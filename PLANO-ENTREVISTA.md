# Plano de descoberta — Concreto

## Método

Adaptação de Grill Me e Grill with Docs, de Matt Pocock (https://github.com/mattpocock/skills).

1. Fazer uma pergunta curta por vez e esperar a resposta completa. Não concluir a entrevista sem pedido.
2. Repetir a interpretação quando necessário; confirmar ambiguidades. Usar situações jogáveis e sugestões opcionais sem decidir pelo criador.
3. Distinguir decisões confirmadas, propostas, pendentes e substituídas. Se uma resposta mudar uma decisão anterior, revisar dependências e registrar a mudança.
4. Investigar as consequências da resposta antes de avançar. Não repetir perguntas já respondidas, salvo contradição ou ambiguidade.
5. A cada bloco coerente ou aproximadamente 5–8 decisões relevantes, fazer checkpoint: resumir em linguagem simples, atualizar especificação, inventário de recursos e histórico; publicar os arquivos alterados no GitHub e confirmar a gravação. Retomar a entrevista na próxima pergunta.
6. Manter arquitetura e implementação separadas. Não programar antes da validação de regras e escopo.

## Árvore de descoberta

- A. Visão e missão: visão lateral confirmada. Pendente: missão, mundo, objetivo e condição para concluir fase, ciclo principal.
- B. Movimentação: andar, pular e botão de pulo confirmados. Pendente: direções, controles de deslocamento, física, queda, plataformas móveis, habilidades e câmera.
- C. Combate: botão separado e raio confirmados. Pendente: espada, alcance, acerto, limites, dano ao inimigo e recarga.
- D. Inimigos e obstáculos: monstros e dano por contato confirmados. Pendente: tipos, comportamento, ataques, armadilhas e chefes.
- E. Vitória e derrota: três vidas, perda de uma por contato, knockback e animação de vento confirmados. Pendente: completar fase, reinício, pontos de retorno, recuperação, invulnerabilidade e dificuldade.
- F. Mundo e fases: temas, caminho, segredos, ordem, desbloqueio, duração, introdução e final.
- G. Itens e progressão: colecionáveis, pontuação, poderes, melhorias, custos e persistência.
- H. Direção de arte: cor, rosto, textura, tamanho e silhueta; monstros, plataformas, cenários, animações e efeitos. Validar conceitos visuais antes de produzir assets finais.
- I. Interface e som: telas, botões, informações, feedback, música, efeitos e acessibilidade.
- J. Primeira versão: fase mínima que demonstra o núcleo do jogo; critérios de diversão e aceitação.

## Próxima pergunta

"Qual é a missão do Concreto? O que ele precisa fazer para ganhar uma fase?"

Depois aprofundar as consequências e retomar o combate e inimigos.

## Etapa de implementação

Discutir plataforma, ferramentas, arquitetura, controles por dispositivo, resolução e pipeline de assets, física, estados, colisões, dados de fases, testes, distribuição e escopo inicial. Revisar com o criador decisões que afetem a experiência. Entregar documentação suficiente para implementação sem invenção de regras críticas.
