# Concreto

Jogo de plataforma em fase de descoberta e preparação para desenvolvimento. Concreto é uma geleca com formato de fantasma que atravessa plataformas e enfrenta monstros. A visão é lateral durante a exploração; o combate contra o Cthulhu Higiênico muda para primeira pessoa.

## Estado atual

Especificação v0.10 (2026-11-16). Existe um protótipo jogável dos cinco mundos em [`jogo/`](jogo/), autorizado pelo responsável como instrumento de validação do design. Cada mundo tem fase em três trechos, monstros próprios, portal e boss.

As regras ainda não decididas pelo criador foram preenchidas com escolhas provisórias, identificadas em [`jogo/js/config.js`](jogo/js/config.js), em [`jogo/js/mundos.js`](jogo/js/mundos.js) e na seção 13 da especificação. Escolha provisória não é requisito. Os mundos 2 e 5 usam as versões originais das pranchas, sem personagens ou marcas de terceiros.

## Como jogar o protótipo

Com o GitHub Pages ativado em `main`, o jogo abre em https://estevaoeller.github.io/Concreto/ em qualquer navegador.

A branch `desenho-por-codigo-v1` guarda a versão em que todo o visual é desenhado por código, anterior ao uso das pranchas.

Abrir `jogo/index.html` no navegador (não precisa instalar nada nem de internet).

- Teclado: setas ou A/D andam, espaço pula, X solta o raio de geleca, Enter confirma.
- Celular ou tablet: botões na tela.
- Na luta contra o boss: esquerda/direita mudam de lado, X (ou RAIO) atira.
- Tela inicial: escolha o mundo com as setas ou tocando nele. Tecla P ou o botão de pausa pausam o jogo.
- Gotinhas liberam cores do Concreto e valem estrelas; corações devolvem uma vida; a bolha de escudo aguenta um golpe. Entrar no portal leva à luta contra o boss.
- Em algumas lutas o boss dá um golpe no chão: aperte o pulo para escapar.
- Tecla C troca a cor do Concreto na tela inicial; tecla S liga e desliga o som.

Para gerar um arquivo HTML único (fácil de enviar): `node ferramentas/empacotar.js`.

Para rodar os testes (precisa de Node e do Playwright com Chromium): `node testes/percurso.js`. Cada verificação cita o ID da regra na especificação.

## Documentação

- [Especificação do jogo](ESPECIFICACAO.md): decisões de design e requisitos.
- [Resumo para o criador](RESUMO.md): versão em linguagem simples.
- [Histórico](HISTORICO.md): decisões e alterações por rodada.
- [Plano de entrevista](PLANO-ENTREVISTA.md): questões, dependências e checkpoints.

## Produção visual

- [Índice de prompts GPT Images](prompts/README.md): cinco storyboards, Concreto, monstros comuns e cinco bosses.
- [Catálogo de concept art](assets/concept-art/README.md): estudos anteriores, nomes previstos, status e instruções de upload.
- [Storyboards](assets/concept-art/storyboards/), [personagens](assets/concept-art/personagens/) e [bosses](assets/concept-art/bosses/): pastas para imagens.
- [Assets do jogo](assets/game/README.md): recursos integráveis após aprovação, separados de estudos.
- Inventário visual: 12 de 12 pranchas recebidas e organizadas; inventário preliminar completo. O estudo do protagonista permanece preliminar e contém ressalva sobre a espada incorreta.

## Desenvolvimento

- [Plano de desenvolvimento](DESENVOLVIMENTO.md): etapas, MVP proposto, bloqueios, arquitetura preliminar e critérios de aceitação.
- [AGENTS.md](AGENTS.md): instruções e prompt inicial para o agente de desenvolvimento.
- Desenvolvimento na nuvem. A ferramenta mencionada como Fable Five ainda precisa ser identificada e avaliada.
- Situação: protótipo cobre D1 a D6 com arte provisória desenhada por código a partir das pranchas. Próximo passo: o criador jogar e revisar as escolhas provisórias; depois, D7 (acabamento).

## Processo

Entrevista adaptada de Grill Me / Grill with Docs: uma pergunta por vez, aprofundamento das consequências e consolidações periódicas. Sugestões não são requisitos até confirmação. Manter os documentos sincronizados e versionados no GitHub. Referências a jogos e marcas são referências criativas, não licenças de uso. Não publicar jogo ou incluir dados pessoais sem autorização.

Tecnologia do protótipo: HTML, CSS e JavaScript puros com Canvas 2D, sem dependências nem etapa de build. A escolha vale para o protótipo, não passou pela etapa D0 e pode ser revista.
