// Exploração de lado (visão lateral, C01): andar, pular, raio de geleca, monstros com faca, portal.

// Fase 1 — mundo das plantas. Desenho da fase PROVISÓRIO.
var FASE1 = {
  nome: 'Mundo das Plantas',
  largura: 5400,
  inicio: { x: 90, y: 460 },
  portalX: 5180,
  plataformas: [
    { x: 0, y: 460, w: 900, chao: true },
    { x: 1030, y: 460, w: 700, chao: true },
    { x: 1870, y: 460, w: 560, chao: true },
    { x: 2570, y: 460, w: 500, chao: true },
    { x: 3900, y: 460, w: 1500, chao: true },
    { x: 500, y: 360, w: 160, h: 22 },
    { x: 1250, y: 350, w: 160, h: 22 },
    { x: 2050, y: 340, w: 180, h: 22 },
    { x: 2700, y: 360, w: 160, h: 22 },
    { x: 3150, y: 400, w: 140, h: 22 },
    { x: 3370, y: 340, w: 140, h: 22 },
    { x: 3590, y: 400, w: 140, h: 22 },
    { x: 3760, y: 340, w: 100, h: 22 },
    { x: 4300, y: 350, w: 180, h: 22 }
  ],
  monstros: [
    { x: 700, y: 460 }, { x: 1500, y: 460 }, { x: 2140, y: 340 }, { x: 2330, y: 460 },
    { x: 2900, y: 460 }, { x: 4200, y: 460 }, { x: 4390, y: 350 }, { x: 4750, y: 460 }
  ]
};

