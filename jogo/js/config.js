// Concreto — números e regras do jogo num lugar só.
// "confirmado" = decidido pelo criador (ver ESPECIFICACAO.md).
// "PROVISÓRIO" = valor escolhido só para o protótipo funcionar; o criador ainda vai decidir.
var CFG = {
  largura: 960,
  altura: 540,

  concreto: {
    // Cor atual. As quatro alternativas da prancha de estudos ficam em `cores`; a escolha definitiva (P04) segue em aberto.
    cor: '#a8e61d', corEscura: '#1d6b1a', clara: '#c9f545', funda: '#8ed412', mancha: '92,176,10', luz: '240,255,170',
    cores: {
      verde: { nome: 'Verde', gotinhas: 0, cor: '#a8e61d', corEscura: '#1d6b1a', clara: '#c9f545', funda: '#8ed412', mancha: '92,176,10', luz: '240,255,170' },
      azul: { nome: 'Azul', gotinhas: 100, cor: '#3fc8f5', corEscura: '#0f5a8a', clara: '#a4e8ff', funda: '#1fa6dc', mancha: '20,130,190', luz: '225,247,255' },
      roxo: { nome: 'Roxo', gotinhas: 200, cor: '#b673f2', corEscura: '#4a1f8a', clara: '#dcb8ff', funda: '#9048d8', mancha: '110,50,180', luz: '242,228,255' },
      laranja: { nome: 'Laranja', gotinhas: 300, cor: '#ffa62a', corEscura: '#9a4a08', clara: '#ffd47a', funda: '#f08a10', mancha: '210,110,10', luz: '255,242,205' }
    },      // PROVISÓRIO
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
  retornoPorTrecho: true,      // PROVISÓRIO (rodada 014): sem vidas, volta à bandeira do trecho. Com false vale V07 como dito pelo criador: começo da fase.
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
    velocidade: 55,            // PROVISÓRIO: quem anda
    passeio: 130,              // PROVISÓRIO: até onde anda, para cada lado
    forcaPulo: 430,            // PROVISÓRIO: quem pula
    intervaloPulo: 1.7,        // PROVISÓRIO
    alturaVoo: 70,             // PROVISÓRIO: quem flutua sobe e desce até aqui
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
