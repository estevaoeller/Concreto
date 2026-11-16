// Concreto — números e regras do jogo num lugar só.
// "confirmado" = decidido pelo criador (ver ESPECIFICACAO.md).
// "PROVISÓRIO" = valor escolhido só para o protótipo funcionar; o criador ainda vai decidir.
var CFG = {
  largura: 960,
  altura: 540,

  concreto: {
    cor: '#a8e61d',            // PROVISÓRIO: verde da alternativa A da prancha de estudos (P04 em aberto)
    corEscura: '#1d6b1a',      // PROVISÓRIO
    velocidade: 260,           // PROVISÓRIO (px/s)
    forcaPulo: 680,            // PROVISÓRIO
    gravidade: 1800,           // PROVISÓRIO
    puloDuplo: false,          // PROVISÓRIO (pendente em M)
    toleranciaBorda: 0.1,      // PROVISÓRIO: ainda dá para pular logo depois de sair da beirada
    memoriaPulo: 0.12,         // PROVISÓRIO: apertar o pulo um pouco antes de pousar também vale
    intervaloGota: 2.2         // PROVISÓRIO (P03: frequência não definida)
  },

  vidas: 3,                    // confirmado (V01)
  invencivelAposDano: 1.2,     // existência confirmada (V05); duração PROVISÓRIA
  empurrao: { vx: 320, vy: 380 }, // confirmado que existe (V03); força PROVISÓRIA
  quedaTiraVida: true,         // confirmado (V06): cair no buraco tira 1 vida e volta para a última plataforma

  mola: { forca: 1.45 },       // PROVISÓRIO: a almofada joga 1,45 vez mais alto que o pulo

  raio: {
    velocidade: 700,           // PROVISÓRIO
    alcance: 380,              // PROVISÓRIO
    recarga: 0.35,             // PROVISÓRIO
    dano: 1                    // PROVISÓRIO
  },

  monstro: {
    vida: 2,                   // PROVISÓRIO (quantos raios aguenta)
    anda: false,               // "representação parada" (I02); deslocamento pendente
    distanciaFaca: 130,        // PROVISÓRIO (I04: "muito perto")
    preparoFaca: 0.7,          // PROVISÓRIO (tempo com a faca à mostra antes do golpe)
    duracaoGolpe: 0.25,        // PROVISÓRIO
    descanso: 0.9,             // PROVISÓRIO
    alcanceFaca: 62            // PROVISÓRIO
  },

  // Ciclo de dia e noite: retirado pelo criador na rodada 010 (código removido na rodada 012; ver histórico do git).

  boss: {
    // Valores padrão. Nome, vida e tempos de cada boss ficam em mundos.js.
    ataquesPorCiclo: 2,        // confirmado (B01)
    pausa: 10,                 // confirmado (B01), segundos
    golpe: 0.4,                // PROVISÓRIO
    entreAtaques: 0.6,         // PROVISÓRIO
    danoSoNaPausa: true,       // PROVISÓRIO (pendente: dano fora da janela)
    desviarPelosLados: true,   // PROVISÓRIO (interpretação de "bater nos lados": andar para o lado para escapar)
    recomecaNoBoss: true       // confirmado (V07): perdeu no boss, recomeça a luta
  },

  som: true                    // PROVISÓRIO (sons simples de teste)
};
