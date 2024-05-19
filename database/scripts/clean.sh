#!/usr/bin/env sh

docker rm -v $(docker ps --filter status=exited -q)
docker rmi $(docker images -qa -f 'dangling=true')
