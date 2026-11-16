// Desenhos feitos por código (sem imagens), seguindo as pranchas de assets/concept-art:
// "Estudos de personagem" (alternativa A, verde) e "Storyboard do Mundo 1: Plantas".
// As pranchas são estudos ainda não aprovados; o visual continua PROVISÓRIO.
var Arte = (function () {
  var W = CFG.largura, H = CFG.altura;

  function mistura(a, b, t) {
    var r = [];
    for (var i = 0; i < 3; i++) r.push(Math.round(a[i] + (b[i] - a[i]) * t));
    return 'rgb(' + r.join(',') + ')';
  }
  function acaso(i) { // número "aleatório" que é sempre o mesmo para o mesmo i
    var x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function retArred(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  // Céu com dia e noite. noite: 0 = dia, 1 = noite.
  function ceu(c, noite, t) {
    var g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mistura([70, 178, 236], [14, 22, 58], noite));
    g.addColorStop(0.7, mistura([170, 232, 240], [40, 58, 96], noite));
    g.addColorStop(1, mistura([206, 246, 214], [44, 70, 92], noite));
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    if (noite > 0.05) {
      c.fillStyle = 'rgba(255,255,240,' + (0.85 * noite) + ')';
      for (var i = 0; i < 60; i++) {
        var px = acaso(i) * W, py = acaso(i + 99) * H * 0.6;
        var r = 0.8 + acaso(i + 7) * 1.4 + Math.sin(t * 2 + i) * 0.3;
        c.beginPath(); c.arc(px, py, Math.max(0.3, r), 0, 7); c.fill();
      }
    } else {
      c.fillStyle = 'rgba(255,255,255,0.75)';
      for (var k = 0; k < 4; k++) {
        var nx = ((k * 310 + t * 6) % (W + 300)) - 150, ny = 50 + acaso(k) * 90;
        c.beginPath();
        c.arc(nx, ny, 22, 0, 7); c.arc(nx + 26, ny - 10, 28, 0, 7); c.arc(nx + 58, ny, 22, 0, 7);
        c.fill();
      }
    }
  }

  function flor(c, x, y, r) {
    c.fillStyle = '#ff5fa8'; c.strokeStyle = '#c22a72'; c.lineWidth = 2;
    for (var i = 0; i < 5; i++) {
      var a = i * Math.PI * 2 / 5 - 1.2;
      c.beginPath(); c.ellipse(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.62, r * 0.44, a, 0, 7);
      c.fill(); c.stroke();
    }
    c.fillStyle = '#ffd84a';
    c.beginPath(); c.arc(x, y, r * 0.28, 0, 7); c.fill();
  }

  // Mundo das plantas: selva com montanhas, cachoeira, copas, cipós e flores.
  function fundoPlantas(c, camX, noite) {
    var i, x;
    // montanhas distantes
    c.fillStyle = mistura([122, 205, 214], [30, 52, 86], noite);
    c.beginPath(); c.moveTo(0, H);
    for (x = 0; x <= W; x += 16) {
      var wx = x + camX * 0.1;
      c.lineTo(x, 300 - Math.abs(Math.sin(wx * 0.004)) * 110 - Math.sin(wx * 0.013) * 22);
    }
    c.lineTo(W, H); c.fill();
    // cachoeiras
    var f1 = 0.22, esp1 = 900, ini1 = Math.floor((camX * f1 - 200) / esp1);
    for (i = ini1; i < ini1 + 3; i++) {
      x = i * esp1 + 420 - camX * f1;
      c.fillStyle = mistura([98, 176, 150], [28, 56, 74], noite);
      retArred(c, x - 60, 210, 190, 300, 30); c.fill();
      c.fillStyle = mistura([120, 214, 244], [50, 92, 140], noite);
      c.fillRect(x, 226, 54, 300);
      c.fillStyle = 'rgba(255,255,255,0.55)';
      c.fillRect(x + 8, 226, 6, 300); c.fillRect(x + 30, 226, 9, 300);
    }
    // copas de árvores (meio)
    var f2 = 0.35, esp2 = 120, ini2 = Math.floor((camX * f2 - 150) / esp2);
    c.fillStyle = mistura([44, 150, 92], [20, 52, 62], noite);
    for (i = ini2; i < ini2 + 11; i++) {
      x = i * esp2 - camX * f2;
      c.beginPath(); c.arc(x, 400 - acaso(i) * 50, 78 + acaso(i + 5) * 40, 0, 7); c.fill();
    }
    c.fillRect(0, 400, W, H);
    // troncos com cipó e folhagem próxima
    var f3 = 0.6, esp3 = 520, ini3 = Math.floor((camX * f3 - 300) / esp3);
    for (i = ini3; i < ini3 + 4; i++) {
      x = i * esp3 + acaso(i) * 200 - camX * f3;
      c.fillStyle = mistura([150, 96, 52], [50, 40, 52], noite);
      c.strokeStyle = mistura([98, 58, 30], [30, 24, 36], noite); c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x - 22, -10); c.quadraticCurveTo(x - 8, 240, x - 34, 480);
      c.lineTo(x + 40, 480); c.quadraticCurveTo(x + 14, 240, x + 30, -10);
      c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = mistura([58, 160, 60], [24, 62, 56], noite); c.lineWidth = 5;
      c.beginPath(); c.moveTo(x - 20, 60);
      c.bezierCurveTo(x + 40, 120, x - 40, 200, x + 24, 280); c.stroke();
    }
    var f4 = 0.6, esp4 = 150, ini4 = Math.floor((camX * f4 - 150) / esp4);
    for (i = ini4; i < ini4 + 9; i++) {
      x = i * esp4 + acaso(i + 40) * 60 - camX * f4;
      c.fillStyle = mistura([70, 186, 78], [26, 70, 62], noite);
      c.beginPath(); c.arc(x, 452, 44 + acaso(i + 2) * 22, 0, 7); c.fill();
      c.fillStyle = mistura([112, 214, 84], [34, 88, 70], noite);
      c.beginPath(); c.ellipse(x + 30, 430, 34, 12, -0.5, 0, 7); c.fill();
      c.beginPath(); c.ellipse(x - 26, 436, 30, 11, 0.6, 0, 7); c.fill();
      if (i % 3 === 0) { c.globalAlpha = 1 - noite * 0.45; flor(c, x + 6, 418, 15); c.globalAlpha = 1; }
    }
    // copa no alto da tela, com cipós pendurados
    var f5 = 0.8, esp5 = 90, ini5 = Math.floor((camX * f5 - 100) / esp5);
    for (i = ini5; i < ini5 + 14; i++) {
      x = i * esp5 - camX * f5;
      if (i % 2 === 0) {
        var comp = 40 + acaso(i + 9) * 70;
        c.strokeStyle = mistura([46, 140, 52], [20, 56, 50], noite); c.lineWidth = 4;
        c.beginPath(); c.moveTo(x + 20, 0); c.quadraticCurveTo(x + 34, comp * 0.6, x + 22, comp); c.stroke();
        c.fillStyle = mistura([96, 204, 70], [30, 84, 66], noite);
        c.beginPath(); c.ellipse(x + 22, comp + 6, 7, 11, 0.3, 0, 7); c.fill();
      }
      c.fillStyle = mistura([40, 138, 58], [16, 48, 46], noite);
      c.beginPath(); c.arc(x, -14, 56 + acaso(i + 1) * 18, 0, 7); c.fill();
    }
  }

  // Plataforma: corpo com tijolinhos e cobertura com franja. As cores vêm do tema do mundo.
  var PALETA_PLANTAS = { terra: '#ba6834', terraEsc: '#783e1e', topo: '#78d628', topoEsc: '#2c841c', topoLuz: '#bef460' };
  var CORES_BLOCO = ['#e8364a', '#2f7de0', '#f5c62a', '#3fb24a'], CORES_BLOCO_ESC = ['#8a1226', '#143f86', '#a06a08', '#1c6426'];
  function plataforma(c, p, camX, pal) {
    pal = pal || PALETA_PLANTAS;
    var x = Math.round(p.x - camX), y = Math.round(p.y);
    if (x > W || x + p.w < 0) return;
    var alt = p.chao ? H - y + 10 : p.h + 8, k;
    if (pal.blocos) { // mundo dos blocos: peças coloridas com pinos
      var nb = Math.max(1, Math.round(p.w / 46)), lb = p.w / nb;
      for (var by = 0, lin = 0; by < alt; by += 34, lin++) {
        for (k = 0; k < nb; k++) {
          var ci = (Math.floor(p.x / 46) + k + lin * 2) % 4;
          c.fillStyle = CORES_BLOCO[ci]; c.strokeStyle = CORES_BLOCO_ESC[ci]; c.lineWidth = 2.5;
          c.fillRect(x + k * lb, y + by, lb, Math.min(34, alt - by)); c.strokeRect(x + k * lb, y + by, lb, Math.min(34, alt - by));
          if (lin === 0) { retArred(c, x + k * lb + lb * 0.2, y - 8, lb * 0.6, 9, 3); c.fill(); c.stroke(); }
        }
      }
      return;
    }
    c.fillStyle = pal.terra; c.strokeStyle = pal.terraEsc; c.lineWidth = 3;
    retArred(c, x, y, p.w, alt, p.chao ? 4 : 10); c.fill(); c.stroke();
    c.save();
    retArred(c, x, y, p.w, alt, p.chao ? 4 : 10); c.clip();
    c.strokeStyle = pal.terraEsc; c.globalAlpha = 0.55; c.lineWidth = 2;
    if (pal.costura) c.setLineDash([6, 5]);
    for (var ly = y + 30, n = 0; ly < y + alt; ly += 24, n++) {
      c.beginPath(); c.moveTo(x, ly); c.lineTo(x + p.w, ly); c.stroke();
      for (var lx = (n % 2) * 24 + 12; lx < p.w; lx += 48) {
        c.beginPath(); c.moveTo(x + lx, ly - 24); c.lineTo(x + lx, ly); c.stroke();
      }
    }
    c.restore();
    c.fillStyle = pal.topo; c.strokeStyle = pal.topoEsc; c.lineWidth = 3;
    c.beginPath();
    c.moveTo(x - 5, y + 8);
    c.lineTo(x - 5, y - 4); c.quadraticCurveTo(x - 5, y - 10, x + 3, y - 10);
    c.lineTo(x + p.w - 3, y - 10); c.quadraticCurveTo(x + p.w + 5, y - 10, x + p.w + 5, y - 4);
    c.lineTo(x + p.w + 5, y + 8);
    var nf = Math.max(2, Math.round((p.w + 10) / 22)), lf = (p.w + 10) / nf;
    for (k = 0; k < nf; k++) {
      var x0 = x + p.w + 5 - k * lf;
      c.quadraticCurveTo(x0 - lf / 2, y + 20 + acaso(p.w + k) * 6, x0 - lf, y + 8);
    }
    c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = pal.topoLuz; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x + 4, y - 5); c.lineTo(x + p.w - 4, y - 5); c.stroke();
  }

  // Almofada/mola: pisar nela joga o Concreto para o alto.
  function mola(c, x, y, w, aperto, cor, corEsc) {
    var a = 14 * (1 - aperto * 0.6);
    c.fillStyle = cor || '#ff7ab8'; c.strokeStyle = corEsc || '#a3246a'; c.lineWidth = 3;
    retArred(c, x, y - a, w, a + 2, 7); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x + 8, y - a + 4); c.lineTo(x + w - 8, y - a + 4); c.stroke();
    c.fillStyle = '#fff27a';
    c.beginPath(); c.moveTo(x + w / 2, y - a - 22 - Math.sin(Date.now() / 150) * 3);
    c.lineTo(x + w / 2 - 9, y - a - 10); c.lineTo(x + w / 2 + 9, y - a - 10); c.closePath(); c.fill();
  }

  // Concreto visto de lado. (x, y) = meio dos pés.
  // Segue a alternativa A da prancha de estudos: geleca verde-limão de contorno grosso,
  // topo que tomba para o lado (P02), barra de baixo escorrendo, olhos pretos grandes e boca aberta.
  function concreto(c, x, y, o) {
    o = o || {};
    var dir = o.dir || 1, t = o.t || 0, esp = o.espichar || 0; // esp > 0 estica (pulo), < 0 achata
    var ww = (o.w || 48) * 1.3 * (1 - esp * 0.18), hh = (o.h || 58) * 0.95 * (1 + esp * 0.22);
    var bal = Math.sin(t * 5) * 0.025;               // o topo balança como gelatina
    var cai = Math.sin(t * 5 + 1) * 0.02;            // a ponta tombada sobe e desce
    function U(v) { return v * ww; }
    function V(v) { return v * hh; }
    var fundos = [0.035, 0.07, 0.02, 0.06], cortes = [0.50, 0.23, -0.03, -0.30, -0.56];
    function corpo() {
      c.beginPath();
      c.moveTo(U(-0.56), V(-0.06));
      c.bezierCurveTo(U(-0.50), V(-0.30), U(-0.44 + bal), V(-0.55), U(-0.36 + bal), V(-0.74));
      c.bezierCurveTo(U(-0.28 + bal), V(-0.96), U(-0.10 + bal), V(-1.05), U(0.06 + bal), V(-1.0));
      c.bezierCurveTo(U(0.22 + bal), V(-0.97), U(0.38 + bal), V(-0.96), U(0.48 + bal), V(-0.86 + cai));
      c.bezierCurveTo(U(0.59 + bal), V(-0.78 + cai), U(0.58 + bal), V(-0.58 + cai), U(0.48 + bal), V(-0.57 + cai));
      c.bezierCurveTo(U(0.42 + bal), V(-0.56 + cai), U(0.41), V(-0.66), U(0.36), V(-0.66));
      c.bezierCurveTo(U(0.41), V(-0.45), U(0.46), V(-0.25), U(0.50), V(-0.06));
      for (var i = 0; i < 4; i++) { // quatro pingos arredondados, de tamanhos diferentes
        var d = fundos[i] + Math.sin(t * 4 + i * 1.9) * 0.012;
        c.bezierCurveTo(U(cortes[i]), V(d), U(cortes[i + 1]), V(d), U(cortes[i + 1]), V(i === 3 ? -0.06 : -0.11));
      }
      c.closePath();
    }
    c.save();
    c.translate(x, y);
    if (!o.semSombra) {
      c.fillStyle = 'rgba(60,40,110,0.2)';
      c.beginPath(); c.ellipse(0, 3, ww * 0.52, hh * 0.07, 0, 0, 7); c.fill();
    }
    c.scale(dir, 1);
    var g = c.createLinearGradient(0, -hh, 0, 0);
    g.addColorStop(0, CFG.concreto.clara);
    g.addColorStop(0.55, CFG.concreto.cor);
    g.addColorStop(1, CFG.concreto.funda);
    corpo(); c.fillStyle = g; c.fill();
    c.save();
    corpo(); c.clip();
    c.fillStyle = 'rgba(' + CFG.concreto.mancha + ',0.5)';             // manchas mais escuras
    c.beginPath(); c.ellipse(U(-0.34), V(-0.2), U(0.15), V(0.13), 0.3, 0, 7); c.fill();
    c.beginPath(); c.ellipse(U(0.34), V(-0.16), U(0.1), V(0.1), 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(U(-0.02), V(-0.06), U(0.09), V(0.06), 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(' + CFG.concreto.luz + ',0.75)';          // pintinhas claras
    c.beginPath(); c.arc(U(-0.2), V(-0.42), U(0.035), 0, 7); c.fill();
    c.beginPath(); c.arc(U(-0.27), V(-0.56), U(0.022), 0, 7); c.fill();
    c.beginPath(); c.arc(U(0.3), V(-0.42), U(0.025), 0, 7); c.fill();
    c.strokeStyle = 'rgba(' + CFG.concreto.luz + ',0.9)'; c.lineWidth = U(0.055); c.lineCap = 'round'; // brilho
    c.beginPath(); c.moveTo(U(-0.33 + bal), V(-0.62));
    c.quadraticCurveTo(U(-0.27 + bal), V(-0.86), U(-0.1 + bal), V(-0.92)); c.stroke();
    c.beginPath(); c.moveTo(U(0.3 + bal), V(-0.88)); c.lineTo(U(0.42 + bal), V(-0.82 + cai)); c.stroke();
    c.restore();
    corpo();
    c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = Math.max(3, ww * 0.06); c.lineJoin = 'round'; c.stroke();
    // rosto
    var fx = 0.07 + bal * 0.6, oy = -0.6;
    var pisca = (t % 3.4) < 0.12;
    c.lineCap = 'round';
    [-1, 1].forEach(function (s) {
      var ex = U(fx + s * 0.135), ey = V(oy), rx = U(0.062), ry = pisca ? V(0.012) : V(0.125);
      if (o.dano) { // levou um golpe: olhos apertados
        c.strokeStyle = '#10200c'; c.lineWidth = Math.max(2.5, ww * 0.05);
        c.beginPath(); c.moveTo(ex - s * rx * 1.2, ey - ry * 0.6); c.lineTo(ex + s * rx * 0.9, ey); c.lineTo(ex - s * rx * 1.2, ey + ry * 0.6); c.stroke();
        return;
      }
      c.fillStyle = '#10200c';
      c.beginPath(); c.ellipse(ex, ey, rx, ry, 0, 0, 7); c.fill();
      if (!pisca) {
        c.fillStyle = '#fff';
        c.beginPath(); c.ellipse(ex + rx * 0.1, ey - ry * 0.45, rx * 0.5, ry * 0.3, 0, 0, 7); c.fill();
      }
      c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = Math.max(2, ww * 0.04); // sobrancelhas decididas
      var b = o.atacando ? 0.05 : 0;
      c.beginPath();
      c.moveTo(ex + s * U(0.07), ey - V(0.21 - b * 0.4));
      c.lineTo(ex - s * U(0.05), ey - V(0.16 - b));
      c.stroke();
    });
    // boca aberta, com língua
    var m = U(o.atacando ? 0.11 : 0.095), my = V(-0.4), md = V(o.atacando ? 0.24 : 0.19);
    c.beginPath();
    c.moveTo(U(fx) - m, my); c.quadraticCurveTo(U(fx), my + md * 0.12, U(fx) + m, my);
    c.bezierCurveTo(U(fx) + m, my + md * 1.3, U(fx) - m, my + md * 1.3, U(fx) - m, my);
    c.closePath();
    c.fillStyle = '#6b1535'; c.fill();
    c.save(); c.clip();
    c.fillStyle = '#ff6fa0';
    c.beginPath(); c.ellipse(U(fx), my + md * 1.02, m * 0.8, md * 0.45, 0, 0, 7); c.fill();
    c.restore();
    c.restore();
  }

  function gota(c, x, y, r) {
    c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = Math.max(1.5, r * 0.28);
    c.beginPath();
    c.moveTo(x, y - r * 1.7);
    c.bezierCurveTo(x + r * 1.3, y - r * 0.1, x + r * 0.9, y + r * 0.8, x, y + r * 0.8);
    c.bezierCurveTo(x - r * 0.9, y + r * 0.8, x - r * 1.3, y - r * 0.1, x, y - r * 1.7);
    c.fill(); c.stroke();
    c.fillStyle = 'rgba(' + CFG.concreto.luz + ',0.9)';
    c.beginPath(); c.arc(x - r * 0.3, y + r * 0.1, r * 0.2, 0, 7); c.fill();
  }

  function poca(c, x, y, a) {
    c.globalAlpha = a;
    c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = 2;
    c.beginPath(); c.ellipse(x, y - 2, 12, 4, 0, 0, 7); c.fill(); c.stroke();
    c.globalAlpha = 1;
  }

  // Monstros do Mundo 1 (prancha P02): quatro aparências, mesmo comportamento. (x, y) = meio dos pés.
  var formas = {};
  var CORES_MONSTRO = { espinho: '#a45cf0', planta: '#e8364a', cogumelo: '#e8364a', semente: '#f5c62a' };
  function corMonstro(tipo) { return CORES_MONSTRO[tipo] || CORES_MONSTRO.espinho; }

  function olhosBravos(c, dir, cx, cy, esc, corOlho) {
    [-1, 1].forEach(function (s) {
      var ex = cx + dir * 3 + s * 9 * esc;
      c.fillStyle = corOlho || '#fff'; c.strokeStyle = '#2a1050'; c.lineWidth = 2;
      c.beginPath(); c.ellipse(ex, cy, 6.5 * esc, 7 * esc, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#2a1050';
      c.beginPath(); c.arc(ex + dir * 2 - s * 1.5, cy + 1, 2.8 * esc, 0, 7); c.fill();
      c.lineWidth = 3.5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(ex + s * 8 * esc, cy - 12 * esc); c.lineTo(ex - s * 5 * esc, cy - 6 * esc); c.stroke();
    });
  }

  function monstro(c, x, y, m, t) {
    var dir = m.olha, bal = Math.sin(t * 3 + m.x) * 1.5, i;
    c.save();
    c.translate(x, y);
    if (m.piscando > 0) c.globalAlpha = 0.5;
    c.fillStyle = 'rgba(60,40,110,0.2)';
    c.beginPath(); c.ellipse(0, 2, 28, 5, 0, 0, 7); c.fill();
    c.lineJoin = 'round'; c.lineCap = 'round';
    if (formas[m.tipo]) {                // monstros dos outros mundos (temas.js)
      formas[m.tipo](c, dir, bal, t, m);
    } else if (m.tipo === 'planta') {            // Planta Mordedora
      c.strokeStyle = '#2c7a1b'; c.lineWidth = 6;
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-dir * 8, -14, 0, -24); c.stroke();
      c.fillStyle = '#58c02e'; c.lineWidth = 2.5;
      c.beginPath(); c.ellipse(-16, -6, 15, 7, 0.5, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(16, -6, 15, 7, -0.5, 0, 7); c.fill(); c.stroke();
      var ab = 0.35 + Math.abs(Math.sin(t * 3 + m.x)) * 0.25;
      c.save(); c.translate(0, -36 + bal); c.scale(dir, 1);
      c.fillStyle = '#7a1024';
      c.beginPath(); c.arc(0, 0, 21, 0, 7); c.fill();
      c.fillStyle = '#e8364a'; c.strokeStyle = '#8a1226'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 24, ab, Math.PI * 2 - ab); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#fff';
      for (i = 0; i < 3; i++) {
        var q = 7 + i * 6;
        c.beginPath(); c.moveTo(q, -Math.tan(ab) * q); c.lineTo(q + 3, -Math.tan(ab) * q + 7); c.lineTo(q + 6, -Math.tan(ab) * (q + 6)); c.fill();
        c.beginPath(); c.moveTo(q, Math.tan(ab) * q); c.lineTo(q + 3, Math.tan(ab) * q - 7); c.lineTo(q + 6, Math.tan(ab) * (q + 6)); c.fill();
      }
      c.fillStyle = '#fff'; c.beginPath(); c.arc(-6, -13, 3, 0, 7); c.arc(-14, -4, 2.2, 0, 7); c.fill();
      c.strokeStyle = '#2a1050'; c.lineWidth = 3.5;
      c.beginPath(); c.moveTo(-4, -20); c.lineTo(8, -15); c.stroke();
      c.restore();
    } else if (m.tipo === 'cogumelo') {   // Cogumelo Saltador
      c.fillStyle = '#fbe9c6'; c.strokeStyle = '#9a7440'; c.lineWidth = 3;
      retArred(c, -15, -30, 30, 30, 10); c.fill(); c.stroke();
      c.fillStyle = '#e8364a'; c.strokeStyle = '#8a1226';
      c.beginPath(); c.moveTo(-30, -26 + bal);
      c.bezierCurveTo(-30, -64 + bal, 30, -64 + bal, 30, -26 + bal);
      c.quadraticCurveTo(0, -18 + bal, -30, -26 + bal); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(-14, -40 + bal, 5.5, 0, 7); c.arc(10, -46 + bal, 6.5, 0, 7); c.arc(20, -32 + bal, 3.5, 0, 7); c.fill();
      olhosBravos(c, dir, 0, -15, 0.72);
      c.strokeStyle = '#2a1050'; c.lineWidth = 2;
      c.beginPath(); c.arc(dir * 3, -3, 4, Math.PI + 0.5, -0.5); c.stroke();
    } else if (m.tipo === 'semente') {    // Semente Brotante
      c.strokeStyle = '#2c7a1b'; c.lineWidth = 4;
      c.beginPath(); c.moveTo(0, -40); c.lineTo(0, -52 + bal); c.stroke();
      c.fillStyle = '#58c02e'; c.lineWidth = 2.5;
      c.beginPath(); c.ellipse(-11, -56 + bal, 12, 7, 0.6, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(11, -56 + bal, 12, 7, -0.6, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#f5c62a'; c.strokeStyle = '#a06a08'; c.lineWidth = 3;
      c.beginPath(); c.ellipse(0, -21, 23, 21 + bal * 0.4, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,244,170,0.8)';
      c.beginPath(); c.ellipse(-dir * 9, -31, 7, 4, -0.4 * dir, 0, 7); c.fill();
      olhosBravos(c, dir, 0, -23, 0.85);
      c.strokeStyle = '#2a1050'; c.lineWidth = 2.5;
      c.beginPath(); c.arc(dir * 3, -7, 5, Math.PI + 0.5, -0.5); c.stroke();
    } else {                              // Espinho
      c.fillStyle = '#a45cf0'; c.strokeStyle = '#4a1f8a'; c.lineWidth = 3;
      c.beginPath();
      var n = 11, cy = -24;
      for (i = 0; i <= n * 2; i++) {
        var a = Math.PI + (i / (n * 2)) * Math.PI * 2;
        var ponta = i % 2 === 1, baixo = Math.sin(a) > 0.55;
        var r = ponta && !baixo ? 33 + bal : 24;
        var px = Math.cos(a) * r * 1.08, py = cy + Math.sin(a) * r * (baixo ? 1 : 0.95);
        if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(214,170,255,0.7)';
      c.beginPath(); c.ellipse(-dir * 8, -36, 9, 5, -0.4 * dir, 0, 7); c.fill();
      olhosBravos(c, dir, 0, -25, 1);
      c.strokeStyle = '#2a1050'; c.lineWidth = 2.5;
      c.beginPath(); c.arc(dir * 4, -8, 6, Math.PI + 0.5, -0.5); c.stroke();
    }
    // percebeu o Concreto: sinal de alerta, e a faca aparece (I04)
    if (m.estado === 'preparando' && m.tempo < 0.35) {
      c.strokeStyle = '#ffd84a'; c.lineWidth = 4;
      [-0.5, 0, 0.5].forEach(function (g) {
        c.beginPath(); c.moveTo(Math.sin(g) * 40, -62 - Math.cos(g) * 6); c.lineTo(Math.sin(g) * 54, -62 - Math.cos(g) * 20); c.stroke();
      });
    }
    if (m.estado !== 'calmo') {
      var av = 0;
      if (m.estado === 'preparando') av = -8 * Math.min(1, m.tempo / 0.3);
      if (m.estado === 'golpe') av = CFG.monstro.alcanceFaca - 22;
      c.save();
      c.translate(dir * (24 + av), -20);
      c.scale(dir, 1);
      c.fillStyle = '#8a5a2a'; c.strokeStyle = '#4a2c10'; c.lineWidth = 2;
      retArred(c, -8, -5, 13, 10, 3); c.fill(); c.stroke();
      c.fillStyle = '#f1f5f9'; c.strokeStyle = '#55657a';
      c.beginPath(); c.moveTo(5, -6); c.lineTo(24, -6); c.lineTo(33, 0); c.lineTo(24, 6); c.lineTo(5, 6); c.closePath();
      c.fill(); c.stroke();
      c.restore();
    }
    c.restore();
  }

  // Coletável (PROVISÓRIO): gotinha brilhante.
  function gotinha(c, x, y, t) {
    c.save(); c.translate(x, y); c.scale(Math.cos(t * 3) * 0.25 + 0.85, 1);
    c.fillStyle = 'rgba(234,255,160,0.35)'; c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fill();
    gota(c, 0, 3, 8);
    c.restore();
  }

  function coracao(c, x, y, r, cheio) {
    c.beginPath();
    c.moveTo(x, y + r * 0.9);
    c.bezierCurveTo(x - r * 1.5, y - r * 0.1, x - r * 0.9, y - r * 1.2, x, y - r * 0.45);
    c.bezierCurveTo(x + r * 0.9, y - r * 1.2, x + r * 1.5, y - r * 0.1, x, y + r * 0.9);
    c.closePath();
    c.fillStyle = cheio ? '#ff4f7b' : 'rgba(40,20,60,0.35)'; c.fill();
    c.strokeStyle = cheio ? '#a3123c' : 'rgba(255,255,255,0.5)'; c.lineWidth = Math.max(2, r * 0.2); c.lineJoin = 'round'; c.stroke();
    if (cheio) { c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.ellipse(x - r * 0.4, y - r * 0.35, r * 0.22, r * 0.14, -0.6, 0, 7); c.fill(); }
  }

  // Escudo de geleca (PROVISÓRIO): bolha que aguenta um golpe.
  function bolha(c, x, y, r, t) {
    c.fillStyle = 'rgba(150,225,255,0.22)'; c.strokeStyle = 'rgba(210,245,255,0.95)'; c.lineWidth = Math.max(2, r * 0.08);
    c.beginPath(); c.arc(x, y, r + Math.sin(t * 5) * r * 0.04, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = Math.max(2, r * 0.1); c.lineCap = 'round';
    c.beginPath(); c.arc(x, y, r * 0.72, -2.4, -1.7); c.stroke();
  }

  function bandeira(c, x, y, ativa, t) {
    c.fillStyle = '#8a5a2a'; c.fillRect(x - 3, y - 92, 6, 92);
    var o = Math.sin(t * 5) * 4;
    c.fillStyle = ativa ? CFG.concreto.cor : '#d8d4e6'; c.strokeStyle = ativa ? CFG.concreto.corEscura : '#7a7490'; c.lineWidth = 3; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(x + 3, y - 90); c.quadraticCurveTo(x + 26, y - 96 + o, x + 48, y - 80 + o);
    c.quadraticCurveTo(x + 26, y - 70 + o, x + 3, y - 60); c.closePath(); c.fill(); c.stroke();
  }
  function gotaDourada(c, x, y, t) {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(255,220,90,' + (0.3 + Math.sin(t * 5) * 0.12) + ')'; c.beginPath(); c.arc(0, 0, 24, 0, 7); c.fill();
    c.fillStyle = '#ffd23a'; c.strokeStyle = '#a06a08'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(0, -20); c.bezierCurveTo(16, -1, 11, 13, 0, 13); c.bezierCurveTo(-11, 13, -16, -1, 0, -20); c.fill(); c.stroke();
    c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(-4, 2, 3, 0, 7); c.fill();
    c.restore();
  }

  // Placa de madeira com dica.
  function placa(c, x, y, s) {
    c.font = '700 15px "Trebuchet MS", "Segoe UI", system-ui, sans-serif';
    var w = c.measureText(s).width + 26;
    c.fillStyle = '#8a5a2a'; c.fillRect(x - 5, y - 44, 10, 44);
    c.fillStyle = '#c98a4a'; c.strokeStyle = '#6b3f18'; c.lineWidth = 3;
    retArred(c, x - w / 2, y - 84, w, 42, 8); c.fill(); c.stroke();
    c.fillStyle = '#3d2109'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(s, x, y - 62);
  }

  // Raio de geleca: jato comprido com respingos, como na prancha.
  function raio(c, x, y, dir, t) {
    c.save();
    c.translate(x, y); c.scale(dir, 1);
    var o = Math.sin(t * 30) * 1.5;
    c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = 2.5; c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(-34, 0);
    c.bezierCurveTo(-22, -7 - o, -4, -5 + o, 6, -9);
    c.bezierCurveTo(22, -11, 24, 11, 6, 9);
    c.bezierCurveTo(-4, 5 - o, -22, 7 + o, -34, 0);
    c.fill(); c.stroke();
    c.fillStyle = 'rgba(' + CFG.concreto.luz + ',0.9)';
    c.beginPath(); c.ellipse(6, -3, 6, 2, 0, 0, 7); c.fill();
    c.fillStyle = CFG.concreto.cor;
    [[-40, -8, 3.5], [-48, 5, 2.5], [-26, 11, 2.5], [-30, -12, 2]].forEach(function (p) {
      c.beginPath(); c.arc(p[0], p[1] + o, p[2], 0, 7); c.fill(); c.stroke();
    });
    c.restore();
  }

  // Portal: arco de pedra com folhas e espiral roxa.
  function portal(c, x, y, t) {
    c.save();
    c.translate(x, y);
    c.strokeStyle = '#ffd84a'; c.lineWidth = 5; c.lineCap = 'round'; // brilho em volta
    for (var r = 0; r < 5; r++) {
      var a = -Math.PI * 0.85 + r * Math.PI * 0.175, k = 96 + Math.sin(t * 4 + r) * 5;
      c.beginPath(); c.moveTo(Math.cos(a) * k, -62 + Math.sin(a) * k);
      c.lineTo(Math.cos(a) * (k + 16), -62 + Math.sin(a) * (k + 16)); c.stroke();
    }
    function arco(l, a) {
      c.beginPath(); c.moveTo(-l, 0); c.lineTo(-l, -a + l);
      c.arc(0, -a + l, l, Math.PI, 0); c.lineTo(l, 0); c.closePath();
    }
    arco(64, 138); c.fillStyle = '#d9c7a4'; c.strokeStyle = '#7a6a52'; c.lineWidth = 3; c.fill(); c.stroke();
    c.lineWidth = 2; // juntas das pedras
    for (var i = 0; i <= 8; i++) {
      var b = Math.PI + i * Math.PI / 8;
      c.beginPath(); c.moveTo(Math.cos(b) * 44, -74 + Math.sin(b) * 44);
      c.lineTo(Math.cos(b) * 64, -74 + Math.sin(b) * 64); c.stroke();
    }
    [-30, -55].forEach(function (yy) {
      c.beginPath(); c.moveTo(-64, yy); c.lineTo(-44, yy); c.moveTo(44, yy); c.lineTo(64, yy); c.stroke();
    });
    arco(44, 118); c.fillStyle = '#5a1fb0'; c.fill(); c.stroke();
    c.save(); arco(44, 118); c.clip();
    var g = c.createRadialGradient(0, -64, 4, 0, -64, 70);
    g.addColorStop(0, '#f4e2ff'); g.addColorStop(0.4, '#b85cff'); g.addColorStop(1, '#4a168f');
    c.fillStyle = g; c.fillRect(-50, -130, 100, 130);
    c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 5;
    c.beginPath();
    for (var s = 0; s < 90; s++) {
      var an = s * 0.22 - t * 2.5, rr = s * 0.62;
      var px = Math.cos(an) * rr, py = -64 + Math.sin(an) * rr * 1.15;
      if (s === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.stroke();
    c.restore();
    c.fillStyle = '#6fd12e'; c.strokeStyle = '#2c7a1b'; c.lineWidth = 2; // folhas
    [[-58, -118, 0.6], [-30, -140, 0.2], [8, -144, -0.2], [44, -130, -0.7], [-66, -16, 1.2], [66, -14, -1.2], [60, -84, -1.1]].forEach(function (f) {
      c.beginPath(); c.ellipse(f[0], f[1], 15, 8, f[2], 0, 7); c.fill(); c.stroke();
    });
    c.restore();
  }

  function texto(c, s, x, y, tam, cor, alinhar, peso, corBorda) {
    c.font = (peso || 700) + ' ' + tam + 'px "Trebuchet MS", "Segoe UI", system-ui, sans-serif';
    c.textAlign = alinhar || 'center';
    c.textBaseline = 'middle';
    c.lineJoin = 'round';
    c.lineWidth = Math.max(3, tam * 0.18);
    c.strokeStyle = corBorda || 'rgba(8,20,16,0.85)';
    c.strokeText(s, x, y);
    c.fillStyle = cor || '#f2fbf4';
    c.fillText(s, x, y);
  }

  // Painel: corações de vida à esquerda, gotinhas coletadas à direita.
  function painel(c, vidas, gotinhas, total, escudo, t) {
    for (var i = 0; i < CFG.vidas; i++) coracao(c, 36 + i * 40, 40, 15, i < vidas);
    if (escudo) bolha(c, 36 + (vidas - 1) * 40, 40, 21, t || 0);
    c.fillStyle = 'rgba(8,20,16,0.4)';
    retArred(c, W - 142, 18, 126, 42, 21); c.fill();
    gota(c, W - 120, 42, 9);
    texto(c, gotinhas + '/' + total, W - 62, 40, 19, '#f2fbf4');
  }

  return {
    mistura: mistura, acaso: acaso, retArred: retArred, ceu: ceu, fundoPlantas: fundoPlantas,
    plataforma: plataforma, concreto: concreto, gota: gota, poca: poca, monstro: monstro, raio: raio,
    portal: portal, texto: texto, painel: painel, flor: flor,
    gotinha: gotinha, coracao: coracao, placa: placa, corMonstro: corMonstro,
    mola: mola, bolha: bolha, bandeira: bandeira, gotaDourada: gotaDourada, formas: formas, coresMonstro: CORES_MONSTRO, olhosBravos: olhosBravos, PALETA_PLANTAS: PALETA_PLANTAS
  };
})();
