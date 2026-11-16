# Concreto — Especificação do jogo

Versão: 0.9 — 2026-11-16
Estado: descoberta e design, com protótipo jogável dos cinco mundos autorizado pelo responsável (ver seções 11 e 13). O protótipo não encerra a descoberta nem converte premissas provisórias em requisitos.
Convenção: requisitos numerados são decisões confirmadas, salvo indicação explícita de interpretação, proposta ou pendência. Referências visuais não são assets aprovados.

## 1. Conceito e ciclo principal

- C01: gênero plataforma 2D, com visão lateral como nos jogos Mario durante a exploração.
- C02: o personagem principal anda, pula entre plataformas e enfrenta monstros.
- C03: o jogador atravessa as plataformas até chegar ao portal localizado sempre no final da fase; o portal leva à fase seguinte.
- C04: o jogo possui cinco fases com cenários diferentes e cada fase tem um boss personalizado.
- Interpretação de fluxo, a validar: entrar na fase → atravessar plataformas e enfrentar/evitar monstros → chegar à área do portal → enfrentar o boss quando presente → acessar a próxima fase.
- Concreto é o nome do protagonista e o título de trabalho do repositório. Nome definitivo do jogo e história/missão narrativa ainda em aberto.
- Pendente: se todas as plataformas devem ser efetivamente visitadas ou se podem ser puladas; se derrotar os monstros normais é obrigatório; se o portal depende da derrota do boss; vitória após o último portal.

## 2. Personagem principal — Concreto

- P01: é uma geleca, não um fantasma. Sua silhueta lembra o formato de um fantasma.
- P02: o topo apresenta uma curvatura, não uma ponta.
- P03: uma pequena porção de geleca cai no chão. Frequência, duração e eventual efeito nas regras não definidos.
- P04: cor, rosto, olhos, tamanho, proporções, textura e estilo gráfico em aberto.

## 3. Movimentação e controles

- M01: o personagem pode andar e pular entre plataformas.
- M02: existe um botão de pulo.
- M03: existe um botão de ataque separado do botão de pulo.
- Pendente: controle de deslocamento, direção, velocidade, altura do salto, pulo duplo ou não, física, colisões, câmera e dispositivos suportados. Um único botão não implica necessariamente um único salto no ar.
- Pendente: controles específicos e transição de câmera nas lutas contra bosses.

## 4. Combate normal e inimigos

- A01: ao acionar o ataque, Concreto faz uma animação e dispara um raio de geleca.
- A02: Concreto não empunha espada nem faca. Correção explícita da rodada anterior: a arma pertence ao monstro. O raio de geleca do Concreto permanece confirmado.
- I01: existem monstros nas plataformas.
- I02: os monstros têm animações simples; foi mencionada uma representação parada. Deslocamento ainda não definido.
- I03: contato com um monstro causa dano ao personagem. Reconfirmado na rodada 010.
- I05: o golpe de faca também tira vida (rodada 010). Contato e faca são, portanto, duas fontes de dano.
- I04: se Concreto estiver muito perto de um monstro, surge uma faca e o monstro ataca. Se estiver longe, a faca não aparece.
- Pendente: distância que ativa a faca, tempo de preparação, área de dano, intervalo entre ataques, se a faca desaparece imediatamente ao afastar, tipos de monstros, dano do raio, alcance, recarga e condições de derrota de inimigos.

## 5. Vida, dano e derrota

- V01: Concreto começa com três vidas, conforme descrição confirmada. A distinção entre vidas e pontos de vida é uma decisão de design a confirmar antes da implementação.
- V02: ao encostar em um monstro, perde uma das três vidas.
- V03: ao sofrer dano, é jogado para trás (knockback).
- V04: quando as três vidas acabam, ocorre uma animação na qual um vento espalha os pedaços de geleca do Concreto.
- V05: depois de levar um golpe, Concreto fica um tempo sem poder levar outro (rodada 010). Duração não definida.
- V06: ao cair num buraco, Concreto perde uma vida e volta para a última plataforma (rodada 010). Registro da fala: "ele morre" e, em seguida, "vai para a última plataforma quando ele cai"; lido como perda de uma vida, não de todas.
- V07: sem vidas, recomeça a fase desde o início; se a derrota foi contra o boss, recomeça a luta (rodada 010).
- Pendente: duração da invulnerabilidade, contato contínuo, direção e intensidade do knockback, armadilhas, recuperação de vida, quantas vidas tem ao recomeçar, persistência de vidas entre fases e interface pós-derrota. A tela de game over foi sugerida, mas não confirmada.

