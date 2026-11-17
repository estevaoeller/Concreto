# Catálogo de concept art — Concreto

Estudos visuais, não assets finais. As imagens serão adicionadas e revisadas progressivamente. Consultar [prompts](../../prompts/README.md) e [especificação](../../ESPECIFICACAO.md).

## Referência preliminar existente

Criada em 15/11/2026, ainda sem aprovação definitiva. Arquivo recebido: [personagens/concreto-v01.png](personagens/concreto-v01.png).

Quatro alternativas: A verde clássico, B azul descolado, C roxo fofo, D laranja aventureiro. A prancha usa A para demonstrar as ações, sem aprovar a escolha definitiva.

Estudos: parado, caminhada, salto com compressão e extensão, gota desprendida, preparação e disparo do raio de geleca, espada e demonstração de plataforma lateral.

Divergência: a espada empunhada pelo protagonista contraria A02. A arma pertence ao monstro; não implementar espada no protagonista. Corações, moedas e outros detalhes ilustrativos não são requisitos.

## Catálogo — inventário de imagens

Caminhos relativos a esta pasta. Inventário verificado em 15/11/2026: 12 de 12 pranchas recebidas; nenhuma aprovação definitiva presumida.

| ID | Prancha | Arquivo previsto | Status |
|---|---|---|---|
| P01 | Concreto| [personagens/concreto-v01.png](personagens/concreto-v01.png) | Recebido / em revisão |
| P02 | Monstros comuns | [personagens/monstros-comuns-v01.png](personagens/monstros-comuns-v01.png) | Recebido / em revisão |
| S01 | Mundo 1 — plantas| [storyboards/01-plantas-v01.png](storyboards/01-plantas-v01.png) | Recebido / em revisão |
| S02 | Mundo 2 — Nether| [storyboards/02-nether-v01.png](storyboards/02-nether-v01.png) | Recebido / em revisão |
| S03 | Mundo 3 — céu| [storyboards/03-ceu-v01.png](storyboards/03-ceu-v01.png) | Recebido / em revisão |
| S04 | Mundo 4 — pelúcias| [storyboards/04-pelucias-v01.png](storyboards/04-pelucias-v01.png) | Recebido / em revisão |
| S05 | Mundo 5 — blocos | [storyboards/05-blocos-v01.png](storyboards/05-blocos-v01.png) | Recebido / em revisão |
| B01 | Cthulhu Higiênico| [bosses/01-cthulhu-v01.png](bosses/01-cthulhu-v01.png) | Recebido / em revisão |
| B02 | Boss vulcânico / Malgosha| [bosses/02-malgosha-referencia-v01.png](bosses/02-malgosha-referencia-v01.png) | Recebido / em revisão |
| B03 | Anjo| [bosses/03-anjo-v01.png](bosses/03-anjo-v01.png) | Recebido / em revisão |
| B04 | Coelho de pelúcia| [bosses/04-coelho-v01.png](bosses/04-coelho-v01.png) | Recebido / em revisão |
| B05 | Peça de bloco| [bosses/05-bloco-v01.png](bosses/05-bloco-v01.png) | Recebido / em revisão |

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

Storyboard revisado com cenário vegetal, plataformas, progressão em três trechos, movimentos do protagonista, raio de geleca, monstros, interação de proximidade e portal. O criador confirmou que o Cthulhu Higiênico é feito de papel higiênico: um rolo com olhos e tentáculos de tiras desenroladas, não uma criatura vegetal. Arquivo recebido: [storyboards/01-plantas-v01.png](storyboards/01-plantas-v01.png). Os exemplos visuais de inimigos, moedas, geometria das plataformas e combate lateral contra o boss são ilustrativos; não alteram os requisitos confirmados, incluindo a perspectiva em primeira pessoa do combate contra o Cthulhu Higiênico.

## Ressalvas da revisão visual

- S02: o storyboard do Nether mostra um Golem de Lava em vez da vilã prevista; corrigir em revisão futura (v02), preservando v01.
- B01: a cena de combate lateral não representa a perspectiva confirmada em primeira pessoa; o aviso visual deve usar papel higiênico. Revisar antes da produção.
- B05: o arquivo enviado corresponde à prancha de boss de blocos; a geração foi interrompida, portanto conferir integridade visual e conteúdo antes da aprovação.
- Os exemplos de ataques, armas, moedas e obstáculos não são requisitos novos. O protagonista não usa espada. O boss final aparece sempre.
- Nenhuma prancha prevista pendente de upload. P02 contém vinte propostas de monstros (quatro por mundo), não necessariamente tipos jogáveis aprovados. S05 contém propostas de obstáculos e mecânicas ainda não aprovadas.

## Folhas de sprites

Imagens feitas para recorte: fundo magenta liso, sem texto, poses separadas. Enviadas pelo responsável em 16/11/2026 com os nomes do gerador e reorganizadas em `sprites/` com nome e versão; o conteúdo dos arquivos não foi alterado. Estado de todas: recebido, em avaliação.

| ID | Folha | Arquivo | Conteúdo | Uso |
|---|---|---|---|---|
| SP01 | Concreto | [sprites/concreto-sprites-v01.png](sprites/concreto-sprites-v01.png) | 12 poses: parado, três de andar, agachar, subir, descer, pousar, carregar, disparar, susto, feliz | No jogo |
| SP02 | Cthulhu Higiênico | [sprites/cthulhu-sprites-v01.png](sprites/cthulhu-sprites-v01.png) | 4 estados de frente: neutro, preparando, atacando, cansado | Retirado do jogo (rodada 022) |
| SP03 | Bruxa Vulcânica | [sprites/bruxa-vulcanica-sprites-v01.png](sprites/bruxa-vulcanica-sprites-v01.png) | 4 estados de frente | Retirado do jogo (rodada 022) |
| SP04 | Anjo | [sprites/anjo-sprites-v01.png](sprites/anjo-sprites-v01.png) | 4 estados de frente | Retirado do jogo (rodada 022) |
| SP05 | Coelho de Pelúcia | [sprites/coelho-sprites-v01.png](sprites/coelho-sprites-v01.png) | 4 estados de frente | Retirado do jogo (rodada 022) |
| SP06 | Urso de pelúcia | [sprites/urso-sprites-v01.png](sprites/urso-sprites-v01.png) | 4 estados de frente | Não usado: o boss do mundo 4 é o coelho |

Não há folha do Guardião de Blocos; ele continua desenhado por código.

## Uso no jogo

Só o Concreto vem da folha de sprites. O criador não gostou dos bosses em sprite, e eles voltaram a ser desenhados por código, como os monstros, os cenários e os itens. Tudo é desenhado por código, com as pranchas como referência. Detalhes da preparação em [assets/game](../game/README.md).
