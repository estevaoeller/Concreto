// Temas dos cinco mundos: fundo, cores das plataformas e monstros de cada um.
// Referência: storyboards S01–S05 e prancha de monstros P02. Visual PROVISÓRIO.
(function () {
  var W = CFG.largura, H = CFG.altura, R = Arte.retArred, ac = Arte.acaso;

  function gradiente(c, cores) {
    var g = c.createLinearGradient(0, 0, 0, H);
    cores.forEach(function (cor, i) { g.addColorStop(i / (cores.length - 1), cor); });
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  function nuvem(c, x, y, e, cor) {
    c.fillStyle = cor || 'rgba(255,255,255,0.85)';
    c.beginPath(); c.arc(x, y, 22 * e, 0, 7); c.arc(x + 26 * e, y - 10 * e, 28 * e, 0, 7); c.arc(x + 58 * e, y, 22 * e, 0, 7);
    c.rect(x, y, 58 * e, 22 * e); c.fill();
  }
  // repete um desenho ao longo do mundo, com efeito de profundidade (fator < 1 anda mais devagar)
  function fileira(cam, fator, passo, fn, extra) {
    var ini = Math.floor((cam * fator - 300) / passo), n = Math.ceil((W + 600) / passo) + (extra || 0);
    for (var i = ini; i < ini + n; i++) fn(i * passo - cam * fator, i);
  }

  Arte.temas = {
    plantas: {
      pal: Arte.PALETA_PLANTAS,
      fundo: function (c, cam, t) { Arte.ceu(c, 0, t); Arte.fundoPlantas(c, cam, 0); }
    },

    vulcao: {
      pal: { terra: '#4a3a52', terraEsc: '#221828', topo: '#6b5a70', topoEsc: '#2a1e30', topoLuz: '#ff9a3a' },
      fundo: function (c, cam, t) {
        gradiente(c, ['#2a0f2e', '#7a2030', '#e8641e']);
        fileira(cam, 0.1, 520, function (x, i) {              // vulcões
          var a = 200 + ac(i) * 120;
          c.fillStyle = '#3a1830';
          c.beginPath(); c.moveTo(x - 260, 470); c.lineTo(x - 40, 470 - a); c.lineTo(x + 40, 470 - a); c.lineTo(x + 260, 470); c.fill();
          c.strokeStyle = '#ff8a2a'; c.lineWidth = 7; c.lineCap = 'round';
          c.beginPath(); c.moveTo(x - 10, 470 - a); c.quadraticCurveTo(x + 30, 470 - a * 0.5, x - 20, 470); c.stroke();
          c.fillStyle = 'rgba(255,170,60,0.5)';
          c.beginPath(); c.arc(x, 462 - a, 30 + Math.sin(t * 2 + i) * 6, 0, 7); c.fill();
        });
        fileira(cam, 0.35, 300, function (x, i) {             // ruínas
          c.fillStyle = '#2a1226';
          var a = 90 + ac(i + 3) * 110;
          c.fillRect(x, 470 - a, 46, a); c.fillRect(x + 110, 470 - a * 0.8, 46, a * 0.8);
          if (i % 2) { c.beginPath(); c.arc(x + 78, 470 - a * 0.8, 55, Math.PI, 0); c.lineTo(x + 133, 470 - a * 0.8 + 16); c.arc(x + 78, 470 - a * 0.8 + 16, 34, 0, Math.PI, true); c.fill(); }
          c.fillRect(x - 8, 470 - a - 10, 62, 12);
        });
        c.fillStyle = '#2a1226'; c.fillRect(0, 468, W, H);
        for (var e = 0; e < 34; e++) {                         // brasas subindo
          var ex = (ac(e) * W * 1.3 - cam * 0.5 % W + W * 2) % W, ey = H - ((t * (30 + ac(e + 7) * 50) + ac(e + 20) * H) % H);
          c.fillStyle = 'rgba(255,' + Math.round(140 + ac(e) * 100) + ',40,0.8)';
          c.beginPath(); c.arc(ex + Math.sin(t + e) * 8, ey, 1.5 + ac(e + 2) * 2.5, 0, 7); c.fill();
        }
      },
      liquido: function (c, t) {                               // lava nos buracos
        var g = c.createLinearGradient(0, 486, 0, H);
        g.addColorStop(0, '#ffd23a'); g.addColorStop(0.3, '#ff7a1e'); g.addColorStop(1, '#c4260e');
        c.fillStyle = g; c.beginPath(); c.moveTo(0, H);
        for (var x = 0; x <= W; x += 20) c.lineTo(x, 492 + Math.sin(x * 0.03 + t * 2) * 5);
        c.lineTo(W, H); c.fill();
      }
    },

    ceu: {
      pal: { terra: '#b9a6d8', terraEsc: '#6a5596', topo: '#ffffff', topoEsc: '#8fb4e0', topoLuz: '#ffffff' },
      fundo: function (c, cam, t) {
        gradiente(c, ['#2f97ea', '#8fd3fb', '#e2f6ff']);
        var sol = c.createRadialGradient(780, 70, 10, 780, 70, 320);
        sol.addColorStop(0, 'rgba(255,250,200,0.95)'); sol.addColorStop(1, 'rgba(255,250,200,0)');
        c.fillStyle = sol; c.fillRect(0, 0, W, H);
        fileira(cam, 0.12, 260, function (x, i) { nuvem(c, x + t * 4 % 260, 70 + ac(i) * 130, 1 + ac(i + 4) * 0.6); });
        fileira(cam, 0.3, 430, function (x, i) {               // ilhas flutuantes com colunas
          var y = 210 + ac(i + 2) * 110 + Math.sin(t + i) * 5;
          c.fillStyle = '#8f7ab8';
          c.beginPath(); c.moveTo(x - 80, y); c.lineTo(x + 80, y); c.lineTo(x + 10, y + 70); c.closePath(); c.fill();
          c.fillStyle = '#7ed06a'; R(c, x - 88, y - 12, 176, 20, 10); c.fill();
          c.fillStyle = '#f4efff'; c.strokeStyle = '#b9a6d8'; c.lineWidth = 2;
          [-40, 0, 40].forEach(function (d) { c.fillRect(x + d - 7, y - 62, 14, 50); c.strokeRect(x + d - 7, y - 62, 14, 50); });
          c.fillRect(x - 54, y - 72, 108, 12); c.strokeRect(x - 54, y - 72, 108, 12);
        });
        fileira(cam, 0.6, 210, function (x, i) { nuvem(c, x, 470 + ac(i + 8) * 40, 2 + ac(i) * 0.8, '#ffffff'); });
      },
      liquido: function (c, t) { for (var i = 0; i < 9; i++) nuvem(c, i * 130 - 60 + Math.sin(t + i) * 10, 520, 2.2, 'rgba(255,255,255,0.95)'); }
    },

    pelucia: {
      pal: { terra: '#b98be0', terraEsc: '#6a3fa0', topo: '#ff9ccb', topoEsc: '#b8427e', topoLuz: '#ffd6ea', costura: true },
      fundo: function (c, cam, t) {
        gradiente(c, ['#9f86ea', '#f0b8e6', '#ffe6f0']);
        fileira(cam, 0.12, 300, function (x, i) { nuvem(c, x, 90 + ac(i) * 100, 1.3, 'rgba(255,255,255,0.7)'); });
        var cores = ['#f7a8d0', '#c9a6f2', '#ffe2a8', '#a8d8f7'];
        fileira(cam, 0.3, 190, function (x, i) {               // morros de retalho
          var r = 120 + ac(i + 1) * 70;
          c.fillStyle = cores[((i % 4) + 4) % 4]; c.strokeStyle = 'rgba(120,70,160,0.5)'; c.lineWidth = 3; c.setLineDash([9, 7]);
          c.beginPath(); c.arc(x, 500, r, Math.PI, 0); c.fill(); c.stroke(); c.setLineDash([]);
        });
        fileira(cam, 0.6, 340, function (x, i) {               // botões gigantes
          var cor = ['#2f7de0', '#e8364a', '#f5c62a'][((i % 3) + 3) % 3];
          c.fillStyle = cor; c.strokeStyle = 'rgba(40,20,80,0.55)'; c.lineWidth = 4;
          c.beginPath(); c.arc(x + 60, 452, 34, 0, 7); c.fill(); c.stroke();
          c.fillStyle = 'rgba(40,20,80,0.5)';
          [[-10, -10], [10, -10], [-10, 10], [10, 10]].forEach(function (d) { c.beginPath(); c.arc(x + 60 + d[0], 452 + d[1], 5, 0, 7); c.fill(); });
        });
        fileira(cam, 0.75, 230, function (x, i) {              // estrelas penduradas
          var comp = 50 + ac(i + 5) * 90, bal = Math.sin(t * 1.5 + i) * 6;
          c.strokeStyle = 'rgba(120,70,160,0.6)'; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x, 0); c.lineTo(x + bal, comp); c.stroke();
          estrela(c, x + bal, comp + 12, 14, '#ffd84a', '#c98a08');
        });
      }
    },

    blocos: {
      pal: { blocos: true },
      fundo: function (c, cam, t) {
        gradiente(c, ['#3fa6f2', '#a8dcfb', '#e6f6ff']);
        fileira(cam, 0.12, 280, function (x, i) { nuvem(c, x + t * 5 % 280, 60 + ac(i) * 110, 1.2); });
        var claras = ['#f4a3ac', '#a6c6f2', '#f7e3a0', '#a8dcae'], vivas = ['#e8364a', '#2f7de0', '#f5c62a', '#3fb24a'];
        function torres(fator, passo, cores, lado, base) {
          fileira(cam, fator, passo, function (x, i) {
            var andares = 2 + Math.floor(ac(i + lado) * 5);
            for (var a = 0; a < andares; a++) {
              var larg = lado * (1 + Math.floor(ac(i * 7 + a) * 2)), cor = cores[(((i + a) % 4) + 4) % 4];
              c.fillStyle = cor; c.strokeStyle = 'rgba(30,40,90,0.35)'; c.lineWidth = 2;
              c.fillRect(x, base - (a + 1) * lado * 0.8, larg, lado * 0.8); c.strokeRect(x, base - (a + 1) * lado * 0.8, larg, lado * 0.8);
              if (a === andares - 1) for (var s = 0; s < larg / lado; s++) c.fillRect(x + s * lado + lado * 0.25, base - (a + 1) * lado * 0.8 - 6, lado * 0.5, 6);
            }
          });
        }
        torres(0.3, 150, claras, 46, 480);
        torres(0.6, 260, vivas, 60, 500);
      }
    }
  };

  function estrela(c, x, y, r, cor, borda) {
    c.fillStyle = cor; c.strokeStyle = borda; c.lineWidth = Math.max(2, r * 0.14); c.lineJoin = 'round';
    c.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.48 : r;
      if (i) c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    c.closePath(); c.fill(); c.stroke();
  }
  Arte.estrela = estrela;
  Arte.nuvem = nuvem;

  // ---- Monstros dos mundos 2 a 5 (prancha P02). Todos parados e com o mesmo comportamento (I02/I04). ----
  var F = Arte.formas, olhos = Arte.olhosBravos, cores = Arte.coresMonstro;
  function boca(c, dir, y) { c.strokeStyle = '#2a1050'; c.lineWidth = 2.5; c.beginPath(); c.arc(dir * 3, y, 5, Math.PI + 0.5, -0.5); c.stroke(); }
  function est(c, fill, stroke, lw) { c.fillStyle = fill; c.strokeStyle = stroke; c.lineWidth = lw || 3; }

  // Mundo 2 — Vulcânico
  cores.lava = '#e8421a'; cores.rocha = '#7d7480'; cores.brasa = '#ff8a1e'; cores.fumaca = '#8a8494';
  F.lava = function (c, dir, bal, t) {
    est(c, '#e8421a', '#7a1408');
    c.beginPath(); c.moveTo(-28, 0); c.bezierCurveTo(-30, -52 - bal, 30, -52 - bal, 28, 0); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#ffd23a'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(-20, -6); c.lineTo(-12, -14); c.lineTo(-16, -22); c.moveTo(18, -4); c.lineTo(12, -12); c.moveTo(-2, -40); c.lineTo(4, -34); c.stroke();
    olhos(c, dir, 0, -24, 0.9, '#ffe14a'); boca(c, dir, -8);
  };
  F.rocha = function (c, dir, bal) {
    est(c, '#7d7480', '#3d3540');
    c.beginPath(); c.moveTo(-26, 0); c.lineTo(-30, -22); c.lineTo(-16, -44 - bal); c.lineTo(10, -48 - bal); c.lineTo(28, -30); c.lineTo(26, 0); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#5a5060'; c.lineWidth = 2; c.beginPath(); c.moveTo(-16, -44); c.lineTo(-8, -34); c.moveTo(28, -30); c.lineTo(16, -26); c.stroke();
    olhos(c, dir, 0, -24, 0.85, '#ffb02a'); boca(c, dir, -8);
  };
  F.brasa = function (c, dir, bal, t) {
    var o = Math.sin(t * 9) * 3;
    est(c, '#ff8a1e', '#b8340a');
    c.beginPath(); c.moveTo(-22, 0); c.bezierCurveTo(-34, -24, -16, -34, -18, -52 + o);
    c.quadraticCurveTo(-6, -40, 0, -60 - o); c.quadraticCurveTo(8, -42, 18, -50 + o);
    c.bezierCurveTo(16, -34, 34, -24, 22, 0); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#ffe14a'; c.beginPath(); c.ellipse(0, -14, 13, 13, 0, 0, 7); c.fill();
    olhos(c, dir, 0, -20, 0.75); boca(c, dir, -6);
  };
  F.fumaca = function (c, dir, bal) {
    est(c, '#8a8494', '#463f52');
    c.beginPath(); c.arc(-16, -16, 16, 0, 7); c.arc(14, -16, 17, 0, 7); c.arc(-4, -36 - bal, 18, 0, 7); c.arc(14, -40 - bal, 12, 0, 7);
    c.stroke(); c.fill();
    olhos(c, dir, 0, -24, 0.85); boca(c, dir, -9);
  };

  // Mundo 3 — Céu
  cores.nuvem = '#e8f2ff'; cores.estrela = '#ffd84a'; cores.passaro = '#3f9ae8'; cores.vento = '#9fe0f5';
  F.nuvem = function (c, dir, bal) {
    est(c, '#ffffff', '#6a9ad6');
    c.beginPath(); c.arc(-18, -16, 16, 0, 7); c.arc(16, -16, 16, 0, 7); c.arc(-2, -32 - bal, 20, 0, 7); c.stroke(); c.fill();
    c.fillStyle = '#ffffff'; c.fillRect(-18, -20, 34, 18);
    olhos(c, dir, 0, -24, 0.85); boca(c, dir, -9);
  };
  F.estrela = function (c, dir, bal) { estrela(c, 0, -28 - bal, 30, '#ffd84a', '#b87a08'); olhos(c, dir, 0, -28, 0.7); boca(c, dir, -15); };
  F.passaro = function (c, dir, bal, t) {
    est(c, '#3f9ae8', '#15508f');
    c.beginPath(); c.ellipse(0, -24, 23, 21, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#7fc4ff'; c.beginPath(); c.ellipse(-dir * 14, -26, 15, 8, -dir * (0.6 + Math.sin(t * 8) * 0.3), 0, 7); c.fill(); c.stroke();
    est(c, '#ffa62a', '#a85a08', 2);
    c.beginPath(); c.moveTo(dir * 18, -24); c.lineTo(dir * 34, -19); c.lineTo(dir * 18, -14); c.closePath(); c.fill(); c.stroke();
    olhos(c, dir, 0, -28, 0.8);
  };
  F.vento = function (c, dir, bal, t) {
    est(c, '#c9f0fb', '#3f9ac8');
    c.beginPath(); c.arc(0, -26, 24, 0, 7); c.fill(); c.stroke();
    c.lineWidth = 3; c.beginPath();
    for (var i = 0; i < 40; i++) { var a = i * 0.3 - t * 4, r = i * 0.55; if (i) c.lineTo(Math.cos(a) * r, -26 + Math.sin(a) * r); else c.moveTo(0, -26); }
    c.stroke();
    olhos(c, dir, 0, -28, 0.8);
  };

  // Mundo 4 — Pelúcia
  cores.urso = '#b47ae8'; cores.coelhinho = '#fff0e0'; cores.novelo = '#f25c9a'; cores.almofada = '#6ab8f0';
  F.urso = function (c, dir, bal) {
    est(c, '#b47ae8', '#5a2a9a');
    c.beginPath(); c.arc(-17, -44 - bal, 9, 0, 7); c.arc(17, -44 - bal, 9, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0, -10, 19, 13, 0, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, -32 - bal, 21, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#e6d0ff'; c.beginPath(); c.ellipse(dir * 3, -25 - bal, 9, 7, 0, 0, 7); c.fill();
    olhos(c, dir, 0, -36 - bal, 0.7); boca(c, dir, -21 - bal);
  };
  F.coelhinho = function (c, dir, bal) {
    est(c, '#fff0e0', '#b08a70');
    [-1, 1].forEach(function (s) { c.beginPath(); c.ellipse(s * 10, -56 - bal, 7, 18, s * 0.2, 0, 7); c.fill(); c.stroke(); });
    c.fillStyle = '#ffb0c8'; [-1, 1].forEach(function (s) { c.beginPath(); c.ellipse(s * 10, -55 - bal, 3, 12, s * 0.2, 0, 7); c.fill(); });
    est(c, '#fff0e0', '#b08a70');
    c.beginPath(); c.ellipse(0, -10, 17, 12, 0, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, -28, 20, 0, 7); c.fill(); c.stroke();
    olhos(c, dir, 0, -31, 0.7); boca(c, dir, -17);
  };
  F.novelo = function (c, dir, bal, t) {
    est(c, '#f25c9a', '#8a1a50');
    c.beginPath(); c.arc(0, -25, 25, 0, 7); c.fill(); c.stroke();
    c.save(); c.beginPath(); c.arc(0, -25, 25, 0, 7); c.clip();
    c.strokeStyle = '#ffa8cc'; c.lineWidth = 2.5;
    for (var i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(-30, -25 + i * 9); c.quadraticCurveTo(0, -40 + i * 9, 30, -25 + i * 9 + 6); c.stroke(); }
    c.restore();
    olhos(c, dir, 0, -26, 0.8); boca(c, dir, -11);
  };
  F.almofada = function (c, dir, bal) {
    est(c, '#6ab8f0', '#1f5f9a');
    c.beginPath(); c.moveTo(-28, -2); c.quadraticCurveTo(-20, -25, -28, -48 - bal); c.quadraticCurveTo(0, -42 - bal, 28, -48 - bal);
    c.quadraticCurveTo(20, -25, 28, -2); c.quadraticCurveTo(0, -8, -28, -2); c.closePath(); c.fill(); c.stroke();
    c.setLineDash([4, 4]); c.lineWidth = 2; c.strokeStyle = '#e6f4ff';
    c.beginPath(); c.moveTo(-18, -10); c.lineTo(-18, -38); c.moveTo(18, -10); c.lineTo(18, -38); c.stroke(); c.setLineDash([]);
    olhos(c, dir, 0, -27, 0.8); boca(c, dir, -12);
  };

  // Mundo 5 — Blocos
  cores.bloco = '#e8364a'; cores.arco = '#2f7de0'; cores.pilha = '#3fb24a'; cores.piramide = '#f5c62a';
  function peca(c, x, y, w, h, cor, borda) {
    est(c, cor, borda);
    c.fillRect(x, y, w, h); c.strokeRect(x, y, w, h);
    for (var s = 0; s < 2; s++) { R(c, x + w * (0.14 + s * 0.44), y - 7, w * 0.28, 8, 2); c.fill(); c.stroke(); }
  }
  F.bloco = function (c, dir, bal) { peca(c, -26, -40 - bal, 52, 40 + bal, '#e8364a', '#8a1226'); olhos(c, dir, 0, -24, 0.9); boca(c, dir, -8); };
  F.arco = function (c, dir, bal) {
    peca(c, -27, -46 - bal, 54, 46 + bal, '#2f7de0', '#143f86');
    c.fillStyle = 'rgba(10,30,70,0.55)'; c.beginPath(); c.arc(0, 0, 13, Math.PI, 0); c.fill();
    olhos(c, dir, 0, -30, 0.85);
  };
  F.pilha = function (c, dir, bal) {
    peca(c, -22, -18, 44, 18, '#e8364a', '#8a1226'); peca(c, -19, -36, 38, 18, '#3fb24a', '#1c6426'); peca(c, -16, -54 - bal, 32, 18 + bal, '#f5c62a', '#a06a08');
    olhos(c, dir, 0, -44 - bal, 0.6);
  };
  F.piramide = function (c, dir, bal) {
    est(c, '#f5c62a', '#a06a08');
    c.beginPath(); c.moveTo(-30, 0); c.lineTo(0, -52 - bal); c.lineTo(30, 0); c.closePath(); c.fill(); c.stroke();
    olhos(c, dir, 0, -18, 0.75); boca(c, dir, -5);
  };
})();
