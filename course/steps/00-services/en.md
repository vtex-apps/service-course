# Services in VTEX IO

## Introduction

The VTEX IO platform allows developers to create unique commerce experiences using Web technologies. It’s possible to create frontend blocks for Store Framework, backend services exposing REST or GraphQL APIs, and combine a series of VTEX modules into a complete solution, packaging it into an app.

As VTEX IO powers big e-commerce operations, they require **running code on a server**. **Services** are how we run **Node.js or .NET** code on VTEX IO infrastructure, backed by API abstractions to improve developer experience.

## Setting up our test bot
It's important for you to have our test bot installed in this course repository. With it installed, we can see your progress, even though it does not contain any tests or evaluations on each step (as in other courses we offer). To install it, follow the steps below:

1. Open [our test bot installation page](https://github.com/apps/vtex-course-hub) and click on **Configure**;
2. Select the **Only selected repositories** option, then click on **Select repositories** and type in `service-course`;
3. Click on `{{ user.username }}/service-course` and then on **Install**. 

    <img src="https://user-images.githubusercontent.com/19495917/86020968-f31fca00-b9fe-11ea-9776-ccab355663b5.png" width="350" />

    > **Note:** The image above shows the process for `store-block`, but the steps for `service-course` are the same.

## Services

A **Service** must be exported from a VTEX IO app, just like themes or store blocks, using builders `node` or `dotnet`. With these, you are able to develop a REST API without having to set up a server, GraphQL APIs and routes.

Services in VTEX IO support one-command rollbacks and continuous integration. They can export internal and external routes and run on top of Kubernetes. You can count on VTEX IO to manage the scalability of your services.

On the `/node` folder of a service lives `service.json`, where it´s possible to **declare routes that the service must respond to** and other configurations like _timeout_ and _memory_.

During this course, you will implement some services in VTEX IO and learn a bit more about the possibilities that they offer to your development.