### Estados funcionais preliminares

Parado, deslocando-se, pulando, atacando, recebendo dano e derrotado. Trata-se de um inventário de estados derivados das ações confirmadas, não de uma máquina de estados de implementação aprovada. Prioridades e transições ainda precisam ser definidas.

## 6. Ciclo temporal e encontros no portal

Decisão da rodada 010: o criador retirou o ciclo de dia e noite ("esse negócio de noite não deu certo", "vamos fazer normal, sem ser de noite"). T01 e T02 ficam substituídas e permanecem abaixo apenas como registro. F05 (rodada 011): ao entrar no portal, Concreto vai enfrentar o boss; não há sorteio. Confirmado a partir da experiência com o protótipo ("do jeito que aconteceu: entrei no portal e fui enfrentar o boss").

Regras anteriores (substituídas, exceto T03):

- T01 (substituída na rodada 010): o jogo possui um ciclo de dia e noite; cada período dura 30 minutos.
- T02 (substituída na rodada 010): durante a noite, quando Concreto chega ao final, há 50% de chance de haver um monstro. A formulação aprovada foi "monstro"; confirmar se se refere ao boss do portal ou a outro inimigo.
- T03: o último boss, na quinta fase, tem 100% de chance de aparecer. A exceção é explícita; não aplicar o sorteio a este boss.
- Pendente: o que acontece depois de vencer o boss (ver seção 7).

## 7. Mundo e progressão

| Fase | Cenário | Boss | Estado |
|---|---|---|---|
| 1 | Plantas/vegetação (descrita como "em planta") | Cthulhu Higiênico | Cenário e boss confirmados. F04: Cthulhu Higiênico é o boss da fase 1 (confirmado expressamente na rodada 010). |
| 2 | Lugar tipo Nether | Malgosha do filme de Minecraft | Referência de cenário e boss confirmadas como intenção criativa. |
| 3 | Céu | Anjo | Tema e tipo de boss confirmados. |
| 4 | Mundo de bichinhos de pelúcia | Coelho de pelúcia | Tema e boss confirmados. |
| 5 | Mundo de Lego | Peça de Lego | Tema, boss e presença garantida confirmados. |

- F01: as cinco fases seguem a ordem acima.
- F02: cada fase tem seu próprio boss personalizado.
- F03: os portais ficam no final das fases. A função do portal da última fase e o desfecho do jogo permanecem em aberto.
- Referências a Minecraft, Nether, Malgosha, Mario e Lego descrevem inspirações ou intenções do criador, não autorização de uso de marcas, assets ou personagens licenciados. Para publicação/distribuição, avaliar direitos e eventual criação de equivalentes originais, a validar com o criador. Não substituir automaticamente as ideias.
- Pendente: formato de plataformas, obstáculos, duração, tamanho, dificuldade, pontos de retorno, caminhos alternativos, transições e cenários específicos de cada mundo.

## 8. Combate contra bosses

### 8.1 Regras comuns confirmadas

- B01: todos os bosses atacam duas vezes e, após o segundo ataque, ficam 10 segundos sem atacar. Durante essa janela, Concreto pode atacar.
- B02: a janela começa após o segundo ataque; não presumir que os dois golpes são simultâneos ou que cada ataque dura um tempo específico.
- Pendente: intervalo entre os dois golpes, se o ciclo se repete até a derrota (interpretação natural, ainda não confirmada), se o jogador pode causar dano fora da janela, reação defensiva, dano por golpe, quantidade de vida e forma de ataque do jogador.
- A extensão da regra a todos os bosses foi confirmada expressamente para dois ataques + 10 segundos. Confirmar se primeira pessoa, barra grande e aviso temático também se aplicam a todos.

### 8.2 Cthulhu Higiênico

