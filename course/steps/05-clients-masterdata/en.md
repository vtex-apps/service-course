# Clients: Using Master Data

## Introduction

Now that we are using the data retrieved from the _Analytics_, we need to save this data and update it. So, everytime we retrieve new data we want to update it using **Master Data**, your database for VTEX IO.

## Master Data Client

**Master Data** is the VTEX module that makes it possible to create database architectures for a store. By default, it's used to store and organize customer data, but it's also widely used by VTEX stores to make business rule customizations and create applications for your virtual store. You can configure applications that use the module as a data repository to create a system on top of Master Data, just by modeling new data.

In the current version of **Master Data**, we use the concept of _data entities_ and use [JSON Schema](https://spacetelescope.github.io/understanding-json-schema/) to validate documents. One _data entity_ can have many _schemas_, depending on how you need to use the data stored. You'll need the name of the JSON Schema to implement a query, as will be seen in the following steps.

> Note: the JSON Schema is not required for all cases. If you don't need to validate your data, you may save your documents without any setup, just indicate the data entity and some access credential. Like your case now, as we need validation, we must create a JSON Schema.

**Master Data Documents** have unique IDs and can have many customized fields. In the JSON Schema, you can declare fields and indicate the ones that you want to index. Indexed fields can be retrieved in queries.

**Master Data client** is already implemented in VTEX API. It is possible to access this client through the `Context`, a param which contains all IO Clients in the clients property. Here it will be used to fetch data regarding the top-N most viewed products, where N is a parameter that will be used to get the desired amount of products.

It is important to highlight that this param contains the master data client as long as the correct version of `@vtex/api` is installed in the node folder. It can be used by accessing `ctx.clients.masterdata`.

## Activity

1. First, we need to setup the policies in our app, to authorize it to use **Master Data**. In the `manifest.json` file, add the following:

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

    > By doing this, we are guaranteeing that this app has the authorization to access **Master Data**.


2. Now, to save this data in the **Master Data**, we need to, first, check for each product, if it is already saved. To do so, we will use a method of the Master Data client called `searchDocuments`. In the `node/event/updateLiveUsers.ts` file, add the following:

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

    > Note that we are using the `COURSE_ENTITY`, from the global constants, to access your data.

3. If our product is already saved, we need to update it by incrementing its count. **Master Data** has a method that allows us to update an existing document or create a new document, if the document does not exist - `createOrUpdateEntireDocument`. To use this method and implement the incrementation on the Master Data entity, in the same file that was changed before, right after the log line of *saved product*, add this code:

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

4. Finally, run `vtex link` and wait for an event to be fired. Once it does, check your terminal for the logs in the code. Break the `vtex link` by typing `ctrl + C` and use the following _cURL_ on the terminal to check the updates on **Master Data**:

    ```
    curl --location --request GET 'https://api.vtex.com/api/dataentities/backendproductusers/search?_fields=slug,count&_schema=v1&an=appliancetheme' \
    --header 'Content-Type: application/json'
    ```

    The result should be like this:

    ![image](https://user-images.githubusercontent.com/43679629/85172472-8579de00-b247-11ea-9758-f34a66df29c7.png)
