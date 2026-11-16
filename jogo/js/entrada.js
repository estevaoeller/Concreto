// Teclado e botões de toque. "Apertou" vale só no quadro em que o botão foi pressionado.
var Entrada = (function () {
  var e = {
    esq: false, dir: false, pulo: false, ataque: false,
    esqApertou: false, dirApertou: false, puloApertou: false, ataqueApertou: false,
    confirmou: false, pausou: false, toque: null
  };
  var teclas = {
    ArrowLeft: 'esq', a: 'esq', A: 'esq',
    ArrowRight: 'dir', d: 'dir', D: 'dir',
    ArrowUp: 'pulo', w: 'pulo', W: 'pulo', ' ': 'pulo',
    x: 'ataque', X: 'ataque', j: 'ataque', J: 'ataque', z: 'ataque', Z: 'ataque'
  };
  function baixar(nome) {
    if (!e[nome]) e[nome + 'Apertou'] = true;
    e[nome] = true;
  }
  function soltar(nome) { e[nome] = false; }

  window.addEventListener('keydown', function (ev) {
    var nome = teclas[ev.key];
    if (nome) { baixar(nome); ev.preventDefault(); }
    if (ev.key === 'Enter') { e.confirmou = true; ev.preventDefault(); }
    if (ev.key === 'p' || ev.key === 'P' || ev.key === 'Escape') e.pausou = true;
    if (ev.key === 'c' || ev.key === 'C') e.corApertou = true;
    if (ev.key === 'v' || ev.key === 'V') e.visualApertou = true;
    if (ev.key === 'g' || ev.key === 'G') e.progressoApertou = true;
    if (ev.key === 'h' || ev.key === 'H') e.historiaApertou = true;
    if (ev.key === 's' || ev.key === 'S') e.somApertou = true;
    Som.acordar();
  });
  window.addEventListener('keyup', function (ev) {
    var nome = teclas[ev.key];
    if (nome) soltar(nome);
  });
  window.addEventListener('blur', function () {
    e.esq = e.dir = e.pulo = e.ataque = false;
  });

  function ligarBotao(id, nome) {
    var b = document.getElementById(id);
    if (!b) return;
    b.addEventListener('pointerdown', function (ev) {
      ev.preventDefault();
      try { b.setPointerCapture(ev.pointerId); } catch (err) {}
      b.classList.add('ativo');
      baixar(nome);
      Som.acordar();
    });
    function fim(ev) { ev.preventDefault(); b.classList.remove('ativo'); soltar(nome); }
    b.addEventListener('pointerup', fim);
    b.addEventListener('pointercancel', fim);
    b.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });
  }
  ligarBotao('btn-esq', 'esq');
  ligarBotao('btn-dir', 'dir');
  ligarBotao('btn-pulo', 'pulo');
  ligarBotao('btn-ataque', 'ataque');

  var tela = document.getElementById('tela');
  tela.addEventListener('pointerdown', function (ev) {
    var r = tela.getBoundingClientRect();
    e.toque = {
      x: (ev.clientX - r.left) / r.width * CFG.largura,
      y: (ev.clientY - r.top) / r.height * CFG.altura
    };
    Som.acordar();
  });

  e.limparQuadro = function () {
    e.esqApertou = e.dirApertou = e.puloApertou = e.ataqueApertou = false;
    e.confirmou = false; e.pausou = false; e.corApertou = false; e.visualApertou = false; e.progressoApertou = false; e.historiaApertou = false; e.somApertou = false; e.toque = null;
  };
  return e;
})();

