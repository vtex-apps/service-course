# GraphQL: Usando o GraphiQL

## Introdução

Agora, com a _query_ e o _resolver_ implementados, precisamos usá-lo para recuperar os _top n_ produtos mais visualizados. Usando o **GraphQL IDE**, podemos testar a _query_ que implementamos anteriormente.

## GraphiQL

[GraphiQL](https://github.com/graphql/graphiql) é uma IDE do GraphQL, no navegador. Antes de usar a _query_ na nossa app, é interessante testar sua funcionalidade. Para isso, reproduziremos o uso da sua _query_ no _GraphQL IDE_.

Explorando a interface IDE, existem três áreas principais: a área de código, a área de variáveis ​​de _query_ e a área de _debug_. Verifique onde cada um aparece na interface na imagem abaixo.

![image](https://user-images.githubusercontent.com/43679629/83764107-e900ea80-a64f-11ea-969f-116ea896fe2d.png)

## Atividade

1. Abra a rota do GraphiQL e digite o código abaixo na área de código:

   ```
   query ($topN: Int) {
     productList(topN: $topN){
       slug
       count
     }
   }
   ```

2. A _query_ que acabamos de declarar usa uma variável (_topN_). Agora precisamos declará-lo na área _Query Variables_:

   ```
   {
     "topN": 2
   }
   ```

   > : exclamation: a área _Query Variables_ está abaixo da área de código, para amplificá-la, basta arrastar (drag and drop) pelo título.

3. Por fim, basta clicar no botão _play_ e verificar o resultado na área de debug. Os resultados da _query_ devem ficar assim:

   ![image](https://user-images.githubusercontent.com/43679629/83763622-4c3e4d00-a64f-11ea-9615-435811d411c6.png)
