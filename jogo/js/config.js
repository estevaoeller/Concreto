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

  tempo: {
    ativo: false,              // DESLIGADO na rodada 010: o criador retirou a noite (T01/T02 substituídas). Reversível.
    duracaoDia: 30 * 60,       // confirmado (T01), em segundos
    duracaoNoite: 30 * 60,     // confirmado (T01)
    comecaDeDia: true,         // PROVISÓRIO
    contaSoJogando: true,      // PROVISÓRIO (relógio do jogo, não o relógio de verdade)
    atalhoDeTeste: true        // FERRAMENTA DE TESTE: tocar no sol/lua (ou tecla N) pula para o outro período
  },

  portal: {
    chanceBoss: 1,             // confirmado (F05, rodada 011): entrou no portal, enfrenta o boss
    chanceBossNoite: 0.5,      // só vale com tempo.ativo = true (regra antiga T02)
    chanceBossDia: 0,          // só vale com tempo.ativo = true
    precisaVencerBoss: true    // PROVISÓRIO
  },

  boss: {
    nome: 'Cthulhu Higiênico', // confirmado (B03); boss da fase 1 confirmado (F04)
    vida: 24,                  // PROVISÓRIO
    ataquesPorCiclo: 2,        // confirmado (B01)
    pausa: 10,                 // confirmado (B01), segundos
    aviso: 1.1,                // PROVISÓRIO (tempo do papel higiênico de aviso — B05)
    golpe: 0.4,                // PROVISÓRIO
    entreAtaques: 0.6,         // PROVISÓRIO
    danoSoNaPausa: true,       // PROVISÓRIO (pendente: dano fora da janela)
    ondaAbaixoDe: 0.5,         // PROVISÓRIO: com menos da metade da vida, o golpe cobre dois lados (sobra um seguro)
    trocaDeLado: 2.5,          // PROVISÓRIO (na pausa o boss muda de lado a cada X s)
    desviarPelosLados: true,   // PROVISÓRIO (interpretação de "bater nos lados": andar para o lado para escapar)
    recomecaNoBoss: true       // confirmado (V07): perdeu no boss, recomeça a luta
  },

  som: true                    // PROVISÓRIO (sons simples de teste)
};
