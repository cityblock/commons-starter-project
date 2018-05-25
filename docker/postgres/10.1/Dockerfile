FROM postgres:10.4@sha256:eb8e809480d43a0719192a0265bcc9f7411ba534f00bc8fabfcf3abad982e434
MAINTAINER https://github.com/muccg/

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    ssl-cert \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD docker-entrypoint-initdb.d /docker-entrypoint-initdb.d