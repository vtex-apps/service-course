# Eventos: lidando e recebendo eventos

## Introdução

Algumas interações no VTEX IO podem gerar eventos e podem ser usadas como gatilhos para ações, como a atividade deste passo. Para este passo, usaremos os eventos disparados pela app `events-example`.

## Eventos no VTEX IO

Nas apps VTEX IO, os eventos podem ser disparados e usados ​​para acionar funções. Por exemplo, uma app que escuta os pedidos e aciona um email de confirmação. É importante destacar que os eventos são _workspace e account bound_, o que significa que os eventos são visíveis apenas para a conta e o _workspace_ em que foram disparados. Eventos disparados no seu espaço de trabalho pessoal serão ouvidos apenas por apps vinculadas nesse mesmo _workspace_.

## Atividade

1. Primeiro, precisamos começar iniciando o disparo do evento no app `events-example`. Esta app irá disparar um evento a cada X segundos. Após executar o `vtex link` em seu diretório, clique na rota de verificação disponível e uma mensagem "ok"deve aparecer no navegador:

   ![image](https://user-images.githubusercontent.com/43679629/83802091-8c69f380-a680-11ea-82af-a438fb73f40b.png)

   > Esse acesso à rota de verificação cria um contexto de cachê necessário para o VTEX IO disparar eventos. Sem ele, a app `events-example` não poderá disparar os eventos que nossa app ouvirá.

2. Precisamos adicionar o _handler_ de eventos na declaração do serviço para nos definir o que a app deve fazer ao ouvir o evento. Para fazer isso, no arquivo `/node/index.ts`, adicione este código na declaração `Service`:

   ```diff
   //node/index/ts
   export default new Service<Clients, State, ParamsContext>({
     clients: {
       implementation: Clients,
       options: {
         default: {
           retries: 2,
           timeout: 10000,
         },
   +      events: {
   +        exponentialTimeoutCoefficient: 2,
   +        exponentialBackoffCoefficient: 2,
   +        initialBackoffDelay: 50,
   +        retries: 1,
   +        timeout: TREE_SECONDS_MS,
   +        concurrency: CONCURRENCY,
   +      },
   +    },
   +  },
   })
   ```

   Explicando cada configuração, temos o seguinte:

   - `exponentialTimeoutCoefficient`: o fator exponencial pelo qual o `timeout` aumentará em cada nova tentativa.
   - `exponentialBackoffCoefficient`: o fator exponencial pelo qual o `initialBackoffDelay` aumentará a cada nova tentativa.
   - `initialBackoffDelay`: o tempo que o app aguardará até a próxima tentativa.
   - `retries`: o número máximo de vezes que a app tentará novamente.
   - `timeout`: o tempo limite até considerar uma tentativa de falha.
   - `concurrency`: a quantidade de processos simultâneos que o evento é capaz de executar.

   > Ao adicionar este código ao `Serviço`, estamos adicionando ao`Cliente` deste `Serviço`, a capacidade de manipular eventos. Neste ponto, ainda não estamos usando o `Client` em si ao manipular o evento.

3. Por enquanto, apenas criaremos um log ao receber um evento. Para criar este _handler_ de eventos, no diretório `/node/event`, acesse o arquivo `liveUsersUpdate.ts` e insira o código abaixo:

   ```ts
   //node/event/liveUsersUpdate.ts
   export async function updateLiveUsers() {
     console.log('EVENT HANDLER: received event')
   }
   ```

4. Agora, precisamos declarar no `Serviço` a referência dessa esta função. No arquivo `/node/index.ts`, adicione este código:

   ```diff
   ...
   + import { updateLiveUsers } from './event/liveUsersUpdate'
   ...

   export default new Service<Clients, State, ParamsContext>({
     clients: {
       implementation: Clients,
       options: {
         default: {
           retries: 2,
           timeout: 10000,
         },
         events: {
           exponentialTimeoutCoefficient: 2,
           exponentialBackoffCoefficient: 2,
           initialBackoffDelay: 50,
           retries: 1,
           timeout: TREE_SECONDS_MS,
           concurrency: CONCURRENCY,
         },
       },
     },
   +  events: {
   +    liveUsersUpdate: updateLiveUsers,
   +  },
   })

   ```

5. Também precisamos modificar o arquivo `service.json`. Para ouvir os eventos enviados, precisamos declarar isso para dar acesso a esse recurso ao serviço da app. Para fazer isso, substitua o código por este:

   ```diff
   //node/service.json
   {
     "memory": 128,
     "ttl": 10,
     "timeout": 10,
     "minReplicas": 2,
     "maxReplicas": 10,
     "workers": 4,
   +  "events": {
   +    "liveUsersUpdate": {
   +      "sender": "vtex.events-example",
   +      "keys": ["send-event"]
   +    }
     },
     ...
   }
   ```

   > Observe que declaramos isso usando o _handler_ de eventos e a referência da app que aciona o evento (declarado como `sender`) e a chave de referência do evento (declarada como `keys`).

6. Por fim, execute o `vtex link` e aguarde o evento ser disparado pela app `events-example`. Quando escutado, o log deve aparecer no console, assim:

   ![image](https://user-images.githubusercontent.com/43679629/83823425-5f323b00-a6aa-11ea-816a-68525e5800d7.png)
