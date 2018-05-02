FROM node:8.11.1@sha256:b802a02ee6496c34e2dc0eb0379eb1c738331414956d650c0dffdfa0866acb2f

RUN apt-get update && apt-get install -y curl apt-transport-https

RUN apt-get update && apt-get -y upgrade

# Install dependencies (but not devDependencies)
# So long as no dependencies have changed, this step will be cached.
ADD package.json /app/
ADD yarn.lock /app/
WORKDIR /app
RUN yarn install --production

ADD . /app
RUN set -a && . /app/.env && yarn build

EXPOSE 3000