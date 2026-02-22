# Diretiva: Jogo da Memória (Memory Game)

**Status**: Em Planejamento
**Autor**: Agente Senior Dev (Simulado)

## 1. Definição da Arquitetura

### Escolha da Linguagem
**Linguagem**: JavaScript (ECMAScript 6+)
**Justificativa**: Executa nativamente no navegador, ideal para interatividade leve sem necessidade de setup complexo (bundlers/compilers) para este escopo. Permite manipulação direta do DOM para feedback visual imediato.

### Estrutura de Arquivos
- `index.html`: Estrutura semântica e container do jogo.
- `style.css`: Estilização, animações (virar carta) e layout responsivo.
- `script.js`: Lógica de controle, estado e manipulação do DOM.
- `assets/`: Imagens/ícones (usaremos emojis ou SVGs inline para simplicidade inicial).

### Separação de Responsabilidades (Pattern MVC Simplificado)
- **Model (Dados)**: Array de cartas, estado do jogo (bloqueado/desbloqueado), contadores (moves, tempo).
- **View (Interface)**: Funções que atualizam o DOM (virar carta, atualizar placar, mostrar modal de vitória).
- **Controller (Lógica)**: Gerencia o fluxo (clique -> verificar par -> atualizar estado -> verificar vitória).

## 2. Modelagem da Lógica do Jogo

### Estrutura de Dados das Cartas
Array de objetos contendo:
```javascript
{
    id: Number,      // Identificador único da instância
    pairId: String,  // Identificador do par (ex: 'alien', 'ghost')
    icon: String,    // Emoji ou caminho da imagem
    isFlipped: Boolean,
    isMatched: Boolean
}
```

### Algoritmo de Embaralhamento
**Fisher-Yates Shuffle**: Padrão da indústria para aleatoriedade imparcial.
Percorre o array de trás para frente, trocando o elemento atual com um aleatório anterior. Complexidade O(n).

### Lógica de Verificação
1.  **Primeiro Clique**: Vira carta, armazena referência em `firstCard`.
2.  **Segundo Clique**: Vira carta, armazena em `secondCard`, **bloqueia o tabuleiro**.
3.  **Comparação**:
    -   `firstCard.dataset.pair === secondCard.dataset.pair`?
        -   **Sim**: Marca como `matched`, mantém viradas, desbloqueia tabuleiro, incrementa contador de pares encontrados.
        -   **Não**: Aguarda 1000ms, desvira ambas, desbloqueia tabuleiro.
4.  **Fim de Jogo**: Se `paresEncontrados === totalPares`, para timer e exibe vitória.

## 3. Requisitos Funcionais

-   [ ] Tabuleiro 4x4 (16 cartas, 8 pares) é um bom padrão inicial.
-   [ ] Contador de Movimentos (1 movimento = 2 cartas viradas).
-   [ ] Temporizador (mm:ss).
-   [ ] Botão de Reinício.
-   [ ] Modal de Vitória com Estrelas (baseado em movimentos/tempo).
