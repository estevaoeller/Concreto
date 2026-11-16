// Os cinco mundos (F01): tema, monstros, boss e desenho da fase.
// Ordem e temas são do criador. Desenho das fases, mecânicas de cenário e números dos bosses são PROVISÓRIOS.
// Mundos 2 e 5 usam as versões originais das pranchas (vulcânico e blocos de montar), sem marcas ou personagens de terceiros.
var MUNDOS = (function () {
  var Y = 460;
  // Jeito de se mexer de cada monstro (PROVISÓRIO; I02 deixava o deslocamento em aberto). A faca por proximidade vale para todos (I04).
  var MODO = {
    planta: 'parado', espinho: 'anda', cogumelo: 'pula', semente: 'parado',
    rocha: 'parado', lava: 'anda', brasa: 'pula', fumaca: 'flutua',
    nuvem: 'flutua', estrela: 'pula', passaro: 'flutua', vento: 'anda',
    almofada: 'parado', urso: 'anda', coelhinho: 'pula', novelo: 'anda',
    arco: 'parado', bloco: 'anda', piramide: 'pula', pilha: 'parado'
  };

  // Monta uma fase da esquerda para a direita. Distâncias em pixels a partir do ponto atual.
  function construir(tipos, roteiro) {
    var d = { plataformas: [], monstros: [], gotinhas: [], coracoes: [], escudos: [], placas: [], molas: [], trechos: [], inicio: { x: 90, y: Y } };
    var x = 0, nm = 0, primeiro = true, poeEscudo = false;
    function monstro(mx, my) { var tipo = tipos[nm++ % tipos.length]; d.monstros.push({ x: mx, y: my, tipo: tipo, modo: MODO[tipo] }); }
    function fila(fx, fy, n) { for (var i = 0; i < n; i++) d.gotinhas.push({ x: fx + i * 44, y: fy }); }
    function arco(x0, x1, alt, n) {
      for (var i = 0; i < n; i++) { var k = i / (n - 1); d.gotinhas.push({ x: x0 + (x1 - x0) * k, y: Y - 60 - Math.sin(k * Math.PI) * alt }); }
    }
    function flutuante(px, py, w, o) {
      o = o || {};
      var p = { x: px, y: py, w: w, h: 22 };
      if (o.mov) { p.mov = { dx: o.mov.dx || 0, dy: o.mov.dy || 0, per: o.mov.per || 3 }; p.bx = px; p.by = py; }
      d.plataformas.push(p);
      if (o.m) monstro(px + w / 2, py);
      else if (!o.mov) fila(px + w / 2 - (Math.floor(w / 50) - 1) * 22, py - 40, Math.floor(w / 50));
      if (o.c) d.coracoes.push({ x: px + w / 2, y: py - 52 });
    }
    var b = {
      trecho: function (nome) { d.trechos.push({ x: x, nome: nome }); if (nome === 'Trecho 2') poeEscudo = true; },
      placa: function (dx, texto) { d.placas.push({ x: x + dx, texto: texto }); },
      // chão: o.m = monstros, o.f = plataformas por cima [dx, y, largura, opções], o.mola = almofadas [dx]
      chao: function (w, o) {
        o = o || {};
        d.plataformas.push({ x: x, y: Y, w: w, chao: true });
        (o.m || []).forEach(function (dx) { monstro(x + dx, Y); });
        (o.f || []).forEach(function (f) { flutuante(x + f[0], f[1], f[2], f[3]); });
        (o.mola || []).forEach(function (dx) { d.molas.push({ x: x + dx, y: Y, w: 60, aperto: 0 }); });
        if (!primeiro && !o.semGotas) fila(x + 70, Y - 40, 3);
        if (poeEscudo) { d.escudos.push({ x: x + 40, y: Y - 110 }); poeEscudo = false; } // um escudo de geleca por mundo
        primeiro = false;
        x += w;
      },
      buraco: function (w) { arco(x - 10, x + w + 10, w > 180 ? 170 : 60, w > 180 ? 5 : 3); x += w; },
      // ponte: plataformas soltas sobre o buraco [distância, y, largura, opções]
      ponte: function (lista) { lista.forEach(function (e) { x += e[0]; flutuante(x, e[1], e[2], e[3]); x += e[2]; }); },
      portal: function (dx) { d.portalX = x + dx; }
    };
    roteiro(b);
    d.largura = x;
    return d;
  }

  return [
    {
      nome: 'Mundo das Plantas', tema: 'plantas',
      boss: { tipo: 'cthulhu', nome: 'Cthulhu Higiênico', vida: 24, aviso: 1.1, ondaAbaixoDe: 0.5, trocaDeLado: 2.5 },
      fase: construir(['planta', 'espinho', 'cogumelo', 'semente'], function (b) {
        b.trecho('Trecho 1');
        b.placa(190, 'Ande para a direita'); b.placa(410, 'PULO para subir'); b.placa(745, 'RAIO de longe!');
        b.chao(1000, { m: [900], f: [[520, 370, 160]] }); b.buraco(120);
        b.chao(900, { m: [440], f: [[280, 360, 160], [520, 290, 140]] }); b.buraco(130);
        b.chao(650, { m: [410], f: [[200, 370, 160]] });
        b.trecho('Trecho 2');
        b.buraco(140); b.chao(500, { m: [260] });
        b.ponte([[80, 400, 130], [80, 340, 130], [80, 400, 130], [60, 340, 110, { c: true }]]); b.buraco(60);
        b.chao(700, { m: [220, 500] }); b.buraco(140); b.chao(400, { m: [210] });
        b.ponte([[60, 400, 120], [70, 340, 120]]); b.buraco(50);
        b.trecho('Trecho 3');
        b.chao(640, { m: [420], f: [[190, 360, 160]] }); b.buraco(140);
        b.chao(520, { m: [390], f: [[160, 350, 160, { m: true }]] });
        b.ponte([[70, 390, 120], [70, 330, 120, { c: true }]]); b.buraco(60);
        b.portal(880); b.chao(1100, { m: [260, 580], f: [[300, 360, 170]] });
      })
    },
    {
      nome: 'Mundo Vulcânico', tema: 'vulcao',
      boss: { tipo: 'rainha', nome: 'Rainha de Lava', vida: 28, aviso: 1.0, ondaAbaixoDe: 0.4, trocaDeLado: 2.3, brasa: 1.2 },
      fase: construir(['lava', 'rocha', 'brasa', 'fumaca'], function (b) {
        b.trecho('Trecho 1');
        b.placa(200, 'Cuidado com a lava!');
        b.chao(800, { m: [560], f: [[300, 370, 150]] }); b.buraco(130); b.chao(600, { m: [300] });
        b.ponte([[70, 400, 120], [80, 350, 120], [80, 400, 120]]); b.buraco(70);
        b.chao(700, { m: [250, 520], f: [[330, 360, 150]] });
        b.trecho('Trecho 2');
        b.buraco(140); b.chao(450, { m: [240] });
        b.ponte([[80, 390, 110], [80, 330, 110], [90, 390, 110], [80, 330, 110, { c: true }], [80, 400, 120]]); b.buraco(70);
        b.chao(600, { m: [200, 430] }); b.buraco(140);
        b.chao(500, { m: [380], f: [[150, 360, 150, { m: true }]] });
        b.trecho('Trecho 3');
        b.ponte([[70, 400, 110], [90, 340, 110], [90, 400, 110]]); b.buraco(80);
        b.chao(700, { m: [230, 520], f: [[320, 355, 160]] }); b.buraco(140); b.chao(420, { m: [220] });
        b.ponte([[80, 380, 120, { c: true }], [90, 330, 110]]); b.buraco(70);
        b.portal(800); b.chao(1000, { m: [250, 520] });
      })
    },
    {
      nome: 'Mundo do Céu', tema: 'ceu',
      boss: { tipo: 'anjo', nome: 'Anjo', vida: 30, aviso: 1.2, ondaAbaixoDe: 0.4, trocaDeLado: 2.0, persegue: true },
      fase: construir(['nuvem', 'estrela', 'passaro', 'vento'], function (b) {
        b.trecho('Trecho 1');
        b.placa(200, 'Algumas plataformas se mexem!');
        b.chao(800, { m: [560], f: [[300, 370, 150]] });
        b.ponte([[70, 400, 130, { mov: { dy: 40, per: 3 } }]]); b.buraco(70);
        b.chao(600, { m: [320] });
        b.ponte([[70, 390, 130], [70, 380, 130, { mov: { dx: 40, per: 3.2 } }], [70, 390, 130]]); b.buraco(70);
        b.chao(650, { m: [240, 480], f: [[300, 360, 150]] });
        b.trecho('Trecho 2');
        b.buraco(130); b.chao(420, { m: [230] });
        b.ponte([[70, 400, 120, { mov: { dy: 45, per: 2.8 } }], [80, 350, 120], [80, 380, 120, { mov: { dx: 40, per: 3 } }], [80, 340, 110, { c: true }]]); b.buraco(80);
        b.chao(600, { m: [220, 450] });
        b.ponte([[80, 390, 120, { mov: { dy: 40, per: 3 } }], [80, 390, 120, { mov: { dy: -40, per: 3 } }]]); b.buraco(80);
        b.chao(520, { m: [330], f: [[130, 360, 150, { m: true }]] });
        b.trecho('Trecho 3');
        b.ponte([[70, 400, 120], [80, 370, 120, { mov: { dx: 40, per: 2.6 } }], [80, 340, 120, { c: true }], [80, 380, 120, { mov: { dy: 40, per: 2.6 } }]]); b.buraco(80);
        b.chao(650, { m: [220, 480] }); b.buraco(140);
        b.portal(800); b.chao(1000, { m: [260, 540], f: [[330, 360, 160]] });
      })
    },
    {
      nome: 'Mundo de Pelúcia', tema: 'pelucia',
      boss: { tipo: 'coelho', nome: 'Coelho de Pelúcia', vida: 32, aviso: 1.0, ondaAbaixoDe: 0.4, trocaDeLado: 1.7, chao: true },
      fase: construir(['urso', 'coelhinho', 'novelo', 'almofada'], function (b) {
        b.trecho('Trecho 1');
        b.placa(200, 'Pise na almofada rosa!');
        b.chao(800, { m: [640], f: [[560, 250, 150]], mola: [430] }); b.buraco(120);
        b.chao(700, { m: [300], f: [[420, 370, 150]] }); b.buraco(130);
        b.chao(600, { m: [250, 460] });
        b.trecho('Trecho 2');
        b.buraco(120); b.chao(500, { m: [220], mola: [434] }); b.buraco(180);
        b.chao(600, { m: [260, 480], f: [[300, 360, 150]] });
        b.ponte([[70, 400, 120], [80, 340, 120], [80, 400, 120, { c: true }]]); b.buraco(70);
        b.chao(520, { m: [260], mola: [454] }); b.buraco(180);
        b.chao(600, { m: [220, 440] });
        b.trecho('Trecho 3');
        b.ponte([[70, 390, 120], [80, 330, 120], [80, 390, 120]]); b.buraco(70);
        b.chao(560, { m: [300], f: [[130, 360, 150, { m: true }]], mola: [494] }); b.buraco(180);
        b.chao(700, { m: [240, 500], f: [[300, 360, 150, { c: true }]] }); b.buraco(140);
        b.portal(800); b.chao(1000, { m: [260, 540], f: [[330, 360, 160]] });
      })
    },
    {
      nome: 'Mundo dos Blocos', tema: 'blocos',
      boss: { tipo: 'guardiao', nome: 'Guardião de Blocos', vida: 40, aviso: 1.0, ondaAbaixoDe: 1, trocaDeLado: 1.8, chao: true },
      fase: construir(['bloco', 'arco', 'pilha', 'piramide'], function (b) {
        b.trecho('Trecho 1');
        b.chao(700, { m: [520], f: [[260, 370, 150]] });
        b.ponte([[70, 400, 120, { mov: { dy: 40, per: 2.6 } }], [80, 380, 120, { mov: { dx: 40, per: 2.8 } }]]); b.buraco(80);
        b.chao(600, { m: [220, 450] }); b.buraco(140);
        b.chao(500, { m: [240], mola: [434] }); b.buraco(180);
        b.chao(560, { m: [260, 460] });
        b.trecho('Trecho 2');
        b.ponte([[70, 390, 110], [80, 330, 110, { mov: { dy: 40, per: 2.4 } }], [80, 390, 110], [80, 340, 110, { c: true }]]); b.buraco(80);
        b.chao(600, { m: [200, 500], f: [[280, 360, 150, { m: true }]] }); b.buraco(140);
        b.chao(480, { m: [240], mola: [414] }); b.buraco(180);
        b.chao(520, { m: [260] });
        b.trecho('Trecho 3');
        b.ponte([[70, 400, 110, { mov: { dx: 40, per: 2.4 } }], [80, 350, 110], [80, 390, 110, { mov: { dy: 45, per: 2.2 } }], [80, 340, 110, { c: true }]]); b.buraco(80);
        b.chao(650, { m: [220, 470] }); b.buraco(140);
        b.portal(940); b.chao(1100, { m: [240, 480, 720], f: [[320, 360, 160]] });
      })
    }
  ];
})();
