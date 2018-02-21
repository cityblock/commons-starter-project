FROM node:8.9.4@sha256:e54e8d37bd8c85b3f607a4978d0d50c21cba0e6a3e132651ea0f19b5dfc76203

RUN apt-get update && apt-get install -y curl apt-transport-https

RUN apt-get update && apt-get -y upgrade

# Install dependencies (but not devDependencies)
# So long as no dependencies have changed, this step will be cached.
ADD package.json /app/
ADD yarn.lock /app/
WORKDIR /app
RUN yarn install --production

ADD . /app
# We do not want this step to be cached
# import our aptible.env to get the google oauth token
# see https://www.aptible.com/documentation/enclave/reference/apps/image/dockerfile-deploy/aptible-env.html
RUN set -a && . /app/.aptible.env && yarn build

EXPOSE 3000
