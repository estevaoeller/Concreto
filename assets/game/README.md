# Recursos de produção do jogo

Reservado para recursos efetivamente integráveis ao jogo, separados dos estudos visuais em concept-art.

Estrutura proposta quando o motor for escolhido: sprites/ (imagens e animações), backgrounds/ (cenários), ui/ (interface), effects/ (efeitos), audio/ (música e sons). Não criar assets definitivos antes de validar aparência e especificações do pipeline.

Cada recurso deve registrar origem, licença/direitos, versão, arquivo conceitual de referência e estado de aprovação. Documentar dimensões, transparência, pivô e frames conforme o motor. Nenhum asset final publicado nesta etapa.

## Recursos integrados

| Recurso | Arquivo | Origem | Versão | Estado |
|---|---|---|---|---|
| Concreto — 10 poses de jogo e 1 desenho grande | `jogo/img/concreto.png` (embutido em `jogo/js/sprites.js`) | Recorte de `assets/concept-art/personagens/concreto-v01.png`, alternativa A (verde), feito por `ferramentas/recortar_concreto.py` | v01 | Em avaliação pelo responsável e pelo criador; não aprovado como arte final |

Características: folha única de 1510×232 px, fundo transparente, pés alinhados na base, todas as poses viradas para a direita. Quadros: parado, anda1, anda2, anda3, agacha, sobe, desce, pousa, carrega, dispara e grande. As posições ficam em `SPRITES.concreto.quadros`.

Preparação aplicada: separação do personagem pelo verde do corpo e pelo contorno escuro; sombras, faíscas, gotas soltas e riscos de movimento foram descartados; o feixe do raio foi cortado da pose de disparo. As cores azul, roxa e laranja são obtidas no jogo girando o matiz do verde, não das alternativas B, C e D da prancha.

Limitações conhecidas: pequenas falhas no contorno em algumas poses; a pose de disparo tem o lado direito cortado reto; as poses têm cerca de 110 px de altura, suficientes para o tamanho de jogo, mas o desenho grande perde nitidez em telas muito grandes. Origem em imagem gerada: avaliar direitos antes de distribuição comercial.

O desenho por código continua disponível: opção "Desenho" na tela inicial (tecla V) ou `visual: 'codigo'` em `jogo/js/config.js`. A branch `desenho-por-codigo-v1` guarda o estado anterior a esta integração.
