# Concreto — Especificação do jogo

Versão: 0.5 — 2026-11-15
Estado: descoberta e design, com protótipo jogável da Fase 1 autorizado pelo responsável (ver seções 11 e 13). O protótipo não encerra a descoberta nem converte premissas provisórias em requisitos.
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
- I03: contato com um monstro causa dano ao personagem, conforme decisão anterior ainda não revogada.
- I04: se Concreto estiver muito perto de um monstro, surge uma faca e o monstro ataca. Se estiver longe, a faca não aparece.
- Pendente: distância que ativa a faca, tempo de preparação, área de dano, intervalo entre ataques, se a faca desaparece imediatamente ao afastar, se dano por contato e por faca são eventos distintos, tipos de monstros, dano do raio, alcance, recarga e condições de derrota de inimigos.

## 5. Vida, dano e derrota

- V01: Concreto começa com três vidas, conforme descrição confirmada. A distinção entre vidas e pontos de vida é uma decisão de design a confirmar antes da implementação.
- V02: ao encostar em um monstro, perde uma das três vidas.
- V03: ao sofrer dano, é jogado para trás (knockback).
- V04: quando as três vidas acabam, ocorre uma animação na qual um vento espalha os pedaços de geleca do Concreto.
- Pendente: invulnerabilidade temporária após dano, contato contínuo, direção e intensidade do knockback, quedas, armadilhas, recuperação de vida, reinício, checkpoints, persistência de vidas entre fases e interface pós-derrota. A tela de game over foi sugerida, mas não confirmada.

### Estados funcionais preliminares

Parado, deslocando-se, pulando, atacando, recebendo dano e derrotado. Trata-se de um inventário de estados derivados das ações confirmadas, não de uma máquina de estados de implementação aprovada. Prioridades e transições ainda precisam ser definidas.

## 6. Ciclo temporal e encontros no portal

- T01: o jogo possui um ciclo de dia e noite; cada período dura 30 minutos.
- T02: durante a noite, quando Concreto chega ao final, há 50% de chance de haver um monstro. A formulação aprovada foi "monstro"; confirmar se se refere ao boss do portal ou a outro inimigo.
- T03: o último boss, na quinta fase, tem 100% de chance de aparecer. A exceção é explícita; não aplicar o sorteio a este boss.
- Pendente: ocorrência de inimigos/bosses durante o dia, se o ciclo utiliza tempo de jogo ativo ou relógio real, período inicial, pausa, persistência entre fases, momento e unidade do sorteio (uma vez por fase, chegada, tentativa etc.), impacto visual, comportamento caso o portal não tenha inimigo e relação exata entre a chance de 50% e os bosses das fases 1–4.

## 7. Mundo e progressão

| Fase | Cenário | Boss | Estado |
|---|---|---|---|
| 1 | Plantas/vegetação (descrita como "em planta") | Cthulhu Higiênico | Cenário e boss do portal confirmados; associação à fase 1 é interpretação contextual ("a primeira fica como eu falei"), a confirmar expressamente. |
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

1. Confirmar se os 50% de chance à noite significam boss ou monstro comum e o que ocorre durante o dia.
2. Confirmar Cthulhu como boss da primeira fase; confirmar se a câmera em primeira pessoa e a barra de vida grande valem para todos os bosses.
3. Definir como o jogador se defende dos dois ataques, como ataca durante a janela e se o boss pode receber dano fora dela.
4. Definir relação portal/derrota do boss, repetição de ciclos, vitória final, continuidade de vidas, reinício, quedas e checkpoints.
5. Definir controles de deslocamento, física, inimigos normais, dano, itens, pontuação e progressão.
6. Validar conceitos de arte, interface, áudio e acessibilidade.
7. Definir primeira versão jogável, direitos de uso das referências e critérios de aceitação.

## 11. Implementação

Protótipo da Fase 1 em `jogo/`: HTML, CSS e JavaScript puros, Canvas 2D, resolução lógica 960×540, teclado e botões de toque, gráficos desenhados por código e sons sintetizados. Sem dependências, sem build, sem assets de terceiros. A escolha visa a iteração rápida com o criador e não é decisão definitiva de motor ou arquitetura. A primeira pessoa é resolvida em 2D (três posições laterais), sem renderização 3D.

