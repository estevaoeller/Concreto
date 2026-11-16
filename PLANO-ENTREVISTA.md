# Plano de descoberta — Concreto

## Método

Adaptação de Grill Me e Grill with Docs, de Matt Pocock (https://github.com/mattpocock/skills).

1. Fazer uma pergunta curta por vez e esperar a resposta completa. Não concluir a entrevista sem pedido.
2. Repetir a interpretação quando necessário; confirmar ambiguidades. Usar situações jogáveis e sugestões opcionais sem decidir pelo criador.
3. Distinguir decisões confirmadas, propostas, pendentes e substituídas. Se uma resposta mudar uma decisão anterior, revisar dependências e registrar a mudança.
4. Investigar as consequências da resposta antes de avançar. Não repetir perguntas já respondidas, salvo contradição ou ambiguidade.
5. A cada bloco coerente ou aproximadamente 5–8 decisões relevantes, fazer checkpoint: resumir em linguagem simples, atualizar especificação, inventário de recursos e histórico; publicar os arquivos alterados no GitHub e confirmar a gravação. Retomar a entrevista na próxima pergunta.
6. Manter arquitetura e implementação separadas. A partir da rodada 006 existe um protótipo da Fase 1 usado para validar regras; premissas provisórias do protótipo (seção 13 da especificação) não são decisões e devem ser levadas ao criador como perguntas.

## Árvore de descoberta — posição atual v0.4

- A. Visão e missão: visão lateral durante exploração; atravessar plataformas e chegar ao portal confirmados. Pendente: história, se todas plataformas precisam ser visitadas, condição de abertura do portal, final do jogo.
- B. Movimentação: andar, pular e botão de pulo confirmados. Pendente: direções, controles de deslocamento, física, queda, plataformas móveis, habilidades e câmera.
- C. Combate: botão separado e raio confirmados; arma dos monstros corrigida para faca por proximidade. Pendente: alcance, acerto, limites, dano ao inimigo e recarga.
- D. Inimigos: monstros nas plataformas, contato causa dano e faca aparece ao aproximar. Pendente: tipos, movimento, distância de ataque, dano por faca vs. contato, ataques e armadilhas.
- E. Vitória e derrota: três vidas, perda de uma por contato, knockback e animação de vento confirmados. Pendente: reinício, pontos de retorno, recuperação, invulnerabilidade, continuidade de vidas e dificuldade.
- F. Mundo e fases: cinco temas e portais no final, com boss personalizado por fase. Pendente: confirmar Cthulhu na fase 1, caminhos, desenho das plataformas, duração, desbloqueio e final.
- F2. Ciclo temporal: dia/noite de 30 min cada, 50% de encontro noturno no final e 100% de presença do último boss confirmados. Pendente: boss vs. monstro comum, chance de dia, unidade do sorteio, persistência e pausa.
- F3. Bosses: dois ataques e janela de 10 segundos para todos; Cthulhu em primeira pessoa, aviso de papel higiênico e barra grande confirmados. Pendente: extensão de câmera e barra aos demais, ataque/defesa em primeira pessoa, vulnerabilidade, ciclo, dano, vida e padrões personalizados.
- G. Itens e progressão: colecionáveis, pontuação, poderes, melhorias, custos e persistência.
- H. Direção de arte: cor, rosto, textura, tamanho e silhueta; monstros, plataformas, cenários, animações e efeitos. Validar conceitos visuais antes de produzir assets finais. Referências a propriedades intelectuais existentes devem ser avaliadas antes de publicação.
- I. Interface e som: telas, botões, informações, feedback, música, efeitos e acessibilidade.
- J. Primeira versão: fase mínima que demonstra o núcleo do jogo; critérios de diversão e aceitação.

## Próxima entrevista — ordem sugerida

Perguntar uma por vez, ajustando conforme respostas:

Atualizado após a rodada 018. As perguntas de regra foram decididas por delegação e estão marcadas como "Delegada" na especificação v1.0 (itens X e H). A entrevista passa a ser de revisão, com o criador jogando:

1. "Qual mundo você mais gostou? Qual foi o mais chato?"
2. "Algum boss ficou difícil demais ou fácil demais?"
3. "Os monstros se mexendo ficaram como você queria?"
4. "O golpe de cada boss ficou legal? Você mudaria algum?"
5. "Inventamos que o Concreto é um alienígena e que a nave dele quebrou em cinco peças. Você gosta? Como é a história de verdade?"
6. "Você quer a espada no jogo? Antes você disse que a arma é só dos monstros." Não presumir.
7. "O boss do mundo 2 e o mundo 5 ficaram diferentes do que você pediu. O que achou?"

Depois resolver as dependências dos controles, inimigos normais, personalização dos mundos e direção de arte. Não ler o roteiro inteiro de uma vez.

## Etapa de implementação

Discutir plataforma, ferramentas, arquitetura, controles por dispositivo, resolução e pipeline de assets, física, estados, colisões, dados de fases, testes, distribuição, direitos de uso de referências e escopo inicial. Avaliar a transição de perspectiva lateral para primeira pessoa sem assumir renderização 3D. Revisar com o criador decisões que afetem a experiência. Entregar documentação suficiente para implementação sem invenção de regras críticas.
