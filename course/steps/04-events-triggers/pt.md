# Eventos: usando eventos como disparadores

## Introdução

Com o cliente _Analytics_ implementado, queremos usar o _Events_ como acionador das solicitações. Isso significa que, para cada evento escutado, queremos executar uma solicitação para a app _Analytics_. Portanto, a cada X segundos, teremos novos dados sobre **Produtos que estão sendo visualizados**.

## Eventos

No VTEX IO, os eventos geralmente são usados ​​como disparadores para outras ações, como o envio de emails para o cliente final. Para implementar isso, precisamos configurar o cliente e o _handler_ de eventos da nossa app.

## Atividade

1. Como o _Analytics client_ é implementado, precisamos apenas usá-lo no manipulador de eventos. Primeiro, no arquivo `/node/event/liveUsersUpdate.ts`, importe o cliente que implementamos na etapa anterior adicionando o seguinte:

   ```ts
   import { Clients } from '../clients/index'
   ```

2. Agora, precisamos usar o `EventContext` que já configuramos anteriormente. Importe-o adicionando o seguinte código e atualize o método:

   ```diff
   //node/event/liveUsersUpdate.ts
   import { Clients } from './../clients/index'
   +import { EventContext } from '@vtex/api'

   +export async function updateLiveUsers(ctx: EventContext<Clients>) {
   ...
   }
   ```

3. Agora, para usar o _Analytics client_, adicione este código:

   ```diff
   //node/event/liveUsersUpdate.ts
   export async function updateLiveUsers(ctx: EventContext<Clients>) {
   +  const liveUsersProducts = await ctx.clients.analytics.getLiveUsers()
   +  console.log('LIVE USERS: ', liveUsersProduct)
   +  return true
   }
   ```

4. Finalmente, execute o `vtex link` e, para cada evento disparado, você deverá ver os usuários ao vivo recuperados do _Analytics_.
   O resultado deve ser assim:
   ![image](https://user-images.githubusercontent.com/43679629/85150833-69ffda80-b229-11ea-9260-b9255adf7d9c.png)
