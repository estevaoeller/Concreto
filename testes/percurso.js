// Testes do protótipo no navegador. Uso: node testes/percurso.js [pasta-para-capturas]
// Precisa do Playwright com Chromium. Cada verificação cita os IDs da ESPECIFICACAO.md.
const { chromium } = require('playwright');
const path = require('path');
const pagina = 'file://' + path.join(__dirname, '..', 'jogo', 'index.html');
const capturas = process.argv[2];
let falhas = 0;
function confere(nome, ok, detalhe) {
  console.log((ok ? 'PASSOU  ' : 'FALHOU  ') + nome + (detalhe ? '  ' + JSON.stringify(detalhe) : ''));
  if (!ok) falhas++;
}

(async () => {
  const nav = await chromium.launch();
  const p = await nav.newPage({ viewport: { width: 960, height: 560 } });
  const erros = [];
  p.on('pageerror', e => erros.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  const foto = async nome => { if (capturas) await p.screenshot({ path: path.join(capturas, nome + '.png') }); };
  const novaFase = async (m) => { await p.goto(pagina); await p.waitForTimeout(300); await p.evaluate(m => { Jogo.semHistoria = true; Jogo.novaFase(m || 0); }, m); await p.waitForTimeout(200); };

  await p.goto(pagina); await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await p.goto(pagina); await p.waitForTimeout(400); await foto('1-titulo');
  await p.keyboard.press('Enter'); await p.waitForTimeout(1300); await foto('2-historia');
  for (let k = 0; k < 3; k++) { await p.keyboard.press('Enter'); await p.waitForTimeout(800); if (k < 2) await foto('2-historia-' + (k + 2)); }
  await p.waitForTimeout(1200); await foto('3-fase');
  confere('história: três páginas e depois a fase começa', await p.evaluate(() => Jogo.estado) === 'fase');

  // V01: começa com três vidas
  confere('V01 começa com três vidas', await p.evaluate(() => Jogo.vidas) === 3);

  // V02/I03/V03/V05: contato tira uma vida, empurra para trás e dá um tempo sem dano
  let r = await p.evaluate(() => {
    const J = Jogo, j = J.fase.j, m = J.fase.monstros[0];
    j.x = m.x - 30;
    J.passo(1 / 60); const v1 = J.vidas, invul = j.invul, vx = j.vx;
    for (let i = 0; i < 10; i++) { j.x = m.x - 30; J.passo(1 / 60); }
    return { v1, invul, vx, v2: J.vidas };
  });
  confere('V02/I03 encostar no monstro tira uma vida', r.v1 === 2, r);
  confere('V03 é jogado para trás', r.vx < 0, r);
  confere('V05 fica um tempo sem levar outro golpe', r.invul > 0 && r.v2 === 2, r);

  // I04/I05/A02: faca só aparece de perto, some de longe e tira vida
  await novaFase();
  r = await p.evaluate(() => {
    const J = Jogo, j = J.fase.j, m = J.fase.monstros[0], o = {};
    j.x = m.x - 300; for (let i = 0; i < 30; i++) J.passo(1 / 60); o.longe = m.estado;
    j.x = m.x - 100; for (let i = 0; i < 10; i++) { j.x = m.x - 100; J.passo(1 / 60); } o.perto = m.estado;
    j.x = m.x - 300; for (let i = 0; i < 5; i++) J.passo(1 / 60); o.afastou = m.estado;
    j.x = m.x - 70; for (let i = 0; i < 90 && J.vidas === 3; i++) { j.x = m.x - 70; J.passo(1 / 60); }
    o.vidas = J.vidas; return o;
  });
  confere('I04 longe não tem faca', r.longe === 'calmo', r);
  confere('I04 perto a faca aparece', r.perto === 'preparando', r);
  confere('I04 afastou, a faca some', r.afastou === 'calmo', r);
  confere('I05 a faca tira uma vida', r.vidas === 2, r);

  // A01: o raio derrota o monstro
  await novaFase();
  r = await p.evaluate(() => {
    const J = Jogo, j = J.fase.j, m = J.fase.monstros[0];
    j.x = m.x - 250; j.dir = 1; let tiros = 0;
    for (let i = 0; i < 240 && m.vida > 0; i++) { if (i % 25 === 0) { Entrada.ataqueApertou = true; tiros++; } J.passo(1 / 60); }
    return { vida: m.vida, tiros };
  });
  confere('A01 raio de geleca derrota o monstro', r.vida <= 0, r);

  // V06: cair no buraco tira uma vida e volta para a última plataforma
  await novaFase();
  r = await p.evaluate(() => {
    const J = Jogo, j = J.fase.j, sx = j.seguro.x;
    j.x = 1060; j.y = 300; for (let i = 0; i < 240; i++) J.passo(1 / 60);
    return { vidas: J.vidas, voltou: Math.abs(j.x - sx) < 2, estado: J.estado };
  });
  confere('V06 queda tira uma vida e volta para a última plataforma', r.vidas === 2 && r.voltou && r.estado === 'fase', r);

  // V04/V07: sem vidas, vento e recomeço da fase
  r = await p.evaluate(() => {
    const J = Jogo, o = {};
    J.vidas = 1; J.fase.j.invul = 0; J.fase.j.x = J.fase.monstros[0].x - 30; J.fase.j.y = 460; J.passo(1 / 60);
    o.estado = J.estado; o.particulas = J.fase.particulas.length;
    for (let i = 0; i < 60 * 4; i++) J.passo(1 / 60);
    o.tela = J.estado; Entrada.confirmou = true; J.passo(1 / 60);
    o.depois = J.estado; o.vidas = J.vidas; o.x = Math.round(J.fase.j.x);
    return o;
  });
  confere('V04 sem vidas, o vento espalha a geleca', r.estado === 'morrendo' && r.particulas > 30, r);
  confere('V07 sem vidas no primeiro trecho recomeça do início da fase', r.depois === 'fase' && r.vidas === 3 && r.x === 90, r);

  // C01–C04, M01–M03, F01–F03: em cada um dos cinco mundos, o robô atravessa a fase, entra no portal e vence o boss
  const robos = () => {
    window.roboFase = () => {
      const J = Jogo, d = MUNDOS[J.mundo].fase; let n = 0;
      const apoio = (x, y) => d.plataformas.some(pl => x > pl.x && x < pl.x + pl.w && pl.y >= y - 4);
      while (J.estado === 'fase' && n < 60 * 300) {
        const j = J.fase.j;
        const m = J.fase.monstros.find(m => m.vida > 0 && m.x > j.x - 10 && m.x - j.x < 210 && Math.abs(m.by - j.y) < 60); // para e atira até o caminho ficar livre
        Entrada.dir = !m || !j.noChao;
        if (!j.noChao && j.vy > 0 && apoio(j.x, j.y) && !apoio(j.x + 40, j.y)) Entrada.dir = false; // pousa em vez de passar do ponto
        if (n % 22 === 0) Entrada.ataqueApertou = true;
        const naMola = J.fase.molas.some(mo => j.x > mo.x - 80 && j.x < mo.x + mo.w + 10);
        if (j.noChao && !m && !naMola && !apoio(j.x + 36, j.y)) { Entrada.puloApertou = true; Entrada.pulo = true; }
        else if (j.noChao) Entrada.pulo = false;
        J.passo(1 / 60); n++;
      }
      Entrada.dir = Entrada.pulo = false;
      return { estado: J.estado, x: Math.round(J.fase.j.x), de: d.portalX, seg: Math.round(n / 60), vidas: J.vidas, gotinhas: J.gotinhas + '/' + d.gotinhas.length };
    };
    window.roboBoss = () => {
      const J = Jogo; let n = 0;
      while (J.estado === 'entrando' && n < 200) { J.passo(1 / 60); n++; }
      const b = J.boss; n = 0;
      const perigo = l => ((b.fase === 'aviso' || b.fase === 'golpe') && b.alvos.indexOf(l) >= 0) || b.brasas.some(q => q.lado === l);
      const ir = l => { if (l > b.lado) Entrada.dirApertou = true; else if (l < b.lado) Entrada.esqApertou = true; };
      while (J.estado === 'boss' && n < 60 * 400) {
        const emAtaque = b.fase === 'aviso' || b.fase === 'golpe';
        if (b.tipoAtaque === 'chao' && b.fase === 'aviso' && b.tempo > b.cfg.aviso - 0.2) Entrada.puloApertou = true; // golpe no chão: pula
        if (b.tipoAtaque === 'chao' && emAtaque) { /* lado não importa */ }
        else if (perigo(b.lado)) { const livre = [-1, 0, 1].filter(l => !perigo(l)).sort((x, y) => Math.abs(x - b.lado) - Math.abs(y - b.lado))[0]; if (livre !== undefined) ir(livre); }
        else if (b.fase === 'pausa') { if (b.lado !== b.bossLado) { if (!perigo(b.bossLado) && !perigo(b.lado + Math.sign(b.bossLado - b.lado))) ir(b.bossLado); } else if (n % 24 === 0) Entrada.ataqueApertou = true; }
        J.passo(1 / 60); n++;
      }
      return { estado: J.estado, seg: Math.round(n / 60), vidas: J.vidas, vidaBoss: b.vida };
    };
  };
  for (let m = 0; m < 5; m++) {
    await novaFase(m); await p.evaluate(robos);
    await p.waitForTimeout(300); await foto('m' + (m + 1) + '-inicio');
    const nome = await p.evaluate(() => MUNDOS[Jogo.mundo].nome);
    r = await p.evaluate(() => roboFase());
    confere('Mundo ' + (m + 1) + ' (' + nome + '): a fase pode ser atravessada até o portal', r.estado === 'entrando', r);
    await p.evaluate(() => { for (let i = 0; i < 60 && Jogo.estado === 'entrando'; i++) Jogo.passo(1 / 60); });
    await p.waitForTimeout(2300); await foto('m' + (m + 1) + '-boss');
    r = await p.evaluate(() => roboBoss());
    confere('Mundo ' + (m + 1) + ': entrar no portal leva ao boss, e ele pode ser vencido', r.estado === 'vitoria' && r.vidaBoss === 0, r);
    r = await p.evaluate(() => { Entrada.confirmou = true; for (let i = 0; i < 80; i++) { Jogo.passo(1 / 60); Entrada.confirmou = true; } return { estado: Jogo.estado, mundo: Jogo.mundo, liberado: Jogo.progresso.liberado, zerou: Jogo.progresso.zerou }; });
    if (m < 4) confere('Mundo ' + (m + 1) + ': vencer libera e abre o mundo seguinte (F01)', r.estado === 'fase' && r.mundo === m + 1 && r.liberado >= m + 1, r);
    else confere('Mundo 5: vencer o último boss leva à tela final', r.estado === 'final' && r.zerou, r);
  }
  await p.waitForTimeout(300); await foto('final');
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await novaFase(0);
  await p.evaluate(() => { const J = Jogo; J.fase.j.x = MUNDOS[0].fase.portalX - 100; });

  // F05: entrou no portal, enfrenta o boss (20 chegadas seguidas)
  r = await p.evaluate(() => {
    const J = Jogo; let boss = 0;
    for (let k = 0; k < 20; k++) {
      J.estado = 'fase'; J.fase.chegouPortal = false; J.fase.j.entrando = 0; J.fase.j.x = MUNDOS[J.mundo].fase.portalX; J.fase.j.y = 460; J.fase.j.vy = 0;
      for (let i = 0; i < 120 && J.estado !== 'boss' && J.estado !== 'vitoria'; i++) J.passo(1 / 60);
      if (J.estado === 'boss') boss++;
    }
    return boss;
  });
  confere('F05 entrar no portal leva sempre ao boss', r === 20, r);
  await p.waitForTimeout(2400); await foto('4-boss-aviso');

  // B01/B02/B05/B06: dois ataques, depois dez segundos sem atacar; aviso antes de cada golpe
  r = await p.evaluate(() => {
    const J = Jogo; J.vidas = 3; J.boss = null; J.estado = 'fase';
    J.fase.chegouPortal = false; J.fase.j.entrando = 0; J.fase.j.x = MUNDOS[J.mundo].fase.portalX; J.fase.j.y = 460; J.fase.j.vy = 0;
    for (let i = 0; i < 120 && J.estado !== 'boss'; i++) J.passo(1 / 60);
    const b = J.boss, linha = []; let ant = '', tPausa = 0, golpesNaPausa = 0, n = 0;
    while (linha.filter(f => f === 'pausa').length < 2 && n < 60 * 60) {
      if (b.fase !== ant) { linha.push(b.fase); ant = b.fase; }
      if (b.fase === 'aviso' && b.alvos.indexOf(b.lado) >= 0) { // desvia para um lado livre
        const livre = [-1, 0, 1].filter(l => b.alvos.indexOf(l) < 0).sort((x, y) => Math.abs(x - b.lado) - Math.abs(y - b.lado))[0];
        if (livre > b.lado) Entrada.dirApertou = true; else Entrada.esqApertou = true;
      }
      if (b.fase === 'pausa' && linha.filter(f => f === 'pausa').length === 1) tPausa += 1 / 60;
      J.passo(1 / 60); n++;
    }
    return { linha: linha.join(' > '), tPausa: Math.round(tPausa * 10) / 10, vidas: J.vidas };
  });
  confere('B01/B05 aviso, golpe, aviso, golpe e então pausa', r.linha.startsWith('entrada > aviso > golpe > espera > aviso > golpe > pausa > aviso'), r);
  confere('B01 a pausa dura dez segundos', Math.abs(r.tPausa - 10) < 0.1, r);
  confere('desviar para o lado evita o golpe (premissa provisória)', r.vidas === 3, r);

  // B07 e luta completa: robô vence o boss; fora da pausa o raio é bloqueado (premissa provisória)
  r = await p.evaluate(() => {
    const J = Jogo, b = J.boss, o = {}; let n = 0;
    while (b.fase !== 'aviso' && n < 600) { J.passo(1 / 60); n++; }
    const v = b.vida; b.lado = b.bossLado = 0; b.bossX = 0; b.alvos = [];
    Entrada.ataqueApertou = true; for (let i = 0; i < 20; i++) J.passo(1 / 60);
    o.bloqueado = b.vida === v; n = 0;
    while (J.estado === 'boss' && n < 60 * 300) {
      if (b.fase === 'aviso' && b.alvos.indexOf(b.lado) >= 0) {
        const livre = [-1, 0, 1].filter(l => b.alvos.indexOf(l) < 0).sort((x, y) => Math.abs(x - b.lado) - Math.abs(y - b.lado))[0];
        if (livre > b.lado) Entrada.dirApertou = true; else Entrada.esqApertou = true;
      }
      if (b.fase === 'pausa') { if (b.lado < b.bossLado) Entrada.dirApertou = true; else if (b.lado > b.bossLado) Entrada.esqApertou = true; else if (n % 24 === 0) Entrada.ataqueApertou = true; }
      J.passo(1 / 60); n++;
    }
    o.estado = J.estado; o.seg = Math.round(n / 60); o.vidas = J.vidas; o.vidaBoss = b.vida;
    return o;
  });
  confere('fora da pausa o raio é bloqueado (premissa provisória)', r.bloqueado, r);
  confere('boss pode ser vencido e a fase termina', r.estado === 'vitoria' && r.vidaBoss === 0, r);

  // V07: derrota no boss recomeça a luta
  r = await p.evaluate(() => {
    const J = Jogo; J.estado = 'fase'; J.vidas = 1; J.fase.chegouPortal = false; J.fase.j.entrando = 0; J.fase.j.x = MUNDOS[J.mundo].fase.portalX;
    for (let i = 0; i < 120 && J.estado !== 'boss'; i++) J.passo(1 / 60);
    for (let i = 0; i < 60 * 20 && J.estado === 'boss'; i++) J.passo(1 / 60);
    for (let i = 0; i < 60 * 4; i++) J.passo(1 / 60);
    Entrada.confirmou = true; J.passo(1 / 60);
    return { estado: J.estado, vidas: J.vidas };
  });
  confere('V07 derrota no boss recomeça a luta', r.estado === 'boss' && r.vidas === 3, r);

  // Escolhas provisórias da rodada 013 (seção 13 da especificação)
  await novaFase(0);
  r = await p.evaluate(() => {
    const J = Jogo, j = J.fase.j, m = J.fase.monstros[0], o = {};
    J.escudo = true; j.x = m.x - 30; J.passo(1 / 60);
    o.vidasComEscudo = J.vidas; o.escudoDepois = J.escudo;
    o.modos = [...new Set(MUNDOS.flatMap(w => w.fase.monstros.map(q => q.modo)))].sort().join(',');
    const anda = J.fase.monstros.find(q => q.modo === 'anda'), x0 = anda.x;
    j.x = 60; for (let i = 0; i < 120; i++) J.passo(1 / 60);
    o.andou = Math.abs(anda.x - x0) > 20 && anda.x >= anda.min && anda.x <= anda.max;
    return o;
  });
  confere('escudo de geleca aguenta um golpe sem tirar vida', r.vidasComEscudo === 3 && r.escudoDepois === false, r);
  confere('monstros: parado, anda, pula e flutua existem; quem anda fica na sua plataforma', r.modos === 'anda,flutua,parado,pula' && r.andou, r);
  r = await p.evaluate(() => {
    const J = Jogo, o = {};
    const luta = pula => {
      J.novaFase(3); J.estado = 'boss'; J.boss = null; J.fase.j.x = MUNDOS[3].fase.portalX; J.estado = 'fase'; J.fase.j.y = 460;
      for (let i = 0; i < 200 && J.estado !== 'boss'; i++) J.passo(1 / 60);
      const b = J.boss; let n = 0, viuChao = false;
      while (n < 60 * 12 && !(viuChao && b.fase === 'pausa')) {
        if (b.tipoAtaque === 'chao' && b.fase === 'aviso') { viuChao = true; if (pula && b.tempo > b.cfg.aviso - 0.2) Entrada.puloApertou = true; }
        else if (b.fase === 'aviso' && b.alvos.indexOf(b.lado) >= 0) { if (b.lado < 1) Entrada.dirApertou = true; else Entrada.esqApertou = true; }
        J.passo(1 / 60); n++;
      }
      return { vidas: J.vidas, viuChao };
    };
    o.semPular = luta(false); o.pulando = luta(true);
    return o;
  });
  confere('golpe no chão (Coelho): acerta quem fica no chão e erra quem pula', r.semPular.viuChao && r.semPular.vidas === 2 && r.pulando.vidas === 3, r);
  r = await p.evaluate(() => {
    const J = Jogo; J.progresso.recordes = [50, 60]; const antes = J.progresso.cor;
    J.estado = 'titulo'; Entrada.corApertou = true; J.passo(1 / 60); const c1 = J.progresso.cor;
    Entrada.corApertou = true; J.passo(1 / 60); const c2 = J.progresso.cor;
    return { antes, c1, c2, cor: CFG.concreto.cor };
  });
  confere('cores: com 110 gotinhas só verde e azul estão liberadas', r.antes === 'verde' && r.c1 === 'azul' && r.c2 === 'verde', r);
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });

  // Escolhas provisórias da rodada 014
  await novaFase(0);
  r = await p.evaluate(() => {
    const J = Jogo, d = MUNDOS[0].fase, j = J.fase.j, o = {};
    const chao = d.plataformas.filter(q => q.chao && q.x >= d.trechos[1].x).sort((a, b) => a.x - b.x)[0];
    j.x = chao.x + 200; j.y = 460; for (let i = 0; i < 5; i++) J.passo(1 / 60);
    o.trecho = J.fase.trecho; const pegas = J.gotinhas;
    J.vidas = 1; j.invul = 0; j.y = 900; for (let i = 0; i < 60 * 5; i++) J.passo(1 / 60);
    o.tela = J.estado; Entrada.confirmou = true; J.passo(1 / 60);
    o.estado = J.estado; o.vidas = J.vidas; o.noRetorno = Math.abs(j.x - d.retornos[1].x) < 2; o.gotinhasMantidas = J.gotinhas === pegas;
    return o;
  });
  confere('ponto de retorno: sem vidas no trecho 2, volta à bandeira do trecho 2', r.trecho === 1 && r.tela === 'derrota' && r.estado === 'fase' && r.vidas === 3 && r.noRetorno && r.gotinhasMantidas, r);
  r = await p.evaluate(() => {
    const J = Jogo, o = {};
    J.novaFase(0); o.sem = JSON.stringify(J.poder);
    J.progresso.liberado = 4; J.novaFase(4); o.com = J.poder;
    const j = J.fase.j; Entrada.puloApertou = true; Entrada.pulo = true; J.passo(1 / 60);
    for (let i = 0; i < 12; i++) J.passo(1 / 60);
    const vy1 = j.vy; Entrada.puloApertou = true; J.passo(1 / 60); o.puloDuplo = j.vy < vy1 - 200;
    Entrada.pulo = false; J.progresso.liberado = 0;
    const d = MUNDOS[4].fase; J.fase.j.x = d.dourada.x; J.fase.j.y = d.dourada.y + 25; J.fase.j.vy = 0; J.passo(1 / 60); o.dourada = J.dourada;
    return o;
  });
  confere('poderes: nenhum no começo; com tudo liberado há raio longo, rápido, forte e pulo duplo', r.sem.includes('"puloDuplo":false') && r.com.puloDuplo && r.com.dano === 2 && r.com.alcance > 500 && r.com.recarga < 0.3 && r.puloDuplo, r);
  confere('gotinha dourada pode ser coletada', r.dourada === true, r);
  r = await p.evaluate(() => MUNDOS.map(w => { const g = w.fase.dourada, ok = !!g && w.fase.retornos.length === 3 && w.fase.retornos.every(q => w.fase.plataformas.some(pl => pl.chao && q.x > pl.x && q.x < pl.x + pl.w)); return ok; }));
  confere('cada mundo tem gotinha dourada e três pontos de retorno em chão firme', r.every(Boolean), r);
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });

  confere('sem erros no navegador', erros.length === 0, erros);
  await nav.close();
  console.log(falhas ? '\n' + falhas + ' verificação(ões) falharam' : '\nTodas as verificações passaram');
  process.exit(falhas ? 1 : 0);
})();
