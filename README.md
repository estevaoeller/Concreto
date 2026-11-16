# Concreto

Jogo de plataforma 2D em que o Concreto, um alienígena de geleca com formato de fantasma, atravessa cinco mundos para recuperar as peças da sua nave. A exploração é vista de lado; as lutas contra os bosses são em primeira pessoa.

## Estado atual

Especificação v1.0 (2026-11-16). O jogo está completo em protótipo: cinco mundos, cada um com fase em três trechos, monstros próprios, portal e boss. Está em validação com o criador.

Parte das regras é decisão do criador e parte foi escolhida pelo desenvolvimento, por delegação do responsável, para o jogo ficar jogável. A especificação marca a origem de cada regra. Escolha delegada não é requisito.

## Como jogar

Abrir `jogo/index.html` no navegador. Não precisa instalar nada nem de internet. Com o GitHub Pages ativado em `main`, o jogo também abre em https://estevaoeller.github.io/Concreto/.

| Ação | Teclado | Toque |
|---|---|---|
| Andar | Setas ou A/D | ◀ ▶ |
| Pular | Espaço, seta para cima ou W | PULO |
| Raio de geleca | X, Z ou J | RAIO |
| Pausar | P ou Esc | Botão de pausa |
| Confirmar | Enter | Toque na tela |

Na tela inicial: escolha o mundo com as setas ou tocando nele; C troca a cor do Concreto; V troca entre as folhas de sprites e o desenho por código; G abre o progresso; H mostra a história; S liga e desliga o som.

As cenas de história avançam com um toque ou Enter e podem ser puladas pelo botão "Pular" ou com Esc.

Nas lutas contra os bosses: esquerda e direita trocam de lado para fugir do golpe; o raio só machuca quando o boss cansa; em algumas lutas é preciso pular para escapar de um golpe no chão.

## Documentação

- [Especificação](ESPECIFICACAO.md): as regras do jogo e a origem de cada uma.
- [Resumo para o criador](RESUMO.md): o mesmo conteúdo em linguagem simples.
- [Histórico](HISTORICO.md): decisões e alterações, rodada a rodada.
- [Roteiro de entrevista](ROTEIRO-ENTREVISTA.md): as perguntas para o criador confirmar ou mudar o que está no jogo.
- [Plano de entrevista](PLANO-ENTREVISTA.md): o método e o histórico das rodadas de perguntas.
- [Plano de desenvolvimento](DESENVOLVIMENTO.md) e [instruções para agentes](AGENTS.md).

## Arte

- [Catálogo de concept art e sprites](assets/concept-art/README.md): pranchas, folhas de sprites e estado de aprovação.
- [Recursos integrados ao jogo](assets/game/README.md): o que está no jogo, de onde veio e como foi preparado.
- [Prompts](prompts/README.md): textos usados para gerar pranchas e folhas de sprites.

O Concreto e quatro bosses usam folhas de sprites. O quinto boss, os monstros, os cenários e a interface são desenhados por código. A branch `desenho-por-codigo-v1` guarda a versão em que tudo era desenhado por código.

## Para quem desenvolve

- Código em `jogo/js/`: `config.js` (regras e números), `mundos.js` (os cinco mundos), `fase.js` (exploração), `boss.js` (lutas), `cenas.js` (cenas de história), `arte.js` e `temas.js` (desenho), `entrada.js` (controles e som), `principal.js` (telas e progressão). `sprites.js` é gerado.
- Testes: `node testes/percurso.js` (precisa de Node e do Playwright com Chromium). Cada verificação cita o identificador da regra na especificação.
- Recortar as folhas de sprites: `python3 ferramentas/recortar_sprites.py` (precisa de Pillow, numpy e scipy).
- Gerar um arquivo HTML único: `node ferramentas/empacotar.js`.

## Cuidados

Referências a jogos e marcas na documentação registram a intenção criativa do criador; não são licenças de uso. O jogo não reproduz personagens nem marcas de terceiros. As imagens foram geradas por modelo de imagem; avaliar direitos antes de qualquer distribuição comercial. Não incluir dados pessoais no repositório, que é público.
