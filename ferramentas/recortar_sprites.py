"""Recorta as folhas de sprites de fundo magenta e gera jogo/js/sprites.js.

Uso: python3 ferramentas/recortar_sprites.py [--com-bosses]   (precisa de Pillow, numpy e scipy)
Entrada: assets/concept-art/sprites/*-sprites-v01.png
Saída: jogo/js/sprites.js, com cada folha recortada embutida (WebP com transparência), para o jogo abrir sem servidor.

Como funciona: o magenta é removido; cada personagem é um pedaço separado; ficam os N maiores pedaços,
o que descarta faíscas e rabiscos soltos; os quadros são ordenados em linhas e colunas e nomeados.
"""
import base64, io, json, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

RAIZ = os.path.join(os.path.dirname(__file__), '..')
PASTA = os.path.join(RAIZ, 'assets', 'concept-art', 'sprites')
ESTADOS = ['neutro', 'prepara', 'ataca', 'cansado']

# nome no jogo: (arquivo, linhas, nomes dos quadros, altura máxima em pixels)
FOLHAS = {
    'concreto': ('concreto-sprites-v01.png', 3,
                 ['parado', 'anda1', 'anda2', 'anda3', 'agacha', 'sobe', 'desce', 'pousa', 'carrega', 'dispara', 'susto', 'feliz'], 200),
}
# Folhas dos bosses: o criador preferiu os bosses desenhados por código (rodada 022).
# Ficam fora do jogo; para voltar a usá-las: python3 ferramentas/recortar_sprites.py --com-bosses
FOLHAS_BOSSES = {
    'cthulhu': ('cthulhu-sprites-v01.png', 1, ESTADOS, 380),
    'rainha': ('bruxa-vulcanica-sprites-v01.png', 1, ESTADOS, 380),
    'anjo': ('anjo-sprites-v01.png', 1, ESTADOS, 380),
    'coelho': ('coelho-sprites-v01.png', 1, ESTADOS, 380),
}


def recortar_folha(caminho, linhas, nomes, alt_max):
    img = Image.open(caminho).convert('RGB')
    a = np.asarray(img).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    magenta = (r > 150) & (b > 150) & (g < 120) & (r - g > 80) & (b - g > 80)
    forte = ndimage.binary_dilation((r > 190) & (b > 190) & (g < 90), iterations=1)
    frente = ndimage.binary_erosion(~magenta, iterations=1)           # tira a beirada misturada com o magenta
    rot, n = ndimage.label(frente)
    tam = ndimage.sum(frente, rot, range(1, n + 1))
    maiores = np.argsort(tam)[::-1][:len(nomes)] + 1                   # só os personagens; faíscas e rabiscos saem
    pedacos = []
    for i in maiores:
        m = ndimage.binary_fill_holes(rot == i) & ~forte      # buracos de magenta no meio do desenho continuam vazados
        ys, xs = np.where(m)
        pedacos.append((ys.mean(), xs.mean(), m, (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)))
    pedacos.sort(key=lambda p: p[0])
    por = len(nomes) // linhas
    ordem = []
    for l in range(linhas):
        ordem += sorted(pedacos[l * por:(l + 1) * por], key=lambda p: p[1])
    quadros = []
    for (_, _, m, cx) in ordem:
        alfa = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.7))
        q = img.convert('RGBA'); q.putalpha(alfa)
        quadros.append(q.crop((max(0, cx[0] - 2), max(0, cx[1] - 2), cx[2] + 2, cx[3] + 2)))
    esc = min(1.0, alt_max / max(q.height for q in quadros))
    quadros = [q.resize((max(1, round(q.width * esc)), max(1, round(q.height * esc))), Image.LANCZOS) for q in quadros]
    alt = max(q.height for q in quadros)
    folha = Image.new('RGBA', (sum(q.width + 4 for q in quadros), alt), (0, 0, 0, 0))
    mapa, x = {}, 0
    for nome, q in zip(nomes, quadros):
        folha.paste(q, (x, alt - q.height))                             # pés alinhados embaixo
        mapa[nome] = {'x': x, 'y': alt - q.height, 'w': q.width, 'h': q.height}
        x += q.width + 4
    return folha, mapa


def main():
    saida, previa = {}, os.environ.get('PREVIA')
    import sys
    folhas = dict(FOLHAS, **(FOLHAS_BOSSES if '--com-bosses' in sys.argv else {}))
    for nome, (arq, linhas, nomes, alt_max) in folhas.items():
        folha, mapa = recortar_folha(os.path.join(PASTA, arq), linhas, nomes, alt_max)
        mem = io.BytesIO(); folha.save(mem, 'WEBP', quality=92, method=6)
        saida[nome] = {'quadros': mapa, 'dados': 'data:image/webp;base64,' + base64.b64encode(mem.getvalue()).decode()}
        if previa: folha.save(os.path.join(previa, nome + '.png'))
        print(nome, folha.size, len(mem.getvalue()) // 1024, 'KB')
    with open(os.path.join(RAIZ, 'jogo', 'js', 'sprites.js'), 'w', encoding='utf-8') as f:
        f.write('// Gerado por ferramentas/recortar_sprites.py a partir das folhas em assets/concept-art/sprites. Não editar à mão.\n')
        f.write('var SPRITES = ' + json.dumps(saida) + ';\n')


if __name__ == '__main__':
    main()
