FROM node:wheezy

RUN apt-get update && apt-get install -y curl apt-transport-https

RUN apt-get --purge -y autoremove libxml2 libxml2-dev libmagickwand-dev imagemagick-common \
  libmagickcore-6.q16-2 imagemagick libmagickcore-6-arch-config imagemagick-6.q16 \
  libmagickwand-6.q16-dev libmagickcore-6-headers libmagickcore-6.q16-dev \
  libmagickcore-dev libmagickwand-6.q16-2 libmagickwand-6-headers libmagickcore-6.q16-2-extra

RUN apt-get update && apt-get -y upgrade

# Install dependencies (but not devDependencies)
# So long as no dependencies have changed, this step will be cached.
ADD package.json /app/
ADD yarn.lock /app/
WORKDIR /app
RUN yarn install --production

ADD . /app
# We do not want this step to be cached
RUN yarn build

EXPOSE 3000
