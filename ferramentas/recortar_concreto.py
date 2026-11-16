"""Recorta as poses do Concreto da prancha de estudos e gera uma folha de sprites com fundo transparente.

Uso: python3 ferramentas/recortar_concreto.py
Entrada: assets/concept-art/personagens/concreto-v01.png (alternativa A, verde)
Saída: jogo/img/concreto.png e jogo/js/sprites.js (a imagem embutida, para o jogo abrir sem servidor)

O recorte separa o personagem pelo verde do corpo e do contorno; sombras, faíscas e riscos de movimento ficam de fora.
"""
import base64, io, json, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

RAIZ = os.path.join(os.path.dirname(__file__), '..')
PRANCHA = os.path.join(RAIZ, 'assets', 'concept-art', 'personagens', 'concreto-v01.png')

# nome: (x0, y0, x1, y1) na prancha de 1536x1024
POSES = {
    'parado':   (55, 440, 205, 568),
    'anda1':    (240, 445, 362, 568),
    'anda2':    (362, 440, 482, 568),
    'anda3':    (482, 445, 605, 568),
    'agacha':   (685, 470, 828, 568),
    'sobe':     (822, 398, 948, 510),
    'desce':    (940, 430, 1060, 515),
    'pousa':    (1045, 480, 1180, 568),
    'carrega':  (118, 660, 262, 772),
    'dispara':  (375, 655, 506, 772),
    'grande':   (5, 55, 362, 348),      # desenho grande do alto da prancha, para as telas de título
}
ALTURA = 232  # altura da folha; os quadros ficam com os pés alinhados embaixo
ALTURA_GRANDE = 230


def recortar(img, caixa):
    a = np.asarray(img.crop(caixa)).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    verde = (g > r + 12) & (g > b + 28)                 # corpo, brilho esverdeado e contorno
    rotulos, n = ndimage.label(verde)
    if n == 0:
        raise SystemExit('nada encontrado em %r' % (caixa,))
    tamanhos = ndimage.sum(verde, rotulos, range(1, n + 1))
    corpo = rotulos == (1 + int(np.argmax(tamanhos)))    # só o maior pedaço: descarta gotas e riscos soltos
    corpo = ndimage.binary_fill_holes(corpo)             # olhos, boca e brilhos brancos ficam dentro
    corpo = ndimage.binary_opening(corpo, iterations=1)
    # o contorno é verde bem escuro, quase preto: entra o que é escuro e encosta no corpo
    escuro = (r + g + b) < 300
    perto = ndimage.binary_dilation(corpo, iterations=7)
    corpo = ndimage.binary_propagation(corpo, mask=corpo | (escuro & perto))
    corpo = ndimage.binary_dilation(corpo, iterations=1) # pega a borda suavizada do traço
    corpo = ndimage.binary_fill_holes(corpo)
    alfa = Image.fromarray((corpo * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.7))
    rgba = img.crop(caixa).convert('RGBA')
    rgba.putalpha(alfa)
    ys, xs = np.where(corpo)
    return rgba.crop((xs.min() - 2, ys.min() - 2, xs.max() + 3, ys.max() + 3))


def main():
    img = Image.open(PRANCHA).convert('RGB')
    quadros, x, mapa = [], 0, {}
    for nome, caixa in POSES.items():
        q = recortar(img, caixa)
        if nome == 'grande': q = q.resize((round(q.width * ALTURA_GRANDE / q.height), ALTURA_GRANDE), Image.LANCZOS)
        quadros.append((nome, q))
    larg = sum(q.width + 4 for _, q in quadros)
    folha = Image.new('RGBA', (larg, ALTURA), (0, 0, 0, 0))
    for nome, q in quadros:
        folha.paste(q, (x, ALTURA - q.height))           # pés alinhados embaixo
        mapa[nome] = {'x': x, 'y': ALTURA - q.height, 'w': q.width, 'h': q.height}
        x += q.width + 4
    os.makedirs(os.path.join(RAIZ, 'jogo', 'img'), exist_ok=True)
    folha.save(os.path.join(RAIZ, 'jogo', 'img', 'concreto.png'), optimize=True)
    mem = io.BytesIO(); folha.save(mem, 'PNG', optimize=True)
    with open(os.path.join(RAIZ, 'jogo', 'js', 'sprites.js'), 'w', encoding='utf-8') as f:
        f.write('// Gerado por ferramentas/recortar_concreto.py a partir da prancha de estudos. Não editar à mão.\n')
        f.write('var SPRITES = { concreto: { quadros: %s,\n  dados: "data:image/png;base64,%s" } };\n' % (json.dumps(mapa), base64.b64encode(mem.getvalue()).decode()))
    print('folha', folha.size, 'bytes', len(mem.getvalue()), json.dumps(mapa))


if __name__ == '__main__':
    main()
