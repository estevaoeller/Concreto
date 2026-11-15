// Desenhos feitos por código (sem imagens). Todo o visual é PROVISÓRIO até o criador aprovar.
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
    g.addColorStop(0, mistura([126, 208, 238], [14, 22, 58], noite));
    g.addColorStop(1, mistura([222, 246, 202], [44, 62, 92], noite));
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    if (noite > 0.05) {
      c.fillStyle = 'rgba(255,255,240,' + (0.85 * noite) + ')';
      for (var i = 0; i < 60; i++) {
        var px = acaso(i) * W, py = acaso(i + 99) * H * 0.6;
        var r = 0.8 + acaso(i + 7) * 1.4 + Math.sin(t * 2 + i) * 0.3;
        c.beginPath(); c.arc(px, py, Math.max(0.3, r), 0, 7); c.fill();
      }
    }
  }

  // Mundo das plantas: morros e folhas gigantes ao fundo.
  function fundoPlantas(c, camX, noite) {
    var camadas = [
      { f: 0.15, base: 380, alt: 90, cor: [[142, 205, 150], [34, 62, 78]] },
      { f: 0.35, base: 430, alt: 70, cor: [[92, 176, 112], [26, 52, 62]] }
    ];
    camadas.forEach(function (cm, k) {
      c.fillStyle = mistura(cm.cor[0], cm.cor[1], noite);
      c.beginPath();
      c.moveTo(0, H);
      for (var x = 0; x <= W; x += 20) {
        var wx = x + camX * cm.f;
        var y = cm.base - Math.sin(wx * 0.006 + k * 2) * cm.alt * 0.5 - Math.sin(wx * 0.017 + k) * cm.alt * 0.2;
        c.lineTo(x, y);
      }
      c.lineTo(W, H);
      c.fill();
    });
    // caules e folhas grandes
    var f = 0.6, esp = 260;
    var ini = Math.floor((camX * f - 200) / esp);
    for (var i = ini; i < ini + 7; i++) {
      var x = i * esp + acaso(i) * 120 - camX * f;
      var alt = 150 + acaso(i + 3) * 170;
      c.strokeStyle = mistura([58, 140, 84], [20, 48, 52], noite);
      c.lineWidth = 9;
      c.beginPath();
      c.moveTo(x, 470);
      c.quadraticCurveTo(x + 30, 470 - alt * 0.5, x + 8, 470 - alt);
      c.stroke();
      c.fillStyle = mistura([74, 168, 96], [24, 58, 60], noite);
      for (var j = 0; j < 3; j++) {
        var ly = 470 - alt * (0.45 + j * 0.25), lado = j % 2 ? 1 : -1;
        c.beginPath();
        c.ellipse(x + 14 + lado * 34, ly, 38, 13, lado * 0.5, 0, 7);
        c.fill();
      }
    }
  }

  function plataforma(c, p, camX, noite) {
    var x = Math.round(p.x - camX);
    if (x > W || x + p.w < 0) return;
    if (p.chao) {
      c.fillStyle = mistura([122, 84, 52], [52, 44, 52], noite);
      c.fillRect(x, p.y, p.w, H - p.y);
      c.fillStyle = mistura([92, 62, 40], [40, 34, 44], noite);
      for (var i = 0; i < p.w; i += 46) {
        c.beginPath();
        c.arc(x + i + 20, p.y + 34 + acaso(p.x + i) * 30, 5, 0, 7);
        c.fill();
      }
    } else {
      c.fillStyle = mistura([112, 78, 48], [48, 40, 50], noite);
      retArred(c, x, p.y, p.w, p.h, 8); c.fill();
      // cipó pendurado
      c.strokeStyle = mistura([58, 140, 84], [22, 56, 56], noite);
      c.lineWidth = 3;
      for (var k = 14; k < p.w; k += 44) {
        c.beginPath(); c.moveTo(x + k, p.y + p.h);
        c.lineTo(x + k, p.y + p.h + 10 + acaso(p.x + k) * 22); c.stroke();
      }
    }
    // grama em cima
    c.fillStyle = mistura([96, 196, 92], [34, 86, 74], noite);
    retArred(c, x - 3, p.y - 6, p.w + 6, 16, 8); c.fill();
  }

  // Concreto visto de lado. (x, y) = meio dos pés.
  // Geleca: base esparramada no chão, corpo mole que balança, topo curvado (P02),
  // brilho de gel, bolhas por dentro e uma gota escorrendo (P03). Silhueta lembra fantasma (P01).
  function concreto(c, x, y, o) {
    o = o || {};
    var w = o.w || 44, h = o.h || 52, dir = o.dir || 1, t = o.t || 0;
    var esp = o.espichar || 0; // >0 estica (pulo), <0 achata
    var ww = w * (1 - esp * 0.18), hh = h * (1 + esp * 0.22);
    var bal = Math.sin(t * 5) * ww * 0.04;          // o topo balança como gelatina
    var pe = 1 + Math.max(0, -esp) * 0.25 - Math.max(0, esp) * 0.3; // base abre ao achatar
    c.save();
    c.translate(x, y);
    c.scale(dir, 1);
    function corpo() {
      c.beginPath();
      c.moveTo(-0.64 * ww * pe, 0);
      c.bezierCurveTo(-0.68 * ww * pe, -0.14 * hh, -0.42 * ww, -0.14 * hh, -0.40 * ww, -0.42 * hh);
      c.bezierCurveTo(-0.40 * ww + bal, -0.96 * hh, -0.04 * ww + bal, -1.13 * hh, 0.14 * ww + bal, -1.05 * hh);
      c.bezierCurveTo(0.42 * ww + bal, -0.95 * hh, 0.45 * ww, -0.62 * hh, 0.42 * ww, -0.40 * hh);
      c.bezierCurveTo(0.44 * ww, -0.14 * hh, 0.72 * ww * pe, -0.12 * hh, 0.66 * ww * pe, 0);
      c.bezierCurveTo(0.5 * ww, 6, 0.22 * ww, 2, 0.02 * ww, 5);
      c.bezierCurveTo(-0.24 * ww, 7, -0.5 * ww, 3, -0.64 * ww * pe, 0);
      c.closePath();
    }
    // sombra no chão
    if (!o.semSombra) {
      c.fillStyle = 'rgba(8,30,22,0.18)';
      c.beginPath(); c.ellipse(0, 4, ww * 0.7, hh * 0.07, 0, 0, 7); c.fill();
    }
    // corpo de gel: claro em cima, mais escuro embaixo
    var g = c.createLinearGradient(0, -hh * 1.1, 0, 4);
    g.addColorStop(0, '#b9f7dc');
    g.addColorStop(0.35, CFG.concreto.cor);
    g.addColorStop(1, '#2fa87c');
    corpo();
    c.fillStyle = g; c.fill();
    c.save();
    corpo(); c.clip();
    // miolo mais escuro e bolhas por dentro
    c.fillStyle = 'rgba(20,110,80,0.22)';
    c.beginPath(); c.ellipse(-0.05 * ww, -0.3 * hh, ww * 0.3, hh * 0.3, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)';
    for (var i = 0; i < 4; i++) {
      var f = ((t * 0.25 + i * 0.27) % 1);
      var bx = (-0.28 + 0.18 * i) * ww + Math.sin(t * 2 + i * 2) * 2;
      c.beginPath(); c.arc(bx, -0.08 * hh - f * hh * 0.55, ww * (0.035 + 0.012 * i) * (1 - f * 0.5), 0, 7); c.fill();
    }
    // luz da borda (parece molhado)
    c.strokeStyle = 'rgba(255,255,255,0.28)'; c.lineWidth = ww * 0.12;
    c.beginPath(); c.moveTo(-0.36 * ww, -0.2 * hh);
    c.bezierCurveTo(-0.36 * ww + bal, -0.8 * hh, -0.1 * ww + bal, -1.02 * hh, 0.1 * ww + bal, -1.0 * hh); c.stroke();
    c.restore();
    corpo();
    c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = Math.max(2.5, ww * 0.06); c.lineJoin = 'round'; c.stroke();
    // brilho forte
    c.fillStyle = 'rgba(255,255,255,0.8)';
    c.beginPath(); c.ellipse(-0.14 * ww + bal, -0.86 * hh, ww * 0.1, hh * 0.045, -0.6, 0, 7); c.fill();
    c.beginPath(); c.arc(-0.27 * ww + bal * 0.7, -0.7 * hh, ww * 0.035, 0, 7); c.fill();
    // gota escorrendo pelas costas
    var q = (t * 0.45) % 1;
    c.fillStyle = CFG.concreto.cor; c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = Math.max(1.5, ww * 0.035);
    c.beginPath();
    var gx = -0.43 * ww - q * 0.12 * ww, gy = -0.5 * hh + q * 0.4 * hh, gr = ww * (0.06 + 0.03 * q);
    c.moveTo(gx, gy - gr * 2); c.quadraticCurveTo(gx + gr * 1.3, gy, gx, gy + gr);
    c.quadraticCurveTo(gx - gr * 1.3, gy, gx, gy - gr * 2); c.fill(); c.stroke();
    // rosto: olhos escuros e brilhantes, um pouco para a frente
    var ox = 0.14 * ww + bal * 0.6, oy = -0.62 * hh;
    var pisca = (t % 3.4) < 0.12;
    [-1, 1].forEach(function (s) {
      var ex = ox + s * 0.15 * ww, rx = ww * 0.085, ry = pisca ? hh * 0.012 : hh * (s > 0 ? 0.105 : 0.095);
      c.fillStyle = '#0f2b22';
      c.beginPath(); c.ellipse(ex, oy, rx, ry, 0, 0, 7); c.fill();
      if (!pisca) {
        c.fillStyle = '#fff';
        c.beginPath(); c.arc(ex + rx * 0.3, oy - ry * 0.4, rx * 0.36, 0, 7); c.fill();
        c.beginPath(); c.arc(ex - rx * 0.3, oy + ry * 0.4, rx * 0.16, 0, 7); c.fill();
      }
    });
    c.fillStyle = 'rgba(255,150,170,0.45)'; // bochechas
    c.beginPath(); c.ellipse(ox - 0.27 * ww, oy + 0.13 * hh, ww * 0.06, hh * 0.03, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(ox + 0.25 * ww, oy + 0.13 * hh, ww * 0.05, hh * 0.03, 0, 0, 7); c.fill();
    c.strokeStyle = '#0f2b22'; c.fillStyle = '#0f2b22'; c.lineWidth = Math.max(1.6, ww * 0.04); c.lineCap = 'round';
    if (o.atacando) { // boca aberta soltando o raio
      c.beginPath(); c.ellipse(ox + 0.04 * ww, oy + 0.2 * hh, ww * 0.085, hh * 0.08, 0, 0, 7); c.fill();
    } else {
      c.beginPath(); c.arc(ox, oy + 0.12 * hh, ww * 0.09, 0.25, Math.PI - 0.25); c.stroke();
    }
    c.restore();
  }

  function gota(c, x, y, r) {
    c.fillStyle = CFG.concreto.cor;
    c.beginPath();
    c.moveTo(x, y - r * 1.6);
    c.quadraticCurveTo(x + r, y - r * 0.2, x, y + r * 0.6);
    c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.6);
    c.fill();
  }

  // Monstro comum do mundo das plantas (aparência PROVISÓRIA). (x, y) = meio dos pés.
  function monstro(c, x, y, m, t) {
    var dir = m.olha;
    c.save();
    c.translate(x, y);
    if (m.piscando > 0) c.globalAlpha = 0.5;
    var bal = Math.sin(t * 3 + m.x) * 2;
    // corpo: bulbo roxo com espinhos
    c.fillStyle = '#7d4bb3';
    c.strokeStyle = '#3d2163';
    c.lineWidth = 3;
    c.beginPath();
    for (var i = -2; i <= 2; i++) {
      c.moveTo(i * 9 - 5, -44 + Math.abs(i) * 3 + bal);
      c.lineTo(i * 9, -58 + Math.abs(i) * 4 + bal);
      c.lineTo(i * 9 + 5, -44 + Math.abs(i) * 3 + bal);
    }
    c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0, -24, 24, 25 + bal * 0.5, 0, 0, 7); c.fill(); c.stroke();
    // olhos bravos
    c.fillStyle = '#ffe66b';
    c.beginPath(); c.ellipse(dir * 4 - 8, -30, 5, 6, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(dir * 4 + 8, -30, 5, 6, 0, 0, 7); c.fill();
    c.fillStyle = '#2a1340';
    c.beginPath(); c.arc(dir * 6 - 8, -29, 2.2, 0, 7); c.fill();
    c.beginPath(); c.arc(dir * 6 + 8, -29, 2.2, 0, 7); c.fill();
    c.strokeStyle = '#2a1340'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(dir * 4 - 15, -40); c.lineTo(dir * 4 - 3, -36);
    c.moveTo(dir * 4 + 15, -40); c.lineTo(dir * 4 + 3, -36); c.stroke();
    c.beginPath(); c.moveTo(-7, -14); c.lineTo(-3, -17); c.lineTo(1, -14); c.lineTo(5, -17); c.lineTo(9, -14); c.stroke();
    // faca: só aparece quando Concreto está perto (I04)
    if (m.estado !== 'calmo') {
      var av = 0;
      if (m.estado === 'preparando') av = -8 * Math.min(1, m.tempo / 0.3);
      if (m.estado === 'golpe') av = CFG.monstro.alcanceFaca - 22;
      c.save();
      c.translate(dir * (22 + av), -22);
      c.scale(dir, 1);
      c.fillStyle = '#5b3a1e';
      c.fillRect(-6, -4, 10, 8);
      c.fillStyle = '#e6edf2'; c.strokeStyle = '#6b7c88'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(4, -5); c.lineTo(22, -5); c.lineTo(30, 0); c.lineTo(22, 5); c.lineTo(4, 5); c.closePath();
      c.fill(); c.stroke();
      c.restore();
    }
    c.restore();
  }

  function raio(c, x, y, dir, t) {
    c.fillStyle = CFG.concreto.cor;
    c.strokeStyle = CFG.concreto.corEscura; c.lineWidth = 2;
    c.beginPath(); c.ellipse(x, y, 15, 7 + Math.sin(t * 30) * 1.5, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(95,217,163,0.5)';
    c.beginPath(); c.arc(x - dir * 18, y + 2, 4, 0, 7); c.fill();
    c.beginPath(); c.arc(x - dir * 28, y - 2, 2.5, 0, 7); c.fill();
  }

  function portal(c, x, y, t) {
    c.save();
    c.translate(x, y);
    for (var i = 4; i >= 0; i--) {
      var k = i / 4;
      c.fillStyle = ['#f6e9ff', '#d3a4ff', '#9a5cf0', '#6a2fc4', '#3b1670'][i];
      c.beginPath();
      c.ellipse(0, -70, 16 + k * 32 + Math.sin(t * 3 + i) * 2, 26 + k * 48 + Math.cos(t * 2 + i) * 2, 0, 0, 7);
      c.fill();
    }
    c.fillStyle = '#fff';
    for (var j = 0; j < 6; j++) {
      var a = t * 1.5 + j * 1.05, rr = 50 + Math.sin(t * 2 + j) * 8;
      c.beginPath(); c.arc(Math.cos(a) * rr * 0.6, -70 + Math.sin(a) * rr, 2.5, 0, 7); c.fill();
    }
    c.restore();
  }

  function texto(c, s, x, y, tam, cor, alinhar, peso) {
    c.font = (peso || 700) + ' ' + tam + 'px "Trebuchet MS", "Segoe UI", system-ui, sans-serif';
    c.textAlign = alinhar || 'center';
    c.textBaseline = 'middle';
    c.lineJoin = 'round';
    c.lineWidth = Math.max(3, tam * 0.18);
    c.strokeStyle = 'rgba(8,20,16,0.85)';
    c.strokeText(s, x, y);
    c.fillStyle = cor || '#f2fbf4';
    c.fillText(s, x, y);
  }

  // Vidas (gotinhas) e relógio de dia/noite.
  function painel(c, vidas, relogio) {
    for (var i = 0; i < CFG.vidas; i++) {
      c.globalAlpha = i < vidas ? 1 : 0.22;
      gota(c, 34 + i * 34, 40, 13);
      c.globalAlpha = 1;
    }
    var x = W - 44, y = 38;
    c.fillStyle = 'rgba(8,20,16,0.35)';
    retArred(c, W - 150, 16, 134, 44, 22); c.fill();
    if (relogio.noite) {
      c.fillStyle = '#f4f1c9';
      c.beginPath(); c.arc(x, y, 13, 0, 7); c.fill();
      c.fillStyle = '#26324f';
      c.beginPath(); c.arc(x + 6, y - 4, 11, 0, 7); c.fill();
    } else {
      c.fillStyle = '#ffd84a';
      c.beginPath(); c.arc(x, y, 11, 0, 7); c.fill();
      c.strokeStyle = '#ffd84a'; c.lineWidth = 3;
      for (var k = 0; k < 8; k++) {
        var a = k * Math.PI / 4;
        c.beginPath(); c.moveTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14);
        c.lineTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18); c.stroke();
      }
    }
    var m = Math.floor(relogio.falta / 60), s = Math.floor(relogio.falta % 60);
    texto(c, (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s, W - 104, 39, 18, '#f2fbf4');
  }

  return {
    mistura: mistura, acaso: acaso, retArred: retArred, ceu: ceu, fundoPlantas: fundoPlantas,
    plataforma: plataforma, concreto: concreto, gota: gota, monstro: monstro, raio: raio,
    portal: portal, texto: texto, painel: painel
  };
})();
