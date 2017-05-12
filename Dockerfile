# TODO: Change to v6.10.x
FROM kkarczmarczyk/node-yarn:6.9

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
