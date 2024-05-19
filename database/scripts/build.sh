#!/usr/bin/env sh

docker build . -t testing; docker run -p 5432:5432 $1 testing:latest
