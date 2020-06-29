# Serviços no VTEX IO

## Introdução

O VTEX IO permite que os desenvolvedores criem experiências comerciais exclusivas usando tecnologias Web. É possível criar blocos de front-end para o Store Framework, serviços de back-end que exponham APIs REST ou GraphQL e combinar uma série de estruturas da VTEX em uma solução completa, empacotado em um aplicativo.

Como o VTEX IO possibilita grandes operações de e-commerce, na maioria das vezes é necessário **executar o código em um servidor**. **Serviço** é como executamos o código **Node.js ou .NET** na infraestrutura do VTEX IO, apoiada por abstrações de API para melhorar a experiência do desenvolvedor.

## Serviços

Um **Serviço** deve ser exportado de um aplicativo VTEX IO, assim como temas ou blocos de frente de loja, usando os builders `node` ou`dotnet`. Com isso, é possível desenvolver uma API REST já configurada, você só precisa se preocupar com o código.

Os serviços no VTEX IO suportam _rollbacks_ e integração contínua. Eles podem exportar rotas internas e externas e gerar resultados em um pod escalável na estrutura Kubernets.

Na pasta raiz de um serviço está o `service.json`, onde é possível **declarar rotas às quais o serviço deve responder** e outras configurações como _timeout_ e _memory_.

Durante este curso, você implementará alguns serviços no VTEX IO e aprenderá um pouco mais sobre as possibilidades que eles oferecem ao seu desenvolvimento.
