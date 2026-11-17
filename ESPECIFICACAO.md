# Concreto — Especificação do jogo

Versão: 1.3 — 2026-11-17
Estado: jogo completo em protótipo (cinco mundos), em validação com o criador. Esta versão reorganiza o documento; nenhuma regra foi alterada na reorganização. O percurso das decisões está em [HISTORICO.md](HISTORICO.md).

## 1. Como ler

Cada regra tem um identificador e uma origem. A origem diz quem decidiu e quanto a regra é firme.

| Marca | Origem | O que significa |
|---|---|---|
| **Criador** | Decisão do criador do jogo | Regra do jogo. Só muda se ele mudar. |
| **Responsável** | Decisão do responsável pelo projeto | Vale para o protótipo. Pode divergir do que o criador disse; quando diverge, está indicado. |
| **Delegada** | Escolha do desenvolvimento, por delegação do responsável | Provisória. O criador pode manter, mudar ou tirar. |
| **Aberta** | Ainda sem decisão | Não implementar como regra. |

Os números (velocidades, tempos, vida dos bosses) ficam em `jogo/js/config.js` e `jogo/js/mundos.js`. Todos são delegados, salvo os citados aqui como do criador.

Identificadores: C conceito, P personagem, M movimento, A ataque, I inimigos, V vida, T tempo, F fases, B bosses, G recursos gráficos e sonoros, H história, X extras.

## 2. Conceito

- C01 (Criador): jogo de plataforma 2D em visão lateral durante a exploração.
- C02 (Criador): o personagem anda, pula entre plataformas e enfrenta monstros.
- C03 (Criador): o jogador atravessa as plataformas até o portal, que fica sempre no final da fase e leva adiante.
- C04 (Criador): cinco fases com cenários diferentes; cada fase tem um boss próprio.
- Nome: Concreto é o protagonista e o título de trabalho. Nome definitivo do jogo: aberto.

## 3. Personagem — Concreto

- P01 (Criador): é uma geleca, não um fantasma. A silhueta lembra a de um fantasma.
- P02 (Criador): o topo é curvado, não pontudo.
- P03 (Criador): uma pequena porção de geleca cai no chão. No protótipo é só enfeite (Delegada).
- P04 (Aberta): cor definitiva. No protótipo as quatro alternativas da prancha de estudos estão disponíveis; verde é a inicial e as outras são liberadas com gotinhas (Delegada).
- H01 (Responsável): o Concreto é um alienígena.

## 4. Controles e movimento

- M01 (Criador): anda e pula entre plataformas.
- M02 (Criador): existe um botão de pulo.
- M03 (Criador): existe um botão de ataque, separado do de pulo.
- X01 (Delegada): teclado e botões de toque, os dois sempre disponíveis.
- X02 (Delegada): um pulo simples, mais alto quanto mais tempo o botão fica apertado; pequena tolerância ao sair da beirada e ao apertar o pulo antes de pousar.
- X03 (Delegada): nas lutas contra bosses, esquerda e direita trocam de lado, o ataque atira e o pulo escapa do golpe no chão.

## 5. Combate comum e monstros

- A01 (Criador): ao atacar, o Concreto faz uma animação e dispara um raio de geleca.
- A02 (Criador): o Concreto não usa espada nem faca. A arma é dos monstros. Um pedido posterior de espada não foi esclarecido; vale A02 até decisão expressa em contrário.
- I01 (Criador): existem monstros nas plataformas.
- I02 (Criador): os monstros têm animações simples; foi mencionada uma representação parada. O deslocamento ficou em aberto.
- I03 (Criador): encostar em um monstro tira vida.
- I04 (Criador): se o Concreto chega muito perto, aparece uma faca e o monstro ataca. De longe, a faca não aparece.
- I05 (Criador): o golpe de faca também tira vida.
- X04 (Delegada): cada tipo de monstro se mexe de um jeito — parado, anda (vai e volta na própria plataforma), pula (no lugar) ou flutua (sobe e desce). Todos param para atacar com a faca.
- X05 (Delegada): quatro aparências por mundo, tiradas da prancha de monstros; dois raios derrotam um monstro comum.
- Aberto: se derrotar os monstros é obrigatório (no protótipo não é).

## 6. Vida, dano e derrota

