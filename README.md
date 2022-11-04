# Arçelik OPCUa Client schedule <img src="https://img.shields.io/badge/nodejs-16-red"> <img src="https://img.shields.io/badge/typescript-4.8.4-blue">


OPCUa Client with scheduled operations

- -  -
## Description

Using a JavaScript OPCUa client implementation, this application can read OPCUa server variables. 

With the variables values, the application build Fiware messages and  send the value via Fiware context broker. This job is scheduled to be execute every hour.


## Table of contents

* [Prerequsites](#prerequsites)
* [Configurations](#configurations)
* [Testing](#testing)
* [Deployment](#deployment)
    * [Standalone](#standalone)
    * [Docker](#docker)
* [Support](#support)

- - -

## Prerequsites

[node.js](https://nodejs.org/en/) and npm installed, and minimal command line knowledge.

## Configurations

The application will read a configuration file. This file consists in a list of servers, and each server with a list of nodes to read.

There are two configurations files, one for test and other for production environment.

* Configuation file to testint environment [here](./build/OPCUaClientConfigTest.js)

* Configuation file to production environment [here](./build/OPCUaClientConfigProd.js)


By deafault, the [default](./src/environment.ts) environmnet configuration is test. To mofify this configuration, set the environment variables at system level or change the [environmnet.ts](./src/environment.ts) file content.

## Testing
To test this application, go to [this repository](https://gitlab.lst.tfo.upm.es/shop4cf/node-red-opc-ua-server) and deploy node-red.

Once node red is running, run the tests executing ``npm run devtest`` to test the application against the depoyed node-red server.

**note** To test the application against the production server, run ``npm run prodtest``


## Deployment

There are two options to use this application:

## *Standalone*

* Open a terminal at package.json level 
* Execute ``npm run dev`` to development purposes.
* To copile to js code, use the script ``npm run build``. This copile the typescipt to javascript into build directory


## *Docker*

To run this apllication inside a docker container:

* Build the image using ``docker build -t arcelikclient .``
* Create a container using ``docker run -d --env-file .env arcelikclient`` for production environment (if no env file is provided, the apllication run with test configuration)
* To perfom the test wiht docker in test environment, execute `` docker build -t arcelikclient . --target devtest . --no-cache --progress=plain``
* To perfom the test wiht docker in prod environment, execute `` docker build -t arcelikclient . --target prodtest . --no-cache --progress=plain`` 


## Support

dcarvajal@lst.tfo.upm.es

ebuhid@lst.tfo.upm.es


