# WoT+IL OPC UA to Fiware

Component that generates interoperability between an OPC UA server and FIWARE Orion LD Context Broker, using the SHOP4CF data model.

## Installing

Clone the respository 

Execute  ``npm install`` to download all needed extra modules

## Running

Execute ``ts-node upmclient.ts`` to run the component

## Docker

Execute ``docker build -t imagename .`` to build the image

Execute ``docker run -d --env-file environment.env imagename`` to create a container using the crated image

### Docker environmnet variables

To configure the OPC UA server variables check the [ENV](./environment.env) file

## Docker offline image generation/import

To donwnload a docker image as a file execute `` docker save -o targetfilename.tar imagename ``

To upload docker image from file execute `` docker load --input imagename.tar ``