# Visão geral: Entendendo o Boilerplate

## Introdução

Fazendo uma breve visão geral do _Boilerplate_, existem dois diretórios (`/node` e`/graphql`) e o arquivo `manifest.json`, que é um arquivo importante para as apps porque será o primeiro ponto de comunicação com o VTEX IO.

## Visão geral do `manifest.json`

No arquivo `manifest.json`, você encontrará o nome da app, _vendor_, versão e outras informações da app que podemos destacar: _builders_, _policies_ e _dependencies_. Nesse primeiro momento, temos as seguintes configurações:

- _builders_: de quais _builders_ sua app precisará. Neste caso, temos, até agora, apenas o `docs builder` e o`node builder`, com suas respectivas versões;
- _policies_: se a app que está sendo criada precisa acessar alguns serviços externos ou obter dados específicos de outros lugares, é necessário declarar isso, mesmo para APIs externas. Neste ponto, ainda não temos _policies_ específicas;
- _dependencies_: outros apps VTEX IO das quais sua app depende. Conforme abordado abaixo, para este curso, também precisamos vincular o app `events-example` pois ele é listado como uma dependência dessa app do curso.

## Visão geral do diretório `/node`

Todos os diretórios usados ​​ao longo do curso já estão neste projeto inicial. A maioria dos diretórios e arquivos está vazia e será preenchida ao longo do curso.

- `/node/clients`: ambos os arquivos estão quase em branco e agora só possuem _placeholders_ para as próximas etapas.

- `/node/handlers`: contém um _handler_ que será usado nas próximas etapas.

- `/node/utils`: você encontrará um arquivo contendo declarações de constantes globais (`/node/constants.ts`).

- `/node/index.ts`: contém as declarações iniciais da funcionalidade da app, como a declaração de cachê e as declarações de serviço, que serão incrementadas durante o curso. Aqui também é possível exportar funções _resolver_.

- `/node/service.json`: descreve sua API REST e algumas características que afetam diretamente os atributos de infraestrutura da sua app.
  Seu arquivo service.json será encontrado na pasta `/node` do app e será semelhante a este:

  ```
  {
  "memory": 256,
  "timeout": 2,
  "minReplicas": 2,
  "maxReplicas": 4,
  "routes": {
    "status": {
      "path": "/_v/status/:code",
      "public": true
    }
  }
  ```

  - _memory_: em MegaBytes. Quanta memória sua app terá alocada. Esse valor será substituído se o IO detectar que sua app está abusando do uso de memória.
  - _timeout_: em segundos. O VTEX.IO infra interromperá a conexão se o tempo de solicitação for maior que o tempo limite
  - _minReplicas_: quando sua app está sendo executado, quantas réplicas mínimas estarão disponíveis.
  - _maxReplicas_: a maior quantidade de réplicas que estarão disponíveis.
  - _routes_: descreve as rotas REST do sua app, dentro de você descreverá o nome (ex: ssr), o caminho e se é pública ou privada.

## Visão geral do diretório `/graphql`

Nesse diretório, você encontrará apenas os diretórios vazios e o arquivo em branco `/graphql/schema.graphql`. Isso também será preenchido ao longo do curso.

## _Dependencies_

Para este curso, esta app depende da app `events-example`. A app `events-example`, quando vinculado à sua conta e espaço de trabalho, é responsável por fornecer exemplos de eventos. Ao longo do curso, à medida que abordamos o tópico de eventos, haverá uma visão geral mais completa da app `events-example`.

## Atividade

1. Por enquanto, clone a app `events-example` deste [repositório](https://github.com/vtex-apps/events-example) e execute o`vtex link` no diretório.

> Sem a app `events-example`, esta app de curso não será vinculado com êxito, pois a app `events-example` está listado como uma dependência.

Após executar o `vtex link` na app `events-example`, o terminal deve mostrar uma rota de verificação que será usada posteriormente. Se parece com esta:

![image](https://user-images.githubusercontent.com/43679629/83797811-91777480-a679-11ea-9bc9-9d32ace321d7.png)
