# Concreto

Jogo de plataforma em fase de descoberta e design. Concreto é uma geleca com formato de fantasma que atravessa plataformas e enfrenta monstros. A visão é lateral durante a exploração; o combate contra o Cthulhu Higiênico muda para primeira pessoa.

## Estado atual

Especificação v0.5 (2026-11-15): personagem, controles básicos, três vidas, portais, ciclo de dia e noite, cinco mundos temáticos e padrão de combate contra bosses. Ainda existem regras a validar.

Existe um protótipo jogável da Fase 1 em [`jogo/`](jogo/), autorizado pelo responsável como instrumento de validação do design. As regras ainda não decididas pelo criador foram preenchidas com valores provisórios, todos identificados em [`jogo/js/config.js`](jogo/js/config.js) e na seção 13 da especificação. Valor provisório não é requisito.

## Como jogar o protótipo

Abrir `jogo/index.html` no navegador (não precisa instalar nada nem de internet).

- Teclado: setas ou A/D andam, espaço pula, X solta o raio de geleca, Enter confirma.
- Celular ou tablet: botões na tela.
- Na luta contra o boss: esquerda/direita mudam de lado, X (ou RAIO) atira.
- Atalho de teste: tecla N, ou toque no sol/lua, pula para o outro período do dia. O boss só pode aparecer à noite (50%).

Para gerar um arquivo HTML único (fácil de enviar): `node ferramentas/empacotar.js`.

## Documentação

- [Especificação do jogo](ESPECIFICACAO.md): decisões de design e requisitos.
- [Resumo para o criador](RESUMO.md): versão em linguagem simples.
- [Histórico](HISTORICO.md): decisões e alterações por rodada.
- [Plano de entrevista](PLANO-ENTREVISTA.md): questões, dependências e checkpoints.

## Processo

Entrevista adaptada de Grill Me / Grill with Docs: uma pergunta por vez, aprofundamento das consequências e consolidações periódicas. Sugestões não são requisitos até confirmação. Manter os documentos sincronizados e versionados no GitHub.

Tecnologia do protótipo: HTML, CSS e JavaScript puros com Canvas 2D, sem dependências nem etapa de build. A escolha vale para o protótipo e pode ser revista. A ferramenta mencionada como Fable Five ainda precisa ser identificada e avaliada. Referências a jogos e marcas são referências criativas, não licenças de uso.
