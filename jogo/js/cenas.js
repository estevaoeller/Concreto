// Cenas de história, todas desenhadas por código: abertura, mapa das peças entre os mundos,
// conversa antes de cada boss, peça recuperada depois, e o final com a nave completa.
// História e falas são PROVISÓRIAS (inventadas a pedido do responsável); a versão definitiva é do criador.
var Cenas = (function () {
  var W = CFG.largura, H = CFG.altura, ac = Arte.acaso;
  var COR_PECA = ['#b673f2', '#a0e6ff', '#ffd84a', '#8f86b8', '#7affc8'];

  // Uma cena é uma lista de passos. Cada passo: { dur, texto, desenhar(c, t, k) }, com k indo de 0 a 1.
  function criar(passos, aoFim) { return { passos: passos, i: 0, t: 0, total: 0, aoFim: aoFim }; }

  // ctrl: { avancar, pular, esq, dir, toque }. Devolve true quando a cena acaba.
  // Um passo com `escolha` espera o jogador escolher; `aoEscolher(i)` devolve os passos que vêm em seguida.
  var BOTOES = [{ x: 290, y: 410 }, { x: 670, y: 410 }], BL = 330, BA = 70;
  function atualizar(cena, dt, ctrl) {
    cena.t += dt; cena.total += dt;
    var p = cena.passos[cena.i];
    if (p.escolha) {
      if (cena.sel === undefined) cena.sel = 0;
      if (ctrl.esq) cena.sel = 0;
      if (ctrl.dir) cena.sel = 1;
      var tocou = -1;
      if (ctrl.toque) BOTOES.forEach(function (bt, i) { if (Math.abs(ctrl.toque.x - bt.x) < BL / 2 && Math.abs(ctrl.toque.y - bt.y) < BA / 2 + 8) tocou = i; });
      if (cena.t > 0.6 && (tocou >= 0 || (ctrl.avancar && !ctrl.toque))) {
        var qual = tocou >= 0 ? tocou : cena.sel, novos = p.aoEscolher(qual) || [];
        Array.prototype.splice.apply(cena.passos, [cena.i + 1, 0].concat(novos));
        cena.i++; cena.t = 0; cena.sel = undefined;
      }
    } else if (ctrl.pular) { // pula até a próxima escolha, ou até o fim
      var j = cena.i + 1;
      while (j < cena.passos.length && !cena.passos[j].escolha) j++;
      cena.i = j; cena.t = 0;
    } else if ((ctrl.avancar && cena.t > 0.5) || (p.dur && cena.t >= p.dur + 2.5)) { cena.i++; cena.t = 0; }
    if (cena.i >= cena.passos.length) { if (cena.aoFim) cena.aoFim(); return true; }
    return false;
  }

  // ---------- peças de desenho ----------
  function espaco(c, t, corA, corB) {
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, corA || '#0e0a2a'); g.addColorStop(1, corB || '#3a1f6e');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (var i = 0; i < 80; i++) {
      c.fillStyle = 'rgba(255,255,240,' + (0.45 + 0.55 * Math.abs(Math.sin(t * 2 + i))) + ')';
      c.beginPath(); c.arc((ac(i) * W - t * (4 + ac(i + 5) * 10) + W * 50) % W, ac(i + 70) * H, 0.8 + ac(i + 9) * 1.8, 0, 7); c.fill();
    }
  }
  // planeta com os cinco mundos: plantas, vulcão, céu, pelúcia, blocos
  function planeta(c, cy) {
    var cores = ['#58c02e', '#e8641e', '#6ab8ff', '#f07ab8', '#f5c62a'], r = 620;
    for (var i = 0; i < 5; i++) {
      var a0 = -Math.PI / 2 - 0.5 + i * 0.2, a1 = a0 + 0.2;
      c.fillStyle = cores[i]; c.beginPath(); c.moveTo(W / 2, cy + r); c.arc(W / 2, cy + r, r, a0, a1); c.closePath(); c.fill();
    }
    c.strokeStyle = 'rgba(8,20,16,0.5)'; c.lineWidth = 4; c.beginPath(); c.arc(W / 2, cy + r, r, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.arc(W / 2, cy + r, r, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5); c.arc(W / 2, cy + r + 26, r, -Math.PI / 2 + 0.5, -Math.PI / 2 - 0.5, true); c.fill();
  }
  function xDoMundo(i) { return W / 2 + Math.sin((i - 2) * 0.2) * 620; }
  function umaPeca(c, i, x, y, e, t) { // peça solta, centrada em (x, y), com brilho
    var p = [false, false, false, false, false]; p[i] = true;
    var g = c.createRadialGradient(x, y, 4, x, y, 70 * e);
    g.addColorStop(0, 'rgba(255,250,200,' + (0.55 + 0.2 * Math.sin(t * 6 + i)) + ')'); g.addColorStop(1, 'rgba(255,250,200,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, 70 * e, 0, 7); c.fill();
    var dy = [-6, 28, 64, -32, -8][i], ex = [0.62, 1, 1.25, 1.15, 0.62][i]; // cada peça ocupa um tamanho parecido
    Arte.nave(c, x, y + dy * e * ex, e * ex, p, t, false, true);
  }
  function brilhos(c, x, y, r, t, n) {
    for (var i = 0; i < (n || 8); i++) {
      var a = t * 2 + i * Math.PI * 2 / (n || 8), d = r * (0.7 + 0.3 * Math.sin(t * 5 + i));
      Arte.estrela(c, x + Math.cos(a) * d, y + Math.sin(a) * d, 7 + 3 * Math.sin(t * 7 + i), '#fff27a', '#a06a08');
    }
  }
  // caixa de texto de baixo, com as letras aparecendo aos poucos
  function legenda(c, linhas, t, cor) {
    if (!linhas) return;
    var alt = 30 + linhas.length * 32, y0 = H - alt - 34, falta = Math.floor(t * 46);
    c.fillStyle = 'rgba(10,6,34,0.78)'; c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2;
    Arte.retArred(c, 60, y0, W - 120, alt, 18); c.fill(); c.stroke();
    linhas.forEach(function (ln, i) {
      var parte = ln.slice(0, Math.max(0, falta)); falta -= ln.length;
      if (parte) Arte.texto(c, parte, W / 2, y0 + 30 + i * 32, 23, cor || '#f2fbf4', 'center', 600);
    });
  }
  // quebra um texto em linhas que caibam na largura
  function quebrar(c, texto, larg, fonte) {
    c.font = fonte; var pal = texto.split(' '), linhas = [], atual = '';
    pal.forEach(function (p) { var tenta = atual ? atual + ' ' + p : p; if (c.measureText(tenta).width > larg && atual) { linhas.push(atual); atual = p; } else atual = tenta; });
    if (atual) linhas.push(atual);
    return linhas;
  }
  // balão de fala apontando para quem fala (ladoX: posição da ponta)
  function balao(c, x, y, texto, pontaX, t, cor) {
    var fonte = '700 21px "Trebuchet MS", "Segoe UI", system-ui, sans-serif';
    var linhas = quebrar(c, texto, 380, fonte), larg = 0;
    linhas.forEach(function (l) { larg = Math.max(larg, c.measureText(l).width); });
    larg += 44; var alt = 28 + linhas.length * 28, falta = Math.floor(t * 40);
    c.fillStyle = '#ffffff'; c.strokeStyle = cor || '#2a2050'; c.lineWidth = 4; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(pontaX - 16, y + alt - 2); c.lineTo(pontaX, y + alt + 26); c.lineTo(pontaX + 16, y + alt - 2); c.closePath(); c.fill(); c.stroke();
    Arte.retArred(c, x - larg / 2, y, larg, alt, 18); c.fill(); c.stroke();
    c.fillRect(pontaX - 13, y + alt - 5, 26, 7);
    c.font = fonte; c.fillStyle = cor || '#2a2050'; c.textAlign = 'center'; c.textBaseline = 'middle';
    linhas.forEach(function (l, i) { var parte = l.slice(0, Math.max(0, falta)); falta -= l.length; if (parte) c.fillText(parte, x, y + 28 + i * 28); });
  }
  function fundoArena(c, tipo, t) {
    var A = Boss.arena(tipo), g = c.createLinearGradient(0, 0, 0, 400);
    g.addColorStop(0, A.ceu[0]); g.addColorStop(1, A.ceu[1]); c.fillStyle = g; c.fillRect(0, 0, W, 400);
    var luz = c.createRadialGradient(660, 230, 20, 660, 230, 420);
    luz.addColorStop(0, 'rgba(' + A.luz + ',0.5)'); luz.addColorStop(1, 'rgba(' + A.luz + ',0)'); c.fillStyle = luz; c.fillRect(0, 0, W, 400);
    var ch = c.createLinearGradient(0, 400, 0, H); ch.addColorStop(0, A.chao[0]); ch.addColorStop(1, A.chao[1]); c.fillStyle = ch; c.fillRect(0, 400, W, H);
    [70, 330, 900].forEach(function (px) { c.fillStyle = A.coluna[0]; c.strokeStyle = A.coluna[1]; c.lineWidth = 3; c.fillRect(px, -10, 46, 416); c.strokeRect(px, -10, 46, 416); });
  }
  function nomeBoss(i) { return MUNDOS[i].boss.nome; }

  // ---------- as cenas ----------
  function abertura(aoFim) {
    return criar([
      { dur: 5, texto: ['O Concreto é um alienígena de geleca.', 'Ele viajava pelo espaço na sua nave...'], desenhar: function (c, t, k) {
        espaco(c, t);
        var x = -120 + k * 620, y = 190 + Math.sin(t * 3) * 12;
        Arte.nave(c, x, y, 1.15, [true, true, true, true, true], t, true);
        Arte.concreto(c, x, y + 4, { w: 30, h: 36, dir: 1, t: t, semSombra: true, pose: 'feliz' });
      } },
      { dur: 4, texto: ['...quando um meteoro acertou a nave!'], desenhar: function (c, t, k) {
        var bate = 0.45, depois = k > bate;
        c.save(); if (depois && k < bate + 0.25) c.translate((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 18);
        espaco(c, t);
        var mk = Math.min(1, k / bate), mx = 900 - mk * 380, my = -40 + mk * 220;
        if (!depois) { // meteoro chegando
          c.strokeStyle = 'rgba(255,170,60,0.7)'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(mx + 70, my - 40); c.lineTo(mx + 10, my - 6); c.stroke();
          c.fillStyle = '#7d6a5a'; c.strokeStyle = '#3d2f25'; c.lineWidth = 4; c.beginPath(); c.arc(mx, my, 30, 0, 7); c.fill(); c.stroke();
          c.fillStyle = '#5a4a3e'; c.beginPath(); c.arc(mx - 8, my - 6, 8, 0, 7); c.arc(mx + 10, my + 8, 6, 0, 7); c.fill();
        }
        c.save(); c.translate(500, 190 + (depois ? (k - bate) * 120 : Math.sin(t * 3) * 10)); c.rotate(depois ? (k - bate) * 1.4 : 0);
        Arte.nave(c, 0, 0, 1.15, [true, true, true, true, true], t, !depois);
        Arte.concreto(c, 0, 4, { w: 30, h: 36, dir: 1, t: t, semSombra: true, pose: depois ? 'susto' : 'feliz' });
        c.restore();
        if (depois) {
          for (var i = 0; i < 7; i++) { c.fillStyle = 'rgba(90,80,100,' + (0.6 - (k - bate)) + ')'; c.beginPath(); c.arc(520 + i * 14 + Math.sin(i) * 20, 170 - (k - bate) * 160 * (0.5 + ac(i)), 16 + i * 3, 0, 7); c.fill(); }
          if (k < bate + 0.3) { c.fillStyle = 'rgba(255,255,255,' + (1 - (k - bate) / 0.3) + ')'; c.fillRect(-30, -30, W + 60, H + 60); Arte.texto(c, 'BUM!', 500, 110, 80, '#ffd23a'); }
        }
        c.restore();
      } },
      { dur: 5.5, texto: ['A nave se quebrou em cinco peças.', 'Cada uma caiu em um mundo diferente.'], desenhar: function (c, t, k) {
        espaco(c, t); planeta(c, 300);
        for (var i = 0; i < 5; i++) { // cada peça faz uma curva até o seu mundo
          var pk = Math.min(1, Math.max(0, (k - 0.1 - i * 0.07) / 0.55)), x0 = W / 2, y0 = 120, x1 = xDoMundo(i), y1 = 280 + Math.abs(i - 2) * 16;
          var px = x0 + (x1 - x0) * pk, py = y0 + (y1 - y0) * pk * pk - Math.sin(pk * Math.PI) * 60;
          umaPeca(c, i, px, py, 0.62, t);
          if (pk >= 1) Arte.texto(c, MUNDOS[i].nome.replace('Mundo ', '').replace(/^d[aeo]s? /, ''), x1, y1 + 62, 16, '#10200c', 'center', 800, 'rgba(255,255,255,0.85)');
        }
        if (k < 0.5) { c.save(); c.translate(W / 2, 110 + k * 60); c.rotate(k * 3); c.globalAlpha = 1 - k * 2; Arte.nave(c, 0, 0, 0.9, [true, false, false, false, false], t, false, true); c.restore(); c.globalAlpha = 1; }
      } },
      { dur: 5.5, texto: ['O chefe de cada mundo achou uma peça...', '...e cada um tem um motivo para não devolver!'], desenhar: function (c, t, k) {
        espaco(c, t, '#1a0e3a', '#5a2a7a');
        MUNDOS.forEach(function (m, i) {
          var ap = Math.min(1, Math.max(0, (k * 5 - i * 0.6))), x = 110 + i * 185, y = 250 + (1 - ap) * 300;
          Boss.retrato(c, m.boss.tipo, x, y, 0.36, k > 0.6 ? 'prepara' : 'neutro', t + i);
          umaPeca(c, i, x, y - 158 + Math.sin(t * 3 + i) * 6, 0.6, t);
          if (ap >= 1) Arte.texto(c, m.boss.nome, x, y + 112, 14, '#f2fbf4', 'center', 700);
        });
      } },
      { dur: 6, texto: ['Atravesse os portais, vença os chefes', 'e conserte a nave para o Concreto voltar para casa!'], desenhar: function (c, t, k) {
        Arte.temas.plantas.fundo(c, t * 20, t);
        c.fillStyle = Arte.PALETA_PLANTAS.topo; c.fillRect(0, 400, W, 30); c.fillStyle = Arte.PALETA_PLANTAS.terra; c.fillRect(0, 420, W, H);
        c.save(); c.translate(230, 392); c.rotate(-0.22); Arte.nave(c, 0, 0, 0.95, [true, false, false, false, false], t); c.restore();
        Arte.portal(c, 760, 410, t);
        var x = 380 + Math.min(1, k * 1.6) * 200;
        Arte.concreto(c, x, 404, { w: 70, h: 82, dir: 1, t: t * 2, pose: k < 0.62 ? ['anda1', 'anda2', 'anda3', 'anda2'][Math.floor(t * 9) % 4] : 'dispara', espichar: Math.sin(t * 12) * 0.1 });
        Arte.seta(c, 680, 300, 0, 24, '#fff27a', t);
      } }
    ], aoFim);
  }

  // Entre os mundos: a nave com o que já foi recuperado e o que falta, e com quem está a próxima peça.
  function mapa(mundo, tem, aoFim, amigos) {
    amigos = amigos || [];
    var faltam = tem.filter(function (v) { return !v; }).length;
    return criar([
      { dur: 7, texto: [faltam === 5 ? 'Faltam as cinco peças da nave.' : faltam === 1 ? 'Falta só uma peça!' : 'Faltam ' + faltam + ' peças da nave.',
        'A próxima é ' + artigo(MUNDOS[mundo].boss.peca) + ', que está com ' + MUNDOS[mundo].boss.art + ' ' + nomeBoss(mundo) + '.',
        MUNDOS[mundo].boss.boato], desenhar: function (c, t, k) {
        espaco(c, t, '#120a34', '#3a1f6e');
        Arte.texto(c, 'A nave do Concreto', W / 2, 46, 34, '#fff27a');
        Arte.nave(c, 250, 200, 1.5, tem, t);
        MUNDOS.forEach(function (m, i) {
          var y = 92 + i * 56, x0 = 520, ok = tem[i], vez = i === mundo;
          c.fillStyle = vez ? 'rgba(255,242,122,' + (0.2 + 0.12 * Math.sin(t * 6)) + ')' : 'rgba(255,255,255,0.08)';
          c.strokeStyle = vez ? '#fff27a' : 'rgba(255,255,255,0.2)'; c.lineWidth = vez ? 3 : 1.5;
          Arte.retArred(c, x0, y - 23, 390, 48, 14); c.fill(); c.stroke();
          umaPeca(c, i, x0 + 40, y + 2, 0.36, t);
          Arte.texto(c, m.boss.peca, x0 + 84, y - 8, 19, ok ? '#7affc8' : '#f2fbf4', 'left', 700);
          Arte.texto(c, ok ? 'recuperada!' : 'com ' + m.boss.art + ' ' + m.boss.nome, x0 + 84, y + 14, 14, ok ? '#7affc8' : '#d0c8e8', 'left', 600);
          if (ok && amigos[i]) Arte.coracao(c, x0 + 360, y, 11, true);
          else if (ok) Arte.estrela(c, x0 + 360, y, 12, '#7affc8', '#1c6a4a');
          else if (vez) Arte.seta(c, x0 - 34, y, 0, 16, '#fff27a', t);
        });
      } }
    ], aoFim);
  }
  function artigo(p) { return (p === 'Luzes' ? 'as luzes' : p === 'Motor' || p === 'Casco' ? 'o ' + p.toLowerCase() : 'a ' + p.toLowerCase()); }

  // Antes do boss: ele aparece com a peça, provoca, o Concreto responde, ele conta por que quer a peça e desafia.
  function cenaBoss(c, mundo, t, o) { // quadro comum das conversas na arena
    var b = MUNDOS[mundo].boss;
    fundoArena(c, b.tipo, t);
    var bx = 690 + (o.entrando ? (1 - Math.min(1, t / 0.7)) * 420 : 0);
    Boss.retrato(c, b.tipo, bx, 200 + (o.quadro === 'cansado' ? 15 : 0), 0.62, o.quadro || 'neutro', t);
    if (o.peca !== false) umaPeca(c, mundo, o.pecaX !== undefined ? o.pecaX : bx - 200, o.pecaY !== undefined ? o.pecaY : 130 + Math.sin(t * 3) * 8, 0.85, t);
    Arte.concreto(c, 200, 470 - (o.pulo || 0), { w: 96, h: 112, dir: 1, t: t, pose: o.pose || 'parado', espichar: Math.sin(t * 4) * 0.06 });
    Arte.texto(c, b.nome, 690, 36, 24, '#f2fbf4');
    var tf = o.entrando ? t - 0.7 : t;
    if (o.fala && tf > 0) { if (o.quem === 'concreto') balao(c, 400, 270, o.fala, 270, tf, '#1d6b1a'); else balao(c, 440, 250, o.fala, 560, tf); }
  }
  function antesDoBoss(mundo, aoFim) {
    var b = MUNDOS[mundo].boss, cv = b.conversa;
    return criar([
      { dur: 4.5, desenhar: function (c, t) { cenaBoss(c, mundo, t, { fala: cv[0], entrando: true, pose: 'susto' }); } },
      { dur: 3.2, desenhar: function (c, t) { cenaBoss(c, mundo, t, { fala: cv[1], quem: 'concreto', pose: 'dispara' }); } },
      { dur: 5.5, desenhar: function (c, t) { cenaBoss(c, mundo, t, { fala: cv[2], pose: 'parado' }); } },
      { dur: 4, desenhar: function (c, t) { cenaBoss(c, mundo, t, { fala: cv[3], quadro: 'prepara', pose: 'dispara' }); } }
    ], aoFim);
  }

  // presente de geleca que o Concreto deixa para o chefe, quando escolhe ajudar
  function presente(c, mundo, x, y, e, t) {
    c.save(); c.translate(x, y); c.scale(e, e);
    var cor = CFG.concreto.cor, esc = CFG.concreto.corEscura;
    c.fillStyle = cor; c.strokeStyle = esc; c.lineWidth = 4; c.lineJoin = 'round'; c.lineCap = 'round';
    if (mundo === 0) { // guarda-chuva
      c.beginPath(); c.arc(0, 0, 52, Math.PI, 0); c.quadraticCurveTo(34, -14, 17, 0); c.quadraticCurveTo(0, -14, -17, 0); c.quadraticCurveTo(-34, -14, -52, 0); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(0, -2); c.lineTo(0, 54); c.arc(-9, 54, 9, 0, Math.PI); c.stroke();
    } else if (mundo === 1) { // redoma com a flor
      Arte.flor(c, 0, 14, 16); c.strokeStyle = '#2c7a1b'; c.beginPath(); c.moveTo(0, 30); c.lineTo(0, 54); c.stroke();
      c.fillStyle = 'rgba(190,240,120,0.45)'; c.strokeStyle = esc;
      c.beginPath(); c.moveTo(-40, 56); c.lineTo(-40, 6); c.arc(0, 6, 40, Math.PI, 0); c.lineTo(40, 56); c.closePath(); c.fill(); c.stroke();
    } else if (mundo === 2) { // sininho
      c.save(); c.rotate(Math.sin(t * 6) * 0.25);
      c.beginPath(); c.moveTo(-34, 40); c.quadraticCurveTo(-30, -40, 0, -40); c.quadraticCurveTo(30, -40, 34, 40); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(0, 48, 9, 0, 7); c.fill(); c.stroke(); c.restore();
      Arte.texto(c, '♪', 46 + Math.sin(t * 4) * 6, -30 - (t * 30) % 30, 30, '#fff27a');
    } else if (mundo === 3) { // bola que quica
      var q = Math.abs(Math.sin(t * 5)) * 46;
      c.beginPath(); c.ellipse(0, 20 - q, 34, 34 - (q < 6 ? 6 : 0), 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = 'rgba(' + CFG.concreto.luz + ',0.9)'; c.beginPath(); c.ellipse(-12, 6 - q, 9, 6, -0.5, 0, 7); c.fill();
    } else { // lanterna que brilha
      var g = c.createRadialGradient(0, 0, 6, 0, 0, 110); g.addColorStop(0, 'rgba(255,255,170,' + (0.55 + 0.2 * Math.sin(t * 5)) + ')'); g.addColorStop(1, 'rgba(255,255,170,0)');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, 110, 0, 7); c.fill();
      c.fillStyle = cor; c.strokeStyle = esc; Arte.retArred(c, -24, -30, 48, 64, 14); c.fill(); c.stroke();
      c.beginPath(); c.arc(0, -34, 16, Math.PI, 0); c.stroke();
    }
    c.restore();
  }
  function botoesEscolha(c, cena, rotulos, t) {
    BOTOES.forEach(function (bt, i) {
      var sel = cena.sel === i, cres = sel ? 1 + Math.sin(t * 6) * 0.03 : 1;
      c.save(); c.translate(bt.x, bt.y); c.scale(cres, cres);
      c.fillStyle = sel ? '#fff27a' : 'rgba(255,255,255,0.92)'; c.strokeStyle = sel ? '#a06a08' : '#2a2050'; c.lineWidth = sel ? 6 : 4;
      Arte.retArred(c, -BL / 2, -BA / 2, BL, BA, 22); c.fill(); c.stroke();
      c.font = '800 23px "Trebuchet MS", "Segoe UI", system-ui, sans-serif'; c.fillStyle = '#2a2050'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(rotulos[i], 0, 1);
      c.restore();
    });
    Arte.texto(c, '◀ ▶ escolhem · Enter confirma · ou toque', W / 2, 474, 15, '#f2fbf4', 'center', 700);
  }

  // Depois do boss: ele se rende e conta o problema; o Concreto escolhe ajudar ou seguir viagem; a peça volta e encaixa na nave.
  // aoEscolher(true) quando o Concreto ajuda e o chefe vira amigo.
  function depoisDoBoss(mundo, tem, aoFim, aoEscolher) {
    var b = MUNDOS[mundo].boss, antes = tem.slice(), cena;
    antes[mundo] = false;
    var faltam = MUNDOS.filter(function (m, i) { return !tem[i]; }).map(function (m) { return m.boss.peca; });
    cena = criar([
      { dur: 5, desenhar: function (c, t) { cenaBoss(c, mundo, t, { fala: b.rendicao, quadro: 'cansado', pecaX: 490 }); } },
      { escolha: true, texto: null, desenhar: function (c, t) {
        cenaBoss(c, mundo, t, { quadro: 'cansado', pecaX: 490 });
        c.fillStyle = 'rgba(10,6,34,0.55)'; c.fillRect(0, 0, W, H);
        Arte.texto(c, 'O que o Concreto faz?', W / 2, 320, 34, '#fff27a');
        botoesEscolha(c, cena, ['Ajudar ' + b.art + ' ' + b.nome.split(' ')[0], 'Seguir viagem'], t);
      }, aoEscolher: function (i) {
        var ajudou = i === 0;
        if (aoEscolher) aoEscolher(ajudou);
        return ajudou ? [
          { dur: 4.5, texto: ['O Concreto fez ' + b.ajuda + '!'], desenhar: function (c, t, k) {
            cenaBoss(c, mundo, t, { quadro: 'cansado', pecaX: 490, pose: 'carrega' });
            var q = Math.min(1, k * 1.8); presente(c, mundo, 290 + q * 250, 330 - Math.sin(q * Math.PI) * 120 - q * 60, 0.5 + q * 0.5, t);
          } },
          { dur: 5, desenhar: function (c, t) {
            cenaBoss(c, mundo, t, { fala: b.obrigado, quadro: 'neutro', pecaX: 490, pose: 'feliz', pulo: Math.abs(Math.sin(t * 6)) * 16 });
            presente(c, mundo, 470, 420, 0.8, t);
            for (var h = 0; h < 5; h++) Arte.coracao(c, 620 + h * 34, 120 - ((t * 40 + h * 17) % 50), 9, true);
          } }
        ] : [
          { dur: 4.5, desenhar: function (c, t) { cenaBoss(c, mundo, t, { fala: b.tchau, quadro: 'cansado', pecaX: 490 }); } }
        ];
      } },
      { dur: 3.5, texto: ['Peça recuperada: ' + b.peca + '!'], desenhar: function (c, t, k) {
        var q = Math.min(1, k * 2.2), px = 490 + (210 - 490) * q, py = 130 + (290 - 130) * q - Math.sin(q * Math.PI) * 90;
        cenaBoss(c, mundo, t, { quadro: 'cansado', pose: 'feliz', peca: false, pulo: q >= 1 ? Math.abs(Math.sin(t * 8)) * 26 : 0 });
        if (q >= 1) brilhos(c, px, py, 90, t, 10);
        umaPeca(c, mundo, px, py, 0.85 + (q >= 1 ? 0.12 * Math.sin(t * 8) : 0), t);
      } },
      { dur: 5, texto: faltam.length ? ['Nave: ' + (5 - faltam.length) + ' de 5 peças.', 'Ainda falta' + (faltam.length > 1 ? 'm: ' : ': ') + faltam.join(', ') + '.'] : ['As cinco peças voltaram!', 'A nave está completa!'], desenhar: function (c, t, k) {
        espaco(c, t, '#120a34', '#3a1f6e');
        var q = Math.min(1, k * 2.5), alvoY = 200 + [6, -28, -64, 32, 8][mundo] * 1.7; // onde a peça encaixa na nave
        Arte.nave(c, W / 2, 200, 1.7, q >= 1 ? tem : antes, t);
        if (q < 1) umaPeca(c, mundo, W / 2 - (1 - q) * 380, alvoY + (1 - q) * 160, 0.6 + 0.6 * q, t);
        else brilhos(c, W / 2, 200, 190, t, 12);
      } }
    ], aoFim);
    return cena;
  }

  // Os sete finais (PROVISÓRIOS). Qual aparece depende de como se jogou; a ordem abaixo é a de prioridade.
  var FINAIS = [
    { id: 'festa', nome: 'Festa na nave', dica: 'Faça tudo: cinco amigos, cinco gotinhas douradas e quase todas as gotinhas.' },
    { id: 'amigos', nome: 'Amigos para sempre', dica: 'Ajude os cinco chefes.' },
    { id: 'paz', nome: 'Geleca da paz', dica: 'Atravesse os cinco mundos sem derrotar nenhum monstro comum.' },
    { id: 'tesouros', nome: 'Caçador de tesouros', dica: 'Ache as cinco gotinhas douradas.' },
    { id: 'colecionador', nome: 'Colecionador de geleca', dica: 'Pegue quase todas as gotinhas dos cinco mundos.' },
    { id: 'solitario', nome: 'Viajante solitário', dica: 'Não ajude nenhum chefe.' },
    { id: 'casa', nome: 'De volta para casa', dica: 'Termine o jogo do seu jeito.' }
  ];
  // d: { amigos: [bool x5], douradas: n, gotinhas: fração de 0 a 1, derrotados: n }
  function qualFinal(d) {
    var na = d.amigos.filter(Boolean).length;
    if (na === 5 && d.douradas === 5 && d.gotinhas >= 0.9) return 'festa';
    if (na === 5) return 'amigos';
    if (d.derrotados === 0) return 'paz';
    if (d.douradas === 5) return 'tesouros';
    if (d.gotinhas >= 0.9) return 'colecionador';
    if (na === 0) return 'solitario';
    return 'casa';
  }

  function final(id, d, aoFim) {
    var todas = [true, true, true, true, true], F = FINAIS.filter(function (f) { return f.id === id; })[0], num = FINAIS.indexOf(F) + 1;
    function chao(c, t) {
      Arte.temas.plantas.fundo(c, 300, t);
      c.fillStyle = Arte.PALETA_PLANTAS.topo; c.fillRect(0, 400, W, 30); c.fillStyle = Arte.PALETA_PLANTAS.terra; c.fillRect(0, 420, W, H);
    }
    function chefes(c, t, y, modo) { // modo: 'todos' animados, 'amigos' só os amigos animados, 'longe' todos cansados
      MUNDOS.forEach(function (m, i) {
        var amigo = d.amigos[i], vivo = modo === 'todos' || (modo === 'amigos' && amigo);
        c.globalAlpha = vivo ? 1 : 0.55;
        Boss.retrato(c, m.boss.tipo, 110 + i * 185, y - (vivo ? Math.abs(Math.sin(t * 3 + i)) * 14 : -12), 0.34, vivo ? 'neutro' : 'cansado', t + i);
        c.globalAlpha = 1;
        if (amigo && modo !== 'longe') Arte.coracao(c, 110 + i * 185, y - 130 - Math.abs(Math.sin(t * 3 + i)) * 14, 12, true);
      });
    }
    function decolagem(c, t, k, extra) { // a nave sobe do chão até o espaço; `extra` desenha o que vai junto
      if (k < 0.45) chao(c, t); else { espaco(c, t); planeta(c, 380 + (k - 0.45) * 500); }
      var y = k < 0.45 ? 330 - k * k * 900 : 420 - (k - 0.45) * 520, e = Math.max(0.3, k < 0.45 ? 1.3 : 1.3 - (k - 0.45) * 1.2), x = W / 2 + Math.sin(t * 2) * 20;
      if (extra) extra(x, y, e);
      Arte.nave(c, x, y, e, todas, t, true);
      Arte.concreto(c, x, y + 4, { w: 32 * e, h: 38 * e, dir: 1, t: t, semSombra: true, pose: 'feliz' });
    }
    var montar = { dur: 5, texto: ['O Concreto juntou as cinco peças', 'e consertou a nave!'], desenhar: function (c, t, k) {
      chao(c, t);
      for (var i = 0; i < 5; i++) { var q = Math.min(1, Math.max(0, (k * 6 - i * 0.8))); if (q > 0 && q < 1) umaPeca(c, i, W / 2 + (i - 2) * 220 * (1 - q), 330 - (1 - q) * 300, 0.9, t); }
      Arte.nave(c, W / 2, 330, 1.3, todas.map(function (v, i) { return k * 6 - i * 0.8 >= 1; }), t);
      if (k > 0.9) brilhos(c, W / 2, 320, 170, t, 12);
      Arte.concreto(c, 200, 404, { w: 70, h: 82, dir: 1, t: t, pose: 'feliz', espichar: Math.sin(t * 10) * 0.15 });
    } };
    var meio, fim;
    if (id === 'festa') {
      meio = { dur: 6, texto: ['Os cinco chefes viraram amigos, e o Concreto', 'achou todos os tesouros. Hora de comemorar!'], desenhar: function (c, t) {
        chao(c, t); chefes(c, t, 250, 'todos'); Arte.nave(c, W / 2, 110, 0.8, todas, t);
        for (var i = 0; i < 40; i++) { c.fillStyle = COR_PECA[i % 5]; c.fillRect((ac(i) * W + t * 30) % W, (ac(i + 40) * H + t * (80 + ac(i) * 80)) % 420, 8, 12); }
        Arte.concreto(c, W / 2, 404 - Math.abs(Math.sin(t * 6)) * 40, { w: 60, h: 70, dir: 1, t: t, pose: 'feliz' });
      } };
      fim = { dur: 7, texto: ['Todo mundo subiu na nave', 'para uma festa no espaço!'], desenhar: function (c, t, k) {
        decolagem(c, t, k, function (x, y, e) {
          MUNDOS.forEach(function (m, i) { var a = t * 1.5 + i * Math.PI * 2 / 5; Boss.retrato(c, m.boss.tipo, x + Math.cos(a) * 190 * e, y + Math.sin(a) * 90 * e - 30 * e, 0.2 * e, 'neutro', t + i); });
          brilhos(c, x, y, 150 * e, t, 14);
        });
      } };
    } else if (id === 'amigos') {
      meio = { dur: 6, texto: ['Os cinco chefes viraram amigos do Concreto', 'e vieram se despedir.'], desenhar: function (c, t) {
        chao(c, t); chefes(c, t, 250, 'todos'); Arte.nave(c, W / 2, 110, 0.8, todas, t);
        Arte.concreto(c, W / 2, 404 - Math.abs(Math.sin(t * 5)) * 30, { w: 60, h: 70, dir: 1, t: t, pose: 'feliz' });
      } };
      fim = { dur: 7, texto: ['O Concreto deixou um portal aberto.', 'Ele prometeu voltar para visitar!'], desenhar: function (c, t, k) {
        decolagem(c, t, k, function () { if (k < 0.45) { Arte.portal(c, 760, 410, t); for (var h = 0; h < 6; h++) Arte.coracao(c, 200 + h * 110, 380 - ((t * 50 + h * 30) % 200), 11, true); } });
      } };
    } else if (id === 'paz') {
      meio = { dur: 6, texto: ['O Concreto não derrotou nenhum monstro.', 'Eles vieram agradecer!'], desenhar: function (c, t) {
        chao(c, t); Arte.nave(c, W / 2, 150, 0.9, todas, t);
        ['planta', 'lava', 'nuvem', 'urso', 'bloco', 'cogumelo', 'estrela', 'novelo'].forEach(function (tp, i) {
          Arte.monstro(c, 90 + i * 112, 404 - Math.abs(Math.sin(t * 4 + i)) * 16, { tipo: tp, olha: i < 4 ? 1 : -1, estado: 'calmo', tempo: 9, x: i * 50, piscando: 0 }, t);
          Arte.coracao(c, 90 + i * 112, 320 - Math.abs(Math.sin(t * 4 + i)) * 16, 9, true);
        });
        Arte.concreto(c, W / 2, 330, { w: 54, h: 62, dir: 1, t: t, pose: 'feliz', semSombra: true });
      } };
      fim = { dur: 7, texto: ['Dá para ser herói sem machucar ninguém.', 'O Concreto voltou para casa em paz.'], desenhar: function (c, t, k) { decolagem(c, t, k); } };
    } else if (id === 'tesouros') {
      meio = { dur: 6, texto: ['As cinco gotinhas douradas', 'cobriram a nave de ouro!'], desenhar: function (c, t) {
        chao(c, t); chefes(c, t, 250, 'amigos');
        var g = c.createRadialGradient(W / 2, 120, 10, W / 2, 120, 220); g.addColorStop(0, 'rgba(255,220,90,0.75)'); g.addColorStop(1, 'rgba(255,220,90,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 360);
        Arte.nave(c, W / 2, 120, 0.95, todas, t);
        for (var i = 0; i < 5; i++) { var a = t * 2 + i * Math.PI * 2 / 5; Arte.gotaDourada(c, W / 2 + Math.cos(a) * 150, 120 + Math.sin(a) * 60, t + i); }
        Arte.concreto(c, W / 2, 404, { w: 60, h: 70, dir: 1, t: t, pose: 'feliz' });
      } };
      fim = { dur: 7, texto: ['A nave mais brilhante do espaço', 'voltou para casa.'], desenhar: function (c, t, k) {
        decolagem(c, t, k, function (x, y, e) {
          for (var i = 0; i < 14; i++) { c.globalAlpha = 1 - i / 14; Arte.estrela(c, x + Math.sin(t * 3 + i) * 18 * e, y + 50 * e + i * 26 * e, (12 - i * 0.6) * e, '#ffd84a', '#a06a08'); } c.globalAlpha = 1;
          var g = c.createRadialGradient(x, y, 8, x, y, 170 * e); g.addColorStop(0, 'rgba(255,220,90,0.7)'); g.addColorStop(1, 'rgba(255,220,90,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 170 * e, 0, 7); c.fill();
        });
      } };
    } else if (id === 'colecionador') {
      meio = { dur: 6, texto: ['O Concreto juntou tanta geleca', 'que mal coube na nave!'], desenhar: function (c, t) {
        chao(c, t); chefes(c, t, 250, 'amigos'); Arte.nave(c, W / 2, 110, 0.8, todas, t);
        for (var i = 0; i < 46; i++) { var lin = Math.floor(Math.sqrt(i)), col = i - lin * lin; Arte.gota(c, 720 + (col - lin) * 20, 250 + lin * 22, 10); }
        Arte.concreto(c, 600, 404, { w: 60, h: 70, dir: 1, t: t, pose: 'feliz', espichar: Math.sin(t * 8) * 0.15 });
      } };
      fim = { dur: 7, texto: ['Na volta, foi caindo geleca pelo caminho.', 'Em casa, choveu geleca por uma semana!'], desenhar: function (c, t, k) {
        decolagem(c, t, k, function (x, y, e) { for (var i = 0; i < 26; i++) Arte.gota(c, x + (ac(i) - 0.5) * 260 * e, y + 40 * e + ((t * 160 + i * 37) % 320), 7 * e + 3); });
      } };
    } else if (id === 'solitario') {
      meio = { dur: 6, texto: ['O Concreto pegou as peças', 'e foi embora sem olhar para trás.'], desenhar: function (c, t) {
        chao(c, t); chefes(c, t, 250, 'longe'); Arte.nave(c, W / 2, 110, 0.8, todas, t);
        Arte.concreto(c, W / 2, 404, { w: 60, h: 70, dir: 1, t: t, pose: 'parado' });
      } };
      fim = { dur: 7, texto: ['A viagem de volta foi bem quieta.', 'Será que faltou fazer amigos?'], desenhar: function (c, t, k) { decolagem(c, t, k); } };
    } else {
      meio = { dur: 6, texto: [d.amigos.some(Boolean) ? 'Os chefes que viraram amigos vieram se despedir.' : 'Os chefes vieram ver a nave partir.', 'Até que eles não eram tão maus assim!'], desenhar: function (c, t) {
        chao(c, t); chefes(c, t, 250, 'amigos'); Arte.nave(c, W / 2, 110, 0.8, todas, t);
        Arte.concreto(c, W / 2, 404 - Math.abs(Math.sin(t * 5)) * 30, { w: 60, h: 70, dir: 1, t: t, pose: 'feliz' });
      } };
      fim = { dur: 7, texto: ['A nave decolou.', 'O Concreto voltou para casa. Obrigado pela ajuda!'], desenhar: function (c, t, k) { decolagem(c, t, k); } };
    }
    return criar([montar, meio, fim,
      { dur: 8, desenhar: function (c, t) {
        espaco(c, t);
        brilhos(c, W / 2, 170, 150, t, 14);
        Arte.texto(c, 'FIM', W / 2, 170, 104, '#fff27a', 'center', 800);
        Arte.texto(c, 'Final ' + num + ' de ' + FINAIS.length + ': ' + F.nome, W / 2, 310, 30, '#f2fbf4');
        Arte.texto(c, 'Existem ' + FINAIS.length + ' finais. Jogue de outro jeito para ver os outros!', W / 2, 362, 19, '#7affc8', 'center', 700);
        Arte.texto(c, 'A tela de progresso mostra pistas de cada um.', W / 2, 394, 16, '#d0c8e8', 'center', 600);
      } }
    ], aoFim);
  }

  function desenhar(c, cena) {
    var p = cena.passos[Math.min(cena.i, cena.passos.length - 1)];
    p.desenhar(c, cena.t, p.dur ? Math.min(1, cena.t / p.dur) : 1);
    legenda(c, p.texto, cena.t);
    // botão de pular, no alto à direita, e aviso de continuar
    c.fillStyle = 'rgba(10,6,34,0.6)'; c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 2;
    Arte.retArred(c, W - 124, 14, 110, 36, 18); c.fill(); c.stroke();
    Arte.texto(c, 'Pular ▶▶', W - 69, 33, 15, '#f2fbf4', 'center', 700);
    if (!p.escolha && cena.t > 0.8 && Math.floor(cena.total * 2) % 3 !== 0) Arte.texto(c, 'Toque ou aperte Enter', W / 2, H - 16, 15, '#fff27a', 'center', 700);
    for (var i = 0; i < cena.passos.length && cena.passos.length > 1; i++) {
      c.fillStyle = i === cena.i ? '#fff27a' : 'rgba(255,255,255,0.4)'; c.beginPath(); c.arc(24 + i * 16, 28, 4.5, 0, 7); c.fill();
    }
  }

  return { atualizar: atualizar, desenhar: desenhar, abertura: abertura, mapa: mapa, antesDoBoss: antesDoBoss, depoisDoBoss: depoisDoBoss, final: final, FINAIS: FINAIS, qualFinal: qualFinal };
})();
