# Clientes: usando _Master Data_

## Introdução

Agora que estamos usando os dados recuperados do _Analytics_, precisamos salvar esses dados e atualizá-los. Portanto, toda vez que recuperamos novos dados, queremos atualizá-los usando **_Master Data_**, seu banco de dados para o VTEX IO.

## Cliente de _Master Data_

**_Master Data_** é o módulo VTEX que possibilita a criação de arquiteturas de banco de dados para uma loja. Por padrão, é usado para armazenar e organizar dados de clientes, mas também é amplamente utilizado pelas lojas VTEX para fazer personalizações de regras de negócios e criar aplicativos para sua loja virtual. Você pode configurar aplicativos que usam o módulo como um repositório de dados para criar um sistema sobre **_Master Data_**, apenas modelando novos dados.

Na versão atual do **Master Data**, usamos o conceito de _data entidades_ e usamos [JSON Schema](https://spacetelescope.github.io/understanding-json-schema/) para validar documentos. Uma entidade de dados pode ter muitos _schemas_, dependendo de como você precisa usar os dados armazenados. Você precisará do nome do _JSON schema_ para implementar uma _query_, como será visto nas etapas a seguir.

> Nota: o _JSON schema_ não é necessário para todos os casos. Se você não precisar validar seus dados, poderá salvar seus documentos sem nenhuma configuração, basta indicar a entidade e alguma credencial de acesso. No nosso caso agora, como precisamos de validação, precisamos criar um _JSON schema_.

**Documentos do _Master Data_** têm IDs exclusivos e podem ter muitos campos personalizados. No _JSON schema_, você pode declarar campos e indicar aqueles que deseja indexar. Os campos indexados podem ser recuperados em _queries_.

O **Cliente de _Master Data_** já está implementado na API VTEX. É possível acessar esse cliente através do `Context`, um parâmetro que contém todos os clientes IO na propriedade _clients_. Aqui, ele será usado para buscar dados sobre os N principais produtos mais visualizados, onde N é um parâmetro que será usado para obter a quantidade desejada de produtos.

É importante destacar que esse parâmetro contém o cliente de **_Master Data_**, desde que a versão correta do `@vtex/api` esteja instalada na pasta `/node`. Pode ser usado acessando `ctx.clients.masterdata`.

## Atividade

1. Primeiro, precisamos configurar as _policies_ da app para autorizá-la a usar **_Master Data_**. No arquivo `manifest.json`, adicione o seguinte:

   ```diff
   //manifest.json
   {
     ...
     },
     "credentialType": "absolute",
     "policies": [
   +      {
   +        "name": "ADMIN_DS"
   +      },
   +    {
   +      "name": "outbound-access",
   +      "attrs": {
   +        "host": "api.vtex.com",
   +        "path": "/*"
   +      }
   +    }
     ],
     "dependencies": {
     ...
   }
   ```

   > Ao fazer isso, garantimos que este aplicativo tenha autorização para acessar **_Master Data_**.

2) Agora, para salvar esses dados no **_Master Data_**, precisamos, primeiro, verificar para cada produto se já estiver salvo. Para isso, usaremos um método do cliente **_Master Data_** chamado `searchDocuments`. No arquivo `/node/event/updateLiveUsers.ts`, adicione o seguinte:

   ```diff
   //node/event/updateLiveUsers.ts
   ...
   + import { COURSE_ENTITY } from '../utils/constants'

   export async function updateLiveUsers(ctx: EventContext<Clients>) {
     const liveUsersProducts = await ctx.clients.analytics.getLiveUsers()
     console.log('LIVE USERS ', liveUsersProducts)
   +  await Promise.all(
   +    liveUsersProducts.map(async ({ slug, liveUsers }) => {
   +      try {
   +        const [savedProduct] = await ctx.clients.masterdata.searchDocuments<{
   +          id: string
   +          count: number
   +          slug: string
   +        }>({
   +          dataEntity: COURSE_ENTITY,
   +          fields: ['count', 'id', 'slug'],
   +          pagination: {
   +            page: 1,
   +            pageSize: 1,
   +          },
   +          schema: 'v1',
   +          where: `slug=${slug}`,
   +        })
   +
   +        console.log('SAVED PRODUCT', savedProduct)
   +
   +      } catch {
   +        console.log(`failed to update product ${slug}`)
   +      }
   +    })
   +  )
     return true
   }
   ```

   > Observe que estamos usando o `COURSE_ENTITY`, das constantes globais, para acessar os dados.

3) Se nosso produto já estiver salvo, precisamos atualizá-lo incrementando sua contagem. O **_Master Data_** possui um método que nos permite atualizar um documento existente ou criar um novo documento, se o documento não existir - `createOrUpdateEntireDocument`. Para usar esse método e implementar a incrementação na entidade **_Master Data_**, no mesmo arquivo que foi alterado antes, logo após a linha de log do _produto salvo_, adicione este código:

   ```diff
   //node/event/updateLiveUsers.ts
   export async function updateLiveUsers(ctx: EventContext<Clients>) {
     await Promise.all(
       liveUsersProducts.map(async ({ slug, liveUsers }) => {
         try {
           ...
           console.log('SAVED PRODUCT', savedProduct)
   +       await ctx.clients.masterdata.createOrUpdateEntireDocument({
   +          dataEntity: COURSE_ENTITY,
   +          fields: {
   +            count: liveUsers,
   +            slug,
   +          },
   +          id: savedProduct?.id,
   +        })
         } catch {
           console.log(`failed to update product ${slug}`)
         }
       })
     )
     return true
   }

   ```

4) Finalmente, execute o `vtex link` e aguarde o evento ser disparado. Depois disso, verifique o seu terminal para ver os logs no código. Quebre o `vtex link` digitando`ctrl + C` e use o seguinte _cURL_ no terminal para verificar as atualizações no **_Master Data_**:

   ```
   curl --location --request GET 'https://api.vtex.com/api/dataentities/backendproductusers/search?_fields=slug,count&_schema=v1&an=appliancetheme' \
   --header 'Content-Type: application/json'
   ```

   O resultado deve ser similar a esse:

   ![image](https://user-images.githubusercontent.com/43679629/85172472-8579de00-b247-11ea-9758-f34a66df29c7.png)