var Fase = (function () {
  var W = CFG.largura, H = CFG.altura;
  var JW = 40, JH = 50, MW = 44, MH = 50;

  function criar(dados) {
    return {
      dados: dados,
      j: {
        x: dados.inicio.x, y: dados.inicio.y, vx: 0, vy: 0, dir: 1, noChao: true,
        invul: 0, trava: 0, recarga: 0, atacando: 0, pulosNoAr: 0,
        seguro: { x: dados.inicio.x, y: dados.inicio.y }, proxGota: CFG.concreto.intervaloGota
      },
      monstros: dados.monstros.map(function (m) {
        return { x: m.x, y: m.y, vida: CFG.monstro.vida, olha: -1, estado: 'calmo', tempo: 0, piscando: 0, acertou: false };
      }),
      raios: [], gotas: [], pocas: [], particulas: [],
      camX: 0, t: 0, chegouPortal: false
    };
  }

  function toca(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }
  function altura(p) { return p.chao ? 400 : p.h; }

  function ferir(f, jogo, deX) {
    var j = f.j;
    if (j.invul > 0) return;
    jogo.vidas--;
    Som.dano();
    j.invul = CFG.invencivelAposDano;
    j.trava = 0.3;
    var lado = j.x >= deX ? 1 : -1;
    j.vx = lado * CFG.empurrao.vx; // jogado para trás (V03)
    j.vy = -CFG.empurrao.vy;
    j.noChao = false;
    poeira(f, j.x, j.y - JH / 2, CFG.concreto.cor, 8);
  }

  function poeira(f, x, y, cor, n) {
    for (var i = 0; i < n; i++) {
      f.particulas.push({
        x: x, y: y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 240,
        vida: 0.5 + Math.random() * 0.3, r: 3 + Math.random() * 3, cor: cor, g: 700
      });
    }
  }

  // Devolve 'portal' quando Concreto chega ao portal, 'morreu' quando acabam as vidas.
  function atualizar(f, dt, jogo) {
    var j = f.j, C = CFG.concreto, d = f.dados;
    f.t += dt;

    // --- Concreto ---
    if (j.trava > 0) j.trava -= dt;
    else {
      var mov = (Entrada.dir ? 1 : 0) - (Entrada.esq ? 1 : 0);
      j.vx = mov * C.velocidade;
      if (mov) j.dir = mov;
      if (Entrada.puloApertou) {
        if (j.noChao) { j.vy = -C.forcaPulo; j.noChao = false; Som.pulo(); }
        else if (C.puloDuplo && j.pulosNoAr < 1) { j.vy = -C.forcaPulo * 0.9; j.pulosNoAr++; Som.pulo(); }
      }
    }
    if (!Entrada.pulo && j.vy < -260) j.vy = -260; // soltar o botão cedo = pulo mais baixo
    j.vy = Math.min(j.vy + C.gravidade * dt, 1100);
    if (j.invul > 0) j.invul -= dt;
    if (j.recarga > 0) j.recarga -= dt;
    if (j.atacando > 0) j.atacando -= dt;

    // mover em X e resolver paredes
    j.x += j.vx * dt;
    j.x = Math.max(JW / 2, Math.min(d.largura - JW / 2, j.x));
    d.plataformas.forEach(function (p) {
      if (toca(j.x - JW / 2, j.y - JH, JW, JH - 1, p.x, p.y, p.w, altura(p))) {
        if (j.vx > 0) j.x = p.x - JW / 2; else if (j.vx < 0) j.x = p.x + p.w + JW / 2;
      }
    });
    // mover em Y e resolver chão/teto
    var yAntes = j.y;
    j.y += j.vy * dt;
    j.noChao = false;
    d.plataformas.forEach(function (p) {
      if (!toca(j.x - JW / 2, j.y - JH, JW, JH, p.x, p.y, p.w, altura(p))) return;
      if (j.vy >= 0 && yAntes <= p.y + 1) {
        j.y = p.y; j.vy = 0; j.noChao = true; j.pulosNoAr = 0;
        if (j.invul <= 0 && j.x > p.x + 24 && j.x < p.x + p.w - 24) j.seguro = { x: j.x, y: p.y };
      } else if (j.vy < 0 && !p.chao) {
        j.y = p.y + p.h + JH; j.vy = 0;
      }
    });

    // caiu no buraco
    if (j.y > H + 120) {
      if (CFG.quedaTiraVida) { jogo.vidas--; Som.dano(); }
      j.x = j.seguro.x; j.y = j.seguro.y; j.vx = 0; j.vy = 0;
      j.invul = CFG.invencivelAposDano;
    }

    // raio de geleca (A01)
    if (Entrada.ataqueApertou && j.recarga <= 0 && j.trava <= 0) {
      j.recarga = CFG.raio.recarga;
      j.atacando = 0.2;
      f.raios.push({ x: j.x + j.dir * 24, y: j.y - JH * 0.45, dir: j.dir, andou: 0 });
      Som.raio();
    }

    // gotinha de geleca que cai no chão (P03) — só enfeite por enquanto
    j.proxGota -= dt;
    if (j.proxGota <= 0) {
      j.proxGota = C.intervaloGota;
      f.gotas.push({ x: j.x - j.dir * 10, y: j.y - 8, vy: 0 });
    }
    f.gotas = f.gotas.filter(function (g) {
      g.vy += 900 * dt; g.y += g.vy * dt;
      for (var i = 0; i < d.plataformas.length; i++) {
        var p = d.plataformas[i];
        if (g.x > p.x && g.x < p.x + p.w && g.y >= p.y && g.y < p.y + 40) {
          f.pocas.push({ x: g.x, y: p.y, vida: 3 });
          return false;
        }
      }
      return g.y < H + 50;
    });
    f.pocas = f.pocas.filter(function (p) { p.vida -= dt; return p.vida > 0; });

    // --- raios ---
    f.raios = f.raios.filter(function (r) {
      var passo = CFG.raio.velocidade * dt;
      r.x += r.dir * passo; r.andou += passo;
      if (r.andou > CFG.raio.alcance) return false;
      for (var i = 0; i < d.plataformas.length; i++) {
        var p = d.plataformas[i];
        if (toca(r.x - 12, r.y - 5, 24, 10, p.x, p.y, p.w, altura(p))) { poeira(f, r.x, r.y, CFG.concreto.cor, 4); return false; }
      }
      for (var k = 0; k < f.monstros.length; k++) {
        var m = f.monstros[k];
        if (m.vida > 0 && toca(r.x - 12, r.y - 5, 24, 10, m.x - MW / 2, m.y - MH, MW, MH)) {
          m.vida -= CFG.raio.dano; m.piscando = 0.15;
          Som.acerto();
          poeira(f, r.x, r.y, CFG.concreto.cor, 5);
          if (m.vida <= 0) poeira(f, m.x, m.y - MH / 2, '#7d4bb3', 16);
          return false;
        }
      }
      return true;
    });

    // --- monstros ---
    var M = CFG.monstro;
    f.monstros.forEach(function (m) {
      if (m.vida <= 0) return;
      if (m.piscando > 0) m.piscando -= dt;
      var dx = j.x - m.x, perto = Math.abs(dx) < M.distanciaFaca && Math.abs(j.y - m.y) < 80;
      if (m.estado !== 'golpe') m.olha = dx >= 0 ? 1 : -1;
      m.tempo += dt;
      if (m.estado === 'calmo') {
        if (perto) { m.estado = 'preparando'; m.tempo = 0; }
      } else if (m.estado === 'preparando') {
        if (!perto) m.estado = 'calmo';                 // longe: a faca some (I04)
        else if (m.tempo >= M.preparoFaca) { m.estado = 'golpe'; m.tempo = 0; m.acertou = false; }
      } else if (m.estado === 'golpe') {
        var fx = m.olha > 0 ? m.x + MW / 2 : m.x - MW / 2 - M.alcanceFaca;
        if (!m.acertou && toca(j.x - JW / 2, j.y - JH, JW, JH, fx, m.y - 36, M.alcanceFaca, 26)) {
          m.acertou = true; ferir(f, jogo, m.x);
        }
        if (m.tempo >= M.duracaoGolpe) { m.estado = 'descanso'; m.tempo = 0; }
      } else if (m.estado === 'descanso') {
        if (m.tempo >= M.descanso) m.estado = perto ? 'preparando' : 'calmo', m.tempo = 0;
      }
      // encostar no monstro tira uma vida (V02)
      if (toca(j.x - JW / 2 + 4, j.y - JH + 4, JW - 8, JH - 4, m.x - MW / 2 + 4, m.y - MH + 6, MW - 8, MH - 6)) ferir(f, jogo, m.x);
    });

    // partículas
    f.particulas = f.particulas.filter(function (p) {
      p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
      return p.vida > 0;
    });

    // câmera segue Concreto
    var alvo = j.x - W * 0.4;
    f.camX += (alvo - f.camX) * Math.min(1, dt * 8);
    f.camX = Math.max(0, Math.min(d.largura - W, f.camX));

    if (jogo.vidas <= 0) return 'morreu';
    if (!f.chegouPortal && Math.abs(j.x - d.portalX) < 30 && j.noChao) { f.chegouPortal = true; return 'portal'; }
    return null;
  }

  // Vento espalha os pedacinhos de geleca (V04).
  function espalhar(f) {
    var j = f.j;
    for (var i = 0; i < 70; i++) {
      f.particulas.push({
        x: j.x + (Math.random() - 0.5) * JW, y: j.y - Math.random() * JH,
        vx: 120 + Math.random() * 380, vy: -160 + Math.random() * 200,
        vida: 1.4 + Math.random() * 0.9, r: 3 + Math.random() * 5, cor: CFG.concreto.cor, g: 60, vento: true
      });
    }
  }
  function soParticulas(f, dt) {
    f.t += dt;
    f.particulas = f.particulas.filter(function (p) {
      p.vy += (p.g || 0) * dt + (p.vento ? Math.sin(f.t * 6 + p.x * 0.02) * 300 * dt : 0);
      p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
      return p.vida > 0;
    });
  }

  function desenhar(c, f, noite, esconderJogador) {
    var d = f.dados, j = f.j, cam = Math.round(f.camX);
    Arte.ceu(c, noite, f.t);
    Arte.fundoPlantas(c, cam, noite);
    d.plataformas.forEach(function (p) { Arte.plataforma(c, p, cam, noite); });
    Arte.portal(c, d.portalX - cam, 460, f.t);
    f.pocas.forEach(function (p) {
      c.globalAlpha = Math.min(1, p.vida);
      c.fillStyle = CFG.concreto.cor;
      c.beginPath(); c.ellipse(p.x - cam, p.y - 1, 9, 3, 0, 0, 7); c.fill();
      c.globalAlpha = 1;
    });
    f.monstros.forEach(function (m) { if (m.vida > 0) Arte.monstro(c, m.x - cam, m.y, m, f.t); });
    f.gotas.forEach(function (g) { Arte.gota(c, g.x - cam, g.y, 5); });
    f.raios.forEach(function (r) { Arte.raio(c, r.x - cam, r.y, r.dir, f.t); });
    if (!esconderJogador && !(j.invul > 0 && Math.floor(f.t * 14) % 2 === 0)) {
      Arte.concreto(c, j.x - cam, j.y, {
        w: JW + 8, h: JH + 8, dir: j.dir, t: f.t + (j.vx ? f.t : 0),
        espichar: j.noChao ? Math.sin(f.t * (j.vx ? 12 : 3)) * 0.12 : Math.max(-0.5, Math.min(0.9, -j.vy / 700)),
        atacando: j.atacando > 0
      });
    }
    f.particulas.forEach(function (p) {
      c.globalAlpha = Math.min(1, p.vida * 2);
      c.fillStyle = p.cor;
      c.beginPath(); c.arc(p.x - cam, p.y, p.r, 0, 7); c.fill();
      c.globalAlpha = 1;
    });
    if (noite > 0) { c.fillStyle = 'rgba(10,16,52,' + (0.3 * noite) + ')'; c.fillRect(0, 0, W, H); }
  }

  return { criar: criar, atualizar: atualizar, desenhar: desenhar, espalhar: espalhar, soParticulas: soParticulas };
})();
