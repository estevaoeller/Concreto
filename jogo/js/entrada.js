// Teclado e botões de toque. "Apertou" vale só no quadro em que o botão foi pressionado.
var Entrada = (function () {
  var e = {
    esq: false, dir: false, pulo: false, ataque: false,
    esqApertou: false, dirApertou: false, puloApertou: false, ataqueApertou: false,
    confirmou: false, pulouTempo: false, toque: null
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
    if (ev.key === 'n' || ev.key === 'N') e.pulouTempo = true;
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
    e.confirmou = false; e.pulouTempo = false; e.toque = null;
  };
  return e;
})();

// Sons simples feitos pelo navegador (sem arquivos). PROVISÓRIO.
var Som = (function () {
  var ctx = null;
  function acordar() {
    if (!CFG.som) return;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (err) { ctx = null; }
  }
  function bip(freq, dur, tipo, freqFim, vol) {
    if (!ctx || !CFG.som) return;
    try {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
      o.type = tipo || 'sine';
      o.frequency.setValueAtTime(freq, t);
      if (freqFim) o.frequency.exponentialRampToValueAtTime(freqFim, t + dur);
      g.gain.setValueAtTime(vol || 0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur);
    } catch (err) {}
  }
  return {
    acordar: acordar,
    pulo: function () { bip(300, 0.18, 'sine', 620); },
    raio: function () { bip(700, 0.14, 'triangle', 240); },
    dano: function () { bip(220, 0.3, 'sawtooth', 70, 0.15); },
    acerto: function () { bip(520, 0.08, 'square', 760, 0.07); },
    bloqueio: function () { bip(180, 0.08, 'square', 160, 0.06); },
    aviso: function () { bip(880, 0.12, 'square', 880, 0.06); },
    gotinha: function () { bip(900, 0.07, 'sine', 1400, 0.07); },
    vida: function () { bip(500, 0.12, 'triangle', 900); setTimeout(function () { bip(900, 0.2, 'triangle', 1300); }, 110); },
    percebeu: function () { bip(1100, 0.07, 'square', 1100, 0.04); },
    derrotou: function () { bip(400, 0.2, 'triangle', 120, 0.1); },
    portal: function () { bip(260, 0.6, 'sine', 1040); },
    vitoria: function () { bip(520, 0.15, 'triangle'); setTimeout(function () { bip(780, 0.3, 'triangle'); }, 150); }
  };
})();
