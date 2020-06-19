# Overview: Understanding the Boilerplate

## Introduction

Making a brief overview of the _Boilerplate_, there are two directories (`/node` and `/graphql`) and the `manifest.json` file, which is an important file to your VTEX IO app because it will be the first communication point with the VTEX IO.

## Manifest Overview

In the `manifest.json` file, you will find the app's name, vendor, version, and other informations to pay attention to: builders, policies and dependencies. In this initial state, we have the following configurations:

- builders: what builder your app will need. In this case, we have, so far, only the `docs builder` and the `node builder`, with its respectives versions;
- policies: if the app being built needs to access some external services or get some specific data from other places, it needs to declare so, even for external API’s. At this point, we have no specific policies yet;
- dependencies: other VTEX IO apps your app depends on. As addressed below, for this course, we need to also link the `events-example` app, as it is listed as a dependency for this course app.

## `/node` Directory Overview

All directories used over the course are already in this initial project. Most of the directories are empty and will be filled throughout the course.

- `/node/clients`: both files are almost blank and are now just placeholders for the next steps.

- `/node/handlers`: contains a handler that will be used in the next steps.

- `/node/utils`: you will find a file containing global constants declarations (`/node/constants.ts`).

- `/node/index.ts`: contains the initial declarations for the app functionality like the cache declaration and the service declarations, which will be incremented during the course. Here is also possible to export resolver functions.

- `/node/service.json`: here it´s possible to declare routes that the service must respond to and other configurations like *timeout* and *memory* and will also be incremented during the course. Also contains the declaration of a route that will be used in the next steps.

## `/graphql` Directory Overview

On this directory, you will find only the empty directories and the `/graphql/schema.graphql` blank file. This will all be filled throughout the course, as well.

## Dependencies

For this course, this app has a dependency on the `events-example` app. The `events-example` app, when linked to your account and workspace, is responsable for provinding events examples. Over the course, as we approach the events topic, there will be a more complete overview of the `events-example` app.

## Activity

1. For now, clone the `events-example` app from [this repository](https://github.com/vtex-apps/events-example) and run `vtex link` in it's directory.

> Without the `events-example` app, this course app will not be successfully linked, as the `events-example` app is listed as a dependency.

After running `vtex link` on the `events-example` app, the terminal should show a healthcheck route that will be used later. It looks like this:

![image](https://user-images.githubusercontent.com/43679629/83797811-91777480-a679-11ea-9bc9-9d32ace321d7.png)
