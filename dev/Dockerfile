FROM ubuntu:latest

RUN apt-get update && apt-get install -y curl git

RUN curl -sL https://deb.nodesource.com/setup_9.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh

RUN apt-get update && apt-get install -y nodejs && apt-get clean

