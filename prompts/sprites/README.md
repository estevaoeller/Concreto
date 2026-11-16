# Prompts para folhas de sprites

As pranchas de concept art foram feitas para mostrar ideias: têm títulos, molduras, sombras, faíscas e poses em tamanhos diferentes. Para virar imagem de jogo, cada pose precisa ser recortada e limpa, e o resultado depende de quanto a prancha atrapalha.

Uma folha de sprites é uma imagem feita só para o recorte. Regras que valem para todos os prompts desta pasta:

- Fundo liso de uma cor só, magenta puro (#FF00FF). Nada no jogo usa essa cor, então o fundo sai inteiro sem comer o contorno. Se o gerador oferecer fundo transparente, melhor ainda.
- Sem texto, título, moldura, legenda, seta, sombra no chão, faísca, risco de movimento ou brilho em volta.
- Poses bem separadas, sem encostar umas nas outras nem na borda. Pelo menos um quarto da largura do personagem de espaço entre elas.
- Mesmo tamanho, mesmas proporções e mesmo traço em todas as poses. Pés na mesma linha de base.
- Personagem virado para a direita, visto de lado.
- Contorno escuro, grosso e fechado em toda a volta.
- Anexar sempre a referência já existente do personagem e pedir para manter exatamente o mesmo desenho.

Ordem sugerida: Concreto, depois os monstros do Mundo 1, depois o Cthulhu Higiênico. Gerar um de cada vez e conferir antes de seguir.

Salvar em `assets/concept-art/sprites/` com nome e versão (por exemplo `concreto-sprites-v01.png`) e registrar no catálogo. Upload não equivale a aprovação. O recorte é feito por `ferramentas/recortar_concreto.py`, que precisa ser ajustado para as posições da folha nova.

## 1. Concreto

Anexar: `assets/concept-art/personagens/concreto-v01.png`.

> Crie uma folha de sprites para jogo de plataforma 2D, usando exatamente o personagem da imagem anexa (a geleca verde-limão "Concreto", alternativa A): mesma forma, mesmo rosto, mesmo contorno preto grosso, mesmas manchas e brilhos. Não redesenhe o personagem.
>
> Fundo: magenta puro #FF00FF, liso, sem degradê. Sem texto, sem molduras, sem sombras no chão, sem faíscas, sem riscos de movimento, sem gotas soltas, sem efeitos em volta.
>
> Organize em uma grade de 4 colunas por 3 linhas, com bastante espaço entre as poses. Todas do mesmo tamanho, viradas para a direita, com os pés na mesma linha de base em cada linha da grade.
>
> Linha 1: parado; andando passo 1; andando passo 2; andando passo 3.
> Linha 2: agachado antes de pular; subindo no pulo, esticado; caindo, inclinado; pousando, achatado.
> Linha 3: carregando o raio, de olhos apertados; disparando, de boca aberta e olhar bravo, SEM desenhar o raio; levando um golpe, assustado; comemorando, feliz.
>
> O personagem não segura espada, faca nem qualquer objeto.

## 2. Monstros do Mundo 1

Anexar: `assets/concept-art/personagens/monstros-comuns-v01.png`.

> Crie uma folha de sprites para jogo de plataforma 2D com os quatro monstros do "Mundo 1 — Plantas" da imagem anexa: Planta Mordedora, Espinho Móvel, Cogumelo Saltador e Semente Brotante. Mantenha exatamente o desenho, as cores e o contorno de cada um.
>
> Fundo: magenta puro #FF00FF, liso. Sem texto, sem molduras, sem sombras no chão, sem faíscas, sem riscos de movimento.
>
> Grade de 3 colunas por 4 linhas, uma linha por monstro, com bastante espaço entre as poses. Todos virados para a direita, pés na mesma linha de base.
>
> Coluna 1: parado. Coluna 2: percebeu alguém, alerta. Coluna 3: atacando, bravo, SEM desenhar a faca (a faca é acrescentada pelo jogo).

## 3. Cthulhu Higiênico

Anexar: `assets/concept-art/bosses/01-cthulhu-v01.png`.

> Crie uma folha de sprites com o boss "Cthulhu Higiênico" da imagem anexa, visto DE FRENTE, olhando para quem joga: rolo de papel higiênico com olhos amarelos bravos, tentáculos de tiras de papel, manto roxo com barra dourada e medalhão. Mantenha exatamente o desenho da imagem anexa.
>
> Fundo: magenta puro #FF00FF, liso. Sem texto, sem molduras, sem sombras, sem cenário, sem efeitos em volta.
>
> Quatro poses lado a lado, do mesmo tamanho, bem separadas: neutro, imponente; preparando o ataque, olhos mais acesos; atacando, tentáculos abertos; cansado, tonto, olhos em X e tentáculos caídos.
