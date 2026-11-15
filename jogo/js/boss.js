// Luta contra o Cthulhu Higiênico, em primeira pessoa (B04): você olha pelos olhos do Concreto.
// Confirmado: 2 ataques e depois 10 s sem atacar (B01), aviso de papel higiênico (B05), barra de vida grande (B07).
// PROVISÓRIO: três lados (esquerda, meio, direita); andar para o lado escapa do golpe; o raio só machuca na pausa.
var Boss = (function () {
  var W = CFG.largura, H = CFG.altura, B = CFG.boss, PASSO = 270;

  function criar() {
    return {
      vida: B.vida, t: 0,
      lado: 0, visao: 0,            // lado do Concreto: -1, 0, 1 (visao segue o lado com suavidade)
      bossLado: 0, bossX: 0,
      fase: 'entrada', tempo: 0, ataques: 0, alvos: [], golpeou: false, trocou: 0, flash: 0,
      recarga: 0, tiros: [], avisos: [], particulas: [], invul: 0, tremor: 0, vencido: 0
    };
  }

  function recado(b, s, cor) { b.avisos.push({ s: s, vida: 0.8, cor: cor || '#f2fbf4', lado: b.bossLado }); }

  // Devolve 'morreu' ou 'venceu'.
  function atualizar(b, dt, jogo) {
    b.t += dt; b.tempo += dt;
    if (b.invul > 0) b.invul -= dt;
    if (b.recarga > 0) b.recarga -= dt;
    if (b.tremor > 0) b.tremor -= dt;
    if (b.flash > 0) b.flash -= dt;

    if (Entrada.esqApertou && b.lado > -1) b.lado--;
    if (Entrada.dirApertou && b.lado < 1) b.lado++;
    b.visao += (b.lado - b.visao) * Math.min(1, dt * 14);
    b.bossX += (b.bossLado - b.bossX) * Math.min(1, dt * 5);

    if (b.fase === 'vencido') {
      b.vencido += dt;
      return b.vencido > 2.4 ? 'venceu' : null;
    }

    if (b.fase === 'entrada') {
      if (b.tempo > 1.6) iniciarAviso(b);
    } else if (b.fase === 'aviso') {            // papel higiênico aparece (B05)
      if (b.tempo >= B.aviso) { b.fase = 'golpe'; b.tempo = 0; b.golpeou = false; }
    } else if (b.fase === 'golpe') {
      if (!b.golpeou && b.tempo >= B.golpe * 0.5) {
        b.golpeou = true;
        if (b.alvos.indexOf(b.lado) >= 0 && b.invul <= 0) {
          jogo.vidas--; b.invul = CFG.invencivelAposDano; b.tremor = 0.4; Som.dano();
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

    // raio de geleca em primeira pessoa
    if (Entrada.ataqueApertou && b.recarga <= 0) {
      b.recarga = CFG.raio.recarga;
      b.tiros.push({ lado: b.lado, p: 0 });
      Som.raio();
    }
    b.tiros = b.tiros.filter(function (tiro) {
      tiro.p += dt / 0.28;
      if (tiro.p < 1) return true;
      if (tiro.lado === b.bossLado && Math.abs(b.bossX - b.bossLado) < 0.35) {
        if (b.fase === 'pausa' || !B.danoSoNaPausa) {
          b.vida -= CFG.raio.dano; b.flash = 0.12; Som.acerto();
          respingo(b, tiro.lado);
          if (b.vida <= 0) { b.vida = 0; b.fase = 'vencido'; b.vencido = 0; Som.vitoria(); }
        } else { recado(b, 'Bloqueou!', '#ffd0d0'); Som.bloqueio(); }
      }
      return false;
    });

    b.avisos = b.avisos.filter(function (a) { a.vida -= dt; return a.vida > 0; });
    b.particulas = b.particulas.filter(function (p) {
      p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt; return p.vida > 0;
    });

    return jogo.vidas <= 0 ? 'morreu' : null;
  }

  function iniciarAviso(b) {
    b.fase = 'aviso'; b.tempo = 0;
    b.alvos = [b.lado];                             // mira onde o Concreto está agora
    if (b.vida / B.vida <= B.ondaAbaixoDe) {        // onda de papel: cobre dois lados, sobra um seguro
      var outros = [-1, 0, 1].filter(function (l) { return l !== b.lado; });
      b.alvos.push(outros[Math.floor(Math.random() * 2)]);
    }
    Som.aviso();
  }
  function respingo(b, lado) {
    for (var i = 0; i < 8; i++) {
      b.particulas.push({ x: lado * PASSO, y: 250, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 260, vida: 0.5, r: 4 + Math.random() * 4 });
    }
  }

  function xTela(b, lado) { return W / 2 + (lado - b.visao) * PASSO; }

  function tira(c, pts, larg) { // tira de papel: linha grossa com contorno
    function tracar() {
      c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length - 1; i++) {
        c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
      }
      c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    }
    c.lineCap = 'round'; c.lineJoin = 'round';
    tracar(); c.strokeStyle = '#8f86b8'; c.lineWidth = larg + 5; c.stroke();
    tracar(); c.strokeStyle = '#fbfaff'; c.lineWidth = larg; c.stroke();
  }

  // Cthulhu Higiênico como no storyboard: rolo de papel com olhos amarelos bravos e tentáculos de tiras desenroladas.
  function desenharBoss(c, b, x, y) {
    var cansado = b.fase === 'pausa', vencido = b.fase === 'vencido', t = b.t;
    var some = vencido ? Math.max(0, 1 - b.vencido / 2) : 1;
    var forca = cansado || vencido ? 0.3 : 1;
    c.save();
    c.translate(x, y + (cansado ? 30 : 0) + Math.sin(t * 2) * 6);
    c.globalAlpha = some;
    if (vencido) c.rotate(b.vencido * 0.25);
    if (b.flash > 0) c.scale(1.05, 1.05);
    // manto cósmico roxo com barra dourada (prancha B01)
    c.fillStyle = '#4a1f9a'; c.strokeStyle = '#2a0f5e'; c.lineWidth = 4; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-84, 10);
    c.quadraticCurveTo(-170, 90, -196, 215); c.quadraticCurveTo(0, 250, 196, 215);
    c.quadraticCurveTo(170, 90, 84, 10); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#f2b824'; c.lineWidth = 9;
    c.beginPath(); c.moveTo(-190, 205); c.quadraticCurveTo(0, 240, 190, 205); c.stroke();
    c.fillStyle = '#ffe9a0';
    [[-120, 150], [-70, 190], [96, 130], [140, 185], [-150, 195], [40, 205]].forEach(function (e, n) {
      c.globalAlpha = some * (0.5 + 0.5 * Math.sin(t * 3 + n));
      c.beginPath(); c.arc(e[0], e[1], 2.5, 0, 7); c.fill();
    });
    c.globalAlpha = some;
    // tiras compridas voando dos lados
    [-1, 1].forEach(function (s) {
      for (var k = 0; k < 2; k++) {
        var o = Math.sin(t * 2.5 + k * 2 + s) * 24 * forca;
        tira(c, [[s * 70, 10 + k * 40], [s * 150, -40 + k * 50 + o], [s * 210, 30 + k * 40 - o], [s * 270, -10 + k * 60 + o * 0.6]], 20 - k * 4);
      }
    });
    // tentáculos saindo de baixo do rosto
    for (var i = -3; i <= 3; i++) {
      var comp = 120 + (3 - Math.abs(i)) * 18, w1 = Math.sin(t * 3 + i * 1.3) * 22 * forca;
      var abre = cansado ? 0.5 : 1;
      tira(c, [[i * 20, 40], [i * 34 * abre + w1, 40 + comp * 0.45], [i * 52 * abre - w1, 40 + comp * 0.8], [i * 62 * abre + w1 * 0.6, 40 + comp + (cansado ? 20 : 0)]], 17);
    }
    // medalhão dourado com um rolinho
    c.fillStyle = '#f2b824'; c.strokeStyle = '#8a5a08'; c.lineWidth = 4;
    c.beginPath(); c.arc(0, 104, 24, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#fff'; c.strokeStyle = '#8f86b8'; c.lineWidth = 2;
    Arte.retArred(c, -11, 94, 22, 22, 5); c.fill(); c.stroke();
    c.fillStyle = '#8a5a34'; c.beginPath(); c.ellipse(0, 96, 6, 2.5, 0, 0, 7); c.fill();
    // corpo = rolo de papel
    var g = c.createLinearGradient(-90, 0, 90, 0);
    g.addColorStop(0, '#d9d4ee'); g.addColorStop(0.35, '#ffffff'); g.addColorStop(1, '#cfc9e6');
    c.fillStyle = g; c.strokeStyle = '#8f86b8'; c.lineWidth = 4;
    Arte.retArred(c, -90, -86, 180, 150, 30); c.fill(); c.stroke();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.ellipse(0, -86, 90, 28, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#8a5a34'; c.strokeStyle = '#5a3a1e'; c.lineWidth = 3;
    c.beginPath(); c.ellipse(0, -86, 34, 11, 0, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(143,134,184,0.5)'; c.lineWidth = 2; c.setLineDash([7, 7]);
    c.beginPath(); c.moveTo(-88, 32); c.lineTo(88, 32); c.stroke();
    c.setLineDash([]);
    // olhos
    [-1, 1].forEach(function (s) {
      if (cansado || vencido) { // tonto: olhos em X
        c.strokeStyle = '#4a3f78'; c.lineWidth = 6; c.lineCap = 'round';
        c.beginPath(); c.moveTo(s * 40 - 14, -34); c.lineTo(s * 40 + 14, -8);
        c.moveTo(s * 40 + 14, -34); c.lineTo(s * 40 - 14, -8); c.stroke();
      } else {
        var bravo = b.fase === 'aviso' || b.fase === 'golpe';
        c.beginPath(); // olho inclinado, bravo
        c.moveTo(s * 14, -18); c.quadraticCurveTo(s * 40, -52, s * 72, -44);
        c.quadraticCurveTo(s * 70, -4, s * 36, 0); c.quadraticCurveTo(s * 18, -2, s * 14, -18);
        c.closePath();
        c.fillStyle = '#2a2050'; c.fill();
        c.save(); c.clip();
        c.shadowColor = bravo ? '#ff7a2a' : '#ffe14a'; c.shadowBlur = 16;
        c.fillStyle = bravo ? '#ff9a2a' : '#ffe14a';
        c.beginPath(); c.ellipse(s * 42, -18, 20, 17, 0, 0, 7); c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#fffbd0';
        c.beginPath(); c.ellipse(s * 44, -20, 8, 7, 0, 0, 7); c.fill();
        c.restore();
        c.strokeStyle = '#2a2050'; c.lineWidth = 7; c.lineCap = 'round'; // sobrancelha
        c.beginPath(); c.moveTo(s * 10, -22); c.lineTo(s * 76, -52); c.stroke();
      }
    });
    c.restore();
  }

  function roloEmPe(c, x, y, e) { // rolo visto de lado, para empilhar na arena
    c.fillStyle = '#f4f1ff'; c.strokeStyle = '#8f86b8'; c.lineWidth = 2.5;
    Arte.retArred(c, x - 22 * e, y - 34 * e, 44 * e, 36 * e, 7 * e); c.fill(); c.stroke();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.ellipse(x, y - 34 * e, 22 * e, 7 * e, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#8a5a34';
    c.beginPath(); c.ellipse(x, y - 34 * e, 8 * e, 2.6 * e, 0, 0, 7); c.fill();
  }

  function rolo(c, x, y, r) {
    c.fillStyle = '#ffffff'; c.strokeStyle = '#9aa2b3'; c.lineWidth = 3;
    c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = '#d5d9e3'; c.lineWidth = 2;
    c.beginPath(); c.arc(x, y, r * 0.72, 0, 7); c.stroke();
    c.fillStyle = '#b08a5a';
    c.beginPath(); c.arc(x, y, r * 0.38, 0, 7); c.fill();
    c.fillStyle = '#6e5433';
    c.beginPath(); c.arc(x, y, r * 0.24, 0, 7); c.fill();
  }

  function desenhar(c, b, noite, vidas) {
    c.save();
    if (b.tremor > 0) c.translate((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 12);
    // arena da prancha B01: salão roxo cósmico, com chão de pedra
    var ceu = c.createLinearGradient(0, 0, 0, 340);
    ceu.addColorStop(0, '#231048'); ceu.addColorStop(1, '#6b3bb0');
    c.fillStyle = ceu; c.fillRect(-20, -20, W + 40, 372);
    c.fillStyle = 'rgba(255,240,255,0.8)';
    for (var e = 0; e < 40; e++) {
      var ex = ((Arte.acaso(e) * (W + 200) - b.visao * 40) % (W + 40) + W + 40) % (W + 40) - 20;
      c.beginPath(); c.arc(ex, Arte.acaso(e + 50) * 300, 1 + Arte.acaso(e + 9) * 1.6 + Math.sin(b.t * 2 + e) * 0.4, 0, 7); c.fill();
    }
    var luz = c.createRadialGradient(W / 2, 210, 20, W / 2, 210, 430);
    luz.addColorStop(0, 'rgba(255,214,250,0.4)'); luz.addColorStop(1, 'rgba(255,214,250,0)');
    c.fillStyle = luz; c.fillRect(-20, -20, W + 40, 372);
    var g = c.createLinearGradient(0, 330, 0, H);
    g.addColorStop(0, '#7a5ab8'); g.addColorStop(1, '#3c2670');
    c.fillStyle = g; c.fillRect(-20, 330, W + 40, H);
    c.strokeStyle = 'rgba(255,255,255,0.16)'; c.lineWidth = 3;
    [-1.5, -0.5, 0.5, 1.5].forEach(function (l) {
      c.beginPath(); c.moveTo(W / 2 + (l - b.visao) * PASSO * 0.45, 330);
      c.lineTo(W / 2 + (l - b.visao) * PASSO * 1.9, H); c.stroke();
    });
    [372, 430, 500].forEach(function (yy) { c.beginPath(); c.moveTo(-20, yy); c.lineTo(W + 20, yy); c.stroke(); });
    [-2.1, -1.35, 1.35, 2.1].forEach(function (l, i) {
      var px = W / 2 + (l - b.visao * 0.6) * PASSO, larg = 46 + (i % 2) * 14;
      c.fillStyle = '#b9a6d8'; c.strokeStyle = '#4a3578'; c.lineWidth = 3;
      c.fillRect(px - larg / 2, -10, larg, 346); c.strokeRect(px - larg / 2, -10, larg, 346);
      c.fillRect(px - larg / 2 - 8, 316, larg + 16, 22); c.strokeRect(px - larg / 2 - 8, 316, larg + 16, 22);
      c.strokeStyle = '#3f9a3a'; c.lineWidth = 5;
      c.beginPath(); c.moveTo(px - larg / 2, 20);
      c.bezierCurveTo(px + larg, 90, px - larg, 170, px + larg / 2, 250); c.stroke();
    });
    [[-1.75, 0, 1], [-1.55, 0, 1], [-1.65, 1, 1], [-0.85, 0, 0.8], [0.95, 0, 0.8], [1.6, 0, 1], [1.8, 0, 1], [1.7, 1, 1]].forEach(function (r) {
      roloEmPe(c, W / 2 + (r[0] - b.visao * 0.8) * PASSO, 372 - r[1] * 34 * r[2], r[2]);
    });

    desenharBoss(c, b, xTela(b, b.bossX), 220);

    // aviso e golpe de papel higiênico
    if (b.fase === 'aviso' || b.fase === 'golpe') b.alvos.forEach(function (alvoLado) {
      var ax = xTela(b, alvoLado);
      if (b.fase === 'aviso') {
        var k = b.tempo / B.aviso, pisca = Math.floor(b.t * 10) % 2;
        c.fillStyle = 'rgba(255,80,60,' + (0.12 + 0.2 * k) + ')';
        c.beginPath(); c.ellipse(ax, 470, 150, 44, 0, 0, 7); c.fill();
        rolo(c, ax + Math.sin(b.t * 40) * 3 * k, 70 + k * 20, 26 + k * 16);
        if (pisca) Arte.texto(c, '!', ax, 150, 44, '#ff5a4a');
      } else {
        var q = Math.min(1, b.tempo / (B.golpe * 0.5));
        c.fillStyle = '#ffffff'; c.strokeStyle = '#9aa2b3'; c.lineWidth = 3;
        c.beginPath();
        c.moveTo(ax - 30, 90); c.lineTo(ax + 30, 90);
        c.lineTo(ax + 30 + q * 110, 90 + q * 470); c.lineTo(ax - 30 - q * 110, 90 + q * 470);
        c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = '#d5d9e3'; c.lineWidth = 2; c.setLineDash([8, 8]);
        for (var i = 1; i < 5; i++) {
          var yy = 90 + q * 470 * i / 5, ww = 30 + q * 110 * i / 5;
          c.beginPath(); c.moveTo(ax - ww, yy); c.lineTo(ax + ww, yy); c.stroke();
        }
        c.setLineDash([]);
        rolo(c, ax, 90, 42);
      }
    });

    // tiros de geleca indo para longe
    b.tiros.forEach(function (tiro) {
      var x0 = W / 2, x1 = xTela(b, tiro.lado), p = tiro.p;
      var x = x0 + (x1 - x0) * p, y = 500 - 270 * p, r = 34 - 24 * p;
      c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = 2;
      c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
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
    if (noite > 0) { c.fillStyle = 'rgba(10,16,52,' + (0.28 * noite) + ')'; c.fillRect(-20, -20, W + 40, H + 40); }

    // a beirada da geleca do Concreto, embaixo da tela (é ele quem está olhando)
    if (vidas > 0 && !(b.invul > 0 && Math.floor(b.t * 14) % 2 === 0)) {
      c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = 6;
      c.beginPath(); c.moveTo(W / 2 - 230, H + 10);
      for (var n = 0; n <= 10; n++) {
        var bx = W / 2 - 230 + n * 46;
        c.lineTo(bx, H - 26 - Math.sin(n / 10 * Math.PI) * 30 - Math.sin(b.t * 4 + n) * 4);
      }
      c.lineTo(W / 2 + 230, H + 10); c.closePath(); c.fill(); c.stroke();
    }
    if (b.invul > 0) { c.fillStyle = 'rgba(255,60,40,' + (0.25 * b.invul / CFG.invencivelAposDano) + ')'; c.fillRect(-20, -20, W + 40, H + 40); }
    c.restore();

    // barra de vida grande, no alto (B07)
    var bw = 520, bx0 = (W - bw) / 2;
    Arte.texto(c, B.nome, W / 2, 26, 20, '#f2fbf4');
    c.fillStyle = 'rgba(8,20,16,0.7)'; Arte.retArred(c, bx0 - 4, 42, bw + 8, 22, 8); c.fill();
    c.fillStyle = '#c14fd6'; Arte.retArred(c, bx0, 46, Math.max(0.01, bw * b.vida / B.vida), 14, 5); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(bx0, 47, bw * b.vida / B.vida, 4);

    // recados
    if (b.fase === 'pausa') {
      var falta = Math.ceil(B.pausa - b.tempo);
      Arte.texto(c, 'Ele cansou! Atire o raio!  ' + falta, W / 2, 92, 24, '#fff27a');
    } else if (b.fase === 'aviso' || b.fase === 'golpe') {
      Arte.texto(c, b.alvos.length > 1 ? 'Onda de papel! Ache o lado livre!' : 'Cuidado! Vá para o lado!', W / 2, 92, 22, '#ffb0a6');
    } else if (b.fase === 'entrada') {
      Arte.texto(c, 'O ' + B.nome + ' apareceu!', W / 2, 300, 34, '#f2fbf4');
    } else if (b.fase === 'vencido') {
      Arte.texto(c, 'Você venceu o ' + B.nome + '!', W / 2, 300, 32, '#fff27a');
    }
  }

  return { criar: criar, atualizar: atualizar, desenhar: desenhar };
})();
