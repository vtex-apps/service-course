# Services in VTEX IO

## Introduction

The VTEX IO platform allows developers to create unique commerce experiences using Web technologies. It’s possible to create frontend blocks for Store Framework, backend services exposing REST or GraphQL APIs and combine a series of VTEX frameworks into a complete solution, packaging it into an app.

As VTEX IO powers big e-commerce operations, for most of that it's necessary to **run code on a server**. **Services** are how we run **Node.js or .NET** code on VTEX IO infrastructure, backed by API abstractions to improve developer experience.

## Services

A **Service** must be exported from a VTEX IO app, just like themes or store blocks, using builders `node` or `dotnet`. With these, it's able to develop a REST API that is setup out of the box, you only need to worry about code.

Services in VTEX IO supports rollbacks and continuous integration. It can export internal and external routes and it's build results in a _scalable pod_ in the Kubernets structure.

On the root folder of a service lives `service.json`, where it´s possible to **declare routes that the service must respond to** and other configurations like *timeout* and *memory*.

During this course, you will implement some services in VTEX IO and learn a bit more about the possibilities that they offer to your development.