- B03: boss do portal chamado Cthulhu Higiênico, com aparência de um Cthulhu de papel higiênico.
- B04: na luta contra ele, a perspectiva muda de lateral para primeira pessoa.
- B05: quando o boss vai atacar, aparece um papel higiênico. É um indicador associado ao ataque do boss, não ao ataque de Concreto. O formato circular/posição/tempo do aviso não estão definidos.
- B06: segue a sequência de dois ataques e pausa de 10 segundos.
- B07: possui uma barra de vida grande, com referência às barras de bosses Wither e Ender Dragon de Minecraft.
- Pendente: como o jogador evita golpes, significado de "bater nos lados" mencionado na fala inicial, como usa o raio em primeira pessoa, se existe outro controle, aparência da arena e condição para retorno à perspectiva lateral.

### 8.3 Demais bosses

Cada boss é personalizado conforme o tema. O padrão B01 é comum; ataques concretos, avisos, aparência, barra de vida e câmera precisam de validação. O boss final é obrigatório no sentido de presença garantida (T03); ainda confirmar se é obrigatório derrotá-lo para vencer o jogo.

### 8.4 Modelo funcional preliminar (proposta para discussão)

Entrada na luta → preparação/aviso do ataque → ataque 1 → preparação/aviso → ataque 2 → janela de contra-ataque de 10 segundos → repetir, se o boss estiver vivo e se o padrão de repetição for confirmado. A derrota do boss e o retorno ao portal precisam ser especificados. Não constitui máquina de estados de implementação aprovada.

## 9. Inventário preliminar de recursos gráficos e sonoros

- G01: conceito visual e silhueta do Concreto.
- G02: efeito de gota de geleca caindo no chão.
- G03: estados visuais de andar e pular.
- G04: preparação do ataque e efeito do raio de geleca.
- G05: representação da faca dos monstros (corrige a espada atribuída à geleca).
- G06: botões de pulo e ataque.
- G07: feedback de dano e deslocamento para trás.
- G08: animação de derrota com vento espalhando geleca.
- G09: representação e animações simples dos monstros, incluindo aparição da faca e ataque.
- G10: indicação de vidas do protagonista (proposta a validar).
- G11: portal de fim de fase e transição de mundo.
- G12: cinco famílias temáticas de cenários e plataformas.
- G13: aparência de dia e noite (tratamento visual a definir).
- G14: conceitos e animações dos cinco bosses.
- G15: arena/tela de combate em primeira pessoa para Cthulhu; extensão aos demais pendente.
- G16: aviso de papel higiênico para ataque do Cthulhu.
- G17: barra de vida grande do Cthulhu; extensão aos demais pendente.
- G18: animações de ataque dos bosses e feedback da janela de 10 segundos (forma de feedback a definir).
- G19: sons de movimentação, ataque, dano, portais, chefes e ambientes; trilhas e estilo são propostas a discutir.

Não há desenhos, sprites ou áudio aprovados. O estilo e o formato técnico permanecem em aberto.

## 10. Decisões pendentes prioritárias

1. Validar com o criador as escolhas delegadas nas rodadas 011 a 013 (seção 13), jogando o protótipo.
2. Espada: não implementada; vale A02 até decisão expressa do criador em contrário. O escudo entrou como item provisório.
3. Confirmar se a câmera em primeira pessoa e a barra de vida grande valem para todos os bosses.
4. Definir como o jogador se defende dos dois ataques, como ataca durante a janela e se o boss pode receber dano fora dela.
5. Definir relação portal/derrota do boss, repetição de ciclos, vitória final e continuidade de vidas.
6. Definir controles de deslocamento, física, inimigos normais, dano, itens, pontuação e progressão.
7. Validar conceitos de arte, interface, áudio e acessibilidade.
8. Definir primeira versão jogável, direitos de uso das referências e critérios de aceitação.

## 11. Implementação

Protótipo dos cinco mundos em `jogo/`: HTML, CSS e JavaScript puros, Canvas 2D, resolução lógica 960×540, teclado e botões de toque, gráficos desenhados por código e sons sintetizados. Sem dependências, sem build, sem assets de terceiros. A escolha visa a iteração rápida com o criador e não é decisão definitiva de motor ou arquitetura. A primeira pessoa é resolvida em 2D (três posições laterais), sem renderização 3D.

Organização do código: `config.js` (números e regras), `entrada.js` (teclado, toque e sons), `arte.js` e `temas.js` (desenho), `mundos.js` (dados dos cinco mundos e construtor de fases), `fase.js` (exploração lateral), `boss.js` (lutas), `principal.js` (telas e progressão). A regra de dois ataques e pausa de 10 s está em um único lugar e vale para os cinco bosses.

