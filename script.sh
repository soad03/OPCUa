#!/bin/bash

#stopping upm client container
docker container stop upmclient
#removing upm client container
docker container rm upmclient
#removing upm client image
docker image rm upmclient
#building upm client image
docker build -t upmclient .
#saving upm client image to upmclient.tar in current directory
docekr save -o upmclient.tar upmclient
#creating upm client container
docker run -d --env-file ./environment.env -t OPCUAClient