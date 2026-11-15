# Concreto — Especificação do jogo

Versão: 0.3 — 2026-11-15
Estado: descoberta e design. Implementação ainda não autorizada.

## 1. Conceito

- C01: gênero plataforma, com visão lateral como nos jogos Mario.
- C02: o personagem principal anda, pula entre plataformas e enfrenta monstros.
- Concreto é o nome do protagonista e o título de trabalho do repositório. Nome definitivo do jogo, missão, história e condição de vitória ainda em aberto.

## 2. Personagem principal — Concreto

- P01: é uma geleca, não um fantasma. Sua silhueta lembra o formato de um fantasma.
- P02: o topo apresenta uma curvatura, não uma ponta.
- P03: uma pequena porção de geleca cai no chão. Frequência, duração e eventual efeito nas regras não definidos.
- P04: cor, rosto, olhos, tamanho, proporções, textura e estilo gráfico em aberto.

## 3. Movimentação e controles

- M01: o personagem pode andar e pular entre plataformas.
- M02: existe um botão de pulo.
- M03: existe um botão de ataque separado do botão de pulo.
- Pendente: controle de deslocamento, direção, velocidade, altura do salto, pulo duplo ou não, física, colisões, câmera e dispositivos suportados. Um único botão não implica necessariamente um único salto no ar.

## 4. Combate e inimigos

- A01: ao acionar o ataque, Concreto faz uma animação e dispara um raio de geleca.
- A02: foi confirmada a menção a uma espada que aparece na geleca na hora do ataque. Ainda é preciso esclarecer de quem é a espada, se o raio e a espada são ataques distintos ou partes de uma mesma ação e como são acionados.
- I01: existem monstros nas fases.
- I02: os monstros têm animações simples; foi mencionada uma representação parada. O comportamento exato ainda precisa ser esclarecido.
- I03: o contato com um monstro causa dano ao personagem.
- Pendente: tipos e aparência dos monstros, deslocamento, ataques, alcance, dano ao inimigo, derrota dos inimigos, recarga e chefes.

## 5. Vida, dano e derrota

- V01: Concreto começa com três vidas, conforme descrição confirmada. A distinção entre vidas e pontos de vida é uma decisão de design a confirmar antes da implementação.
- V02: ao encostar em um monstro, perde uma das três vidas.
- V03: ao sofrer dano, é jogado para trás (knockback).
- V04: quando as três vidas acabam, ocorre uma animação na qual um vento espalha os pedaços de geleca do Concreto.
- Pendente: invulnerabilidade temporária após dano, contato contínuo, direção e intensidade do knockback, quedas, armadilhas, recuperação de vida, reinício, checkpoints e interface pós-derrota. A tela de game over foi sugerida, mas não confirmada pelo criador.

### Estados funcionais preliminares

Parado, deslocando-se, pulando, atacando, recebendo dano e derrotado. Trata-se de um inventário de estados derivados das ações confirmadas, não de uma máquina de estados de implementação aprovada. Prioridades e transições ainda precisam ser definidas.

## 6. Inventário preliminar de recursos gráficos

- G01: conceito visual e silhueta do Concreto.
- G02: efeito de gota de geleca caindo no chão.
- G03: estados visuais de andar e pular.
- G04: preparação do ataque e efeito do raio de geleca.
- G05: representação da espada (proprietário e função pendentes).
- G06: botões de pulo e ataque.
- G07: feedback de dano e deslocamento para trás.
- G08: animação de derrota com vento espalhando geleca.
- G09: representação e animações dos monstros.
- G10: indicação de vidas na interface (proposta a validar).

Não há desenho ou sprites aprovados. O estilo e o formato técnico permanecem em aberto.

## 7. Decisões pendentes

- Objetivo de fase, missão, mundo, obstáculos, progressão, itens, pontuação e condição de vitória.
- Regras detalhadas de movimento, combate e derrota; comportamento dos inimigos.
- Estrutura e dificuldade das fases, câmera, direção de arte, interface, menus, áudio e acessibilidade.
- Escopo da primeira versão jogável e critérios de aceitação.

## 8. Implementação (pendente)

Motor, arquitetura, formato de assets, resolução, dispositivos, persistência, testes e distribuição serão discutidos separadamente. Não presumir que os botões na tela restringem o jogo a dispositivos móveis. A ferramenta mencionada como Fable Five ainda precisa ser identificada e avaliada.

## 9. Próxima rodada

Estabelecer a missão do Concreto e a condição para vencer uma fase. Depois, resolver as dependências de combate, movimento e inimigos. Ver [plano de entrevista](PLANO-ENTREVISTA.md).
