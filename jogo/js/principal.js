// Junta tudo: escolha de mundo, fase, portal, luta contra o boss, progresso salvo e o laço principal.
(function () {
  var W = CFG.largura, H = CFG.altura;
  var tela = document.getElementById('tela');
  var c = tela.getContext('2d');

  function ajustarTela() {
    var s = Math.min(2, window.devicePixelRatio || 1);
    tela.width = W * s; tela.height = H * s;
    c.setTransform(s, 0, 0, s, 0, 0);
  }
  ajustarTela();
  window.addEventListener('resize', ajustarTela);

  // Progresso guardado no aparelho (PROVISÓRIO): até que mundo chegou e o recorde de gotinhas de cada um.
  var CHAVE = 'concreto-progresso-v1';
  function carregar() {
    try {
      var p = JSON.parse(localStorage.getItem(CHAVE) || '{}');
      return { liberado: Math.max(0, Math.min(MUNDOS.length - 1, p.liberado | 0)), recordes: p.recordes || [], zerou: !!p.zerou,
        cor: CFG.concreto.cores[p.cor] ? p.cor : 'verde', mudo: !!p.mudo, viuHistoria: !!p.viuHistoria };
    } catch (e) { return { liberado: 0, recordes: [], zerou: false, cor: 'verde', mudo: false, viuHistoria: false }; }
  }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(Jogo.progresso)); } catch (e) {} }

  var Jogo = {
    estado: 'titulo',          // titulo | fase | entrando | boss | morrendo | derrota | vitoria | final
    mundo: 0,
    vidas: CFG.vidas,
    gotinhas: 0, escudo: false,
    progresso: carregar(),
    fase: null, boss: null,
    morreuNoBoss: false, espera: 0, pausado: false, t: 0
  };
  Jogo.mundo = Jogo.progresso.liberado;
  Jogo.fase = Fase.criar(MUNDOS[Jogo.mundo]);
  window.Jogo = Jogo; // para testes

  // ---- cores do Concreto: as quatro alternativas da prancha; três são liberadas juntando gotinhas (PROVISÓRIO) ----
  var NOMES_COR = ['verde', 'azul', 'roxo', 'laranja'];
  function somaRecordes() { var n = 0; MUNDOS.forEach(function (m, i) { n += Jogo.progresso.recordes[i] || 0; }); return n; }
  function corLiberada(nome) { return somaRecordes() >= CFG.concreto.cores[nome].gotinhas; }
  function aplicarCor(nome) {
    var pal = CFG.concreto.cores[nome], C = CFG.concreto;
    ['cor', 'corEscura', 'clara', 'funda', 'mancha', 'luz'].forEach(function (k) { C[k] = pal[k]; });
    Jogo.progresso.cor = nome;
  }
  function bolinhaCor(i) { return { x: W / 2 + 150, y: 196 + i * 40, r: 14 }; }
  // estrelas do mundo: 1 por vencer, 2 com 60% das gotinhas, 3 com 90% (PROVISÓRIO)
  function estrelas(i) {
    var P = Jogo.progresso, venceu = i < P.liberado || (P.zerou && i === MUNDOS.length - 1);
    if (!venceu) return 0;
    var fr = (P.recordes[i] || 0) / MUNDOS[i].fase.gotinhas.length;
    return fr >= 0.9 ? 3 : fr >= 0.6 ? 2 : 1;
  }
  Jogo.estrelas = estrelas;
  aplicarCor(Jogo.progresso.cor);
  Som.ligar(!Jogo.progresso.mudo);
  function alternarSom() { Jogo.progresso.mudo = !Jogo.progresso.mudo; Som.ligar(!Jogo.progresso.mudo); salvar(); }

  function mundoAtual() { return MUNDOS[Jogo.mundo]; }

  function novaFase(i) {
    if (i !== undefined) Jogo.mundo = i;
    Jogo.vidas = CFG.vidas; Jogo.gotinhas = 0; Jogo.escudo = false;
    Jogo.fase = Fase.criar(mundoAtual());
    Jogo.boss = null; Jogo.morreuNoBoss = false; Jogo.pausado = false;
    Jogo.estado = 'fase';
    if (Jogo.mundo === 0 && !Jogo.progresso.viuHistoria && !Jogo.semHistoria) { Jogo.estado = 'historia'; Jogo.espera = 1; }
  }
  function novoBoss() { Jogo.boss = Boss.criar(mundoAtual().boss); Jogo.estado = 'boss'; }
  function irParaTitulo() {
    Jogo.estado = 'titulo'; Jogo.pausado = false;
    Jogo.fase = Fase.criar(mundoAtual());
  }
  Jogo.novaFase = novaFase; // para testes

  // posição das cinco bolinhas de mundo na tela de título
  function bolinha(i) { return { x: W / 2 + (i - 2) * 150, y: 408, r: 40 }; }

  function atualizar(dt) {
    var confirmou = Entrada.confirmou || Entrada.puloApertou || Entrada.ataqueApertou;
    var toque = Entrada.toque, e = Jogo.estado, i;
    Jogo.t += dt;
    Som.musica(e === 'boss' ? 'boss' : e === 'final' ? 'ceu' : MUNDOS[Jogo.mundo].tema);
    // botão de som, no canto de cima à direita da tela inicial e da pausa
    if (Entrada.somApertou || ((e === 'titulo' || Jogo.pausado) && toque && toque.x > W - 70 && toque.y < 70)) { alternarSom(); toque = null; Entrada.toque = null; }

    // pausa: tecla P/Esc ou toque no botão do alto da tela
    if (e === 'fase' || e === 'boss') {
      var noBotao = toque && Math.abs(toque.x - 172) < 32 && toque.y < 68;
      if (Jogo.pausado) {
        if (toque && toque.y > 330 && toque.y < 400 && Math.abs(toque.x - W / 2) < 190) { irParaTitulo(); return; }
        if (Entrada.pausou || confirmou || toque) Jogo.pausado = false;
        return;
      }
      if (Entrada.pausou || noBotao) { Jogo.pausado = true; return; }
    }

    if (e === 'historia') {
      Jogo.espera -= dt;
      if (Jogo.espera <= 0 && (confirmou || toque)) { Jogo.progresso.viuHistoria = true; salvar(); Jogo.estado = 'fase'; }
    } else if (e === 'titulo') {
      Jogo.fase.t += dt;
      var lib = Jogo.progresso.liberado, escolhido = null;
      // trocar a cor: tecla C ou toque na bolinha de cor
      var nova = null;
      if (Entrada.corApertou) { var ic = NOMES_COR.indexOf(Jogo.progresso.cor); do { ic = (ic + 1) % 4; } while (!corLiberada(NOMES_COR[ic])); nova = NOMES_COR[ic]; }
      if (toque) NOMES_COR.forEach(function (nome, k) { var bc = bolinhaCor(k); if (Math.abs(toque.x - bc.x) < 24 && Math.abs(toque.y - bc.y) < 20) { toque = null; if (corLiberada(nome)) nova = nome; } });
      if (nova) { aplicarCor(nova); salvar(); Som.gotinha(); }
      if (Entrada.esqApertou && Jogo.mundo > 0) Jogo.mundo--;
      if (Entrada.dirApertou && Jogo.mundo < lib) Jogo.mundo++;
      if (Entrada.esqApertou || Entrada.dirApertou) Jogo.fase = Fase.criar(mundoAtual());
      if (toque) {
        for (i = 0; i < MUNDOS.length; i++) {
          var b = bolinha(i);
          if (Math.abs(toque.x - b.x) < b.r + 14 && Math.abs(toque.y - b.y) < b.r + 30) escolhido = i;
        }
        if (escolhido === null) escolhido = Jogo.mundo;
        if (escolhido <= lib) novaFase(escolhido);
      } else if (Entrada.confirmou || Entrada.puloApertou) novaFase();
    } else if (e === 'fase') {
      var r = Fase.atualizar(Jogo.fase, dt, Jogo);
      if (r === 'morreu') { Fase.espalhar(Jogo.fase); Jogo.estado = 'morrendo'; Jogo.espera = 2.4; Jogo.morreuNoBoss = false; }
      if (r === 'portal') { Som.portal(); Jogo.estado = 'entrando'; Jogo.espera = 0.9; }
    } else if (e === 'entrando') {
      // Concreto é puxado para dentro do portal e vai enfrentar o boss (F05).
      Fase.soParticulas(Jogo.fase, dt);
      Jogo.espera -= dt;
      Jogo.fase.j.entrando = Math.min(1, 1 - Jogo.espera / 0.9);
      if (Jogo.espera <= 0) novoBoss();
    } else if (e === 'boss') {
      var rb = Boss.atualizar(Jogo.boss, dt, Jogo);
      if (rb === 'morreu') { Jogo.estado = 'morrendo'; Jogo.espera = 2.4; Jogo.morreuNoBoss = true; Jogo.boss.vento = []; }
      if (rb === 'venceu') {
        Som.portal(); Jogo.estado = 'vitoria'; Jogo.espera = 0.8;
        var P = Jogo.progresso;
        P.recordes[Jogo.mundo] = Math.max(P.recordes[Jogo.mundo] || 0, Jogo.gotinhas);
        if (Jogo.mundo < MUNDOS.length - 1) P.liberado = Math.max(P.liberado, Jogo.mundo + 1); else P.zerou = true;
        salvar();
      }
    } else if (e === 'morrendo') {
      if (Jogo.morreuNoBoss) { Jogo.boss.t += dt; ventoBoss(dt); } else Fase.soParticulas(Jogo.fase, dt);
      Jogo.espera -= dt;
      if (Jogo.espera <= 0) { Jogo.estado = 'derrota'; Jogo.espera = 0.5; }
    } else if (e === 'derrota') {
      Jogo.espera -= dt;
      if (Jogo.espera <= 0 && (confirmou || toque)) {
        if (Jogo.morreuNoBoss && CFG.boss.recomecaNoBoss) { Jogo.vidas = CFG.vidas; novoBoss(); } // V07
        else novaFase();
      }
    } else if (e === 'vitoria') {
      Jogo.espera -= dt;
      if (Jogo.espera <= 0 && (confirmou || toque)) {
        if (Jogo.mundo < MUNDOS.length - 1) novaFase(Jogo.mundo + 1);
        else { Jogo.estado = 'final'; Jogo.espera = 1; }
      }
    } else if (e === 'final') {
      Jogo.espera -= dt;
      if (Jogo.espera <= 0 && (confirmou || toque)) irParaTitulo();
    }
  }

  // Na derrota em primeira pessoa, os pedacinhos de geleca voam com o vento pela tela.
  function ventoBoss(dt) {
    var v = Jogo.boss.vento;
    if (Jogo.espera > 1.2) for (var i = 0; i < 3; i++) v.push({ x: 250 + Math.random() * 460, y: H - Math.random() * 60, vx: 200 + Math.random() * 400, vy: -80 - Math.random() * 220, r: 4 + Math.random() * 7 });
    v.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt + Math.sin(Jogo.boss.t * 6 + p.x * 0.02) * 2; });
  }

  function pisca() { return Math.floor(Jogo.t * 2) % 3 !== 0; }

  function faixa(titulo, linhas, botao) {
    c.fillStyle = 'rgba(8,20,16,0.62)'; c.fillRect(0, 0, W, H);
    Arte.texto(c, titulo, W / 2, 160, 44, '#f2fbf4');
    linhas.forEach(function (s, i) { Arte.texto(c, s, W / 2, 232 + i * 36, 22, '#d9f3e2', 'center', 600); });
    if (Jogo.espera <= 0 && pisca()) Arte.texto(c, botao, W / 2, 430, 24, '#fff27a');
  }

  function totalGotinhas() {
    var pegas = 0, total = 0;
    MUNDOS.forEach(function (m, i) { pegas += Jogo.progresso.recordes[i] || 0; total += m.fase.gotinhas.length; });
    return pegas + ' de ' + total;
  }

  function telaTitulo() {
    var lib = Jogo.progresso.liberado, cores = ['#58c02e', '#e8641e', '#3fa6f2', '#f07ab8', '#f5c62a'];
    c.fillStyle = 'rgba(30,14,64,0.62)'; c.fillRect(0, 0, W, H);
    Arte.texto(c, 'CONCRETO', W / 2, 102, 84, '#4a1f8a', 'center', 800, '#4a1f8a');
    Arte.texto(c, 'CONCRETO', W / 2, 96, 84, '#b6f03a', 'center', 800, '#1d6b1a');
    Arte.concreto(c, W / 2, 300, { w: 100, h: 116, dir: 1, t: Jogo.t, espichar: Math.sin(Jogo.t * 3) * 0.1 });
    for (var i = 0; i < MUNDOS.length; i++) {
      var b = bolinha(i), aberto = i <= lib, sel = i === Jogo.mundo;
      if (i < MUNDOS.length - 1) {
        c.strokeStyle = i < lib ? '#f2fbf4' : 'rgba(242,251,244,0.3)'; c.lineWidth = 5; c.setLineDash([4, 10]); c.lineCap = 'round';
        c.beginPath(); c.moveTo(b.x + b.r + 8, b.y); c.lineTo(b.x + 150 - b.r - 8, b.y); c.stroke(); c.setLineDash([]);
      }
      var r = b.r + (sel ? 6 + Math.sin(Jogo.t * 5) * 2 : 0);
      c.fillStyle = aberto ? cores[i] : '#5a5470'; c.strokeStyle = sel ? '#fff27a' : 'rgba(8,20,16,0.7)'; c.lineWidth = sel ? 7 : 4;
      c.beginPath(); c.arc(b.x, b.y, r, 0, 7); c.fill(); c.stroke();
      if (aberto) Arte.texto(c, String(i + 1), b.x, b.y + 1, 36, '#ffffff', 'center', 800);
      else { // cadeado
        c.strokeStyle = '#d8d4e6'; c.lineWidth = 5; c.beginPath(); c.arc(b.x, b.y - 6, 10, Math.PI, 0); c.stroke();
        c.fillStyle = '#d8d4e6'; Arte.retArred(c, b.x - 15, b.y - 6, 30, 24, 5); c.fill();
      }
      for (var q = 0; q < 3; q++) { var tem = q < estrelas(i); if (aberto) Arte.estrela(c, b.x - 22 + q * 22, b.y - r - 12, 9, tem ? '#ffd84a' : 'rgba(20,10,50,0.55)', tem ? '#a06a08' : 'rgba(255,255,255,0.35)'); }
      Arte.texto(c, MUNDOS[i].nome.replace('Mundo ', '').replace(/^d[aeo]s? /, ''), b.x, b.y + 62, 15, aberto ? '#f2fbf4' : '#b0a8c8', 'center', 700);
    }
    NOMES_COR.forEach(function (nome, k) { // cores do Concreto
      var bc = bolinhaCor(k), pal = CFG.concreto.cores[nome], ok = corLiberada(nome), usada = Jogo.progresso.cor === nome;
      c.fillStyle = ok ? pal.cor : '#5a5470'; c.strokeStyle = usada ? '#fff27a' : ok ? pal.corEscura : '#2e2a3e'; c.lineWidth = usada ? 5 : 3;
      c.beginPath(); c.arc(bc.x, bc.y, bc.r, 0, 7); c.fill(); c.stroke();
      if (!ok) { Arte.gota(c, bc.x + 30, bc.y + 2, 7); Arte.texto(c, String(pal.gotinhas), bc.x + 58, bc.y, 15, '#f2fbf4', 'center', 700); }
    });
    Arte.texto(c, 'Gotinhas: ' + somaRecordes(), W / 2 - 170, 250, 17, '#f2fbf4', 'center', 700);
    botaoSom();
    if (pisca()) Arte.texto(c, 'Toque em um mundo ou aperte Enter para jogar', W / 2, 505, 20, '#fff27a');
    Arte.texto(c, 'Setas andam · espaço pula · X raio · P pausa · C cor · S som', W / 2, 20, 14, '#d9f3e2', 'center', 600);
  }

  function botaoSom() {
    var x = W - 40, y = 40, ligado = !Jogo.progresso.mudo;
    c.fillStyle = 'rgba(8,20,16,0.45)'; c.beginPath(); c.arc(x, y, 22, 0, 7); c.fill();
    c.fillStyle = '#f2fbf4';
    c.beginPath(); c.moveTo(x - 12, y - 5); c.lineTo(x - 5, y - 5); c.lineTo(x + 3, y - 12); c.lineTo(x + 3, y + 12); c.lineTo(x - 5, y + 5); c.lineTo(x - 12, y + 5); c.closePath(); c.fill();
    c.strokeStyle = ligado ? '#f2fbf4' : '#ff6a5a'; c.lineWidth = 3; c.lineCap = 'round';
    c.beginPath();
    if (ligado) { c.arc(x + 4, y, 7, -0.8, 0.8); c.moveTo(x + 12, y - 9); c.arc(x + 4, y, 13, -0.75, 0.75); }
    else { c.moveTo(x + 8, y - 6); c.lineTo(x + 16, y + 6); c.moveTo(x + 16, y - 6); c.lineTo(x + 8, y + 6); }
    c.stroke();
  }

  function desenhar() {
    var e = Jogo.estado, m = mundoAtual();
    var noBoss = e === 'boss' || ((e === 'morrendo' || e === 'derrota' || e === 'vitoria') && Jogo.boss && (Jogo.morreuNoBoss || e === 'vitoria'));
    if (e === 'final') {
      Arte.temas.plantas.fundo(c, Jogo.t * 40, Jogo.t);
    } else if (noBoss) {
      Boss.desenhar(c, Jogo.boss, Jogo.vidas);
      (Jogo.boss.vento || []).forEach(function (p) {
        c.fillStyle = CFG.concreto.cor; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill();
      });
    } else {
      Fase.desenhar(c, Jogo.fase, e === 'morrendo' || e === 'derrota' || e === 'titulo');
    }
    if (e !== 'titulo' && e !== 'final' && e !== 'historia') {
      Arte.painel(c, Jogo.vidas, Jogo.gotinhas, m.fase.gotinhas.length, Jogo.escudo, Jogo.t);
      if (e === 'fase' || e === 'boss') { // botão de pausa
        c.fillStyle = 'rgba(8,20,16,0.4)'; c.beginPath(); c.arc(172, 40, 20, 0, 7); c.fill();
        c.fillStyle = '#f2fbf4'; c.fillRect(164, 31, 6, 18); c.fillRect(174, 31, 6, 18);
      }
    }
    if (e === 'fase' && Jogo.fase.t < 4) Arte.texto(c, 'Mundo ' + (Jogo.mundo + 1) + ' — ' + m.nome, W / 2, 112, 30, '#f2fbf4');
    else if (e === 'fase' && Jogo.fase.avisoTrecho > 0) Arte.texto(c, m.fase.trechos[Jogo.fase.trecho].nome, W / 2, 112, 28, '#f2fbf4');
    if (e === 'entrando') { c.fillStyle = 'rgba(244,226,255,' + (Jogo.fase.j.entrando * 0.9) + ')'; c.fillRect(0, 0, W, H); }

    if (e === 'titulo') telaTitulo();
    else if (e === 'historia') { // história PROVISÓRIA: o criador ainda vai inventar a dele
      c.fillStyle = 'rgba(30,14,64,0.72)'; c.fillRect(0, 0, W, H);
      Arte.concreto(c, W / 2, 200, { w: 90, h: 104, dir: 1, t: Jogo.t, espichar: Math.sin(Jogo.t * 3) * 0.1 });
      ['Cinco chefes bagunçaram os cinco mundos.', 'Só o Concreto, uma geleca corajosa,', 'consegue atravessar os portais.', 'Atravesse cada mundo e enfrente o chefe no final!']
        .forEach(function (ln, k) { Arte.texto(c, ln, W / 2, 262 + k * 36, 23, '#f2fbf4', 'center', 600); });
      if (Jogo.espera <= 0 && pisca()) Arte.texto(c, 'Toque ou aperte Enter para começar', W / 2, 460, 24, '#fff27a');
    }
    else if (e === 'derrota') {
      faixa('O vento levou o Concreto!', ['As três vidas acabaram.', Jogo.morreuNoBoss ? 'Você volta para a luta contra o boss.' : 'Você volta para o começo da fase.'], 'Toque ou aperte Enter para tentar de novo');
    } else if (e === 'vitoria') {
      var ultimo = Jogo.mundo === MUNDOS.length - 1;
      faixa('Mundo ' + (Jogo.mundo + 1) + ' completo!', [
        m.boss.nome + ' foi derrotado!',
        'Gotinhas: ' + Jogo.gotinhas + ' de ' + m.fase.gotinhas.length,
        ultimo ? 'Era o último boss!' : 'Próximo: ' + MUNDOS[Jogo.mundo + 1].nome
      ], ultimo ? 'Toque ou aperte Enter' : 'Toque ou aperte Enter para continuar');
      for (var es = 0; es < 3; es++) Arte.estrela(c, W / 2 - 60 + es * 60, 360, 22, es < estrelas(Jogo.mundo) ? '#ffd84a' : 'rgba(20,10,50,0.6)', es < estrelas(Jogo.mundo) ? '#a06a08' : 'rgba(255,255,255,0.4)');
    } else if (e === 'final') {
      c.fillStyle = 'rgba(30,14,64,0.55)'; c.fillRect(0, 0, W, H);
      for (var i = 0; i < 14; i++) Arte.estrela(c, (Arte.acaso(i) * W + Jogo.t * 30 * (0.5 + Arte.acaso(i + 3))) % W, 40 + Arte.acaso(i + 8) * 460, 8 + Arte.acaso(i + 5) * 10, '#ffd84a', '#a06a08');
      Arte.texto(c, 'Você venceu os cinco mundos!', W / 2, 110, 44, '#fff27a');
      Arte.concreto(c, W / 2, 330 - Math.abs(Math.sin(Jogo.t * 4)) * 40, { w: 110, h: 128, dir: 1, t: Jogo.t, espichar: Math.sin(Jogo.t * 8) * 0.25 });
      Arte.texto(c, 'Gotinhas: ' + totalGotinhas(), W / 2, 400, 24, '#f2fbf4');
      Arte.texto(c, 'Os cinco mundos estão em paz de novo. Obrigado, Concreto!', W / 2, 440, 19, '#d9f3e2', 'center', 600);
      if (Jogo.espera <= 0 && pisca()) Arte.texto(c, 'Toque ou aperte Enter para voltar aos mundos', W / 2, 490, 22, '#fff27a');
    }
    if (Jogo.pausado) {
      c.fillStyle = 'rgba(8,20,16,0.7)'; c.fillRect(0, 0, W, H);
      Arte.texto(c, 'Pausa', W / 2, 190, 52, '#f2fbf4');
      Arte.texto(c, 'Toque ou aperte P para continuar', W / 2, 270, 22, '#fff27a');
      c.fillStyle = 'rgba(242,251,244,0.16)'; c.strokeStyle = 'rgba(242,251,244,0.6)'; c.lineWidth = 3;
      Arte.retArred(c, W / 2 - 180, 336, 360, 58, 29); c.fill(); c.stroke();
      Arte.texto(c, 'Voltar para os mundos (tecla M)', W / 2, 366, 20, '#f2fbf4');
      botaoSom();
    }
  }

  window.addEventListener('keydown', function (ev) {
    if ((ev.key === 'm' || ev.key === 'M') && Jogo.pausado) irParaTitulo();
  });

  var antes = 0;
  function quadro(agora) {
    var dt = Math.min(0.033, (agora - antes) / 1000 || 0);
    antes = agora;
    atualizar(dt);
    desenhar();
    Entrada.limparQuadro();
    requestAnimationFrame(quadro);
  }
  Jogo.passo = function (dt) { atualizar(dt); Entrada.limparQuadro(); }; // para testes
  requestAnimationFrame(quadro);
})();
