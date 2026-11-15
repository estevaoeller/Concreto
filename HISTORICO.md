# Histórico de decisões

## 2026-11-15 — Rodada 000 — Preparação

- Definido processo progressivo de especificação, com documento técnico e resumo em linguagem simples.
- Nenhuma tecnologia escolhida.

## 2026-11-15 — Rodada 001 — Personagem e ações iniciais

- Confirmado gênero plataforma, nome do protagonista Concreto, corpo de geleca com silhueta de fantasma, topo curvado e gota que cai no chão.
- Correção expressa: não é fantasma, apenas tem formato de fantasma.
- Confirmados andar, pular, monstros, botão de ataque, animação de raio de geleca e menção à espada que aparece na geleca durante ataque.
- Animações dos monstros simples; representação parada mencionada. Relação entre espada, monstro e ataque ainda não resolvida nesta rodada.
- Nota posterior: atribuição da espada à geleca foi substituída na rodada 004; consultar a especificação vigente.

## 2026-11-15 — Rodada 002 — Método de descoberta

- Adotada entrevista ramificada, inspirada em Grill Me e Grill with Docs, de Matt Pocock, com consolidações periódicas.
- Entrevista continua em aberto; implementação não autorizada.

## 2026-11-15 — Rodada 003 — Perspectiva, controles e dano

- Confirmada visão lateral, como no Mario.
- Confirmados botão de pulo e botão de ataque separados.
- Confirmadas três vidas, perda de uma por contato com monstro e deslocamento para trás após dano.
- Confirmada animação de derrota: vento espalha os pedaços de geleca quando acabam as três vidas.
- Pendentes: distinção entre vidas e pontos de vida, comportamento após a derrota, invulnerabilidade e regras de colisão.

## 2026-11-15 — Publicação inicial

- Repositório oficial: estevaoeller/Concreto.
- Consolidação inicial da especificação v0.3 e demais documentos. Informações pessoais não são necessárias à documentação pública.

## 2026-11-15 — Rodada 004 — Portais, armas, ciclo de dia e noite

- C03: atravessar plataformas até o portal, sempre no final, que leva à próxima fase.
- I01/I04: monstros ficam nas plataformas; faca aparece e o monstro ataca quando Concreto está perto.
- A02 (correção): arma pertence aos monstros, não à geleca; Concreto continua com o raio de geleca, conforme confirmação explícita.
- T01: dia e noite duram 30 minutos cada.
- T02: à noite, 50% de chance de encontrar um monstro no final. Não equiparar automaticamente "monstro" a boss; confirmar na próxima entrevista.
- Mantida a regra anterior de dano por contato até definição sobre a relação entre faca e contato.

## 2026-11-15 — Rodada 005 — Bosses e mundos

- B03–B07: Cthulhu Higiênico é boss do portal, inspirado em Cthulhu de papel higiênico; luta em primeira pessoa; papel higiênico aparece quando ele vai atacar; barra de vida grande como Wither/Ender Dragon; dois ataques seguidos de 10 segundos sem atacar.
- C04/F01/F02: cinco fases temáticas em ordem: plantas, tipo Nether, céu, bichinhos de pelúcia e Lego; cada fase tem um boss personalizado.
- Fase 2: Malgosha do filme do Minecraft como boss; fase 3: anjo; fase 4: coelho de pelúcia; fase 5: peça de Lego.
- Fase 1: associação do Cthulhu ao primeiro mundo é interpretação contextual da confirmação de que a primeira permanece como descrita; ainda confirmar.
- B01: revisão do criador estende os dois ataques seguidos de 10 segundos de pausa a todos os bosses. Não assumir automaticamente extensão de todos os demais detalhes.
- T03: boss final tem 100% de chance de aparecer.
- Revisão geral aprovada ao final da entrevista. Permanecem em aberto detalhes não respondidos e ambiguidades explicitadas acima.
- Consolidação v0.4: atualizados documentos, inventário gráfico e plano de entrevista. Sem escolha de tecnologia, criação de assets ou programação.

## 2026-11-15: estudos visuais

Criada prancha preliminar com quatro alternativas de Concreto, estudos de movimento, gota, raio, espada e cenário de plataforma. A alternativa verde foi usada como exemplo, sem aprovação definitiva. A espada do protagonista diverge de A02 e permanece não aprovada. Referência documentada em `assets/concept-art/README.md`; upload do PNG pendente. Desenvolvimento previsto na nuvem, sem definição de tecnologia.

## 2026-11-15 — Preparação para desenvolvimento e produção visual

- Pedido de centralizar prompts e imagens no GitHub, com upload progressivo de imagens pelo responsável do projeto.
- Publicados 12 prompts independentes: cinco storyboards, Concreto, monstros comuns e cinco bosses; todos são estudos, não assets ou novas regras aprovadas.
- Corrigidos os prompts para que apenas os monstros usem faca; protagonista mantém raio de geleca. Preservadas as referências de Thomas a Malgosha e Lego, com alternativas originais propostas para eventual distribuição, sem substituir decisões criativas.
- Organizado catálogo e pastas para imagens por tipo, com versões e estados de aprovação, além de separação entre concept art e assets de produção.
- Adicionados DESENVOLVIMENTO.md e AGENTS.md, com proposta de MVP de uma fase, roteiro D0–D7, critérios de aceitação, pendências e prompt inicial para agente. Desenvolvimento na nuvem mantido; stack ainda não escolhida.
- Especificação de gameplay permanece v0.4. Nenhum código implementado; a preparação do desenvolvimento pode começar com D0. Imagens finais não são pré-requisito para protótipos reversíveis.
