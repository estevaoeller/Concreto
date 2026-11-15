# Concreto

Jogo de plataforma em fase de descoberta e preparação para desenvolvimento. Concreto é uma geleca com formato de fantasma que atravessa plataformas e enfrenta monstros. A visão é lateral durante a exploração; o combate contra o Cthulhu Higiênico muda para primeira pessoa.

## Estado atual

Especificação v0.6 (2026-11-15): personagem, controles básicos, três vidas, portais, cinco mundos temáticos e padrão de combate contra bosses. Pacote de preparação para desenvolvimento e produção visual publicado. Ainda existem regras a validar.

Existe um protótipo jogável da Fase 1 em [`jogo/`](jogo/), autorizado pelo responsável como instrumento de validação do design. As regras ainda não decididas pelo criador foram preenchidas com valores provisórios, todos identificados em [`jogo/js/config.js`](jogo/js/config.js) e na seção 13 da especificação. Valor provisório não é requisito.

## Como jogar o protótipo

Abrir `jogo/index.html` no navegador (não precisa instalar nada nem de internet).

- Teclado: setas ou A/D andam, espaço pula, X solta o raio de geleca, Enter confirma.
- Celular ou tablet: botões na tela.
- Na luta contra o boss: esquerda/direita mudam de lado, X (ou RAIO) atira.
- O ciclo de dia e noite foi retirado pelo criador; no protótipo o boss aparece sempre ao chegar ao portal (premissa a confirmar).

Para gerar um arquivo HTML único (fácil de enviar): `node ferramentas/empacotar.js`.

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
- Situação: protótipo da Fase 1 cobre D1 a D4 com arte provisória desenhada por código. Próximo passo: validar stack e premissas com o responsável e o criador, e alinhar a arte às pranchas quando os PNGs forem enviados.

## Processo

Entrevista adaptada de Grill Me / Grill with Docs: uma pergunta por vez, aprofundamento das consequências e consolidações periódicas. Sugestões não são requisitos até confirmação. Manter os documentos sincronizados e versionados no GitHub. Referências a jogos e marcas são referências criativas, não licenças de uso. Não publicar jogo ou incluir dados pessoais sem autorização.

Tecnologia do protótipo: HTML, CSS e JavaScript puros com Canvas 2D, sem dependências nem etapa de build. A escolha vale para o protótipo, não passou pela etapa D0 e pode ser revista.
