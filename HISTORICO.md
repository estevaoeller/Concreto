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

<<<<<<< HEAD
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
=======
## 2026-11-15 — Organização das pranchas recebidas

- Verificados dez PNGs no repositório, movidos para os caminhos previstos no catálogo, preservando os blobs originais.
- Atualizados nomes, links e status. Faltam S05 (Mundo 5) e P02 (monstros comuns). Recebimento não implica aprovação; divergências de S02 e B01 e integridade de B05 permanecem em revisão.

## 2026-11-15 — Conclusão do inventário visual preliminar

- Recebidos S05 (storyboard do Mundo 5) e P02 (monstros comuns), totalizando 12 de 12 pranchas previstas. Arquivos movidos para caminhos padronizados, preservando os blobs originais.
- Atualizados catálogo e README principal. Todos os estudos permanecem em revisão; não representam aprovação de novos requisitos nem assets finais de produção.
>>>>>>> origin/main

## 2026-11-15 — Rodada 010 — Respostas do criador após o protótipo

Respostas recebidas por transcrição de voz, com trechos truncados. Registrado apenas o que ficou inteligível.

- I03 reconfirmada e I05 nova: encostar no monstro tira vida e a faca também.
- V05: após um golpe, Concreto fica um tempo sem poder levar outro. Duração não informada.
- V06: cair no buraco tira uma vida e Concreto volta para a última plataforma. A fala começou com "ele morre" e seguiu com "vai para a última plataforma quando ele cai"; interpretação registrada como perda de uma vida.
- V07: sem vidas, recomeça a fase; derrota no boss recomeça a luta.
- Alteração de decisão anterior: ciclo de dia e noite retirado ("não deu certo", "vamos fazer normal, sem ser de noite"). T01 e T02 substituídas. Dependência revisada: a chance de 50% de encontro deixou de ter base; o protótipo passa a mostrar o boss sempre, como premissa provisória. T03 (boss final sempre aparece) não foi alterada.
- F04: Cthulhu Higiênico confirmado expressamente como boss da primeira fase.
- Não resolvido: um trecho menciona querer uma espada e, em seguida, um escudo, sem deixar claro se o pedido é para o jogo. Não implementado. Se for pedido de gameplay, altera A02 (Concreto sem espada) e precisa de confirmação expressa.
- Sem resposta nesta rodada: Q01 (dispositivos), Q06 (defesa e ataque na luta), Q07 (portal e final), Q08 (cor e aparência) e as demais partes de Q05.
- Protótipo atualizado: relógio e sorteio desligados por configuração, indicador de sol/lua removido da tela, boss sempre presente no portal. Especificação v0.6.

## 2026-11-15 — Rodada 011 — Delegação de escolhas e ampliação da Fase 1

- F05 confirmada: entrar no portal leva à luta contra o boss, sem sorteio ("do jeito que aconteceu").
- Espada e escudo: decisão adiada pelo responsável. A02 continua valendo; nada implementado.
- Decisão de processo: o responsável delegou ao desenvolvimento as escolhas ainda pendentes, tomando como base o que é usual em jogos de plataforma para crianças, com revisão posterior ("assume a melhor coisa, depois a gente revê"). As escolhas feitas estão na seção 13 da especificação v0.7, todas reversíveis e nenhuma tratada como decisão do criador.
- Protótipo ampliado: fase em três trechos; 62 gotinhas coletáveis com contador; dois corações que devolvem vida; vidas mostradas como corações; quatro aparências de monstro da prancha P02 com sinal de alerta; pulo mais tolerante; placas de dica; entrada animada no portal; Cthulhu com manto e medalhão em salão roxo, com a onda de papel abaixo de metade da vida.
- Mantido sem alteração: Concreto sem espada (A02), monstros parados (I02), dois ataques e pausa de 10 s (B01), luta em primeira pessoa (B04), aviso de papel higiênico (B05).
- Testes: criado `testes/percurso.js`, com 21 verificações no navegador identificadas pelos IDs da especificação. Resultado nesta rodada: todas passaram. Limitação: é um robô; dificuldade e diversão para uma criança de 9 anos não foram testadas.

## 2026-11-16 — Rodada 012 — Cinco mundos jogáveis

