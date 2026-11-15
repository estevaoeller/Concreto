# Instruções para agentes — Concreto

## Início de trabalho

1. Ler README.md, ESPECIFICACAO.md, DESENVOLVIMENTO.md, HISTORICO.md, PLANO-ENTREVISTA.md e o catálogo assets/concept-art/README.md.
2. Conferir estado real do repositório, branches, código existente, ferramentas e ambiente de execução. Não presumir motor, linguagem ou plataforma.
3. Apresentar proposta técnica para D0, incluindo opções de stack adequadas à exploração lateral e ao encontro em primeira pessoa, execução na nuvem, comandos de build/teste, pipeline de assets e pendências.
4. Aguardar autorização para implementação da stack escolhida; se a autorização já constar da tarefa explícita atual, seguir somente o escopo autorizado.
5. Começar por D1 com placeholders e incrementos testáveis. Não tentar entregar cinco fases antes de validar a primeira.

## Regras de projeto

- ESPECIFICACAO.md é a fonte oficial das decisões de gameplay. A versão atual contém regras em aberto; não as transformar em certezas.
- Concreto é geleca com forma de fantasma, não fantasma. Seu ataque é raio de geleca. Faca pertence aos monstros, jamais ao protagonista.
- Manter requisitos e testes rastreáveis por ID (C, P, M, A, I, V, T, F, B, G).
- Toda hipótese indispensável ao protótipo deve ser reversível, registrada e separada da regra aprovada.
- Referências e storyboards são conceituais. Não usar imagens geradas como sprite final sem preparação e aprovação. Respeitar direitos de terceiros.
- Preservar histórico e arquivos do usuário. Não sobrescrever imagens; usar versões e registrar aprovação.
- Não adicionar informações pessoais desnecessárias ao repositório público.
- Não publicar/deployar versão pública sem autorização expressa.

## Entregas

Para cada incremento: resumo, alterações, decisões, testes executados e respectivos resultados, comandos para reproduzir, limitações e próximo passo. Atualizar documentação técnica e histórico; pedir validação do criador se a mudança afetar gameplay. Não afirmar que testes passaram sem executá-los.

## Prompt inicial para uma sessão de desenvolvimento

"Leia AGENTS.md e os documentos vinculados. Execute D0: examine o estado real do repositório Concreto, proponha a stack e a arquitetura mais adequadas para a primeira fase jogável em nuvem, considerando plataforma 2D lateral e combate em primeira pessoa. Identifique as regras que precisam de validação e descreva o plano D1 com placeholders e testes. Não implemente código até que o plano técnico e a etapa estejam autorizados. Preserve as decisões do criador e não invente mecânicas."
