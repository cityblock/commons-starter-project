FROM postgres:10.3@sha256:b7e73f7768f8bdab547c56e921d7ac37d27368ff802677417b35aa9a633973bd
MAINTAINER https://github.com/muccg/

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    ssl-cert \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD docker-entrypoint-initdb.d /docker-entrypoint-initdb.d