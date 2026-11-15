// Junta tudo: telas, relógio de dia e noite, sorteio do portal e o laço principal.
(function () {
  var W = CFG.largura, H = CFG.altura;
  var tela = document.getElementById('tela');
  var c = tela.getContext('2d');

  function ajustarTela() {
    var s = Math.min(2, window.devicePixelRatio || 1);
    tela.width = W * s; tela.height = H * s;
    c.setTransform(s, 0, 0, s, 0, 0);
  }
  ajustarTela();
  window.addEventListener('resize', ajustarTela);

  var T = CFG.tempo, cicloTotal = T.duracaoDia + T.duracaoNoite;
  var Jogo = {
    estado: 'titulo',          // titulo | fase | boss | morrendo | derrota | vitoria
    vidas: CFG.vidas,
    relogio: T.comecaDeDia ? 0 : T.duracaoDia,
    fase: Fase.criar(FASE1),
    boss: null,
    morreuNoBoss: false, teveBoss: false, espera: 0
  };
  window.Jogo = Jogo; // para testes

  function relogio() {
    var p = Jogo.relogio % cicloTotal, noite = p >= T.duracaoDia, mud = 10, n;
    if (!noite) n = p > T.duracaoDia - mud ? (p - (T.duracaoDia - mud)) / mud : 0;
    else n = p > cicloTotal - mud ? 1 - (p - (cicloTotal - mud)) / mud : 1;
    return { noite: noite, brilho: n, falta: noite ? cicloTotal - p : T.duracaoDia - p };
  }

  function novaFase() {
    Jogo.vidas = CFG.vidas;
    Jogo.fase = Fase.criar(FASE1);
    Jogo.boss = null; Jogo.teveBoss = false; Jogo.morreuNoBoss = false;
    Jogo.estado = 'fase';
  }
  function novoBoss() {
    Jogo.boss = Boss.criar(); Jogo.teveBoss = true; Jogo.estado = 'boss';
  }

  function atualizar(dt) {
    var confirmou = Entrada.confirmou || Entrada.puloApertou || Entrada.ataqueApertou;
    var toque = Entrada.toque;

    // FERRAMENTA DE TESTE: pular para o outro período tocando no sol/lua ou com a tecla N
    if (T.atalhoDeTeste && (Jogo.estado === 'fase' || Jogo.estado === 'boss')) {
      if (Entrada.pulouTempo || (toque && toque.x > W - 160 && toque.y < 70)) {
        var p = Jogo.relogio % cicloTotal;
        Jogo.relogio += (p < T.duracaoDia ? T.duracaoDia : cicloTotal) - p;
        toque = null;
      }
    }
    if (Jogo.estado === 'fase' || Jogo.estado === 'boss') Jogo.relogio += dt;

    if (Jogo.estado === 'titulo') {
      Jogo.fase.t += dt;
      if (confirmou || toque) novaFase();
    } else if (Jogo.estado === 'fase') {
      var r = Fase.atualizar(Jogo.fase, dt, Jogo);
      if (r === 'morreu') { Fase.espalhar(Jogo.fase); Jogo.estado = 'morrendo'; Jogo.espera = 2.4; Jogo.morreuNoBoss = false; }
      if (r === 'portal') {
        // Sorteio do encontro no portal (T02), uma vez por chegada.
        var chance = relogio().noite ? CFG.portal.chanceBossNoite : CFG.portal.chanceBossDia;
        if (Math.random() < chance) novoBoss();
        else { Som.portal(); Jogo.estado = 'vitoria'; Jogo.espera = 0.8; }
      }
    } else if (Jogo.estado === 'boss') {
      var rb = Boss.atualizar(Jogo.boss, dt, Jogo);
      if (rb === 'morreu') { Jogo.estado = 'morrendo'; Jogo.espera = 2.4; Jogo.morreuNoBoss = true; Jogo.boss.vento = []; }
      if (rb === 'venceu') { Som.portal(); Jogo.estado = 'vitoria'; Jogo.espera = 0.8; }
    } else if (Jogo.estado === 'morrendo') {
      if (Jogo.morreuNoBoss) { Jogo.boss.t += dt; ventoBoss(dt); } else Fase.soParticulas(Jogo.fase, dt);
      Jogo.espera -= dt;
      if (Jogo.espera <= 0) { Jogo.estado = 'derrota'; Jogo.espera = 0.5; }
    } else if (Jogo.estado === 'derrota' || Jogo.estado === 'vitoria') {
      Jogo.fase.t += dt;
      Jogo.espera -= dt;
      if (Jogo.espera <= 0 && (confirmou || toque)) {
        if (Jogo.estado === 'derrota' && Jogo.morreuNoBoss && CFG.boss.recomecaNoBoss) { Jogo.vidas = CFG.vidas; novoBoss(); }
        else novaFase();
      }
    }
  }

  // Na derrota em primeira pessoa, os pedacinhos de geleca voam com o vento pela tela.
  function ventoBoss(dt) {
    var v = Jogo.boss.vento;
    if (Jogo.espera > 1.2) for (var i = 0; i < 3; i++) v.push({ x: 250 + Math.random() * 460, y: H - Math.random() * 60, vx: 200 + Math.random() * 400, vy: -80 - Math.random() * 220, r: 4 + Math.random() * 7 });
    v.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt + Math.sin(Jogo.boss.t * 6 + p.x * 0.02) * 2; });
  }

  function faixa(titulo, linhas, botao) {
    c.fillStyle = 'rgba(8,20,16,0.62)'; c.fillRect(0, 0, W, H);
    Arte.texto(c, titulo, W / 2, 170, 46, '#f2fbf4');
    linhas.forEach(function (s, i) { Arte.texto(c, s, W / 2, 240 + i * 36, 22, '#d9f3e2', 'center', 600); });
    if (Jogo.espera <= 0 && Math.floor(Jogo.fase.t * 2) % 3 !== 0) Arte.texto(c, botao, W / 2, 420, 24, '#fff27a');
  }

  function desenhar() {
    var rel = relogio(), e = Jogo.estado;
    var noBoss = e === 'boss' || ((e === 'morrendo' || e === 'derrota') && Jogo.morreuNoBoss);
    if (noBoss) {
      Boss.desenhar(c, Jogo.boss, rel.brilho, Jogo.vidas);
      (Jogo.boss.vento || []).forEach(function (p) {
        c.fillStyle = CFG.concreto.cor; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill();
      });
    } else {
      Fase.desenhar(c, Jogo.fase, rel.brilho, e === 'morrendo' || e === 'derrota' || e === 'vitoria');
    }
    if (e !== 'titulo') Arte.painel(c, Jogo.vidas, rel);
    if (e === 'fase' && Jogo.fase.t < 4) Arte.texto(c, 'Fase 1 — ' + FASE1.nome, W / 2, 110, 30, '#f2fbf4');

    if (e === 'titulo') {
      c.fillStyle = 'rgba(40,20,80,0.35)'; c.fillRect(0, 0, W, H);
      Arte.texto(c, 'CONCRETO', W / 2, 134, 88, '#4a1f8a', 'center', 800, '#4a1f8a');
      Arte.texto(c, 'CONCRETO', W / 2, 128, 88, '#b6f03a', 'center', 800, '#1d6b1a');
      Arte.concreto(c, W / 2, 345, { w: 120, h: 140, dir: 1, t: Jogo.fase.t, espichar: Math.sin(Jogo.fase.t * 3) * 0.1 });
      if (Math.floor(Jogo.fase.t * 2) % 3 !== 0) Arte.texto(c, 'Toque na tela ou aperte Enter para jogar', W / 2, 400, 24, '#fff27a');
      Arte.texto(c, 'Teclado: setas andam · espaço pula · X solta o raio de geleca', W / 2, 470, 17, '#d9f3e2', 'center', 600);
      Arte.texto(c, 'Protótipo da Fase 1 — versão de teste', W / 2, 505, 14, '#a9cbb6', 'center', 600);
    } else if (e === 'derrota') {
      faixa('O vento levou o Concreto!', ['As três vidas acabaram.', Jogo.morreuNoBoss ? 'Você volta para a luta contra o boss.' : 'Você volta para o começo da fase.'], 'Toque ou aperte Enter para tentar de novo');
    } else if (e === 'vitoria') {
      faixa('Você atravessou o portal!', [
        Jogo.teveBoss ? 'O ' + CFG.boss.nome + ' foi derrotado!' : (rel.noite ? 'Desta vez não tinha boss no portal.' : 'De dia o portal estava livre.'),
        'O Mundo 2 ainda está sendo inventado.'
      ], 'Toque ou aperte Enter para jogar de novo');
    }
  }

  var antes = 0;
  function quadro(agora) {
    var dt = Math.min(0.033, (agora - antes) / 1000 || 0);
    antes = agora;
    atualizar(dt);
    desenhar();
    Entrada.limparQuadro();
    requestAnimationFrame(quadro);
  }
  Jogo.passo = function (dt) { atualizar(dt); Entrada.limparQuadro(); }; // para testes
  requestAnimationFrame(quadro);
})();
