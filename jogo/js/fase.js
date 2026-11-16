// Exploração de lado (visão lateral, C01): andar, pular, raio de geleca, monstros com faca, portal.

var Fase = (function () {
  var W = CFG.largura, H = CFG.altura;
  var JW = 40, JH = 50, MW = 44, MH = 50;

  function criar(mundo) {
    var dados = mundo.fase;
    dados.plataformas.forEach(function (p) { if (p.mov) { p.x = p.bx; p.y = p.by; } });
    return {
      dados: dados, tema: Arte.temas[mundo.tema],
      molas: dados.molas.map(function (m) { return { x: m.x, y: m.y, w: m.w, aperto: 0 }; }),
      j: {
        x: dados.inicio.x, y: dados.inicio.y, vx: 0, vy: 0, dir: 1, noChao: true,
        invul: 0, trava: 0, recarga: 0, atacando: 0, pulosNoAr: 0, coiote: 0, memoriaPulo: 0, pouso: 0, entrando: 0, apoio: null,
        seguro: { x: dados.inicio.x, y: dados.inicio.y }, proxGota: CFG.concreto.intervaloGota
      },
      monstros: dados.monstros.map(function (m, i) {
        var base = null; // plataforma onde ele fica: quem anda não sai dela
        dados.plataformas.forEach(function (p) { if (!p.mov && Math.abs(p.y - m.y) < 2 && m.x >= p.x && m.x <= p.x + p.w) base = p; });
        return {
          x: m.x, y: m.y, by: m.y, tipo: m.tipo || 'espinho', modo: m.modo || 'parado', vida: CFG.monstro.vida,
          olha: -1, estado: 'calmo', tempo: 0, piscando: 0, acertou: false, anda: i % 2 ? 1 : -1, vy: 0, relogio: i * 0.7,
          min: Math.max(base ? base.x + 34 : m.x, m.x - CFG.monstro.passeio), max: Math.min(base ? base.x + base.w - 34 : m.x, m.x + CFG.monstro.passeio)
        };
      }),
      escudos: dados.escudos.map(function (g) { return { x: g.x, y: g.y, pego: false }; }),
      dourada: dados.dourada ? { x: dados.dourada.x, y: dados.dourada.y, pego: false } : null,
      gotinhas: dados.gotinhas.map(function (g) { return { x: g.x, y: g.y, pego: false }; }),
      coracoes: dados.coracoes.map(function (g) { return { x: g.x, y: g.y, pego: false }; }),
      raios: [], gotas: [], pocas: [], particulas: [],
      camX: 0, t: 0, tremor: 0, chegouPortal: false, trecho: 0, avisoTrecho: 0
    };
  }

  function toca(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }
  function altura(p) { return p.chao ? 400 : p.h; }

  function ferir(f, jogo, deX) {
    var j = f.j;
    if (j.invul > 0) return;
    if (jogo.escudo) { jogo.escudo = false; Som.quebrou(); poeira(f, j.x, j.y - JH / 2, '#c8f0ff', 14); } // o escudo aguenta um golpe
    else { jogo.vidas--; Som.dano(); }
    jogo.congela = 0.09; // o jogo para um instante: o golpe fica mais forte
    j.invul = CFG.invencivelAposDano; // V05
    j.trava = 0.3;
    f.tremor = 0.25;
    var lado = j.x >= deX ? 1 : -1;
    j.vx = lado * CFG.empurrao.vx; // jogado para trás (V03)
    j.vy = -CFG.empurrao.vy;
    j.noChao = false;
    poeira(f, j.x, j.y - JH / 2, CFG.concreto.cor, 8);
  }

  function poeira(f, x, y, cor, n, forca) {
    for (var i = 0; i < n; i++) {
      f.particulas.push({
        x: x, y: y, vx: (Math.random() - 0.5) * 260 * (forca || 1), vy: -Math.random() * 240 * (forca || 1),
        vida: 0.5 + Math.random() * 0.3, r: 3 + Math.random() * 3, cor: cor, g: 700
      });
    }
  }

  // Devolve 'portal' quando Concreto chega ao portal, 'morreu' quando acabam as vidas.
  function atualizar(f, dt, jogo) {
    var j = f.j, C = CFG.concreto, d = f.dados;
    f.t += dt;
    if (f.tremor > 0) f.tremor -= dt;
    if (f.avisoTrecho > 0) f.avisoTrecho -= dt;

    // plataformas que se mexem (PROVISÓRIO): levam o Concreto junto
    d.plataformas.forEach(function (p) {
      if (!p.mov) return;
      var k = Math.sin(f.t * Math.PI * 2 / p.mov.per);
      var nx = p.bx + p.mov.dx * k, ny = p.by + p.mov.dy * k;
      if (j.apoio === p) { j.x += nx - p.x; j.y = ny; }
      p.x = nx; p.y = ny;
    });
    f.molas.forEach(function (m) { if (m.aperto > 0) m.aperto -= dt * 3; });

    // --- Concreto ---
    j.coiote = j.noChao ? C.toleranciaBorda : j.coiote - dt;
    j.memoriaPulo = Entrada.puloApertou ? C.memoriaPulo : j.memoriaPulo - dt;
    if (j.pouso > 0) j.pouso -= dt;
    if (j.trava > 0) j.trava -= dt;
    else {
      var mov = (Entrada.dir ? 1 : 0) - (Entrada.esq ? 1 : 0);
      j.vx = mov * C.velocidade;
      if (mov) j.dir = mov;
      if (j.memoriaPulo > 0) {
        if (j.coiote > 0) { j.vy = -C.forcaPulo; j.noChao = false; j.coiote = 0; j.memoriaPulo = 0; Som.pulo(); }
        else if (jogo.poder.puloDuplo && j.pulosNoAr < 1 && Entrada.puloApertou) { j.vy = -C.forcaPulo * 0.9; j.pulosNoAr++; j.memoriaPulo = 0; Som.pulo(); poeira(f, j.x, j.y, '#ffffff', 6, 0.6); }
      }
    }
    if (j.vy >= 0) j.lancado = false;
    if (!Entrada.pulo && j.vy < -260 && !j.lancado) j.vy = -260; // soltar o botão cedo = pulo mais baixo
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
    var yAntes = j.y, vyAntes = j.vy, estavaNoChao = j.noChao;
    j.y += j.vy * dt;
    j.noChao = false; j.apoio = null;
    d.plataformas.forEach(function (p) {
      if (!toca(j.x - JW / 2, j.y - JH, JW, JH, p.x, p.y, p.w, altura(p))) return;
      if (j.vy >= 0 && yAntes <= p.y + 3) {
        j.y = p.y; j.vy = 0; j.noChao = true; j.pulosNoAr = 0; j.apoio = p;
        if (!p.mov && j.invul <= 0 && j.x > p.x + 24 && j.x < p.x + p.w - 24) j.seguro = { x: j.x, y: p.y };
      } else if (j.vy < 0 && !p.chao) {
        j.y = p.y + p.h + JH; j.vy = 0;
      }
    });
    if (j.noChao && !estavaNoChao && vyAntes > 300) { j.pouso = 0.14; poeira(f, j.x, j.y, '#e8f7c8', 5, 0.5); }

    // almofada: pisar nela joga para o alto (PROVISÓRIO)
    f.molas.forEach(function (m) {
      if (j.vy >= 0 && j.x > m.x - 6 && j.x < m.x + m.w + 6 && j.y >= m.y - 16 && j.y <= m.y + 4) {
        j.vy = -C.forcaPulo * CFG.mola.forca; j.noChao = false; j.coiote = 0; j.apoio = null;
        j.lancado = true; m.aperto = 1; Som.mola();
      }
    });

        // caiu no buraco: perde uma vida e volta para a última plataforma (V06)
    if (j.y > H + 120) {
      if (CFG.quedaTiraVida) { jogo.vidas--; Som.dano(); }
      j.x = j.seguro.x; j.y = j.seguro.y; j.vx = 0; j.vy = 0;
      j.invul = CFG.invencivelAposDano;
    }

    // raio de geleca (A01)
    if (Entrada.ataqueApertou && j.recarga <= 0 && j.trava <= 0) {
      j.recarga = jogo.poder.recarga;
      j.atacando = 0.2;
      f.raios.push({ x: j.x + j.dir * 40, y: j.y - JH * 0.45, dir: j.dir, andou: 0 });
      Som.raio();
    }

    // gotinha de geleca que cai no chão (P03) — só enfeite
    j.proxGota -= dt;
    if (j.proxGota <= 0) {
      j.proxGota = C.intervaloGota;
      f.gotas.push({ x: j.x + j.dir * 30, y: j.y - 30, vy: 0 });
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

    // coletáveis (PROVISÓRIO): gotinhas contam pontos, coração devolve uma vida
    f.gotinhas.forEach(function (g) {
      if (!g.pego && Math.abs(g.x - j.x) < 30 && Math.abs(g.y - (j.y - JH / 2)) < 38) {
        g.pego = true; jogo.gotinhas++; Som.gotinha();
        poeira(f, g.x, g.y, '#eaffa0', 4, 0.5);
      }
    });
    f.escudos.forEach(function (g) {
      if (!g.pego && !jogo.escudo && Math.abs(g.x - j.x) < 36 && Math.abs(g.y - (j.y - JH / 2)) < 46) {
        g.pego = true; jogo.escudo = true; Som.escudo();
        poeira(f, g.x, g.y, '#c8f0ff', 10);
      }
    });
    f.escudoAtivo = jogo.escudo;
    var go = f.dourada; // segredo do mundo: gotinha dourada
    if (go && !go.pego && Math.abs(go.x - j.x) < 30 && Math.abs(go.y - (j.y - JH / 2)) < 38) {
      go.pego = true; jogo.dourada = true; Som.vida(); jogo.congela = 0.08;
      poeira(f, go.x, go.y, '#ffd84a', 18, 1.3);
    }
    f.coracoes.forEach(function (g) {
      if (!g.pego && jogo.vidas < CFG.vidas && Math.abs(g.x - j.x) < 34 && Math.abs(g.y - (j.y - JH / 2)) < 42) {
        g.pego = true; jogo.vidas++; Som.vida();
        poeira(f, g.x, g.y, '#ff6f91', 10);
      }
    });

    // --- raios ---
    f.raios = f.raios.filter(function (r) {
      var passo = CFG.raio.velocidade * dt;
      r.x += r.dir * passo; r.andou += passo;
      if (r.andou > jogo.poder.alcance) return false;
      for (var i = 0; i < d.plataformas.length; i++) {
        var p = d.plataformas[i];
        if (toca(r.x - 12, r.y - 5, 24, 10, p.x, p.y, p.w, altura(p))) { poeira(f, r.x, r.y, CFG.concreto.cor, 4); return false; }
      }
      for (var k = 0; k < f.monstros.length; k++) {
        var m = f.monstros[k];
        if (m.vida > 0 && toca(r.x - 12, r.y - 5, 24, 10, m.x - MW / 2, m.y - MH, MW, MH)) {
          m.vida -= jogo.poder.dano; m.piscando = 0.15;
          Som.acerto(); jogo.congela = 0.045;
          poeira(f, r.x, r.y, CFG.concreto.cor, 7);
          if (m.vida <= 0) { poeira(f, m.x, m.y - MH / 2, Arte.corMonstro(m.tipo), 22, 1.3); poeira(f, m.x, m.y - MH / 2, '#ffffff', 8, 1.6); f.tremor = 0.12; Som.derrotou(); }
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
      m.tempo += dt; m.relogio += dt;
      // cada tipo se mexe de um jeito; para atacar com a faca, todos param
      if (m.modo === 'anda' && m.estado === 'calmo' && m.max > m.min) {
        m.x += m.anda * M.velocidade * dt;
        if (m.x >= m.max) { m.x = m.max; m.anda = -1; } else if (m.x <= m.min) { m.x = m.min; m.anda = 1; }
        m.olha = m.anda;
      } else if (m.modo === 'pula') {
        if (m.y >= m.by && m.relogio >= M.intervaloPulo && m.estado === 'calmo') { m.vy = -M.forcaPulo; m.relogio = 0; }
        m.vy += 1200 * dt; m.y = Math.min(m.by, m.y + m.vy * dt);
        if (m.y >= m.by) m.vy = 0;
      } else if (m.modo === 'flutua') {
        m.y = m.by - M.alturaVoo * (0.5 - 0.5 * Math.cos(m.relogio * 2));
      }
      if (m.estado === 'calmo') {
        if (perto) { m.estado = 'preparando'; m.tempo = 0; Som.percebeu(); }
      } else if (m.estado === 'preparando') {
        if (!perto) m.estado = 'calmo';                 // longe: a faca some (I04)
        else if (m.tempo >= M.preparoFaca) { m.estado = 'golpe'; m.tempo = 0; m.acertou = false; }
      } else if (m.estado === 'golpe') {
        var fx = m.olha > 0 ? m.x + MW / 2 : m.x - MW / 2 - M.alcanceFaca;
        if (!m.acertou && toca(j.x - JW / 2, j.y - JH, JW, JH, fx, m.y - 36, M.alcanceFaca, 26)) {
          m.acertou = true; ferir(f, jogo, m.x);       // a faca tira vida (I05)
        }
        if (m.tempo >= M.duracaoGolpe) { m.estado = 'descanso'; m.tempo = 0; }
      } else if (m.estado === 'descanso') {
        if (m.tempo >= M.descanso) { m.estado = perto ? 'preparando' : 'calmo'; m.tempo = 0.3; }
      }
      // encostar no monstro tira uma vida (V02/I03)
      if (toca(j.x - JW / 2 + 4, j.y - JH + 4, JW - 8, JH - 4, m.x - MW / 2 + 4, m.y - MH + 6, MW - 8, MH - 6)) ferir(f, jogo, m.x);
    });

    // partículas
    f.particulas = f.particulas.filter(function (p) {
      p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
      return p.vida > 0;
    });

    // aviso de trecho novo
    var tr = 0;
    d.trechos.forEach(function (t, i) { if (j.x >= t.x) tr = i; });
    if (tr > f.trecho) { f.trecho = tr; f.avisoTrecho = 2.5; Som.gotinha(); } // chegou a um ponto de retorno novo

    // câmera segue Concreto, olhando um pouco para a frente
    var alvo = j.x - W * 0.4 + j.dir * 40;
    f.camX += (alvo - f.camX) * Math.min(1, dt * 6);
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
  // Ponto de retorno (PROVISÓRIO): sem vidas, volta ao começo do trecho em que estava. O que já foi feito continua feito.
  function voltar(f) {
    var j = f.j, r = f.dados.retornos[f.trecho];
    j.x = r.x; j.y = r.y; j.vx = 0; j.vy = 0; j.dir = 1; j.noChao = true; j.trava = 0; j.recarga = 0; j.entrando = 0;
    j.invul = 1.5; j.seguro = { x: r.x, y: r.y };
    f.raios = []; f.particulas = []; f.gotas = []; f.tremor = 0;
    f.monstros.forEach(function (m) { m.estado = 'calmo'; m.tempo = 0; });
    f.camX = Math.max(0, Math.min(f.dados.largura - W, r.x - W * 0.4));
  }

  function soParticulas(f, dt) {
    f.t += dt;
    f.particulas = f.particulas.filter(function (p) {
      p.vy += (p.g || 0) * dt + (p.vento ? Math.sin(f.t * 6 + p.x * 0.02) * 300 * dt : 0);
      p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
      return p.vida > 0;
    });
  }

  function desenhar(c, f, esconderJogador) {
    var d = f.dados, j = f.j, cam = Math.round(f.camX);
    c.save();
    if (f.tremor > 0) c.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8);
    f.tema.fundo(c, cam, f.t);
    if (f.tema.liquido) f.tema.liquido(c, f.t);
    d.placas.forEach(function (p) { if (p.x - cam > -200 && p.x - cam < W + 200) Arte.placa(c, p.x - cam, 452, p.texto); });
    d.plataformas.forEach(function (p) { Arte.plataforma(c, p, cam, f.tema.pal); });
    d.retornos.forEach(function (r, i) { // bandeira do ponto de retorno
      var x = r.x - 46 - cam;
      if (i > 0 && x > -40 && x < W + 40) Arte.bandeira(c, x, 452, i <= f.trecho, f.t);
    });
    if (f.dourada && !f.dourada.pego && f.dourada.x - cam > -40 && f.dourada.x - cam < W + 40) Arte.gotaDourada(c, f.dourada.x - cam, f.dourada.y + Math.sin(f.t * 3) * 4, f.t);
    f.molas.forEach(function (m) { if (m.x - cam > -80 && m.x - cam < W + 20) Arte.mola(c, m.x - cam, m.y - 8, m.w, Math.max(0, m.aperto)); });
    Arte.portal(c, d.portalX - cam, 452, f.t);
    f.pocas.forEach(function (p) { Arte.poca(c, p.x - cam, p.y - 8, Math.min(1, p.vida)); });
    f.gotinhas.forEach(function (g, i) {
      var x = g.x - cam;
      if (!g.pego && x > -30 && x < W + 30) Arte.gotinha(c, x, g.y + Math.sin(f.t * 4 + i) * 3, f.t + i);
    });
    f.coracoes.forEach(function (g, i) {
      var x = g.x - cam;
      if (!g.pego && x > -40 && x < W + 40) Arte.coracao(c, x, g.y + Math.sin(f.t * 3 + i) * 4, 15 + Math.sin(f.t * 6) * 1.5, true);
    });
    f.escudos.forEach(function (g, i) {
      var x = g.x - cam;
      if (!g.pego && x > -40 && x < W + 40) { Arte.bolha(c, x, g.y + Math.sin(f.t * 3 + i) * 4, 18, f.t); Arte.gota(c, x, g.y + 4 + Math.sin(f.t * 3 + i) * 4, 7); }
    });
    f.monstros.forEach(function (m) {
      var x = m.x - cam;
      if (m.vida > 0 && x > -80 && x < W + 80) Arte.monstro(c, x, m.y, m, f.t);
    });
    f.gotas.forEach(function (g) { Arte.gota(c, g.x - cam, g.y, 6); });
    f.raios.forEach(function (r) { Arte.raio(c, r.x - cam, r.y, r.dir, f.t); });
    if (!esconderJogador && !(j.invul > 0 && Math.floor(f.t * 14) % 2 === 0)) {
      var esp = j.pouso > 0 ? -0.5 * (j.pouso / 0.14)
        : j.noChao ? Math.sin(f.t * (j.vx ? 12 : 3)) * 0.12 : Math.max(-0.5, Math.min(0.9, -j.vy / 700));
      if (j.entrando > 0) { // sendo puxado para dentro do portal
        var k = 1 - j.entrando;
        c.save();
        c.translate(j.x - cam + (d.portalX - j.x) * j.entrando, j.y - 60 * j.entrando);
        c.rotate(j.entrando * 7); c.scale(k, k);
        Arte.concreto(c, 0, 26, { w: JW + 8, h: JH + 8, dir: j.dir, t: f.t, semSombra: true, pose: 'sobe' });
        c.restore();
      } else {
        var pose = j.trava > 0 ? 'carrega' : j.atacando > 0 ? 'dispara' : j.pouso > 0 ? 'pousa' : !j.noChao ? (j.vy < 0 ? 'sobe' : 'desce')
          : j.vx ? ['anda1', 'anda2', 'anda3', 'anda2'][Math.floor(f.t * 9) % 4] : 'parado';
        Arte.concreto(c, j.x - cam, j.y, { w: JW + 8, h: JH + 8, dir: j.dir, t: f.t + (j.vx ? f.t : 0), espichar: esp, atacando: j.atacando > 0, dano: j.trava > 0, pose: pose });
        if (f.escudoAtivo) Arte.bolha(c, j.x - cam, j.y - 28, 44, f.t);
      }
    }
    f.particulas.forEach(function (p) {
      c.globalAlpha = Math.min(1, p.vida * 2);
      c.fillStyle = p.cor;
      c.beginPath(); c.arc(p.x - cam, p.y, p.r, 0, 7); c.fill();
      c.globalAlpha = 1;
    });
    c.restore();
  }

  return { criar: criar, atualizar: atualizar, desenhar: desenhar, espalhar: espalhar, soParticulas: soParticulas, voltar: voltar };
})();