// Sons e músicas feitos pelo próprio navegador (sem arquivos). Composições originais e PROVISÓRIAS.
var Som = (function () {
  var ctx = null, saida = null;
  function acordar() {
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        saida = ctx.createGain(); saida.gain.value = CFG.som ? 1 : 0; saida.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (err) { ctx = null; }
  }
  function ligar(sim) { CFG.som = sim; if (saida) saida.gain.value = sim ? 1 : 0; }
  // nota com ataque e queda suaves; freqFim faz a nota escorregar
  function nota(freq, quando, dur, tipo, vol, freqFim) {
    if (!ctx) return;
    try {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = quando || ctx.currentTime;
      o.type = tipo || 'sine';
      o.frequency.setValueAtTime(freq, t);
      if (freqFim) o.frequency.exponentialRampToValueAtTime(freqFim, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(saida);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (err) {}
  }
  function agora() { return ctx ? ctx.currentTime : 0; }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function acorde(notas, passo, dur, tipo, vol) { notas.forEach(function (m, i) { nota(hz(m), agora() + i * passo, dur, tipo, vol); }); }

  // ---- músicas: melodia e baixo em passos de colcheia, quatro compassos ----
  var TEMAS = {
    plantas: { bpm: 116, onda: 'triangle', baixo: [48, 50, 48, 43],
      mel: [72, 0, 76, 0, 79, 76, 72, 0, 74, 0, 77, 0, 81, 77, 74, 0, 72, 0, 76, 0, 79, 84, 79, 0, 77, 76, 74, 0, 72, 0, 0, 0] },
    vulcao: { bpm: 108, onda: 'square', baixo: [45, 41, 45, 40],
      mel: [69, 72, 76, 72, 69, 0, 67, 0, 65, 69, 72, 69, 65, 0, 64, 0, 69, 72, 76, 81, 79, 0, 76, 0, 74, 72, 71, 0, 69, 0, 0, 0] },
    ceu: { bpm: 96, onda: 'sine', baixo: [41, 43, 41, 36],
      mel: [77, 0, 81, 0, 84, 0, 81, 0, 79, 0, 82, 0, 86, 0, 82, 0, 77, 81, 84, 89, 84, 0, 81, 0, 79, 77, 76, 0, 77, 0, 0, 0] },
    pelucia: { bpm: 124, onda: 'triangle', baixo: [43, 45, 43, 38],
      mel: [79, 0, 83, 79, 86, 0, 83, 0, 81, 0, 84, 81, 88, 0, 84, 0, 79, 83, 86, 91, 86, 83, 79, 0, 81, 79, 78, 0, 79, 0, 0, 0] },
    blocos: { bpm: 134, onda: 'square', baixo: [38, 40, 38, 45],
      mel: [74, 74, 0, 78, 81, 0, 78, 0, 76, 76, 0, 79, 83, 0, 79, 0, 74, 78, 81, 86, 81, 78, 74, 0, 76, 74, 73, 0, 74, 0, 0, 0] },
    boss: { bpm: 150, onda: 'sawtooth', baixo: [40, 38, 40, 35], pulso: true,
      mel: [64, 0, 64, 67, 0, 64, 71, 0, 62, 0, 62, 66, 0, 62, 69, 0, 64, 0, 64, 67, 0, 71, 76, 0, 75, 0, 71, 0, 67, 0, 64, 0] }
  };
  var atual = null, passoN = 0, proximo = 0, relogio = null;
  function agendar() {
    if (!ctx || !atual || !CFG.som) return;
    var T = TEMAS[atual], dur = 60 / T.bpm / 2;
    if (proximo < ctx.currentTime) proximo = ctx.currentTime + 0.05;
    while (proximo < ctx.currentTime + 0.15) {
      var i = passoN % T.mel.length, m = T.mel[i], comp = Math.floor(i / 8), noComp = i % 8;
      if (m) nota(hz(m), proximo, dur * 1.7, T.onda, T.onda === 'sine' || T.onda === 'triangle' ? 0.05 : 0.022);
      if (noComp === 0 || noComp === 4 || (T.pulso && noComp % 2 === 0)) nota(hz(T.baixo[comp] + (noComp === 4 ? 7 : 0)), proximo, dur * 1.8, 'triangle', 0.07);
      passoN++; proximo += dur;
    }
  }
  function musica(nome) {
    if (nome === atual) return;
    atual = nome; passoN = 0; proximo = 0;
    if (!relogio) relogio = setInterval(agendar, 40);
  }

  return {
    acordar: acordar, ligar: ligar, musica: musica,
    pulo: function () { nota(300, 0, 0.18, 'sine', 0.12, 640); },
    raio: function () { nota(760, 0, 0.16, 'triangle', 0.1, 220); nota(1500, 0, 0.06, 'sine', 0.04, 900); },
    dano: function () { nota(240, 0, 0.32, 'sawtooth', 0.13, 70); nota(120, 0, 0.3, 'square', 0.06, 60); },
    acerto: function () { nota(520, 0, 0.09, 'square', 0.06, 780); },
    bloqueio: function () { nota(180, 0, 0.09, 'square', 0.05, 150); },
    aviso: function () { nota(880, 0, 0.1, 'square', 0.05); nota(880, agora() + 0.14, 0.1, 'square', 0.05); },
    mola: function () { nota(240, 0, 0.3, 'sine', 0.12, 960); },
    gotinha: function () { nota(1040, 0, 0.07, 'sine', 0.07, 1560); },
    vida: function () { acorde([72, 76, 79, 84], 0.07, 0.2, 'triangle', 0.09); },
    escudo: function () { acorde([67, 74, 79], 0.06, 0.25, 'sine', 0.09); },
    quebrou: function () { nota(900, 0, 0.25, 'triangle', 0.1, 200); },
    percebeu: function () { nota(1100, 0, 0.07, 'square', 0.035); },
    derrotou: function () { nota(420, 0, 0.22, 'triangle', 0.1, 110); },
    portal: function () { nota(260, 0, 0.7, 'sine', 0.11, 1040); },
    vitoria: function () { acorde([72, 76, 79, 84, 88], 0.11, 0.35, 'triangle', 0.1); }
  };
})();
