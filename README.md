# Arçelik OPCUa Client schedule <img src="https://img.shields.io/badge/nodejs-16-red"> <img src="https://img.shields.io/badge/typescript-4.8.4-blue">


OPCUa Client with scheduled operations

## Description

Usin OPCUa client, this software read some opcua server variables, and send the value via Fiware context broker. This job is scheduled to be execute every hour.

- -  -

## Table of contents

* [Prerequsites](#prerequsites)
* [Configuration](#configuration)
    * [OPCUa client](#client)
    * [Fiware](#fiware)
* [Testing](#testing)
* [Deployment](#deployment)
    * [Standalone](#standalone)
    * [Docker](#docker)
* [Support](#support)

- - -

## Prerequsites

[node.js](https://nodejs.org/en/) and npm installed, and minimal command line knowledge.

## Configuration

There are two configurations

## *Client*

The client will read the [client configuration json file](./OPCUaClientConfig.json) who is holding the connection information. This configuration allows to connect with multiple servers wit more or one variable to read

## *Fiware*

The [environment file](./ENV) holds the configuration to connect with fiware.

## Testing

To run the tests, execute ``npm run test``

## Deployment

There are two options to use this tool

## *Standalone*

* Open a terminal at package.json level 
* execute ``npm run dev``


## *Docker*

To run this code inside a docker container:

* Build the image using ``docker build -t arcelikclient .``
* Create a container using ``docker run -d arcelikclient  --env-file ./ENV``


## Support

dcarvajal@lst.tfo.upm.es

ebuhid@lst.tfo.upm.es


