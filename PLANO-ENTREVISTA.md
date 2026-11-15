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

Atualizado após a rodada 010 (respondidas: dano por contato e faca, invulnerabilidade, queda, reinício, Cthulhu na fase 1; retirado o ciclo de dia e noite).

1. Respondida na rodada 011: entrar no portal leva ao boss. Revisar com o criador as escolhas delegadas (seção 13 da especificação), uma por vez, depois de ele jogar.
2. "Você falou de uma espada e de um escudo. É para o Concreto ter no jogo? Como ele usaria?" Não presumir; a decisão vigente é A02 (sem espada).
3. "Se o boss aparecer, precisa derrotá-lo para entrar no portal?"
4. "A tela muda para primeira pessoa em todas as lutas de boss ou só na do Cthulhu? E todos têm a barrinha de vida grande?" Dividir em duas perguntas no diálogo.
5. "Quando o boss vai atacar, como o Concreto escapa do golpe?" Explorar a fala sobre bater nos lados sem presumir que significa desviar.
6. "Nos dez segundos, como o Concreto ataca? E o que acontece se tentar atacar fora desse tempo?"
7. "O que acontece depois de derrotar o boss do último mundo?"
8. "Qual dos quatro Concretos você escolhe: verde, azul, roxo ou laranja?"

Depois resolver as dependências dos controles, inimigos normais, personalização dos mundos e direção de arte. Não ler o roteiro inteiro de uma vez.

## Etapa de implementação

Discutir plataforma, ferramentas, arquitetura, controles por dispositivo, resolução e pipeline de assets, física, estados, colisões, dados de fases, testes, distribuição, direitos de uso de referências e escopo inicial. Avaliar a transição de perspectiva lateral para primeira pessoa sem assumir renderização 3D. Revisar com o criador decisões que afetem a experiência. Entregar documentação suficiente para implementação sem invenção de regras críticas.