- Pedido do responsável: fazer todos os mundos, seguindo boas práticas e as referências. Corresponde à etapa D6 do plano, antecipada em relação à validação da Fase 1 pelo criador; o risco é retrabalho se ele mudar regras básicas.
- Implementados os cinco mundos na ordem de F01, cada um com fase em três trechos, quatro aparências de monstro, portal e boss próprio (C04, F02, F03). A regra B01 é a mesma para os cinco bosses.
- Mundos 2 e 5 construídos com as versões originais das pranchas: Mundo Vulcânico com a Rainha de Lava e Mundo dos Blocos com o Guardião de Blocos. Malgosha, Nether e Lego não foram reproduzidos, por serem personagens e marcas de terceiros. Fica como ponto a conversar com o criador.
- Escolhas novas, todas provisórias e listadas na seção 13 da especificação v0.8: formato de luta comum aos bosses, identidade de cada boss, mecânicas de cenário (lava, plataformas móveis, almofadas), progressão com escolha de mundo e progresso salvo, tela final e pausa.
- Removido do código o ciclo de dia e noite, já retirado pelo criador na rodada 010.
- Testes: `testes/percurso.js` passou a jogar os cinco mundos (travessia, portal, boss e liberação do seguinte) além das regras por ID. Resultado: todas as verificações passaram. Limitação: o robô não mede dificuldade nem diversão; os mundos 2 a 5 nunca foram jogados por uma pessoa.

## 2026-11-16 — Rodada 013 — Decisões delegadas e melhorias

- Retorno do responsável: o jogo com cinco mundos foi jogado e considerado jogável e interessante. Não houve registro de observações específicas do criador.
- Decisão de processo: o responsável pediu que as perguntas pendentes fossem decididas pelo desenvolvimento, com o que já se sabe, e que as melhorias fossem implementadas. As decisões abaixo são delegadas e provisórias; qualquer uma pode ser substituída pelo criador.
- Monstros (I02, movimento antes em aberto): cada tipo passa a ter um jeito de se mexer (parado, anda, pula, flutua). A faca por proximidade continua valendo para todos.
- Bosses: cada um ganhou um ataque próprio, sem alterar B01. Novidade de controle: o botão de pulo passa a ser usado nas lutas para escapar do golpe no chão (Coelho e Guardião).
- Gotinhas: liberam cores do Concreto e contam para estrelas por mundo.
- Cor do Concreto (P04): as quatro alternativas da prancha ficam disponíveis; verde é a inicial.
- Espada e escudo: sem espada, mantendo A02; escudo como bolha de geleca que aguenta um golpe.
- Dispositivos (Q01): teclado e toque.
- História: abertura e encerramento curtos e provisórios.
- Música por mundo e para as lutas, efeitos sonoros novos e botão de som.
- Sem decisão delegada possível, por depender só da experiência dele: qual mundo é mais divertido, qual é chato e se algum boss está difícil ou fácil demais.
- Testes: `testes/percurso.js` ganhou verificações para escudo, movimento dos monstros, golpe no chão e liberação de cores, e o robô passou a esperar os monstros que se mexem. Resultado: todas as verificações passaram em execuções repetidas. Limitação: a música e os sons não são verificados por teste e não foram ouvidos por ninguém; a dificuldade com os ataques novos não foi testada por uma pessoa.

## 2026-11-16 — Rodada 014 — Acabamento, versão de referência e publicação

Decisões do responsável nesta rodada:

- Ponto de retorno no meio da fase: autorizado ("pode variar"). Altera, no protótipo, o comportamento de V07 definido pelo criador; a regra original foi preservada na especificação e pode ser restaurada por configuração.
- Aprovados: segredo por mundo, poder por mundo, entrada e saída dos bosses e efeitos de impacto.
- Teste em celular: feito pelo responsável.
- Autorizado levar o trabalho para `main` e publicar um link público do jogo.
- Antes de trocar o desenho por código pelas pranchas, manter uma versão do estado atual. Atendido com a branch `desenho-por-codigo-v1` no repositório (o envio de etiqueta não foi aceito pelo ambiente).

Implementado: bandeiras de retorno por trecho, gotinha dourada por mundo, quatro poderes liberados ao vencer mundos, fala de entrada e estouro de derrota dos bosses, pausa de impacto. Testes ampliados para pontos de retorno, poderes e gotinha dourada; todas as verificações passaram.

