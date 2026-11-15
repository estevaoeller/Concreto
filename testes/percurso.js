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
  const novaFase = async () => { await p.goto(pagina); await p.waitForTimeout(300); await p.keyboard.press('Enter'); await p.waitForTimeout(300); };

  await p.goto(pagina); await p.waitForTimeout(400); await foto('1-titulo');
  await p.keyboard.press('Enter'); await p.waitForTimeout(500); await foto('2-fase');

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
  confere('V07 sem vidas recomeça a fase do início', r.depois === 'fase' && r.vidas === 3 && r.x === 90, r);

  // C01–C03, M01–M03: robô atravessa a fase inteira andando, pulando e atirando
  await novaFase();
  r = await p.evaluate(() => {
    const J = Jogo, d = FASE1; let n = 0;
    const apoio = (x, y) => d.plataformas.some(pl => x > pl.x && x < pl.x + pl.w && pl.y >= y - 2);
    while (J.estado === 'fase' && n < 60 * 240) {
      const j = J.fase.j;
      const m = J.fase.monstros.find(m => m.vida > 0 && m.x > j.x && m.x - j.x < 190 && Math.abs(m.y - j.y) < 60);
      Entrada.dir = !m || !j.noChao;
      if (n % 25 === 0) Entrada.ataqueApertou = true;
      if (j.noChao && !m && !apoio(j.x + 36, j.y)) { Entrada.puloApertou = true; Entrada.pulo = true; }
      else if (j.noChao) Entrada.pulo = false;
      J.passo(1 / 60); n++;
    }
    Entrada.dir = Entrada.pulo = false;
    return { estado: J.estado, x: Math.round(J.fase.j.x), seg: Math.round(n / 60), vidas: J.vidas, gotinhas: J.gotinhas, total: d.gotinhas.length };
  });
  confere('C01–C03 a fase pode ser atravessada até o portal', r.estado === 'entrando', r);
  await p.waitForTimeout(250); await foto('3-portal');

  // F05: entrou no portal, enfrenta o boss (20 chegadas seguidas)
  r = await p.evaluate(() => {
    const J = Jogo; let boss = 0;
    for (let k = 0; k < 20; k++) {
      J.estado = 'fase'; J.fase.chegouPortal = false; J.fase.j.entrando = 0; J.fase.j.x = FASE1.portalX; J.fase.j.y = 460; J.fase.j.vy = 0;
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
    J.fase.chegouPortal = false; J.fase.j.entrando = 0; J.fase.j.x = FASE1.portalX;
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
  await p.waitForTimeout(400); await foto('5-vitoria');

  // V07: derrota no boss recomeça a luta
  r = await p.evaluate(() => {
    const J = Jogo; J.estado = 'fase'; J.vidas = 1; J.fase.chegouPortal = false; J.fase.j.entrando = 0; J.fase.j.x = FASE1.portalX;
    for (let i = 0; i < 120 && J.estado !== 'boss'; i++) J.passo(1 / 60);
    for (let i = 0; i < 60 * 20 && J.estado === 'boss'; i++) J.passo(1 / 60);
    for (let i = 0; i < 60 * 4; i++) J.passo(1 / 60);
    Entrada.confirmou = true; J.passo(1 / 60);
    return { estado: J.estado, vidas: J.vidas };
  });
  confere('V07 derrota no boss recomeça a luta', r.estado === 'boss' && r.vidas === 3, r);

  confere('sem erros no navegador', erros.length === 0, erros);
  await nav.close();
  console.log(falhas ? '\n' + falhas + ' verificação(ões) falharam' : '\nTodas as verificações passaram');
  process.exit(falhas ? 1 : 0);
})();
