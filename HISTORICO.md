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

## 2026-11-15 — Rodada 006 — Início do protótipo

- O responsável autorizou o início do desenvolvimento. Decisão de processo: o protótipo passa a ser instrumento de validação do design, em paralelo à entrevista. Altera a regra anterior de não programar antes da validação de regras e escopo.
- Criado protótipo jogável da Fase 1 em `jogo/`: exploração lateral, pulo, raio de geleca, monstros com faca por proximidade, três vidas, knockback, derrota com vento, portal, ciclo de dia e noite e luta em primeira pessoa contra o Cthulhu Higiênico (dois ataques, 10 segundos de pausa, aviso de papel higiênico, barra de vida grande).
- Tecnologia do protótipo: HTML/CSS/JavaScript com Canvas 2D, sem dependências. Não é decisão definitiva.
- Regras pendentes foram preenchidas com premissas provisórias, listadas na seção 13 da especificação v0.5. Nenhuma foi confirmada pelo criador.
- Escopo limitado à Fase 1, cujo tema e boss são originais. As fases 2 e 5 dependem da avaliação das referências a Minecraft/Malgosha e Lego antes de qualquer implementação.
- Verificação: percurso automatizado da fase e da luta contra o boss concluído sem erros no navegador; não houve teste com o criador.

## 2026-11-15 — Rodada 007 — Redesenho do Concreto

- Retorno do responsável: o Concreto do protótipo lembrava demais um fantasma de Pac-Man.
- Redesenhado como geleca: base esparramada no lugar da barra ondulada, corpo translúcido com degradê, brilho, bolhas internas, gota escorrendo, olhos escuros sem branco e sorriso. Mantidos P01 (silhueta que lembra fantasma) e P02 (topo curvado).
- Aparência continua provisória (P04); falta a validação do criador.

## 2026-11-15 — Rodada 008 — Integração com o pacote de preparação

- A branch do protótipo foi criada antes da publicação do pacote de preparação (prompts, catálogo de concept art, DESENVOLVIMENTO.md e AGENTS.md) e não o considerou. Integrado agora por merge de `main`.
- Desvio de processo a registrar: o protótipo cobriu D1 a D4 sem passar pela proposta técnica D0 prevista em AGENTS.md. A stack (HTML/Canvas, sem dependências) e a arquitetura ficam sujeitas à revisão do responsável.
- Verificado em `main`: não há arquivos de imagem no repositório; o catálogo registra o storyboard do Mundo 1 e a prancha de estudos do Concreto como "upload do PNG pendente". O redesenho da rodada 007 foi feito sem acesso a essas referências.
- Pendente: receber os PNGs para alinhar Concreto, monstros, cenário e Cthulhu às pranchas.

## 2026-11-15 — Rodada 009 — Arte do protótipo alinhada às pranchas

- Recebidas quatro pranchas em `assets/concept-art/`: estudos de personagem e storyboards dos mundos 1, 2 e 3. Registradas no catálogo com os nomes originais; divergências com a especificação listadas lá.
- Protótipo redesenhado por código seguindo a alternativa A (verde) e o storyboard do Mundo 1: Concreto verde-limão de contorno grosso com o topo tombado para o lado e barra escorrendo; monstro espinho roxo; plataformas de terra com grama; selva com cachoeira, cipós e flores; portal de pedra com espiral roxa; Cthulhu Higiênico de olhos amarelos com tentáculos de tiras de papel, em arena roxa com colunas.
- Mantido o que a especificação confirma contra as pranchas: sem espada no Concreto (A02), monstro parado (I02) e luta do boss em primeira pessoa (B04). Moedas, blocos e corações não foram incluídos.
- A escolha da alternativa A é provisória: foi a usada nas pranchas para demonstrar as ações, não uma aprovação do criador.
- Verificação: percurso automatizado da fase e do boss repetido sem erros.