Publicação: adicionada página inicial na raiz que leva a `jogo/`, para uso com GitHub Pages a partir de `main`. A ativação do Pages é feita nas configurações do repositório.

Próximo passo combinado: substituir o desenho por código pelas pranchas, com aprovação dos recursos antes de integrar (AGENTS.md).

## 2026-11-16 — Rodada 015 — Concreto a partir da prancha

- Autorizado pelo responsável: começar a troca do desenho por código pelas pranchas, pelo Concreto, com comparação lado a lado.
- Criada a ferramenta `ferramentas/recortar_concreto.py`, que recorta dez poses e o desenho grande da prancha `personagens/concreto-v01.png` e gera a folha de sprites. A prancha original não foi alterada.
- Integrado ao jogo com troca imediata entre "Desenho: prancha" e "Desenho: código" na tela inicial (tecla V). As quatro cores funcionam nos dois modos.
- Estado do recurso: em avaliação, registrado em `assets/game/README.md` com origem, preparação e limitações. Monstros, cenários e bosses continuam desenhados por código.
- Testes: bateria completa executada com o modo prancha ativo; resultado registrado no relato da rodada.

## 2026-11-16 — Rodada 016 — Recorte do Concreto refeito

- Retorno do responsável: o recorte não ficou bom, porque trechos do contorno foram apagados no tratamento da imagem.
- Causa: o método partia do verde do corpo e depois anexava o contorno escuro; onde a prancha tem um brilho claro entre o corpo e o traço, o contorno não era alcançado.
- Correção: o recorte passou a remover o fundo (branco, lilás e sombras) de fora para dentro e a manter o personagem inteiro. Riscos finos grudados no corpo são retirados e o raio da pose de disparo é cortado rente ao corpo.
- Conferido visualmente, pose a pose, em fundo claro e escuro: contorno completo nas onze imagens. Restam um resto pequeno de risco na pose de carregar e uma emenda na pose de disparo.

## 2026-11-16 — Rodada 017 — Folhas de sprites

- O responsável enviou seis folhas de sprites em fundo magenta: Concreto (12 poses), Cthulhu Higiênico, Bruxa Vulcânica, Anjo, Coelho de Pelúcia e um urso de pelúcia (quatro estados cada, de frente).
- Os arquivos foram reorganizados em `assets/concept-art/sprites/` com nome e versão, sem alterar o conteúdo, e registrados no catálogo.
- Nova ferramenta `ferramentas/recortar_sprites.py`, que substitui o recorte anterior a partir da prancha de estudos.
- Integrados ao jogo: Concreto e quatro bosses. O boss do mundo 2 passa a se chamar Bruxa Vulcânica, acompanhando a folha enviada. O urso não é usado, porque o boss do mundo 4 é o coelho.

## 2026-11-16 — Rodada 018 — História, pistas visuais, cenários e documentação

Decisões do responsável:

- O restante do visual segue em código. Imagens para cenário podem ser consideradas depois.
- Aprovados: cenários mais ricos, entrada e saída de fase, tela de progresso e revisão da documentação.
- História: o Concreto é um alienígena; inventar o motivo de ele fazer o que faz.
- Mais pistas visuais.

Implementado:

- História (H01 a H03): a nave do Concreto caiu e se quebrou em cinco peças; cada chefe guardou uma; vencer um boss devolve uma peça; com as cinco, a nave decola. Abertura em três páginas, falas dos bosses ajustadas, nave caída no começo do mundo 1 e tela final com a decolagem. O motivo e as peças são invenção do desenvolvimento, a pedido; a história definitiva é do criador.
- Pistas visuais na fase e nas lutas (X22 e X23 da especificação).
- Cenários dos mundos 2 a 5 com mais elementos; chegada do Concreto por portal no começo de cada mundo; tela de progresso.
- Documentação: especificação reescrita como v1.0, com a origem de cada regra (criador, responsável, delegada, aberta) e identificadores X para as escolhas delegadas, no lugar da antiga "seção 13". README, catálogo e registro de recursos refeitos. Nenhuma regra mudou na reorganização.
- Testes: bateria completa executada após as mudanças; todas as verificações passaram.