Mundos 2 e 5: o protótipo usa as versões originais das pranchas (mundo vulcânico com a Rainha de Lava; mundo de blocos de montar com o Guardião de Blocos). Não reproduz a Malgosha, o Nether nem a marca Lego. A intenção criativa do criador continua registrada na seção 7; a troca vale para o que é construído e publicado.

Fora do protótipo: história, final narrativo, itens além de gotinhas e corações, e arte e áudio definitivos. Distribuição pública continua dependendo de autorização. Não presumir que botões na tela restringem o jogo a dispositivos móveis. A ferramenta mencionada como Fable Five ainda precisa ser identificada e avaliada.

## 12. Próxima rodada

O protótipo pode ser usado como apoio à entrevista: o criador joga, e cada premissa provisória da seção 13 vira uma pergunta concreta ("ficou como você imaginou?").

O responsável delegou ao desenvolvimento as decisões pendentes, com revisão posterior (rodadas 011 e 013). A próxima rodada é de revisão: o criador joga e diz o que manter, mudar ou tirar entre os itens da seção 13. Continuam sendo dele, e podem substituir qualquer escolha delegada: a história e o final, a espada, a cor definitiva do Concreto e o jeito de cada monstro e de cada boss. Ver [plano de entrevista](PLANO-ENTREVISTA.md).

## 13. Premissas provisórias do protótipo

Valores adotados para tornar o protótipo jogável e, desde a rodada 011, escolhas delegadas pelo responsável ("assume a melhor coisa, depois a gente revê"). Nenhum foi confirmado pelo criador. Todos ficam em `jogo/js/config.js`, marcados como PROVISÓRIO, e podem ser alterados sem mexer no restante do código.

