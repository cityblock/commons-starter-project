FROM node:8.11.1@sha256:9fef54193f605eb77fcb7eaae564e7cc9b3444a12d76a2e1c87b9789752852b3

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