FROM postgres:10.2@sha256:7361bae1fbf5642099663d1f02dc949cabde1f86727bf8ff00d0a8806640a617
MAINTAINER https://github.com/muccg/

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    ssl-cert \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD docker-entrypoint-initdb.d /docker-entrypoint-initdb.d