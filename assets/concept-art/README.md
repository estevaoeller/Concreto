# Catálogo de concept art — Concreto

Estudos visuais, não assets finais. As imagens serão adicionadas e revisadas progressivamente. Consultar [prompts](../../prompts/README.md) e [especificação](../../ESPECIFICACAO.md).

## Referência preliminar existente

Criada em 15/11/2026, ainda sem aprovação definitiva. Arquivo previsto: `concreto-estudos-personagem.png` nesta pasta (upload pendente no momento do registro original).

Quatro alternativas: A verde clássico, B azul descolado, C roxo fofo, D laranja aventureiro. A prancha usa A para demonstrar as ações, sem aprovar a escolha definitiva.

Estudos: parado, caminhada, salto com compressão e extensão, gota desprendida, preparação e disparo do raio de geleca, espada e demonstração de plataforma lateral.

Divergência: a espada empunhada pelo protagonista contraria A02. A arma pertence ao monstro; não implementar espada no protagonista. Corações, moedas e outros detalhes ilustrativos não são requisitos.

## Imagens recebidas (2026-11-15)

Enviadas pelo responsável nesta pasta, com os nomes originais do gerador. Não foram renomeadas nem movidas. Status de todas: recebido, sem aprovação do criador registrada.

| Arquivo | Conteúdo | ID do catálogo |
|---|---|---|
| `file_0000000077ec820e9a70dd966e422867.png` | Estudos de personagem: quatro alternativas (A verde, B azul, C roxo, D laranja), animações, raio e espada | Referência preliminar / P01 |
| `a_bright_colorful_cartoon_game_concept_storyboar.png` | Storyboard do Mundo 1: Plantas | S01 |
| `file_00000000a9c0820e8cc64a2e06f702c2.png` | Storyboard do Mundo 2: Nether | S02 |
| `file_000000000714820ebbbdb857f858b745.png` | Storyboard do Mundo 3: Céu | S03 |

Divergências entre as pranchas e a especificação, a resolver com o criador (a especificação prevalece até decisão):

- Estudos de personagem: "pode empunhar uma espada" e o quadro "Ataque: espada" contrariam A02.
- Mundo 1: a luta contra o Cthulhu Higiênico aparece em visão lateral; B04 confirma primeira pessoa.
- Mundo 2: o boss aparece como "Golem de Lava"; a especificação registra a Malgosha como intenção do criador.
- Moedas, blocos com estrela, corações, placas, caixas e os nomes e comportamentos de monstros e obstáculos (por exemplo "Espinho Móvel", "Planta Mordedora", plataformas móveis, lava, espinhos) não são requisitos confirmados.

Uso no protótipo: o visual da Fase 1 em `jogo/` foi redesenhado por código tomando como referência a alternativa A e o storyboard do Mundo 1. Nenhuma imagem foi usada como sprite.

## Catálogo — arquivos previstos

Caminhos relativos a esta pasta. Status inicial: aguardando upload/validação; não afirmar que um arquivo existe até verificar.

| ID | Prancha | Arquivo previsto | Status |
|---|---|---|---|
| P01 | Concreto | personagens/concreto-v01.png | Aguardando |
| P02 | Monstros comuns | personagens/monstros-comuns-v01.png | Aguardando |
| S01 | Mundo 1 — plantas | storyboards/01-plantas-v01.png | Aguardando |
| S02 | Mundo 2 — Nether | storyboards/02-nether-v01.png | Aguardando |
| S03 | Mundo 3 — céu | storyboards/03-ceu-v01.png | Aguardando |
| S04 | Mundo 4 — pelúcias | storyboards/04-pelucias-v01.png | Aguardando |
| S05 | Mundo 5 — blocos | storyboards/05-blocos-v01.png | Aguardando |
| B01 | Cthulhu Higiênico | bosses/01-cthulhu-v01.png | Aguardando |
| B02 | Boss vulcânico / Malgosha | bosses/02-malgosha-referencia-v01.png | Aguardando |
| B03 | Anjo | bosses/03-anjo-v01.png | Aguardando |
| B04 | Coelho de pelúcia | bosses/04-coelho-v01.png | Aguardando |
| B05 | Peça de bloco | bosses/05-bloco-v01.png | Aguardando |

Os IDs deste catálogo são identificadores locais de arte; não substituem os IDs de regras da especificação.

## Fluxo de produção e aprovação

1. Copiar o prompt individual e anexar imagens de referência aprovadas quando disponíveis.
2. Gerar e salvar em PNG; usar os nomes acima ou registrar o nome efetivamente enviado. Incrementar v02, v03 etc. para revisões; não sobrescrever estudos anteriores.
3. No GitHub, abrir a pasta apropriada, escolher Add file → Upload files, enviar o PNG e realizar commit descritivo. Alternativamente, usar git ou a interface de desenvolvimento.
4. Atualizar o status no catálogo (aguardando, recebido, em revisão, aprovado ou substituído). Registrar versão, data, variante escolhida, observações, origem e direitos. Upload não equivale a aprovação.
5. Revisar com o criador. Atualizar especificação e histórico somente se uma decisão de jogo tiver sido efetivamente aprovada.
6. Preparar recursos integráveis e documentar suas características em [assets/game](../game/README.md), sem misturar conceito e arte de produção.

Para cada aprovação, preencher: ID | arquivo/versão | data | opção selecionada | origem/licença | decisão e ressalvas. Se a imagem introduzir detalhes contraditórios, registrar e resolver antes de utilizar.

Ambiente de desenvolvimento previsto na nuvem; plataforma e tecnologia a definir. O repositório é público: evitar dados pessoais nas imagens, prompts e metadados, e avaliar direitos de referências a marcas e personagens antes de distribuição.

## Mundo 1: Plantas

Storyboard revisado com cenário vegetal, plataformas, progressão em três trechos, movimentos do protagonista, raio de geleca, monstros, interação de proximidade e portal. O criador confirmou que o Cthulhu Higiênico é feito de papel higiênico: um rolo com olhos e tentáculos de tiras desenroladas, não uma criatura vegetal. Arquivo previsto: `concreto-storyboard-mundo-1-plantas.png` (upload do PNG pendente). Os exemplos visuais de inimigos, moedas, geometria das plataformas e combate lateral contra o boss são ilustrativos; não alteram os requisitos confirmados, incluindo a perspectiva em primeira pessoa do combate contra o Cthulhu Higiênico.
