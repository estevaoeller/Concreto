// Lutas contra os bosses, em primeira pessoa: você olha pelos olhos do Concreto.
// Confirmado para todos: 2 ataques e depois 10 s sem atacar (B01). Confirmado para o Cthulhu: primeira pessoa (B04),
// aviso de papel higiênico (B05), barra de vida grande (B07).
// PROVISÓRIO: primeira pessoa, barra grande e aviso temático para os outros bosses; três lados (esquerda, meio, direita);
// andar para o lado escapa do golpe; o raio só machuca na pausa; onda que cobre dois lados; brasa que fica no chão.
var Boss = (function () {
  var W = CFG.largura, H = CFG.altura, PASSO = 270, PULO = 0.75, R = Arte.retArred;

  function criar(def, semFala) {
    var cfg = {}, k;
    for (k in CFG.boss) cfg[k] = CFG.boss[k];
    for (k in def) cfg[k] = def[k];
    if (semFala) { cfg.fala = null; cfg.entrada = 1.3; } // a provocação já foi dita na cena de antes
    return {
      cfg: cfg, vis: VISUAL[cfg.tipo], vida: cfg.vida, t: 0,
      lado: 0, visao: 0,            // lado do Concreto: -1, 0, 1 (visao segue o lado com suavidade)
      bossLado: 0, bossX: 0,
      fase: 'entrada', tempo: 0, ataques: 0, alvos: [], brasas: [], golpeou: false, trocou: 0, flash: 0,
      recarga: 0, tiros: [], avisos: [], particulas: [], invul: 0, tremor: 0, vencido: 0,
      tipoAtaque: 'lado', perseguiu: false, pulo: 0   // pulo: tempo no ar do Concreto, para escapar do golpe no chão
    };
  }

  function recado(b, s, cor) { b.avisos.push({ s: s, vida: 0.8, cor: cor || '#f2fbf4', lado: b.bossLado }); }
  function ferir(b, jogo) {
    if (jogo.escudo) { jogo.escudo = false; Som.quebrou(); } else { jogo.vidas--; Som.dano(); }
    b.invul = CFG.invencivelAposDano; b.tremor = 0.4;
  }
  function mirar(b) {
    b.alvos = [b.lado];                             // mira onde o Concreto está agora
    if (b.vida / b.cfg.vida <= b.cfg.ondaAbaixoDe) { // onda: cobre dois lados, sobra um seguro
      var outros = [-1, 0, 1].filter(function (l) { return l !== b.lado; });
      b.alvos.push(outros[Math.floor(Math.random() * 2)]);
    }
  }

  // Devolve 'morreu' ou 'venceu'.
  function atualizar(b, dt, jogo) {
    var B = b.cfg;
    b.t += dt; b.tempo += dt;
    if (b.invul > 0) b.invul -= dt;
    if (b.recarga > 0) b.recarga -= dt;
    if (b.tremor > 0) b.tremor -= dt;
    if (b.flash > 0) b.flash -= dt;
    if (b.pulo > 0) b.pulo -= dt;
    if (Entrada.puloApertou && b.pulo <= 0) { b.pulo = PULO; Som.pulo(); }

    if (Entrada.esqApertou && b.lado > -1) b.lado--;
    if (Entrada.dirApertou && b.lado < 1) b.lado++;
    b.visao += (b.lado - b.visao) * Math.min(1, dt * 14);
    b.bossX += (b.bossLado - b.bossX) * Math.min(1, dt * 5);

    if (b.fase === 'vencido') {
      b.vencido += dt;
      return b.vencido > 2.4 ? 'venceu' : null;
    }

    if (b.fase === 'entrada') {
      if (b.tempo > (B.entrada || 2.8)) iniciarAviso(b);
    } else if (b.fase === 'aviso') {            // aviso antes do golpe (B05)
      if (B.persegue && b.tipoAtaque === 'lado' && !b.perseguiu && b.tempo >= B.aviso * 0.45) { // o aviso muda de lado uma vez
        b.perseguiu = true; mirar(b); Som.aviso();
      }
      if (b.tempo >= B.aviso) { b.fase = 'golpe'; b.tempo = 0; b.golpeou = false; }
    } else if (b.fase === 'golpe') {
      if (!b.golpeou && b.tempo >= B.golpe * 0.5) {
        b.golpeou = true;
        if (b.tipoAtaque === 'chao') { b.tremor = 0.3; if (b.pulo <= 0.08 && b.invul <= 0) ferir(b, jogo); } // no chão: só escapa pulando
        else {
          if (b.alvos.indexOf(b.lado) >= 0 && b.invul <= 0) ferir(b, jogo);
          if (B.brasa) b.alvos.forEach(function (l) { b.brasas.push({ lado: l, tempo: B.brasa }); });
        }
      }
      if (b.tempo >= B.golpe) {
        b.ataques++;
        if (b.ataques >= B.ataquesPorCiclo) { b.fase = 'pausa'; b.tempo = 0; b.trocou = 0; }
        else { b.fase = 'espera'; b.tempo = 0; }
      }
    } else if (b.fase === 'espera') {
      if (b.tempo >= B.entreAtaques) iniciarAviso(b);
    } else if (b.fase === 'pausa') {            // 10 segundos sem atacar: a chance do Concreto (B01)
      b.trocou += dt;
      if (b.trocou >= B.trocaDeLado) {
        b.trocou = 0;
        var op = [-1, 0, 1].filter(function (l) { return l !== b.bossLado; });
        b.bossLado = op[Math.floor(Math.random() * op.length)];
      }
      if (b.tempo >= B.pausa) { b.ataques = 0; b.bossLado = 0; iniciarAviso(b); }
    }

    // brasa que fica no chão depois do golpe
    b.brasas = b.brasas.filter(function (q) {
      q.tempo -= dt;
      if (q.lado === b.lado && b.invul <= 0 && q.tempo > 0) ferir(b, jogo);
      return q.tempo > 0;
    });

    // raio de geleca em primeira pessoa
    if (Entrada.ataqueApertou && b.recarga <= 0) {
      b.recarga = jogo.poder.recarga;
      b.tiros.push({ lado: b.lado, p: 0 });
      Som.raio();
    }
    b.tiros = b.tiros.filter(function (tiro) {
      tiro.p += dt / 0.28;
      if (tiro.p < 1) return true;
      if (tiro.lado === b.bossLado && Math.abs(b.bossX - b.bossLado) < 0.35) {
        if (b.fase === 'pausa' || !B.danoSoNaPausa) {
          b.vida -= CFG.raio.dano; b.flash = 0.12; Som.acerto(); jogo.congela = 0.035;
          respingo(b, tiro.lado);
          if (b.vida <= 0) { // derrota: o boss estoura em pedaços do seu próprio tema
            b.vida = 0; b.fase = 'vencido'; b.vencido = 0; b.brasas = []; b.tremor = 0.5; jogo.congela = 0.25; Som.vitoria();
            b.estouro = [];
            for (var e = 0; e < 16; e++) b.estouro.push({ x: 0, y: 0, vx: (Math.random() - 0.5) * 700, vy: -200 - Math.random() * 500, r: 14 + Math.random() * 16 });
          }
        } else { recado(b, 'Bloqueou!', '#ffd0d0'); Som.bloqueio(); }
      }
      return false;
    });

    (b.estouro || []).forEach(function (q) { q.vy += 900 * dt; q.x += q.vx * dt; q.y += q.vy * dt; });
    b.avisos = b.avisos.filter(function (a) { a.vida -= dt; return a.vida > 0; });
    b.particulas = b.particulas.filter(function (p) {
      p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt; return p.vida > 0;
    });

    return jogo.vidas <= 0 ? 'morreu' : null;
  }

  function iniciarAviso(b) {
    b.fase = 'aviso'; b.tempo = 0; b.perseguiu = false;
    // golpe no chão: o segundo ataque de cada ciclo, para os bosses que têm esse golpe
    b.tipoAtaque = b.cfg.chao && b.ataques === 1 ? 'chao' : 'lado';
    if (b.tipoAtaque === 'chao') b.alvos = [-1, 0, 1]; else mirar(b);
    Som.aviso();
  }
  function respingo(b, lado) {
    for (var i = 0; i < 8; i++) {
      b.particulas.push({ x: lado * PASSO, y: 250, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 260, vida: 0.5, r: 4 + Math.random() * 4 });
    }
  }

  function xTela(b, lado) { return W / 2 + (lado - b.visao) * PASSO; }

  // ---------- peças de desenho ----------
  function tira(c, pts, larg, cor, borda) {
    function tracar() {
      c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length - 1; i++) {
        c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
      }
      c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    }
    c.lineCap = 'round'; c.lineJoin = 'round';
    tracar(); c.strokeStyle = borda || '#8f86b8'; c.lineWidth = larg + 5; c.stroke();
    tracar(); c.strokeStyle = cor || '#fbfaff'; c.lineWidth = larg; c.stroke();
  }
  function olhoBravo(c, s, x, y, e, cor, estado) { // olho inclinado; em X quando cansado
    if (estado.tonto) {
      c.strokeStyle = estado.corX || '#4a3f78'; c.lineWidth = 6 * e; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x - 13 * e, y - 13 * e); c.lineTo(x + 13 * e, y + 13 * e);
      c.moveTo(x + 13 * e, y - 13 * e); c.lineTo(x - 13 * e, y + 13 * e); c.stroke();
      return;
    }
    c.save(); c.translate(x, y); c.scale(e, e);
    c.beginPath();
    c.moveTo(-s * 26, 6); c.quadraticCurveTo(0, -26, s * 30, -24);
    c.quadraticCurveTo(s * 30, 16, 0, 20); c.quadraticCurveTo(-s * 22, 18, -s * 26, 6); c.closePath();
    c.fillStyle = '#2a2050'; c.fill();
    c.save(); c.clip();
    c.shadowColor = estado.bravo ? '#ff7a2a' : cor; c.shadowBlur = 16;
    c.fillStyle = estado.bravo ? '#ff9a2a' : cor;
    c.beginPath(); c.ellipse(s * 4, 2, 19, 16, 0, 0, 7); c.fill();
    c.shadowBlur = 0; c.fillStyle = '#fffbd0';
    c.beginPath(); c.ellipse(s * 6, 0, 7, 6, 0, 0, 7); c.fill();
    c.restore();
    c.strokeStyle = '#2a2050'; c.lineWidth = 7; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-s * 30, 2); c.lineTo(s * 34, -30); c.stroke();
    c.restore();
  }
  function rolo(c, x, y, r) {
    c.fillStyle = '#ffffff'; c.strokeStyle = '#9aa2b3'; c.lineWidth = 3;
    c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = '#d5d9e3'; c.lineWidth = 2;
    c.beginPath(); c.arc(x, y, r * 0.72, 0, 7); c.stroke();
    c.fillStyle = '#b08a5a'; c.beginPath(); c.arc(x, y, r * 0.38, 0, 7); c.fill();
    c.fillStyle = '#6e5433'; c.beginPath(); c.arc(x, y, r * 0.24, 0, 7); c.fill();
  }
  function roloEmPe(c, x, y, e) {
    c.fillStyle = '#f4f1ff'; c.strokeStyle = '#8f86b8'; c.lineWidth = 2.5;
    R(c, x - 22 * e, y - 34 * e, 44 * e, 36 * e, 7 * e); c.fill(); c.stroke();
    c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x, y - 34 * e, 22 * e, 7 * e, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#8a5a34'; c.beginPath(); c.ellipse(x, y - 34 * e, 8 * e, 2.6 * e, 0, 0, 7); c.fill();
  }
  function cubo(c, x, y, r, cor, borda, brilho) {
    if (brilho) { c.shadowColor = brilho; c.shadowBlur = 22; }
    c.fillStyle = cor; c.strokeStyle = borda; c.lineWidth = 3;
    R(c, x - r, y - r, r * 2, r * 2, r * 0.2); c.fill(); c.shadowBlur = 0; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x - r * 0.6, y - r * 0.55); c.lineTo(x + r * 0.2, y - r * 0.55); c.stroke();
  }
  function pecaBloco(c, x, y, w, h, cor, borda, pinos) {
    c.fillStyle = cor; c.strokeStyle = borda; c.lineWidth = 3.5; c.lineJoin = 'round';
    c.fillRect(x, y, w, h); c.strokeRect(x, y, w, h);
    for (var i = 0; i < (pinos || 0); i++) {
      var lw = w / pinos;
      R(c, x + i * lw + lw * 0.2, y - 11, lw * 0.6, 12, 3); c.fill(); c.stroke();
    }
    c.fillStyle = 'rgba(255,255,255,0.22)'; c.fillRect(x + 4, y + 4, w - 8, h * 0.22);
  }

  // ---------- os cinco bosses ----------
  var VISUAL = {
    // Mundo 1 — rolo de papel com olhos amarelos, tentáculos de tiras, manto roxo e medalhão (prancha B01)
    cthulhu: {
      arena: { ceu: ['#231048', '#6b3bb0'], chao: ['#7a5ab8', '#3c2670'], coluna: ['#b9a6d8', '#4a3578'], luz: '255,214,250', estrelas: true },
      feixe: ['#ffffff', '#9aa2b3'], tracejado: true,
      objeto: function (c, x, y, r) { rolo(c, x, y, r); },
      prop: function (c, x, y, e) { roloEmPe(c, x, y, e); roloEmPe(c, x + 34 * e, y, e); roloEmPe(c, x + 17 * e, y - 34 * e, e); },
      corpo: function (c, b, t, est) {
        c.fillStyle = '#4a1f9a'; c.strokeStyle = '#2a0f5e'; c.lineWidth = 4; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(-84, 10); c.quadraticCurveTo(-170, 90, -196, 215); c.quadraticCurveTo(0, 250, 196, 215);
        c.quadraticCurveTo(170, 90, 84, 10); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = '#f2b824'; c.lineWidth = 9;
        c.beginPath(); c.moveTo(-190, 205); c.quadraticCurveTo(0, 240, 190, 205); c.stroke();
        [-1, 1].forEach(function (s) {
          for (var k = 0; k < 2; k++) {
            var o = Math.sin(t * 2.5 + k * 2 + s) * 24 * est.forca;
            tira(c, [[s * 70, 10 + k * 40], [s * 150, -40 + k * 50 + o], [s * 210, 30 + k * 40 - o], [s * 270, -10 + k * 60 + o * 0.6]], 20 - k * 4);
          }
        });
        for (var i = -3; i <= 3; i++) {
          var comp = 120 + (3 - Math.abs(i)) * 18, w1 = Math.sin(t * 3 + i * 1.3) * 22 * est.forca, abre = est.cansado ? 0.5 : 1;
          tira(c, [[i * 20, 40], [i * 34 * abre + w1, 40 + comp * 0.45], [i * 52 * abre - w1, 40 + comp * 0.8], [i * 62 * abre + w1 * 0.6, 40 + comp + (est.cansado ? 20 : 0)]], 17);
        }
        c.fillStyle = '#f2b824'; c.strokeStyle = '#8a5a08'; c.lineWidth = 4;
        c.beginPath(); c.arc(0, 104, 24, 0, 7); c.fill(); c.stroke();
        c.fillStyle = '#fff'; c.strokeStyle = '#8f86b8'; c.lineWidth = 2; R(c, -11, 94, 22, 22, 5); c.fill(); c.stroke();
        var g = c.createLinearGradient(-90, 0, 90, 0);
        g.addColorStop(0, '#d9d4ee'); g.addColorStop(0.35, '#ffffff'); g.addColorStop(1, '#cfc9e6');
        c.fillStyle = g; c.strokeStyle = '#8f86b8'; c.lineWidth = 4;
        R(c, -90, -86, 180, 150, 30); c.fill(); c.stroke();
        c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(0, -86, 90, 28, 0, 0, 7); c.fill(); c.stroke();
        c.fillStyle = '#8a5a34'; c.strokeStyle = '#5a3a1e'; c.lineWidth = 3;
        c.beginPath(); c.ellipse(0, -86, 34, 11, 0, 0, 7); c.fill(); c.stroke();
        [-1, 1].forEach(function (s) { olhoBravo(c, s, s * 42, -22, 1, '#ffe14a', est); });
      }
    },

    // Mundo 2 — rainha vulcânica original da prancha B02: coroa de pedra, cabelo de chamas, manto com veios de lava
    rainha: {
      arena: { ceu: ['#1e0a1e', '#8a2420'], chao: ['#5a2a30', '#22101a'], coluna: ['#4a3a52', '#1c1220'], luz: '255,150,60', estrelas: false },
      feixe: ['#ff8a1e', '#b8340a'],
      objeto: function (c, x, y, r) { cubo(c, x, y, r * 0.8, '#ff8a1e', '#b8340a', '#ffd23a'); },
      prop: function (c, x, y, e) { cubo(c, x, y - 18 * e, 18 * e, '#3a2a40', '#1c1220'); cubo(c, x + 30 * e, y - 14 * e, 14 * e, '#ff7a1e', '#8a2408', '#ff7a1e'); },
      corpo: function (c, b, t, est) {
        var i, o;
        for (i = -4; i <= 4; i++) {                               // cabelo de chamas
          if (i === 0) continue;
          o = Math.sin(t * 3 + i) * 16 * est.forca;
          tira(c, [[i * 14, -80], [i * 38 + o, -30], [i * 46 - o, 50], [i * 52 + o, 130]], 26, i % 2 ? '#ff7a1e' : '#b8264a', '#5a1030');
        }
        c.fillStyle = '#2a1830'; c.strokeStyle = '#120a18'; c.lineWidth = 4; c.lineJoin = 'round';   // manto
        c.beginPath(); c.moveTo(-60, 0);
        c.quadraticCurveTo(-150, 90, -180, 220);
        for (i = -3; i <= 3; i++) c.lineTo(i * 52 + 26, 220 + (Math.abs(i) % 2 ? 0 : 18));
        c.lineTo(180, 220); c.quadraticCurveTo(150, 90, 60, 0); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = '#ff8a1e'; c.lineWidth = 4; c.shadowColor = '#ff8a1e'; c.shadowBlur = 10 * est.forca;   // veios de lava
        c.beginPath(); c.moveTo(-90, 200); c.lineTo(-60, 150); c.lineTo(-80, 110); c.moveTo(-10, 210); c.lineTo(10, 160); c.lineTo(-14, 120); c.lineTo(8, 80);
        c.moveTo(90, 205); c.lineTo(70, 160); c.lineTo(96, 120); c.stroke(); c.shadowBlur = 0;
        c.fillStyle = '#ff5a2a'; c.strokeStyle = '#7a1408'; c.lineWidth = 3;                              // gema do peito
        c.beginPath(); c.moveTo(0, 22); c.lineTo(16, 42); c.lineTo(0, 62); c.lineTo(-16, 42); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = '#c47a5a'; c.strokeStyle = '#6a3424'; c.lineWidth = 4;                              // rosto
        c.beginPath(); c.ellipse(0, -40, 62, 58, 0, 0, 7); c.fill(); c.stroke();
        c.fillStyle = '#8a2050'; c.beginPath(); c.moveTo(-64, -50); c.quadraticCurveTo(-30, -84, 0, -70); c.quadraticCurveTo(30, -84, 64, -50);
        c.quadraticCurveTo(40, -110, 0, -104); c.quadraticCurveTo(-40, -110, -64, -50); c.fill();
        c.fillStyle = '#3a2a40'; c.strokeStyle = '#120a18'; c.lineWidth = 4;                              // coroa
        c.beginPath(); c.moveTo(-58, -84); c.lineTo(-64, -132); c.lineTo(-38, -112); c.lineTo(-20, -146); c.lineTo(0, -116);
        c.lineTo(20, -146); c.lineTo(38, -112); c.lineTo(64, -132); c.lineTo(58, -84); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = '#ff5a2a'; c.beginPath(); c.arc(0, -98, 9, 0, 7); c.fill();
        [-1, 1].forEach(function (s) { olhoBravo(c, s, s * 26, -40, 0.78, '#ffe14a', est); });
        c.strokeStyle = '#4a1420'; c.lineWidth = 4; c.lineCap = 'round';
        c.beginPath(); if (est.cansado) c.arc(0, 2, 12, Math.PI + 0.4, -0.4); else c.arc(0, -14, 14, 0.3, Math.PI - 0.3); c.stroke();
        if (!est.tonto) cubo(c, 150, -70 + Math.sin(t * 3) * 10, 30, '#ff8a1e', '#b8340a', '#ffd23a');
      }
    },

    // Mundo 3 — anjo da prancha B03: auréola, asas grandes, manto branco e dourado
    anjo: {
      arena: { ceu: ['#3f9ff0', '#d8f2ff'], chao: ['#ffffff', '#b8d8f5'], coluna: ['#f6f2ff', '#9aa8d8'], luz: '255,250,200', estrelas: false },
      feixe: ['#fff6b0', '#e0b020'],
      objeto: function (c, x, y, r) { c.shadowColor = '#fff27a'; c.shadowBlur = 24; Arte.estrela(c, x, y, r * 1.05, '#fff27a', '#d8a010'); c.shadowBlur = 0; },
      prop: function (c, x, y, e) { Arte.nuvem(c, x - 20 * e, y - 16 * e, e * 1.1, '#ffffff'); },
      corpo: function (c, b, t, est) {
        var bate = Math.sin(t * 4) * 0.18 * est.forca, i;
        [-1, 1].forEach(function (s) {                             // asas
          for (i = 0; i < 4; i++) {
            c.save(); c.translate(s * 50, -10); c.rotate(s * (-0.75 + i * 0.36 + bate) - (est.cansado ? s * -0.5 : 0));
            c.fillStyle = '#ffffff'; c.strokeStyle = '#a8b8e8'; c.lineWidth = 3;
            c.beginPath(); c.ellipse(s * 95, 0, 100 - i * 12, 26, 0, 0, 7); c.fill(); c.stroke();
            c.restore();
          }
        });
        c.fillStyle = '#ffffff'; c.strokeStyle = '#a8b8e8'; c.lineWidth = 4; c.lineJoin = 'round';        // manto
        c.beginPath(); c.moveTo(-46, 10); c.quadraticCurveTo(-110, 110, -124, 215); c.quadraticCurveTo(0, 240, 124, 215);
        c.quadraticCurveTo(110, 110, 46, 10); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = '#f2c230'; c.lineWidth = 8;
        c.beginPath(); c.moveTo(-118, 206); c.quadraticCurveTo(0, 230, 118, 206); c.stroke();
        c.beginPath(); c.moveTo(-30, 20); c.lineTo(0, 130); c.lineTo(30, 20); c.stroke();
        Arte.estrela(c, 0, 52, 20, '#ffd84a', '#b8860b');
        c.fillStyle = '#fff3c8'; c.strokeStyle = '#d8b860'; c.lineWidth = 4;                              // cabelo e rosto
        c.beginPath(); c.arc(0, -46, 70, 0, 7); c.fill(); c.stroke();
        c.fillStyle = '#ffe9d6'; c.strokeStyle = '#d8a890'; c.lineWidth = 3;
        c.beginPath(); c.ellipse(0, -36, 52, 46, 0, 0, 7); c.fill(); c.stroke();
        Arte.estrela(c, 0, -84, 11, '#ffd84a', '#b8860b');
        [-1, 1].forEach(function (s) { olhoBravo(c, s, s * 22, -36, 0.62, '#ffe14a', est); });
        c.fillStyle = '#7a2a40'; c.beginPath(); c.ellipse(0, -8, est.cansado ? 6 : 10, est.cansado ? 4 : 9, 0, 0, 7); c.fill();
        c.save(); c.translate(0, -132); c.rotate(est.cansado ? 0.35 : 0);                                // auréola
        c.strokeStyle = '#ffd84a'; c.lineWidth = 9; c.shadowColor = '#fff27a'; c.shadowBlur = 16 * est.forca;
        c.beginPath(); c.ellipse(0, 0, 54, 14, 0, 0, 7); c.stroke(); c.restore(); c.shadowBlur = 0;
      }
    },

    // Mundo 4 — coelho de pelúcia da prancha B04: orelhas compridas, costuras, laço vermelho e botão azul
    coelho: {
      arena: { ceu: ['#7a4ac8', '#f0a8dc'], chao: ['#ffb8dc', '#b06ac0'], coluna: ['#ffd6ea', '#b8427e'], luz: '255,230,250', estrelas: true },
      feixe: ['#ffffff', '#d0a0c8'],
      objeto: function (c, x, y, r) { Arte.nuvem(c, x - r * 0.9, y + r * 0.2, r / 30, '#ffffff'); c.strokeStyle = '#d0a0c8'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); },
      prop: function (c, x, y, e) {
        c.fillStyle = '#2f7de0'; c.strokeStyle = '#143f86'; c.lineWidth = 3;
        c.beginPath(); c.ellipse(x, y - 8 * e, 26 * e, 10 * e, 0, 0, 7); c.fill(); c.stroke();
        c.fillStyle = '#143f86'; [-8, 8].forEach(function (d) { c.beginPath(); c.arc(x + d * e, y - 8 * e, 3 * e, 0, 7); c.fill(); });
      },
      corpo: function (c, b, t, est) {
        var pele = '#fbe6d8', borda = '#b08a78';
        [-1, 1].forEach(function (s) {                             // orelhas
          c.save(); c.translate(s * 44, -100); c.rotate(s * (0.2 + Math.sin(t * 2 + s) * 0.06) + (est.cansado && s > 0 ? 1.3 : 0));
          c.fillStyle = pele; c.strokeStyle = borda; c.lineWidth = 4;
          c.beginPath(); c.ellipse(0, -70, 30, 82, 0, 0, 7); c.fill(); c.stroke();
          c.fillStyle = '#ff9ec4'; c.beginPath(); c.ellipse(0, -66, 15, 60, 0, 0, 7); c.fill();
          c.restore();
        });
        c.fillStyle = pele; c.strokeStyle = borda; c.lineWidth = 4;                                      // corpo e patas
        c.beginPath(); c.ellipse(0, 130, 120, 100, 0, 0, 7); c.fill(); c.stroke();
        [-1, 1].forEach(function (s) {
          var py = 90 + Math.sin(t * 3 + s) * 10 * est.forca;
          c.fillStyle = pele; c.beginPath(); c.ellipse(s * 140, py, 44, 40, 0, 0, 7); c.fill(); c.stroke();
          c.fillStyle = '#ff9ec4'; c.beginPath(); c.ellipse(s * 140, py + 6, 20, 16, 0, 0, 7); c.fill();
          [-16, 0, 16].forEach(function (d) { c.beginPath(); c.arc(s * 140 + d, py - 18, 7, 0, 7); c.fill(); });
        });
        c.fillStyle = '#2f7de0'; c.strokeStyle = '#143f86';                                              // botão
        c.beginPath(); c.arc(0, 150, 24, 0, 7); c.fill(); c.stroke();
        c.fillStyle = pele; c.strokeStyle = borda;                                                        // cabeça
        c.beginPath(); c.ellipse(0, -20, 104, 92, 0, 0, 7); c.fill(); c.stroke();
        c.save(); c.beginPath(); c.ellipse(0, -20, 104, 92, 0, 0, 7); c.clip();
        c.fillStyle = '#b48ae0'; c.beginPath(); c.arc(-70, -90, 46, 0, 7); c.fill(); c.restore();
        c.strokeStyle = '#7a5a48'; c.lineWidth = 3; c.setLineDash([8, 6]);                                // costuras
        c.beginPath(); c.moveTo(0, -110); c.lineTo(0, -62); c.moveTo(60, 20); c.lineTo(92, -4); c.stroke(); c.setLineDash([]);
        [-1, 1].forEach(function (s) { olhoBravo(c, s, s * 40, -30, 0.9, '#ff5a4a', est); });
        c.fillStyle = '#ff7aa8'; c.beginPath(); c.ellipse(0, 4, 13, 9, 0, 0, 7); c.fill();
        c.fillStyle = '#6b1535'; c.beginPath(); c.ellipse(0, 36, est.cansado ? 14 : 26, est.cansado ? 8 : 20, 0, 0, 7); c.fill();
        c.fillStyle = '#fff'; c.strokeStyle = borda; c.lineWidth = 2; c.fillRect(-12, 18, 11, 16); c.strokeRect(-12, 18, 11, 16); c.fillRect(1, 18, 11, 16); c.strokeRect(1, 18, 11, 16);
        c.fillStyle = '#e8364a'; c.strokeStyle = '#8a1226'; c.lineWidth = 4; c.lineJoin = 'round';        // laço
        [-1, 1].forEach(function (s) { c.beginPath(); c.moveTo(0, 82); c.lineTo(s * 58, 56); c.lineTo(s * 58, 108); c.closePath(); c.fill(); c.stroke(); });
        c.beginPath(); c.arc(0, 82, 13, 0, 7); c.fill(); c.stroke();
      }
    },

    // Mundo 5 — guardião de blocos de montar da prancha B05: cabeça amarela, tronco azul, punhos vermelhos
    guardiao: {
      arena: { ceu: ['#5a3ab8', '#ffa86a'], chao: ['#f5c62a', '#c8641e'], coluna: ['#2f7de0', '#143f86'], luz: '255,240,200', estrelas: false },
      feixe: ['#e8364a', '#8a1226'],
      objeto: function (c, x, y, r) { pecaBloco(c, x - r, y - r * 0.6, r * 2, r * 1.2, '#e8364a', '#8a1226', 2); },
      prop: function (c, x, y, e) {
        pecaBloco(c, x - 26 * e, y - 26 * e, 52 * e, 26 * e, '#3fb24a', '#1c6426', 2);
        pecaBloco(c, x - 13 * e, y - 52 * e, 40 * e, 26 * e, '#2f7de0', '#143f86', 2);
      },
      corpo: function (c, b, t, est) {
        var soco = est.bravo ? 30 : 0;
        pecaBloco(c, -66, 150, 54, 70, '#e8364a', '#8a1226', 0); pecaBloco(c, 12, 150, 54, 70, '#f5c62a', '#a06a08', 0);   // pernas
        pecaBloco(c, -82, 30, 164, 124, '#2f7de0', '#143f86', 0);                                                       // tronco
        pecaBloco(c, -40, 70, 80, 46, '#f5c62a', '#a06a08', 0);
        [-1, 1].forEach(function (s) {                                                                                 // ombros e punhos
          pecaBloco(c, s * 82 - (s < 0 ? 56 : 0), 24, 56, 50, '#3fb24a', '#1c6426', 2);
          var py = 96 + Math.sin(t * 3 + s) * 12 * est.forca + (est.cansado ? 40 : 0) + soco;
          pecaBloco(c, s * 150 - 50, py, 100, 90, '#e8364a', '#8a1226', 2);
        });
        pecaBloco(c, -78, -112, 156, 130, '#f5c62a', '#a06a08', 2);                                                    // cabeça
        [-1, 1].forEach(function (s) { olhoBravo(c, s, s * 34, -54, 0.9, '#fff6c8', { tonto: est.tonto, bravo: est.bravo, corX: '#5a3a08' }); });
        c.fillStyle = '#3a1a10'; c.strokeStyle = '#3a1a10'; c.lineWidth = 3;
        c.beginPath();
        if (est.cansado) c.rect(-26, -16, 52, 10);
        else { c.moveTo(-40, -22); c.lineTo(40, -22); c.lineTo(28, 6); c.lineTo(-28, 6); c.closePath(); }
        c.fill();
        if (!est.cansado) { c.fillStyle = '#fff'; c.fillRect(-30, -22, 14, 9); c.fillRect(16, -22, 14, 9); }
      }
    }
  };

  function desenharBoss(c, b, x, y) {
    var cansado = b.fase === 'pausa', vencido = b.fase === 'vencido';
    var est = { cansado: cansado, vencido: vencido, tonto: cansado || vencido, bravo: b.fase === 'aviso' || b.fase === 'golpe', forca: cansado || vencido ? 0.3 : 1 };
    c.save();
    c.translate(x, y + (cansado ? 30 : 0) + Math.sin(b.t * 2) * 6);
    c.globalAlpha = vencido ? Math.max(0, 1 - b.vencido / 2) : 1;
    if (vencido) c.rotate(b.vencido * 0.25);
    if (b.flash > 0) c.scale(1.05, 1.05);
    // folha de sprites do boss, só se tiver sido incluída em sprites.js; por decisão do criador, hoje os bosses são desenhados por código
    var quadro = est.tonto ? 'cansado' : b.fase === 'golpe' ? 'ataca' : b.fase === 'aviso' ? 'prepara' : 'neutro';
    if (typeof SPRITES === 'undefined' || !SPRITES[b.cfg.tipo] || !Arte.sprite(c, b.cfg.tipo, quadro, 0, 218, 372, 'neutro')) b.vis.corpo(c, b, b.t, est);
    c.restore();
  }

  function desenhar(c, b, vidas) {
    var B = b.cfg, V = b.vis, A = V.arena, i;
    c.save();
    if (b.tremor > 0) c.translate((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 12);
    var noAr = b.pulo > 0 ? Math.sin((1 - b.pulo / PULO) * Math.PI) : 0;
    c.translate(0, noAr * 46); // pulando, o chão desce na tela
    // arena
    var ceu = c.createLinearGradient(0, 0, 0, 340);
    ceu.addColorStop(0, A.ceu[0]); ceu.addColorStop(1, A.ceu[1]);
    c.fillStyle = ceu; c.fillRect(-20, -80, W + 40, 432);
    if (A.estrelas) {
      c.fillStyle = 'rgba(255,240,255,0.8)';
      for (i = 0; i < 40; i++) {
        var ex = ((Arte.acaso(i) * (W + 200) - b.visao * 40) % (W + 40) + W + 40) % (W + 40) - 20;
        c.beginPath(); c.arc(ex, Arte.acaso(i + 50) * 300, 1 + Arte.acaso(i + 9) * 1.6 + Math.sin(b.t * 2 + i) * 0.4, 0, 7); c.fill();
      }
    }
    var luz = c.createRadialGradient(W / 2, 210, 20, W / 2, 210, 430);
    luz.addColorStop(0, 'rgba(' + A.luz + ',0.45)'); luz.addColorStop(1, 'rgba(' + A.luz + ',0)');
    c.fillStyle = luz; c.fillRect(-20, -20, W + 40, 372);
    var g = c.createLinearGradient(0, 330, 0, H);
    g.addColorStop(0, A.chao[0]); g.addColorStop(1, A.chao[1]);
    c.fillStyle = g; c.fillRect(-20, 330, W + 40, H);
    c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 3;
    [-1.5, -0.5, 0.5, 1.5].forEach(function (l) {
      c.beginPath(); c.moveTo(W / 2 + (l - b.visao) * PASSO * 0.45, 330);
      c.lineTo(W / 2 + (l - b.visao) * PASSO * 1.9, H); c.stroke();
    });
    [372, 430, 500].forEach(function (yy) { c.beginPath(); c.moveTo(-20, yy); c.lineTo(W + 20, yy); c.stroke(); });
    [-2.1, -1.35, 1.35, 2.1].forEach(function (l, k) {
      var px = W / 2 + (l - b.visao * 0.6) * PASSO, larg = 46 + (k % 2) * 14;
      c.fillStyle = A.coluna[0]; c.strokeStyle = A.coluna[1]; c.lineWidth = 3;
      c.fillRect(px - larg / 2, -70, larg, 406); c.strokeRect(px - larg / 2, -70, larg, 406);
      c.fillRect(px - larg / 2 - 8, 316, larg + 16, 22); c.strokeRect(px - larg / 2 - 8, 316, larg + 16, 22);
    });
    [[-1.7, 1], [-0.85, 0.8], [0.95, 0.8], [1.65, 1]].forEach(function (r) { V.prop(c, W / 2 + (r[0] - b.visao * 0.8) * PASSO, 374, r[1]); });

    desenharBoss(c, b, xTela(b, b.bossX), 220);
    (b.estouro || []).forEach(function (q) { V.objeto(c, xTela(b, b.bossX) + q.x, 200 + q.y, q.r); });

    // brasa no chão
    b.brasas.forEach(function (q) {
      var bx = xTela(b, q.lado);
      for (i = -3; i <= 3; i++) {
        var a = 46 + Math.sin(b.t * 12 + i * 2) * 16;
        c.fillStyle = i % 2 ? '#ff8a1e' : '#ffd23a'; c.globalAlpha = Math.min(1, q.tempo * 1.5);
        c.beginPath(); c.moveTo(bx + i * 34 - 22, 500); c.quadraticCurveTo(bx + i * 34, 500 - a * 2, bx + i * 34 + 22, 500); c.fill();
      }
      c.globalAlpha = 1;
    });

    // aviso e golpe
    if ((b.fase === 'aviso' || b.fase === 'golpe') && b.tipoAtaque === 'chao') {
      // golpe no chão: uma onda vem do fundo e passa por baixo; o aviso é o objeto do boss batendo no meio da arena
      var kc = b.fase === 'aviso' ? b.tempo / B.aviso : 1, qc = b.fase === 'golpe' ? Math.min(1, b.tempo / (B.golpe * 0.5)) : 0;
      c.fillStyle = 'rgba(255,80,60,' + (0.14 + 0.22 * kc) + ')'; c.fillRect(-20, 400, W + 40, H);
      V.objeto(c, W / 2 + Math.sin(b.t * 40) * 4 * kc, 60 + kc * 260, 30 + kc * 22);
      if (b.fase === 'golpe') {
        c.strokeStyle = V.feixe[0]; c.lineWidth = 26 + qc * 30; c.globalAlpha = 0.9;
        c.beginPath(); c.ellipse(W / 2, 360 + qc * 150, 200 + qc * 520, 30 + qc * 70, 0, 0, 7); c.stroke();
        c.strokeStyle = V.feixe[1]; c.lineWidth = 5;
        c.beginPath(); c.ellipse(W / 2, 360 + qc * 150, 200 + qc * 520, 30 + qc * 70, 0, 0, 7); c.stroke(); c.globalAlpha = 1;
      }
      if (Math.floor(b.t * 8) % 2) { // seta para cima: pule!
        c.fillStyle = '#fff27a'; c.strokeStyle = 'rgba(8,20,16,0.85)'; c.lineWidth = 5; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(W / 2, 400); c.lineTo(W / 2 + 46, 452); c.lineTo(W / 2 + 18, 452); c.lineTo(W / 2 + 18, 500);
        c.lineTo(W / 2 - 18, 500); c.lineTo(W / 2 - 18, 452); c.lineTo(W / 2 - 46, 452); c.closePath(); c.stroke(); c.fill();
      }
    } else if (b.fase === 'aviso' || b.fase === 'golpe') b.alvos.forEach(function (alvoLado) {
      var ax = xTela(b, alvoLado);
      if (b.fase === 'aviso') {
        var k = b.tempo / B.aviso;
        c.fillStyle = 'rgba(255,80,60,' + (0.12 + 0.2 * k) + ')';
        c.beginPath(); c.ellipse(ax, 470, 150, 44, 0, 0, 7); c.fill();
        V.objeto(c, ax + Math.sin(b.t * 40) * 3 * k, 70 + k * 20, 26 + k * 16);
        if (Math.floor(b.t * 10) % 2) Arte.texto(c, '!', ax, 150, 44, '#ff5a4a');
      } else {
        var q = Math.min(1, b.tempo / (B.golpe * 0.5));
        c.fillStyle = V.feixe[0]; c.strokeStyle = V.feixe[1]; c.lineWidth = 3;
        c.beginPath();
        c.moveTo(ax - 30, 90); c.lineTo(ax + 30, 90);
        c.lineTo(ax + 30 + q * 110, 90 + q * 470); c.lineTo(ax - 30 - q * 110, 90 + q * 470);
        c.closePath(); c.fill(); c.stroke();
        if (V.tracejado) {
          c.strokeStyle = '#d5d9e3'; c.lineWidth = 2; c.setLineDash([8, 8]);
          for (var n = 1; n < 5; n++) {
            var yy = 90 + q * 470 * n / 5, ww = 30 + q * 110 * n / 5;
            c.beginPath(); c.moveTo(ax - ww, yy); c.lineTo(ax + ww, yy); c.stroke();
          }
          c.setLineDash([]);
        }
        V.objeto(c, ax, 90, 42);
      }
    });

    // tiros de geleca indo para longe
    b.tiros.forEach(function (tiro) {
      var x0 = W / 2, x1 = xTela(b, tiro.lado), p = tiro.p;
      c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = 2;
      c.beginPath(); c.arc(x0 + (x1 - x0) * p, 500 - 270 * p, 34 - 24 * p, 0, 7); c.fill(); c.stroke();
    });
    b.particulas.forEach(function (p) {
      c.globalAlpha = Math.min(1, p.vida * 2);
      c.fillStyle = CFG.concreto.cor;
      c.beginPath(); c.arc(xTela(b, 0) + p.x, p.y, p.r, 0, 7); c.fill();
      c.globalAlpha = 1;
    });
    b.avisos.forEach(function (a) {
      c.globalAlpha = Math.min(1, a.vida * 2);
      Arte.texto(c, a.s, xTela(b, a.lado), 110 - (0.8 - a.vida) * 40, 26, a.cor);
      c.globalAlpha = 1;
    });

    // a beirada da geleca do Concreto, embaixo da tela (é ele quem está olhando)
    c.translate(0, -noAr * 46 - noAr * 26); // a geleca sobe junto com o olhar
    if (vidas > 0 && !(b.invul > 0 && Math.floor(b.t * 14) % 2 === 0)) {
      c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = 6;
      c.beginPath(); c.moveTo(W / 2 - 230, H + 10);
      for (i = 0; i <= 10; i++) c.lineTo(W / 2 - 230 + i * 46, H - 26 - Math.sin(i / 10 * Math.PI) * 30 - Math.sin(b.t * 4 + i) * 4);
      c.lineTo(W / 2 + 230, H + 40); c.lineTo(W / 2 - 230, H + 40); c.closePath(); c.fill(); c.stroke();
    }
    c.translate(0, noAr * 26);
    if (b.invul > 0) { c.fillStyle = 'rgba(255,60,40,' + (0.25 * b.invul / CFG.invencivelAposDano) + ')'; c.fillRect(-20, -20, W + 40, H + 40); }
    c.restore();

    // barra de vida grande, no alto (B07)
    var bw = 520, bx0 = (W - bw) / 2;
    Arte.texto(c, B.nome, W / 2, 26, 20, '#f2fbf4');
    c.fillStyle = 'rgba(8,20,16,0.7)'; R(c, bx0 - 4, 42, bw + 8, 22, 8); c.fill();
    c.fillStyle = '#c14fd6'; R(c, bx0, 46, Math.max(0.01, bw * b.vida / B.vida), 14, 5); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(bx0, 47, bw * b.vida / B.vida, 4);

    // pista: radar dos três lados. Verde = onde você está; vermelho = onde o golpe vai cair; a bolinha de cima é o boss.
    var perigoso = (b.fase === 'aviso' || b.fase === 'golpe') ? b.alvos : [];
    [-1, 0, 1].forEach(function (l) {
      var rx = W - 112 + l * 46, ry = H - 40, ruim = perigoso.indexOf(l) >= 0 || b.brasas.some(function (q) { return q.lado === l; });
      c.fillStyle = ruim ? 'rgba(255,70,60,' + (0.55 + 0.35 * Math.abs(Math.sin(b.t * 12))) + ')' : 'rgba(8,20,16,0.5)';
      c.strokeStyle = l === b.lado ? '#7aff8a' : 'rgba(255,255,255,0.55)'; c.lineWidth = l === b.lado ? 5 : 2;
      R(c, rx - 18, ry - 14, 36, 28, 8); c.fill(); c.stroke();
      if (l === b.lado) Arte.gota(c, rx, ry + 4, 7);
      if (l === b.bossLado && b.fase !== 'vencido') { c.fillStyle = '#c14fd6'; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(rx, ry - 26, 8, 0, 7); c.fill(); c.stroke(); }
    });
    if (b.fase === 'pausa') { // pista: barra do tempo que resta e mira
      var resta = 1 - b.tempo / B.pausa;
      c.fillStyle = 'rgba(8,20,16,0.7)'; R(c, bx0 - 4, 70, bw + 8, 14, 6); c.fill();
      c.fillStyle = resta > 0.3 ? '#fff27a' : '#ff8a4a'; R(c, bx0, 73, Math.max(0.01, bw * resta), 8, 4); c.fill();
      var alinhado = b.lado === b.bossLado && Math.abs(b.bossX - b.bossLado) < 0.35, mx = xTela(b, b.bossX);
      if (alinhado) {
        c.strokeStyle = '#7aff8a'; c.lineWidth = 5;
        var rr = 70 + Math.sin(b.t * 10) * 6;
        c.beginPath(); c.arc(mx, 250, rr, 0, 7); c.moveTo(mx - rr - 14, 250); c.lineTo(mx - rr + 16, 250); c.moveTo(mx + rr - 16, 250); c.lineTo(mx + rr + 14, 250);
        c.moveTo(mx, 250 - rr - 14); c.lineTo(mx, 250 - rr + 16); c.moveTo(mx, 250 + rr - 16); c.lineTo(mx, 250 + rr + 14); c.stroke();
      } else if (b.lado !== b.bossLado) {
        var sd = b.bossLado > b.lado ? 1 : -1;
        Arte.seta(c, W / 2 + sd * 380, 300, sd > 0 ? 0 : Math.PI, 30, '#fff27a', b.t);
      }
    }
    // recados
    if (b.fase === 'pausa') Arte.texto(c, 'Cansou! Atire o raio!', W / 2, 446, 26, '#fff27a');
    else if (b.fase === 'aviso' || b.fase === 'golpe') Arte.texto(c, b.tipoAtaque === 'chao' ? 'Golpe no chão! Aperte PULO!' : b.alvos.length > 1 ? 'Ache o lado livre!' : 'Cuidado! Vá para o lado!', W / 2, 446, 24, '#ffb0a6');
    else if (b.fase === 'entrada') {
      if (b.tempo < 1 || !B.fala) Arte.texto(c, B.nome + ' apareceu!', W / 2, 446, 30, '#f2fbf4');
      else { // fala do boss (texto PROVISÓRIO)
        c.font = '700 21px "Trebuchet MS", "Segoe UI", system-ui, sans-serif';
        var lw = c.measureText(B.fala).width + 44;
        c.fillStyle = '#ffffff'; c.strokeStyle = '#2a2050'; c.lineWidth = 4; c.lineJoin = 'round';
        R(c, W / 2 - lw / 2, 396, lw, 56, 20); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(W / 2 - 16, 398); c.lineTo(W / 2, 372); c.lineTo(W / 2 + 16, 398); c.closePath(); c.fill(); c.stroke();
        c.fillRect(W / 2 - 14, 397, 28, 6);
        c.fillStyle = '#2a2050'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(B.fala, W / 2, 425);
      }
    }
    else if (b.fase === 'vencido') Arte.texto(c, 'Você venceu: ' + B.nome + '!', W / 2, 446, 32, '#fff27a');
  }

  // Retrato do boss para as cenas de história. (x, y) = centro; quadro: neutro, prepara, ataca ou cansado.
  function retrato(c, tipo, x, y, esc, quadro, t) {
    var est = { cansado: quadro === 'cansado', vencido: false, tonto: quadro === 'cansado', bravo: quadro === 'prepara' || quadro === 'ataca', forca: quadro === 'cansado' ? 0.3 : 1 };
    c.save(); c.translate(x, y + Math.sin(t * 2) * 6 * esc); c.scale(esc, esc);
    if (typeof SPRITES === 'undefined' || !SPRITES[tipo] || !Arte.sprite(c, tipo, quadro, 0, 218, 372, 'neutro')) VISUAL[tipo].corpo(c, { fase: quadro === 'cansado' ? 'pausa' : 'espera', vencido: 0 }, t, est);
    c.restore();
  }
  function arena(tipo) { return VISUAL[tipo].arena; }

  return { criar: criar, atualizar: atualizar, desenhar: desenhar, retrato: retrato, arena: arena };
})();