Fora do protótipo: fases 2 a 5 e seus bosses, persistência, itens, pontuação, história e arte/áudio definitivos. Distribuição e direitos de uso das referências continuam em aberto. Não presumir que botões na tela restringem o jogo a dispositivos móveis. A ferramenta mencionada como Fable Five ainda precisa ser identificada e avaliada. A combinação de exploração lateral e combate em primeira pessoa deve ser tratada como requisito funcional de perspectiva, sem impor motor 2D/3D ou arquitetura antes da avaliação.

## 12. Próxima rodada

O protótipo pode ser usado como apoio à entrevista: o criador joga, e cada premissa provisória da seção 13 vira uma pergunta concreta ("ficou como você imaginou?").

Começar esclarecendo a regra de encontro no portal: "Quando você falou dos 50% de chance de aparecer um monstro à noite, você quis dizer o boss da fase ou um monstro comum?" Depois investigar o que acontece de dia, a generalização da primeira pessoa e como desviar dos golpes. Ver [plano de entrevista](PLANO-ENTREVISTA.md).

## 13. Premissas provisórias do protótipo

Valores adotados apenas para tornar o protótipo jogável. Nenhum foi confirmado pelo criador. Todos ficam em `jogo/js/config.js`, marcados como PROVISÓRIO, e podem ser alterados sem mexer no restante do código.

| Tema | Pendência na especificação | Premissa adotada no protótipo |
|---|---|---|
| Encontro no portal (T02) | "Monstro" é o boss ou um monstro comum? O que ocorre de dia? | À noite, 50% de chance de o boss aparecer; de dia, 0% (portal livre). Sorteio uma vez por chegada ao portal. |
| Portal e boss | O portal depende da derrota do boss? | Se o boss aparece, é preciso vencê-lo para concluir a fase. |
| Relógio (T01) | Tempo de jogo ou relógio real; período inicial | Tempo de jogo ativo, começa de dia. Atalho de teste (tecla N ou toque no sol/lua) pula o período. |
| Movimento | Velocidade, altura do salto, pulo duplo | Um salto simples, com altura variável conforme o tempo de pressão do botão. |
| Queda | Consequência de cair | Perde uma vida e volta à última plataforma segura. |
| Dano (V02/V03) | Invulnerabilidade, intensidade do knockback | 1,2 s de invulnerabilidade com o personagem piscando. |
| Raio (A01) | Alcance, recarga, dano | Projétil horizontal, alcance de 380 px, recarga de 0,35 s, dano 1. |
| Monstros (I02/I04) | Tipos, movimento, vida, distância e tempo da faca | Um tipo, parado, 2 pontos de vida. A faca aparece a menos de 130 px, golpeia após 0,7 s e some se Concreto se afasta. Faca e contato tiram uma vida cada. |
| Derrota (V04) | Reinício | Tela de derrota; reinício no começo da fase, ou no começo da luta se a derrota foi contra o boss. Vidas restauradas. |
| Boss — defesa (8.2) | Como evitar os golpes; sentido de "bater nos lados" | Três posições (esquerda, meio, direita). O aviso de papel higiênico indica a posição atacada; mudar de posição evita o golpe. Interpretação não validada. |
| Boss — ataque (B01) | Dano fora da janela; forma do ataque | O raio só causa dano na janela de 10 s; fora dela é bloqueado. O boss troca de posição a cada 2,5 s durante a janela. 24 pontos de vida. |
| Boss — ciclo (B02) | Repetição do ciclo; intervalo entre golpes | Ciclo repete até a derrota; aviso de 1,1 s e 0,6 s entre os dois golpes. |
| Fase 1 (F01) | Cthulhu Higiênico como boss da fase 1 | Adotado como boss da Fase 1. |
| Arte e som (P04, G01–G19) | Cor, rosto, estilo, sons | Concreto verde-água com olhos; monstro roxo com espinhos; cenário e sons de teste. Nada aprovado. |
| Gota (P03) | Frequência e efeito | Uma gota a cada 2,2 s; apenas decorativa. |
