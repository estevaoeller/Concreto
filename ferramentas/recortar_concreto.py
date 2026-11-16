"""Recorta as poses do Concreto da prancha de estudos e gera uma folha de sprites com fundo transparente.

Uso: python3 ferramentas/recortar_concreto.py
Entrada: assets/concept-art/personagens/concreto-v01.png (alternativa A, verde)
Saída: jogo/img/concreto.png e jogo/js/sprites.js (a imagem embutida, para o jogo abrir sem servidor)

O recorte remove o fundo lilás de fora para dentro e mantém o personagem inteiro, com o contorno; sombras, faíscas e riscos de movimento ficam de fora.
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
    'dispara':  (375, 655, 512, 772),
    'grande':   (5, 55, 362, 348),      # desenho grande do alto da prancha, para as telas de título
}
ALTURA = 232  # altura da folha; os quadros ficam com os pés alinhados embaixo
ALTURA_GRANDE = 230


def recortar(img, caixa):
    """Tira o fundo de fora para dentro e fica com o personagem inteiro, contorno incluído.

    O fundo da prancha é branco ou lilás claro e as sombras são lilás mais escuro. Os brilhos brancos do corpo
    ficam fechados pelo contorno preto, então não são alcançados a partir da beira.
    Partir do verde do corpo (primeira versão) perdia o contorno onde há um brilho claro entre o corpo e o traço.
    """
    a = np.asarray(img.crop(caixa)).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    soma = r + g + b
    lilas = ((b - g >= 5) & (r - g >= 3) & (soma > 400)) | ((b - g >= 12) & (r - g >= 5) & (soma > 200))
    borda = np.zeros_like(lilas); borda[0, :] = borda[-1, :] = borda[:, 0] = borda[:, -1] = True
    mn, mx = a.min(axis=2), a.max(axis=2)
    claro = (mn > 165) & (mx - mn < 34)                                  # branco e cinza claro em volta do personagem
    lilas = lilas | claro
    fundo = ndimage.binary_propagation(borda & lilas, mask=lilas)       # só o fundo ligado à beira do recorte
    frente = ~fundo
    frente[0, :] = frente[-1, :] = frente[:, 0] = frente[:, -1] = False
    rotulos, n = ndimage.label(frente)
    if n == 0:
        raise SystemExit('nada encontrado em %r' % (caixa,))
    tamanhos = ndimage.sum(frente, rotulos, range(1, n + 1))
    corpo = rotulos == (1 + int(np.argmax(tamanhos)))                    # maior pedaço: descarta faíscas, gotas e riscos soltos
    corpo = ndimage.binary_fill_holes(corpo)
    # riscos finos grudados no corpo (redemoinhos da pose de carregar) saem; o corpo, que é grosso, fica
    aberto = ndimage.binary_opening(corpo, structure=np.ones((3, 3), bool), iterations=3)
    rot2, n2 = ndimage.label(aberto)
    if n2:
        aberto = rot2 == (1 + int(np.argmax(ndimage.sum(aberto, rot2, range(1, n2 + 1)))))
        corpo = corpo & ndimage.binary_dilation(aberto, iterations=3)
    pintar = None
    linhas = np.where(corpo[:, -3])[0]
    if len(linhas):  # algo sai pela direita do recorte: é o raio da pose de disparo. Corta rente ao corpo e refaz o traço.
        y0, y1 = linhas.min(), linhas.max()
        vizinhas = np.r_[corpo[max(0, y0 - 6):max(1, y0 - 2)], corpo[y1 + 3:y1 + 7]]
        col = max(int(np.where(l)[0].max()) for l in vizinhas if l.any())
        corpo[y0 - 2:y1 + 3, col + 1:] = False
        pintar = (slice(y0 - 2, y1 + 3), slice(col - 3, col + 1))
    alfa = Image.fromarray((corpo * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.6))
    rgba = img.crop(caixa).convert('RGBA')
    if pintar:
        px = np.asarray(rgba).copy(); px[pintar[0], pintar[1], :3] = (17, 17, 15); rgba = Image.fromarray(px)
    rgba.putalpha(alfa)
    ys, xs = np.where(corpo)
    return rgba.crop((max(0, xs.min() - 2), max(0, ys.min() - 2), xs.max() + 3, ys.max() + 3))


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
