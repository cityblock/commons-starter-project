FROM postgres:10.3@sha256:7299646996aba8e5ca2a5e345dc6b9f9b0f3278bea63aacbe3be6ff6482ce4dc
MAINTAINER https://github.com/muccg/

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    ssl-cert \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD docker-entrypoint-initdb.d /docker-entrypoint-initdb.d