FROM node:8.9.4@sha256:4c43091f426f1a630c3db3acb6f2eaf940e50eafe4d08ddc53f4d5832ba9958d

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
