FROM postgres:10.4@sha256:852dd8150c5ea73015cf2c9c601de07113c31b3272628f9a945d46c7d960004d
MAINTAINER https://github.com/muccg/

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    ssl-cert \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD docker-entrypoint-initdb.d /docker-entrypoint-initdb.d