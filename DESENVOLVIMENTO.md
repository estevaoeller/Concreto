# Concreto — Plano de desenvolvimento e entrega ao agente

Estado em 2026-11-16: as etapas D1 a D6 estão implementadas em protótipo (cinco mundos jogáveis em `jogo/`, HTML e JavaScript puros) e parte de D7 foi feita (som, pistas visuais, pausa, publicação preparada). A etapa D0 não foi apresentada formalmente antes da implementação; a stack entrou por autorização direta do responsável e continua revisável. Falta a validação com o criador. Especificação de referência: v1.0. O texto abaixo é o plano original, mantido como registro.

## Objetivo

Entregar primeiro um protótipo jogável de uma fase, com a experiência principal de plataforma lateral e uma prova de conceito de luta em primeira pessoa. Expandir para cinco mundos somente após validar o núcleo. Não esperar imagens finais para testar a mecânica: usar formas, cores e placeholders originais substituíveis.

## Etapas e critérios de saída

| Etapa | Trabalho | Critério de saída |
|---|---|---|
| D0 — preparação | Ler especificação, histórico e catálogo; conferir ambiente, motor, dispositivos-alvo, capacidade de build e controle de versões; propor arquitetura, estrutura de arquivos, execução local/nuvem e estratégia de testes. | Plano técnico aprovado; pendências de regra identificadas; nenhuma escolha irreversível feita sem autorização. |
| D1 — plataforma | Implementar cena de teste lateral, deslocamento, botão de pulo, colisões e plataformas; personagem provisório; câmera lateral. | Jogador anda e pula de forma previsível; não atravessa plataformas; controles separados; teste de reinício provisório isolado. |
| D2 — combate normal | Raio de geleca; monstros nas plataformas; faca por proximidade; três vidas, dano e knockback; derrota com placeholder para efeito de vento. | Requisitos A01–A02, I01–I04 e V01–V04 demonstráveis; dano e temporizações testados. |
| D3 — portal e ciclo temporal | Portal ao fim da fase, mudança de fase de teste, relógio de 30 min/30 min e seleção de encontro parametrizada. | Transições e limites temporais testáveis; regra noturna e diurna não inventadas; boss final sempre selecionado. |
| D4 — boss | Prova de conceito em primeira pessoa para Cthulhu; aviso de papel higiênico, barra de vida, dois ataques e pausa de 10 s. | Ciclo de ataque observável, janela de contra-ataque mensurável e câmera distinta; defesa e dano definitivos condicionados à validação. |
| D5 — primeira fase completa | Integrar protótipo de plantas, inimigos, portal, boss e UI; substituir placeholders por recursos aprovados disponíveis. | Fluxo completo de uma fase validado pelo criador; lista de correções e feedback registrada. |
| D6 — cinco mundos | Fases 2–5, bosses personalizados, progressão, conclusão e recursos gráficos/sonoros. | Cinco fases funcionais, boss final garantido, regras de vitória/derrota aprovadas e testes de regressão. |
| D7 — acabamento | UX, áudio, acessibilidade, desempenho, bugs, empacotamento e publicação. | Build reproduzível, arte e licenças verificadas, testes aprovados e autorização para publicar. |

O recorte D1–D5 é proposta de MVP (não decisão de Thomas). D1 pode começar com placeholders após aprovação do ambiente; D2–D5 dependem da confirmação das regras que afetem o comportamento final. Provas de conceito podem usar parâmetros temporários identificados, nunca como decisões aprovadas.

## Decisões prioritárias e bloqueios

| ID | Questão | Impacto |
|---|---|---|
| Q01 | Movimento por teclado, toque ou ambos? Qual motor/plataforma? | Entrada, build, resolução e controles. |
| Q02 | Contato simples causa dano, faca causa dano separado? Há invulnerabilidade após impacto? | Colisões e vidas. |
| Q03 | Como tratar queda, perda de todas as vidas, reinício e persistência? | Checkpoints e fluxo de derrota. |
| Q04 | 50% à noite se refere a boss ou monstro comum? De dia qual a regra? Sorteio a cada chegada ou por fase? | Progressão e RNG. |
| Q05 | Cthulhu é o boss da fase 1? A perspectiva e barra de vida são comuns a todos? | Arenas e interface. |
| Q06 | Como desviar/defender, atacar e causar dano no boss? Dano fora da janela? Ciclo se repete? | Combate de bosses. |
| Q07 | Derrotar boss é obrigatório para abrir portal? Qual desfecho após boss final? | Progressão e condição de vitória. |
| Q08 | Cor/forma final, arte de monstros e cenários, ataques personalizados, áudio e UI. | Produção visual e acabamento. |

Não bloquear infraestrutura, testes ou protótipos reversíveis por uma pendência visual. Se uma regra indefinida for indispensável, solicitar decisão ou criar modo de teste claramente sinalizado. Separar configuração de comportamento definitivo. Não publicar versões contendo marcas, personagens ou assets de terceiros sem avaliar direitos e autorização.

## Critérios de aceitação mínimos rastreáveis

- AC01 (C01–C03, M01–M03): exploração lateral com andar e pular; ataque separado; portal no final. Testar movimentos, colisão e transição.
- AC02 (A01–A02, I01–I04): raio com preparação; faca apenas nos monstros e quando próximos; nenhuma espada no protagonista. Testar perto/longe e ação.
- AC03 (V01–V04): iniciar com três vidas; contato decrementa uma e causa knockback; após a última, efeito de vento. Regras de contato contínuo e faca dependem de Q02. Testar transições 3→2→1→0.
- AC04 (T01–T03): ciclo 30 min de dia e 30 min de noite, testável com relógio controlado; 50% noturno condicionado à definição Q04; presença do último boss 100% independentemente do sorteio. Testar limites e usar gerador aleatório controlável.
- AC05 (B01–B07): dois ataques de cada boss, pausa de 10 segundos depois do segundo; para Cthulhu, visão em primeira pessoa, aviso e barra grande. Testar cronograma com relógio simulado e eventos.
- AC06 (C04, F01–F03): cinco mundos na ordem especificada, boss personalizado em cada, portais ao final. Vitória final ainda depende de Q07.

## Arquitetura — princípios, não escolha de stack

Separar entrada, movimento/física, combate/dano, relógio, progressão, lógica de bosses, renderização e dados das fases. Fazer clock e RNG injetáveis para testes. Definir configurações das fases e dos bosses sem duplicar a lógica de dois ataques/pausa. Separar estados de exploração lateral e encontro em primeira pessoa, sem assumir renderização 3D real. Manter recursos intercambiáveis (placeholders versus arte aprovada). Documentar decisões arquiteturais, comandos de execução/teste e limitações.

## Rotina do agente

Trabalhar em incrementos pequenos, testar antes de confirmar, registrar decisões e commits descritivos. Abrir branch de desenvolvimento em vez de substituir a documentação aprovada. Não editar a especificação como se uma proposta técnica fosse decisão criativa. Ao final de cada etapa, reportar o que foi implementado, como reproduzir, resultados dos testes, pendências e próximos passos. Ver [AGENTS.md](AGENTS.md).
