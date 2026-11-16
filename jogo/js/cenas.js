// Cenas de história, todas desenhadas por código: abertura, mapa das peças entre os mundos,
// conversa antes de cada boss, peça recuperada depois, e o final com a nave completa.
// História e falas são PROVISÓRIAS (inventadas a pedido do responsável); a versão definitiva é do criador.
var Cenas = (function () {
  var W = CFG.largura, H = CFG.altura, ac = Arte.acaso;
  var COR_PECA = ['#b673f2', '#a0e6ff', '#ffd84a', '#8f86b8', '#7affc8'];

  // Uma cena é uma lista de passos. Cada passo: { dur, texto, desenhar(c, t, k) }, com k indo de 0 a 1.
  function criar(passos, aoFim) { return { passos: passos, i: 0, t: 0, total: 0, aoFim: aoFim }; }

  // avancar: toque ou tecla de confirmar; pular: sai da cena inteira. Devolve true quando a cena acaba.
  function atualizar(cena, dt, avancar, pular) {
    cena.t += dt; cena.total += dt;
    var p = cena.passos[cena.i];
    if (pular) cena.i = cena.passos.length;
    else if ((avancar && cena.t > 0.5) || (p.dur && cena.t >= p.dur + 2.5)) { cena.i++; cena.t = 0; }
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
      { dur: 5.5, texto: ['O chefe de cada mundo achou uma peça...', '...e não quer devolver!'], desenhar: function (c, t, k) {
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
  function mapa(mundo, tem, aoFim) {
    var faltam = tem.filter(function (v) { return !v; }).length;
    return criar([
      { dur: 7, texto: [faltam === 5 ? 'Faltam as cinco peças da nave.' : faltam === 1 ? 'Falta só uma peça!' : 'Faltam ' + faltam + ' peças da nave.',
        'A próxima é ' + artigo(MUNDOS[mundo].boss.peca) + ', que está com ' + MUNDOS[mundo].boss.art + ' ' + nomeBoss(mundo) + '.'], desenhar: function (c, t, k) {
        espaco(c, t, '#120a34', '#3a1f6e');
        Arte.texto(c, 'A nave do Concreto', W / 2, 46, 34, '#fff27a');
        Arte.nave(c, 250, 220, 1.5, tem, t);
        MUNDOS.forEach(function (m, i) {
          var y = 96 + i * 62, x0 = 520, ok = tem[i], vez = i === mundo;
          c.fillStyle = vez ? 'rgba(255,242,122,' + (0.2 + 0.12 * Math.sin(t * 6)) + ')' : 'rgba(255,255,255,0.08)';
          c.strokeStyle = vez ? '#fff27a' : 'rgba(255,255,255,0.2)'; c.lineWidth = vez ? 3 : 1.5;
          Arte.retArred(c, x0, y - 24, 390, 52, 14); c.fill(); c.stroke();
          umaPeca(c, i, x0 + 40, y + 2, 0.36, t);
          Arte.texto(c, m.boss.peca, x0 + 84, y - 8, 19, ok ? '#7affc8' : '#f2fbf4', 'left', 700);
          Arte.texto(c, ok ? 'recuperada!' : 'com ' + m.boss.art + ' ' + m.boss.nome, x0 + 84, y + 14, 14, ok ? '#7affc8' : '#d0c8e8', 'left', 600);
          if (ok) Arte.estrela(c, x0 + 360, y, 12, '#7affc8', '#1c6a4a');
          else if (vez) Arte.seta(c, x0 - 34, y, 0, 16, '#fff27a', t);
        });
      } }
    ], aoFim);
  }
  function artigo(p) { return (p === 'Luzes' ? 'as luzes' : p === 'Motor' || p === 'Casco' ? 'o ' + p.toLowerCase() : 'a ' + p.toLowerCase()); }

  // Antes do boss: ele aparece com a peça, provoca, o Concreto responde, e ele desafia.
  function antesDoBoss(mundo, aoFim) {
    var b = MUNDOS[mundo].boss;
    function quadro(c, t, fala, quem, entrando) {
      fundoArena(c, b.tipo, t);
      var bx = 690 + (entrando ? (1 - Math.min(1, t / 0.7)) * 420 : 0);
      Boss.retrato(c, b.tipo, bx, 200, 0.62, quem === 'boss' ? (fala === 2 ? 'prepara' : 'neutro') : 'neutro', t);
      umaPeca(c, mundo, bx - 200, 130 + Math.sin(t * 3) * 8, 0.85, t);
      Arte.concreto(c, 200, 470, { w: 96, h: 112, dir: 1, t: t, pose: quem === 'concreto' ? 'dispara' : fala === 0 ? 'susto' : 'parado', espichar: Math.sin(t * 4) * 0.06 });
      Arte.texto(c, b.nome, 690, 36, 24, '#f2fbf4');
      if (!entrando || t > 0.7) {
        if (quem === 'boss') balao(c, 440, 250, b.conversa[fala], 560, entrando ? t - 0.7 : t);
        else balao(c, 400, 270, b.conversa[fala], 270, t, '#1d6b1a');
      }
    }
    return criar([
      { dur: 4.5, desenhar: function (c, t) { quadro(c, t, 0, 'boss', true); } },
      { dur: 3.2, desenhar: function (c, t) { quadro(c, t, 1, 'concreto'); } },
      { dur: 4, desenhar: function (c, t) { quadro(c, t, 2, 'boss'); } }
    ], aoFim);
  }

  // Depois do boss: ele se rende, a peça volta para o Concreto e entra no lugar na nave.
  function depoisDoBoss(mundo, tem, aoFim) {
    var b = MUNDOS[mundo].boss, antes = tem.slice(); antes[mundo] = false;
    var faltam = MUNDOS.filter(function (m, i) { return !tem[i]; }).map(function (m) { return m.boss.peca; });
    return criar([
      { dur: 4, desenhar: function (c, t) {
        fundoArena(c, b.tipo, t);
        Boss.retrato(c, b.tipo, 690, 215, 0.62, 'cansado', t);
        umaPeca(c, mundo, 490, 130 + Math.sin(t * 3) * 8, 0.85, t);
        Arte.concreto(c, 200, 470, { w: 96, h: 112, dir: 1, t: t, pose: 'parado', espichar: Math.sin(t * 4) * 0.06 });
        balao(c, 440, 250, b.rendicao, 560, t);
      } },
      { dur: 3.5, texto: ['Peça recuperada: ' + b.peca + '!'], desenhar: function (c, t, k) {
        fundoArena(c, b.tipo, t);
        Boss.retrato(c, b.tipo, 690, 215, 0.62, 'cansado', t);
        var q = Math.min(1, k * 2.2), px = 490 + (210 - 490) * q, py = 130 + (290 - 130) * q - Math.sin(q * Math.PI) * 90;
        Arte.concreto(c, 200, 470 - (q >= 1 ? Math.abs(Math.sin(t * 8)) * 26 : 0), { w: 96, h: 112, dir: 1, t: t, pose: 'feliz', espichar: q >= 1 ? Math.sin(t * 16) * 0.2 : 0 });
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
  }

  // Final: a nave completa, a despedida e a decolagem.
  function final(aoFim) {
    var todas = [true, true, true, true, true];
    function chao(c, t) {
      Arte.temas.plantas.fundo(c, 300, t);
      c.fillStyle = Arte.PALETA_PLANTAS.topo; c.fillRect(0, 400, W, 30); c.fillStyle = Arte.PALETA_PLANTAS.terra; c.fillRect(0, 420, W, H);
    }
    return criar([
      { dur: 5, texto: ['O Concreto juntou as cinco peças', 'e consertou a nave!'], desenhar: function (c, t, k) {
        chao(c, t);
        for (var i = 0; i < 5; i++) { // as peças chegam uma a uma
          var q = Math.min(1, Math.max(0, (k * 6 - i * 0.8)));
          if (q > 0 && q < 1) umaPeca(c, i, W / 2 + (i - 2) * 220 * (1 - q), 330 - (1 - q) * 300, 0.9, t);
        }
        Arte.nave(c, W / 2, 330, 1.3, todas.map(function (v, i) { return k * 6 - i * 0.8 >= 1; }), t);
        if (k > 0.9) brilhos(c, W / 2, 320, 170, t, 12);
        Arte.concreto(c, 200, 404, { w: 70, h: 82, dir: 1, t: t, pose: 'feliz', espichar: Math.sin(t * 10) * 0.15 });
      } },
      { dur: 6, texto: ['Os chefes vieram se despedir.', 'Até que eles não eram tão maus assim!'], desenhar: function (c, t, k) {
        chao(c, t);
        MUNDOS.forEach(function (m, i) { Boss.retrato(c, m.boss.tipo, 110 + i * 185, 250 - Math.abs(Math.sin(t * 3 + i)) * 14, 0.34, 'neutro', t + i); });
        Arte.nave(c, W / 2, 110, 0.8, todas, t);
        Arte.concreto(c, W / 2, 404 - Math.abs(Math.sin(t * 5)) * 30, { w: 60, h: 70, dir: 1, t: t, pose: 'feliz' });
      } },
      { dur: 6, texto: ['A nave decolou.', 'O Concreto voltou para casa. Obrigado pela ajuda!'], desenhar: function (c, t, k) {
        var sobe = k * k;
        if (k < 0.45) chao(c, t); else espaco(c, t);
        if (k >= 0.45) planeta(c, 380 + (k - 0.45) * 500);
        var y = k < 0.45 ? 330 - sobe * 900 : 420 - (k - 0.45) * 520, e = k < 0.45 ? 1.3 : 1.3 - (k - 0.45) * 1.2;
        Arte.nave(c, W / 2 + Math.sin(t * 2) * 20, y, Math.max(0.3, e), todas, t, true);
        Arte.concreto(c, W / 2 + Math.sin(t * 2) * 20, y + 4, { w: 32 * Math.max(0.3, e), h: 38 * Math.max(0.3, e), dir: 1, t: t, semSombra: true, pose: 'feliz' });
      } },
      { dur: 5, desenhar: function (c, t) {
        espaco(c, t);
        brilhos(c, W / 2, 230, 150, t, 14);
        Arte.texto(c, 'FIM', W / 2, 230, 110, '#fff27a', 'center', 800);
        Arte.texto(c, 'História provisória: o criador ainda vai inventar a dele.', W / 2, 420, 16, '#d0c8e8', 'center', 600);
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
    if (cena.t > 0.8 && Math.floor(cena.total * 2) % 3 !== 0) Arte.texto(c, 'Toque ou aperte Enter', W / 2, H - 16, 15, '#fff27a', 'center', 700);
    for (var i = 0; i < cena.passos.length && cena.passos.length > 1; i++) {
      c.fillStyle = i === cena.i ? '#fff27a' : 'rgba(255,255,255,0.4)'; c.beginPath(); c.arc(24 + i * 16, 28, 4.5, 0, 7); c.fill();
    }
  }

  return { atualizar: atualizar, desenhar: desenhar, abertura: abertura, mapa: mapa, antesDoBoss: antesDoBoss, depoisDoBoss: depoisDoBoss, final: final };
})();