| Tema | Pendência na especificação | Premissa adotada no protótipo |
|---|---|---|
| Portal e boss | O portal depende da derrota do boss? | Se o boss aparece, é preciso vencê-lo para concluir a fase. |
| Movimento | Velocidade, altura do salto, pulo duplo | Um salto simples, com altura variável conforme o tempo de pressão do botão. |
| Dano (V05) | Duração da invulnerabilidade, intensidade do knockback | 1,2 s de invulnerabilidade com o personagem piscando. |
| Raio (A01) | Alcance, recarga, dano | Projétil horizontal, alcance de 380 px, recarga de 0,35 s, dano 1. |
| Monstros (I02/I04) | Tipos, movimento, vida, distância e tempo da faca | Um tipo, parado, 2 pontos de vida. A faca aparece a menos de 130 px, golpeia após 0,7 s e some se Concreto se afasta. Faca e contato tiram uma vida cada. |
| Derrota (V07) | Vidas ao recomeçar; tela de derrota | Tela de derrota; três vidas ao recomeçar a fase ou a luta. |
| Boss — defesa (8.2) | Como evitar os golpes; sentido de "bater nos lados" | Três posições (esquerda, meio, direita). O aviso de papel higiênico indica a posição atacada; mudar de posição evita o golpe. Interpretação não validada. |
| Boss — ataque (B01) | Dano fora da janela; forma do ataque | O raio só causa dano na janela de 10 s; fora dela é bloqueado. O boss troca de posição a cada 2,5 s durante a janela. 24 pontos de vida. |
| Boss — ciclo (B02) | Repetição do ciclo; intervalo entre golpes | Ciclo repete até a derrota; aviso de 1,1 s e 0,6 s entre os dois golpes. |
| Arte e som (P04, G01–G19) | Cor, rosto, estilo, sons | Visual desenhado por código a partir da alternativa A dos estudos de personagem e do storyboard do Mundo 1 (rodada 009); monstro roxo com espinhos; cenário e sons de teste. Nada aprovado. |
| Gota (P03) | Frequência e efeito | Uma gota a cada 2,2 s; apenas decorativa. |
| Coletáveis | Itens e pontuação (árvore G) não definidos | 62 gotinhas de geleca espalhadas pela fase, com contador na tela e total no fim. Não afetam vidas nem progresso. |
| Recuperar vida | Recuperação de vida não definida | Dois corações na fase; cada um devolve uma vida, só quando falta alguma. |
| Indicador de vidas (G10) | Forma do indicador | Três corações no canto da tela. |
| Tolerância do pulo | Física não definida | Ainda dá para pular 0,1 s depois de sair da beirada, e o pulo apertado 0,12 s antes de pousar também vale. |
| Tamanho da fase | Duração e desenho não definidos | Três trechos de dificuldade crescente, como no storyboard S01; cerca de 35 s em linha reta. |
| Monstros — movimento (I02) | Deslocamento não definido | Decisão delegada na rodada 013: cada tipo tem um jeito. Parado, anda (vai e volta na própria plataforma), pula (no lugar) ou flutua (sobe e desce). A faca por proximidade (I04) vale para todos, e todos param para atacar. |
| Dicas | Tutorial não definido | Três placas de madeira no começo da fase. |
| Portal | Transição não definida | Concreto é puxado para dentro do portal e a tela clareia antes da luta. |
| Boss — onda de papel | Variedade de ataques não definida | Com menos da metade da vida, cada golpe cobre dois dos três lados; sobra um lado seguro. A regra de dois ataques e pausa de 10 s (B01) não muda. |
| Boss — aparência e arena | Arte não aprovada | Manto roxo, medalhão dourado e salão roxo com colunas e rolos, conforme a prancha B01. |
| Bosses 2 a 5 — formato da luta | Primeira pessoa e barra grande valem para todos? | Sim para todos, com o mesmo formato do Cthulhu: três lados, aviso temático antes de cada golpe, raio só na pausa. |
| Bosses — ataque próprio | Ataques personalizados | Decisão delegada na rodada 013, sempre dentro de B01 (dois ataques e pausa de 10 s). Cthulhu: onda de papel em dois lados com menos de metade da vida. Rainha de Lava: o lado atingido fica em brasa por 1,2 s. Anjo: o aviso muda de lado uma vez antes do golpe. Coelho de Pelúcia: o segundo ataque é um golpe no chão, que só se evita pulando. Guardião de Blocos: golpes sempre em dois lados e segundo ataque no chão. Vida: 24, 28, 30, 32 e 40. |
| Mundos 2 a 5 — fases | Desenho das fases e mecânicas de cenário | Três trechos por mundo. Mundo 2: lava nos buracos. Mundo 3: plataformas que se mexem. Mundo 4: almofadas que jogam para o alto. Mundo 5: as duas coisas. Cair continua valendo V06 em todos. |
| Mundos 2 a 5 — monstros | Tipos por mundo | Quatro aparências por mundo, da prancha P02; todos parados e com faca. |
| Progressão | Desbloqueio, persistência e vidas entre mundos | Vencer o boss libera o mundo seguinte; tela de escolha de mundo; progresso e recorde de gotinhas guardados no aparelho; três vidas ao começar cada mundo. |
| História e final | História, missão e desfecho em aberto | Decisão delegada na rodada 013: abertura de quatro linhas (cinco chefes bagunçaram os mundos; Concreto atravessa os portais para enfrentá-los) e frase de encerramento. Texto provisório; a história é do criador. |
| Pausa | Não definida | Botão na tela e tecla P; permite voltar à escolha de mundos. |
| Gotinhas — utilidade | Itens e progressão (árvore G) | Decisão delegada na rodada 013: as gotinhas liberam cores do Concreto (azul com 100, roxo com 200, laranja com 300) e contam para as estrelas de cada mundo (1 por vencer, 2 com 60% das gotinhas, 3 com 90%). |
| Cor do Concreto (P04) | Qual das quatro alternativas | Decisão delegada na rodada 013: as quatro ficam no jogo. Verde é a inicial; as outras são liberadas com gotinhas e escolhidas na tela inicial. |
| Espada e escudo | Pedido não esclarecido na rodada 010 | Decisão delegada na rodada 013: sem espada, porque A02 é decisão expressa do criador. O escudo entra como bolha de geleca: um por mundo, aguenta um golpe e vale também na luta contra o boss. Não protege de queda. |
| Dispositivos (Q01) | Teclado, toque ou ambos | Decisão delegada na rodada 013: ambos. |
| Música e sons (G19) | Trilhas e estilo | Uma música por mundo e uma para as lutas, mais efeitos, todos sintetizados pelo navegador e compostos para o protótipo. Botão para ligar e desligar o som. |
| Expressões do Concreto | Animações (G03, G07) | Olhos apertados ao levar um golpe, além de piscar e abrir a boca ao atirar. |
