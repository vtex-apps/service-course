# Getting to know more about clients

## Introduction
In this step, some clients concepts are going to be briefly explained and it's be presented which are the clients that are necessary for this course: **analytics client** and **master data client**. The first one will be implemented on this step and you'll also learn how to use a client that has been already implemented in our API.

## About the clients
Clients, on VTEX IO, are abstractions to other services. We tackle complexities when setting up an HTTP client, for example, so you can focus on the real value of your software. Whenever you need to setup a connection with an external API or another VTEX service, you should create a client! Some standard clients are already baked into VTEX IO, check them [here](https://github.com/vtex/node-vtex-api/blob/ccf4d8f8d3208007c4bfd558baf979df8d825af8/src/clients/IOClients.ts).

If you already got to know more about IO services, you probably know that your implementation exports functions that receive a context object. These functions can be a resolver function to a GraphQL field, a middleware to an HTTP server or an event handler, and, in all of them, you receive a ctx (or however you wanna call it) object of type `Context`, and it is inside of `ctx.clients` where you’ll find each client.

It's possible to read more about clients concepts [on this document](https://www.notion.so/How-to-use-and-create-Clients-on-VTEX-IO-3598e97a761645e0befdac84a32f339d).

## Analytics client
In this course, it will be necessary to create a client that will be used to get information regardning product's number of views. The client that will be created will make a REST request in which it'll retrieve information about product views. This client needs to have a handler that will be response to handle the request made on a specific route and this is how it can be tested.

## Master Data client

Master Data client is already implemented in VTEX API. It is possible to access this client through the `Context`, a param which contains all IO Clients in the clients property. Here it will be used to fetch data regarding the top-N most viewed products, where N is a parameter that will be used to get the desired amount of products.

It is important to highlight that this param contains the master data client as long as the correct version of `@vtex/api` is installed in the node folder. It can be used by accessing `ctx.clients.masterdata`.


## Activity

In this step, we will implement the Anaylitcs client. At the beginning, it's important to emphasize that that is a function in the `utils` folder, called `randomNumber`. So, let's create a file named `analytics.ts` in the `/node/clients/` directory. This file will be our client.

1. First, we will import and define our basic client, which will be a class that extends from `AppClient` that besides the constructor, has only one method, which will be `getLiveUsers` that's responsible for getting the number of product views in a well-defined structure: it's an array of objects of type `LiveUsersProduct`, which needs to be defined in a interface. This type has two fields: `slug`, the product ID - a **string** - and `liveUsers`, quantity of views - a **number**.

    Below you can check the class sketch that will be used on this implementation and it's possible to see that the constructor is already implemented. It inherits from an app called `vtex.analytics@0.x`.

    ```ts
    import { AppClient, InstanceOptions, IOContext } from '@vtex/api'

    export default class Analytics extends AppClient {
      constructor(context: IOContext, options?: InstanceOptions) {
        super('vtex.analytics@0.x', context, options)
      }

      public async getLiveUsers(): Promise<LiveUsersProduct[]> {
        //this.http.get()
      }
    }

    interface LiveUsersProduct {
      slug: string
      liveUsers: number
    }
    ```

3. In the `node/clients/` directory, go to the file called `index.ts` and add a get method to the class that extends `IOClients` that refers to the analytics client. It's also necessary to import the client that you created.
    ```diff
    // node/clients/index.ts
    + import analytics from './analytics'

    export class Clients extends IOClients {
    +  public get analytics() {
    +    return this.getOrSet('analytics', analytics)
      }
    }
    ```

4. So as to see it working, it's possible to use `getLiveUsers` method inside the handler for the analytics client. Using a route that it's already defined in the project, it is possible to send a request to it and the handler of this route will call the method that we created.

    Inside the node directory, there is a folder called `handlers`. There is already a file named `analytics.ts`, in which its necessary to do two things for your test to work: get the analytics client from `ctx` and replace the content of `ctx.body` with the method mentioned before, as you can see in the code block below:
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

    4. Now let's test it! You can send a `GET` request to the following route: 
    `{your workspace}--appliancetheme.myvtex.com/_v/app/analytics/realTime` and it's expected that it replies with the product data and status `200`.