- V01 (Criador): o Concreto começa com três vidas.
- V02 (Criador): ao encostar em um monstro, perde uma vida.
- V03 (Criador): ao sofrer dano, é jogado para trás.
- V04 (Criador): quando as vidas acabam, um vento espalha os pedaços de geleca.
- V05 (Criador): depois de um golpe, fica um tempo sem poder levar outro. Duração: Delegada (1,2 s).
- V06 (Criador): ao cair num buraco, perde uma vida e volta para a última plataforma.
- V07 (Criador): sem vidas, recomeça a fase desde o início; se a derrota foi contra o boss, recomeça a luta.
- V07-b (Responsável, diverge de V07): no protótipo, sem vidas o Concreto volta à bandeira do trecho em que estava, com três vidas; o que já foi derrotado ou coletado continua assim. A regra original pode ser restaurada em `retornoPorTrecho`.
- X06 (Delegada): três vidas ao começar cada mundo e ao recomeçar.

## 7. Mundos e progressão

| Fase | Tema (Criador) | Boss pedido (Criador) | Boss no protótipo |
|---|---|---|---|
| 1 | Plantas | Cthulhu Higiênico | Cthulhu Higiênico |
| 2 | Lugar tipo Nether | Malgosha, do filme de Minecraft | Bruxa Vulcânica (original) |
| 3 | Céu | Anjo | Anjo |
| 4 | Bichinhos de pelúcia | Coelho de pelúcia | Coelho de Pelúcia |
| 5 | Lego | Peça de Lego | Guardião de Blocos (original) |

- F01 (Criador): as cinco fases seguem a ordem acima.
- F02 (Criador): cada fase tem seu próprio boss.
- F03 (Criador): os portais ficam no final das fases.
- F04 (Criador): o Cthulhu Higiênico é o boss da fase 1.
- F05 (Criador): ao entrar no portal, o Concreto vai enfrentar o boss. Não há sorteio.
- T03 (Criador): o boss final sempre aparece. Com F05, isso vale para todos.
- X07 (Responsável): os mundos 2 e 5 usam versões originais (mundo vulcânico; mundo de blocos de montar). Malgosha, Nether e Lego são personagem e marcas de terceiros e não são reproduzidos. A intenção do criador continua registrada na tabela.
- X08 (Delegada): cada fase tem três trechos de dificuldade crescente. Particularidade por mundo: lava nos buracos (2), plataformas que se mexem (3), almofadas que jogam para o alto (4), as duas coisas (5).
- X09 (Delegada): vencer o boss libera o mundo seguinte; há tela de escolha de mundo; o progresso fica salvo no aparelho.
- Aberto: se é preciso visitar todas as plataformas (no protótipo não é).

## 8. Bosses

- B01 (Criador): todos os bosses atacam duas vezes e depois ficam 10 segundos sem atacar. Nessa janela o Concreto pode atacar.
- B02 (Criador): a janela começa depois do segundo ataque.
- B03 (Criador): o Cthulhu Higiênico parece um Cthulhu de papel higiênico: um rolo com olhos e tentáculos de tiras desenroladas.
- B04 (Criador): na luta contra o Cthulhu, a visão muda para primeira pessoa.
- B05 (Criador): quando o Cthulhu vai atacar, aparece um papel higiênico.
- B06 (Criador): o Cthulhu segue a sequência de dois ataques e pausa de 10 segundos.
- B07 (Criador): o Cthulhu tem uma barra de vida grande.
- X10 (Delegada): primeira pessoa, barra grande e aviso temático valem para todos os bosses.
- X11 (Delegada): a arena tem três lados (esquerda, meio, direita). O aviso mostra onde o golpe vai cair; mudar de lado evita o golpe. É a leitura adotada para a fala "bater nos lados", ainda não validada.
- X12 (Delegada): o raio só causa dano na janela de 10 segundos e quando o Concreto está no mesmo lado do boss; fora dela é bloqueado. O ciclo se repete até a derrota.
- X13 (Delegada): um golpe próprio por boss, sempre dentro de B01.

| Boss | Vida | Golpe próprio |
|---|---|---|
| Cthulhu Higiênico | 24 | Com menos de metade da vida, a onda de papel cobre dois lados. |
| Bruxa Vulcânica | 28 | O lado atingido fica em brasa por 1,2 s. |
| Anjo | 30 | O aviso muda de lado uma vez antes do golpe. |
| Coelho de Pelúcia | 32 | O segundo ataque é um golpe no chão; só se escapa pulando. |
| Guardião de Blocos | 40 | Golpes sempre em dois lados; o segundo ataque é no chão. |

