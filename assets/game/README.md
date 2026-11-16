# Recursos de produção do jogo

Reservado para recursos efetivamente integráveis ao jogo, separados dos estudos visuais em concept-art.

Estrutura proposta quando o motor for escolhido: sprites/ (imagens e animações), backgrounds/ (cenários), ui/ (interface), effects/ (efeitos), audio/ (música e sons). Não criar assets definitivos antes de validar aparência e especificações do pipeline.

Cada recurso deve registrar origem, licença/direitos, versão, arquivo conceitual de referência e estado de aprovação. Documentar dimensões, transparência, pivô e frames conforme o motor. Nenhum asset final publicado nesta etapa.

## Recursos integrados

Todos em avaliação pelo responsável e pelo criador; nenhum aprovado como arte final.

| Recurso | Origem | Quadros |
|---|---|---|
| Concreto | `assets/concept-art/sprites/concreto-sprites-v01.png` | parado, anda1, anda2, anda3, agacha, sobe, desce, pousa, carrega, dispara, susto, feliz |
| Cthulhu Higiênico | `assets/concept-art/sprites/cthulhu-sprites-v01.png` | neutro, prepara, ataca, cansado |
| Bruxa Vulcânica | `assets/concept-art/sprites/bruxa-vulcanica-sprites-v01.png` | neutro, prepara, ataca, cansado |
| Anjo | `assets/concept-art/sprites/anjo-sprites-v01.png` | neutro, prepara, ataca, cansado |
| Coelho de Pelúcia | `assets/concept-art/sprites/coelho-sprites-v01.png` | neutro, prepara, ataca, cansado |

Formato: as folhas recortadas ficam embutidas em `jogo/js/sprites.js` (WebP com transparência), para o jogo abrir sem servidor. O arquivo é gerado por `ferramentas/recortar_sprites.py`; não editar à mão. As posições de cada quadro ficam em `SPRITES.<nome>.quadros`. Pés alinhados na base; Concreto virado para a direita; bosses de frente.

Preparação: o fundo magenta é removido; cada personagem é um pedaço separado; ficam os maiores pedaços, o que descarta faíscas e rabiscos soltos; a beirada misturada com o magenta é aparada. O Concreto fica na resolução original (cerca de 200 px de altura) e os bosses são reduzidos a 380 px.

Cores: azul, roxo e laranja do Concreto são obtidos no jogo girando o matiz do verde da folha.

Uso dos estados dos bosses: neutro na entrada e entre os ataques, prepara durante o aviso, ataca no golpe, cansado na pausa de 10 segundos e na derrota.

Histórico: antes das folhas, o Concreto foi recortado da prancha de estudos `personagens/concreto-v01.png`. A primeira versão desse recorte perdia trechos do contorno e foi reprovada pelo responsável; a segunda foi substituída pelas folhas de sprites, que são feitas para recorte.

Limitações: não há folha do Guardião de Blocos nem dos monstros; as faíscas e o rabisco de tontura das folhas dos bosses são descartados no recorte. Origem em imagem gerada: avaliar direitos antes de distribuição comercial.

O desenho por código continua disponível: opção "Desenho" na tela inicial (tecla V) ou `visual: 'codigo'` em `jogo/js/config.js`.
