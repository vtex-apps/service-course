# Conhecendo mais sobre clientes

## Introdução

Nesta etapa, alguns conceitos de clientes serão explicados brevemente e serão apresentados quais são os clientes necessários para este curso: **cliente de _Analytics_** e **cliente de _Master Data_**. O primeiro será implementado nesta etapa e você também aprenderá como usar um cliente que já foi implementado em nossa API.

## Sobre os clientes

Os clientes, no VTEX IO, são abstrações para outros serviços. Enfrentamos complexidades ao configurar um cliente HTTP, por exemplo, para que você possa se concentrar no valor real do seu software. Sempre que você precisar configurar uma conexão com uma API externa ou outro serviço VTEX, crie um cliente! Alguns clientes padrão já estão integrados no VTEX IO, verifique-os [aqui](https://github.com/vtex/node-vtex-api/blob/ccf4d8f8d3208007c4bfd558baf979df8d825af8/src/clients/IOClients.ts).

Se você já conheceu mais sobre os serviços de IO, provavelmente sabe que sua implementação exporta funções que recebem um objeto de contexto. Essas funções podem ser uma função de _resolver_ de um campo GraphQL, um _middleware_ para um servidor HTTP ou um _handler_ de eventos e, em todas elas, você recebe um objeto ctx (ou como você deseja chamá-lo) do tipo `Context`, e está dentro de `ctx.clients` onde você encontrará cada cliente.

É possível ler mais sobre os conceitos dos clientes [neste documento](https://www.notion.so/How-to-use-and-create-Clients-on-VTEX-IO-3598e97a761645e0befdac84a32f339d).

## Cliente de _Analytics_

Neste curso, será necessário criar um cliente que será usado para obter informações sobre o número de visualizações do produto. O cliente que será criado fará uma requisição REST na qual recuperará informações sobre as visualizações do produto. Esse cliente precisa ter um _handler_ que seja a resposta para lidar com a requisição feita em uma rota específica e é assim que pode ser testada.

## Atividade

Nesta etapa, implementaremos o cliente _Anaylitcs_.

1. Primeiro, no diretório `/node/clients/`, você encontrará um arquivo chamado `analytics.ts`, que já possui um esboço, assim como o bloco de código abaixo. É aqui que você implementará seu cliente.

   ```ts
   import { AppClient } from '@vtex/api'

   export default class Analytics extends AppClient {}
   ```

   > Você pode notar neste bloco de código que o _Analytics_ é um cliente que se estende do `AppClient`.

2. O cliente precisa ter um construtor e apenas um único método, chamado `getLiveUsers`. Este método retorna a promessa de uma matriz de que seus elementos são do tipo `LiveUsersProduct`. Usando o código abaixo, adicione as linhas de código necessárias ao cliente:

   ```diff
   //node/clients/analytics.ts
   import { AppClient, InstanceOptions, IOContext } from '@vtex/api'

   export default class Analytics extends AppClient {
   +  constructor(context: IOContext, options?: InstanceOptions) {
   +    super('vtex.mocked-analytics@0.x', context, options)
   +  }

   +  public getLiveUsers(): Promise<LiveUsersProduct[]> {}
   }

   +interface LiveUsersProduct {
   +  slug: string
   +  liveUsers: number
   +}
   ```

   > A interface definida será usada como um tipo no método que implementaremos.

3. Agora é necessário implementar o método `getLiveUsers`. Ele **retorna** uma requisição HTTP GET para um terminal bem definido que é responsável por obter os dados necessários neste aplicativo. Portanto, adicione a seguinte linha ao método `getLiveUsers`:

   ```ts
   return this.http.get('_v/live-products')
   ```

   > O método que você acabou de criar é obterá os dados necessários para esta aplicação: uma matriz de objetos com dois campos: `slug`, uma string que representa o ID do produto, e`liveUsers`, um número que é a quantidade de usuários visualizando este produto - que são os campos na interface.

4. Com o seu cliente já implementado, é necessário declará-lo como um dos clientes na classe `Clients`, para que seja acessível pelo `Contexto`, que falamos no início desta etapa.

   Portanto, no diretório `node/clients/`, acesse o arquivo chamado `index.ts` e adicione um método GET à classe que se refere ao cliente de _Analytics_. Também é necessário importar o cliente que você criou.

   ```diff
   // node/clients/index.ts
   + import Analytics from '../clients/analytics'

   export class Clients extends IOClients {
   +  public get analytics() {
   +    return this.getOrSet('analytics', Analytics)
     }
   }
   ```

5. Para vê-lo funcionando, é possível usar o método `getLiveUsers` dentro do _handler_ para o cliente de _Analytics_. Usando uma rota que já está definida no projeto, é possível enviar uma solicitação a ele e o _handler_ responsável por essa rota chamará o método que criamos.

   Dentro do diretório `/node`, há uma pasta chamada `handlers`. Já existe um arquivo chamado `analytics.ts`, no qual é necessário fazer duas coisas para que seu teste funcione: obter o cliente de _Analytics_ de `ctx` e substitua o conteúdo de `ctx.body` pelo método mencionado anteriormente, como você pode ver no bloco de código abaixo:

   ```diff
   export async function analytics(ctx: Context, next: () => Promise<any>) {
     if (ctx.method.toUpperCase() === 'GET') {
   +    const {
   +      clients: {
   +        analytics
   +      }
   +    } = ctx

       ctx.status = 200
   -   ctx.body = 'OK'
   +   ctx.body = await analytics.getLiveUsers()

       ctx.set('cache-control', 'no-cache')
     }
     await next()
   }
   ```

6. Agora vamos testar! É possível usar o _Postman_ para enviar uma solicitação `GET` para a seguinte rota:

   `{seu espaço de trabalho}-appliancetheme.myvtex.com/_v/app/analytics/realTime`

   e espera-se que ele responda com os dados e o status `200`.

![image](https://user-images.githubusercontent.com/19495917/84827089-53c00780-affa-11ea-857f-fdcba0fef7c2.png)