- X14 (Delegada): cada boss provoca o Concreto numa cena antes da luta (H04) e estoura em pedaços do seu tema ao perder.
- Aberto: se o criador quer outro jeito de escapar e de atacar; se algum boss está difícil ou fácil demais.

## 9. Itens, poderes e segredos

Tudo nesta seção é Delegado.

- X15: gotinhas de geleca espalhadas pelas fases. Liberam cores do Concreto (azul com 100, roxo com 200, laranja com 300) e contam para as estrelas do mundo (1 por vencer, 2 com 60% das gotinhas, 3 com 90%).
- X16: corações devolvem uma vida, só quando falta alguma.
- X17: escudo de geleca, um por mundo; aguenta um golpe, vale também contra o boss e não protege de queda. Foi a forma de atender ao pedido de escudo sem contrariar A02.
- X18: uma gotinha dourada escondida em cada mundo.
- X19: vencer um mundo libera um poder permanente — raio longo (após o mundo 1), pulo duplo (2), raio rápido (3), raio forte contra monstros comuns (4). As fases continuam vencíveis sem eles.

## 10. História

- H01 (Responsável): o Concreto é um alienígena.
- H02 (Delegada, a pedido do responsável): a nave dele caiu e se quebrou em cinco peças. Cada peça foi parar em um mundo, e o chefe de cada mundo guardou uma. O Concreto atravessa os portais para recuperar as peças, consertar a nave e voltar para casa.
- H03 (Delegada): cada boss vencido devolve uma peça (casco, cúpula, antena, motor, luzes). Com as cinco, a nave decola.
- H04 (Responsável): a história é contada por cenas desenhadas por código, nestes momentos:
  - abertura, na primeira vez que o jogo começa (e pelo botão "Ver a história"): a viagem, o meteoro, as peças caindo nos cinco mundos, os chefes com as peças e o chamado para a aventura;
  - antes de cada mundo: a nave com as peças recuperadas e as que faltam, e com quem está a próxima;
  - antes de cada boss: ele aparece com a peça, provoca, o Concreto responde e ele desafia;
  - depois de cada boss: ele se rende, a peça volta para o Concreto e encaixa na nave;
  - no final: a nave completa, a despedida dos chefes e a decolagem.
- H05 (Delegada): o motivo da queda (um meteoro), as falas dos chefes e do Concreto e a despedida no final. Toda cena pode ser avançada com um toque e pulada pelo botão "Pular".
- H06 (Delegada, a pedido do responsável): cada chefe tem um motivo para querer a peça, contado na conversa antes da luta e antecipado por um boato no mapa.

| Chefe | Peça | Por que não devolve | O que o Concreto pode fazer |
|---|---|---|---|
| Cthulhu Higiênico | Casco | Usa como guarda-chuva; papel não pode pegar chuva | Um guarda-chuva de geleca |
| Bruxa Vulcânica | Cúpula | Protege sua única flor do calor do vulcão | Uma redoma de geleca para a flor |
| Anjo | Antena | Escuta a música das estrelas; o céu é quieto demais | Um sininho de geleca que toca com o vento |
| Coelho de Pelúcia | Motor | É seu único brinquedo; ninguém brinca com ele | Uma bola de geleca que quica |
| Guardião de Blocos | Luzes | Iluminam a torre; ele tem medo do escuro | Uma lanterna de geleca |

- H07 (Delegada): depois de vencer cada chefe, o jogador escolhe entre ajudar o chefe ou seguir viagem. Ajudando, o Concreto deixa o presente da tabela e o chefe vira amigo. A peça é recuperada nos dois casos. Vale a escolha da última vez que o mundo foi vencido.
- H08 (Delegada, a pedido do responsável): há sete finais. O final depende de como se jogou; vale o primeiro da lista cujas condições forem cumpridas.

| # | Final | Condição |
|---|---|---|
| 1 | Festa na nave | Cinco amigos, cinco gotinhas douradas e pelo menos 90% das gotinhas |
| 2 | Amigos para sempre | Cinco amigos |
| 3 | Geleca da paz | Nenhum monstro comum derrotado nos cinco mundos |
| 4 | Caçador de tesouros | Cinco gotinhas douradas |
| 5 | Colecionador de geleca | Pelo menos 90% das gotinhas |
| 6 | Viajante solitário | Nenhum amigo |
| 7 | De volta para casa | Qualquer outro caso |

  Para amigos e monstros derrotados vale a última passagem por cada mundo; para gotinhas, o recorde; a gotinha dourada, uma vez achada, fica. A tela de progresso mostra os finais já vistos e uma pista para os outros.
- A história foi inventada para o protótipo. A versão definitiva é do criador.

## 11. Interface, pistas e som

Tudo nesta seção é Delegado.

- X20: vidas em corações, contador de gotinhas, botão de pausa, botão de som.
- X21: tela inicial com escolha de mundo, de cor e de tipo de desenho; tela de progresso; cenas de história (H04); tela final.
- X22: pistas visuais — seta de direção no começo, seta do portal no fim, área vermelha mostrando o alcance da faca, setas nas plataformas que se mexem, bandeira nos pontos de retorno, borda vermelha e coração pulsando na última vida.
- X23: pistas nas lutas — radar dos três lados (onde você está, onde o golpe cai, onde está o boss), barra do tempo da pausa, mira quando o raio vai acertar, seta para o lado do boss, botões de toque que piscam na hora de usar.
- X24: uma música por mundo e uma para as lutas, mais efeitos, todos sintetizados e compostos para o protótipo.

## 12. Arte e recursos

- Só o Concreto usa folha de sprites, recortada por `ferramentas/recortar_sprites.py`. Estado: em avaliação.
- G14 (Criador): os bosses são desenhados por código. Ele não gostou das folhas de sprites dos bosses; elas continuam no repositório, fora do jogo.
- Os monstros, os cenários, os itens e a interface também são desenhados por código, tendo as pranchas de concept art como referência (Responsável).
- A opção "Desenho" na tela inicial troca entre as folhas de sprites e o desenho por código. A branch `desenho-por-codigo-v1` guarda a versão anterior aos sprites.
- Catálogo e origem de cada imagem: [assets/concept-art/README.md](assets/concept-art/README.md) e [assets/game/README.md](assets/game/README.md).
- Inventário de recursos G01 a G19 (personagem, efeitos, monstros, portal, cenários, bosses, interface, sons): todos têm versão no protótipo; nenhum está aprovado como final.

## 13. Regras substituídas

Mantidas só como registro.

- T01 (Criador, retirada pelo criador): ciclo de dia e noite de 30 minutos cada.
- T02 (Criador, retirada pelo criador): à noite, 50% de chance de encontrar um monstro no final. Substituída por F05.
- Espada no protagonista: apareceu em um estudo visual e foi corrigida pelo criador (A02).

## 14. Implementação e testes

- HTML, CSS e JavaScript puros com Canvas 2D, resolução lógica de 960×540, sem dependências e sem etapa de build. O jogo abre direto de `jogo/index.html`. Não é decisão definitiva de motor.
- Arquivos: `config.js` (regras e números), `entrada.js` (teclado, toque, som e música), `sprites.js` (imagens recortadas, gerado), `arte.js` e `temas.js` (desenho), `mundos.js` (os cinco mundos), `fase.js` (exploração), `boss.js` (lutas), `cenas.js` (cenas de história), `principal.js` (telas e progressão).
- A primeira pessoa é feita em 2D, com três posições laterais.
- Testes: `node testes/percurso.js` roda o jogo num navegador e confere as regras pelos identificadores, além de atravessar os cinco mundos e vencer os cinco bosses com um robô. O robô não mede dificuldade nem diversão.
- Publicação: página inicial na raiz para GitHub Pages a partir de `main`.

## 15. O que falta decidir com o criador

1. O que achou de cada mundo e de cada boss depois de jogar: qual é o mais divertido, qual é chato, o que está difícil ou fácil demais.
2. A história: se o Concreto alienígena e a nave quebrada ficam, mudam ou saem.
3. Os bosses dos mundos 2 e 5 no lugar da Malgosha e do Lego.
4. A espada: se ele quer mesmo, contra o que disse antes.
5. A cor definitiva do Concreto e o nome definitivo do jogo.
6. Voltar à bandeira do trecho ou ao começo da fase.
7. O que manter, mudar ou tirar entre as escolhas delegadas (itens X).
