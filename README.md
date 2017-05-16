# Commons

[![Coverage Status](https://coveralls.io/repos/github/sidewalklabs/commons/badge.svg?t=Mrcm01)](https://coveralls.io/github/sidewalklabs/commons) [![CircleCI](https://circleci.com/gh/sidewalklabs/commons.svg?style=svg&circle-token=ff9336cd2c27998733f1abe9a3c3bcbba62a045f)](https://circleci.com/gh/sidewalklabs/commons)

Care MVP. For a more detailed spec, see the [PRD][].

Tech wise, this app is an Express server running GraphQL, PostgreSQL (Objection.js) and GraphiQL written in TypeScript. Tested using Jest. Hosted on [Aptible][].

## Meta

* __State:__ development
* __Production:__ https://app-6170.on-aptible.com | [Aptible](https://dashboard.aptible.com/apps/6170)
* __Github:__ https://github.com/sidewalklabs/commons
* __CI:__ [CircleCi](https://circleci.com/gh/sidewalklabs/commons); merged PRs to `sidewalklabs/commons#master` are automatically deployed
* __Point People:__ @zamiang, @loganhasson
* __Pingdom:__ http://stats.pingdom.com/8uqm3ndqqgmh
* __Trace:__ https://trace.risingstack.com/app/#/infrastructure/5915e849e665183589dd7506
* __Optics:__ https://optics.apollodata.com/service/sidewalklabs-Commons-Production?range=lastHour

## Getting started

Tools this repo uses and how to get started using them.

#### GraphQL

_Getting up to speed with GraphQL:_
- [Learn GraphQL](https://learngraphql.com/basics/introduction)
- [Example large GraphQL project](https://github.com/artsy/metaphysics)
- [Building Apollo](https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035)
- [GraphQL Tips after a Year in Production](https://hackernoon.com/graphql-tips-after-a-year-in-production-419341db52e3#.voca72wji)
- We use [apollo tools][] to reduce boilerplate in our app.

#### PostgreSQL + Objection.js ORM

_Getting up to speed with PostgreSQL:_
- Basic familiarity with SQL
- [objection.js][]

Create a migration (using [knex][]) with: (TODO: make a yarn script)

    yarn knex migrate:make initial-migration -- --knexfile=server/models/knexfile.js

Run a migration with:

    yarn migrate

#### GraphiQL

GraphiQL is accessible locally at [http://localhost:3000/graphiql](http://localhost:3000/graphiql) and on production at [https://app-6170.on-aptible.com/graphiql](https://app-6170.on-aptible.com/graphiql). All endpoints except login require you to be authenticated. In order to pass auth information we need to...

1. create a user (NOTE: You may need to disable authentication checks locally in the `createUser` mutation resolver.)

        mutation {
          createUser(input: {email: "your-name@sidewalklabs.com", password: "password"}) {
            user { id }
          }
        }

2. log in and get `authToken`

        mutation {
          login(input: {email: "brennan@sidewalklabs.com", password: "password"}) {
            authToken
          }
        }

3. pass auth information via [modheader][] for future requests
- copy `authToken`
- download [modheader][] for Chrome
- add `auth_token` to the request header (note underscore!)

#### Aptible

This app is hosted on [Aptible][]. It is a heroku-like wrapper around some AWS services to make it easier to setup HIPAA compliant infrastructure. It is modeled after Heroku so if you have some experience there, it should be pretty straightforward.

Getting up to speed:
- Try deploying a node app to Aptible (or Heroku if that is easier)
- Learn about HIPAA: https://www.aptible.com/resources/common-hipaa-questions/

## Developer Workflow

### Installation

- Install [yarn][]
- Create a `.env` file in the project root (see: [.env][])
- Create a Postgres database:

    ```
    brew install postgres  # if necessary
    createdb commons
    createdb commons_test
    ```

### Development

    yarn run dev

### Testing

Our test database uses postgres. Before running tests, ensure that postgres is running and create the database `commons_test` (`psql -c "create database commons_test;"`)

Next run:

    NODE_ENV=test yarn migrate

This will setup the test database and you should be good to go.

### Production

The app is hosted on [Aptible][]. If you do not have an account please ask Point People.
Once you have an account, add your SSH Keys, install the [Aptible toolbelt][] and log in via the toolbelt.

Deploy manually via:

    git remote add aptible git@beta.aptible.com:sidewalk-labs/commons.git
    git push aptible master

You should see the changes at our [staging][] endpoint.

## How-to

### To automatically fix linter errors, run:

    yarn lint -- --fix

Once you've added the aptible git remote, you can use Aptible toolbelt to interface with the app:

    aptible config  # prints environment variables from aptible

### To update the TypeScript types to reflect GraphQL schema changes (`schema.graphql`), run:

    yarn update-schema

CircleCI will complain if you forget to do this.

### To connect to the Aptible database from your machine, run:

    yarn prod-db

Or, alternatively, use `aptible db:tunnel commons`. Note: If you get an auth error here, you may need to login to Aptible again. Login tokens last 1 week.

### To push your local version of the server to Aptible, run:

    git push aptible HEAD:master

Be careful, though! Your changes will go live immediately, then be overridden by the next push to
master.

### Update custom tslint rules (such as checkIsAllowedRule).

    cd rules
    tsc checkIsAllowedRule.ts

### Update react jest snapshots

    yarn test -- -u

### Recreate Production DB

1. Connect to Aptible database using

    yarn prod-db

2. Create a temporary database and connect to it

    create database temp;
    \connect temp

3. Drop, recreate, and connect to the production database

    drop database db;
    create database db;
    \connect db

4. Run any mutation against production

5. Get and aptible console

    aptible ssh --app=commons
    NODE_ENV=production yarn ts-node
    var Db = require('./server/db').default
    var User = require('./server/models/user').default
    var db = Db.get()
    db.then(() => User.create({email: 'some@email.com', password: 'password', userRole: 'physician'}))

### Run RabbitMQ, Workers, and Cron

We are using RabbitMQ as our message broker. It allows us to throw tasks into the background to be performed at a later time when workers have bandwidth. Currently, there are two ways to do this. You can either manually create publishers and consumers or just rely on the `low-priority` and `high-priority` queues by creating services that extend `BaseService`. (For now, everthing is just getting published to the default exchange which, in effect, creates the illusion of a publish-to-queue-and-consume-from-queue model.)

For tasks that need to be scheduled, we are using the `cron` node module. Jobs are specified in `config/cron.ts` and will run at their scheduled times. You are free to run any arbitrary code within these scheduled jobs, though it's preferable to have the jobs fire off background jobs which workers can then work off.

To get started

1. Install RabbitMQ:

    brew install rabbitmq

2. Run RabbitMQ:

    rabbitmq-server

3. Run individual consumers/cron with:

    yarn run low-priority-dev / yarn run high-priority-dev / yarn run cron-dev

### PostgreSQL Log Settings

We've modified the default PostgreSQL logging behavior to give us more visibility into the database. A good description of what all of these different settings can be found in the [PostgreSQL Documentation][]. All of these settings are modified by running the following statements against the database:

1. `ALTER SYSTEM SET desired_setting = value;`
2. `SELECT pg_reload_conf();`

The settings are as follows:

1. `log_statement = 'all'`
2. `log_connections = true`
3. `log_disconnections = true`
4. `log_duration = true`
5. `log_min_duration_statement = -1`
6. `log_min_messages = 'DEBUG2'`

### Running in Production Mode Locally Using Docker

We are able to run the application locally using Docker and Docker Compose. For now, this means running the web application with a postgres database, but no RabbitMQ. To get started, download and install [Docker][]. After you have Docker installed and running, follow these steps:

1. Start the application and database by running `yarn run docker-prod:start`. The first time you do this, you will have to wait a little while.
2. In a separate terminal window, run: `yarn run docker-prod:migrate`.
3. To set up an initial user, run: `yarn run docker-prod:ts-node` and follow the usual steps.
4. Visit `localhost:3000` in your browser.
5. After making changes to the application, you'll need to rebuild the Docker image and restart the app.
6. If you make changes to the application and wish to see them, the application container will need to be rebuilt and restarted. To do this, in another terminal window, run `yarn run docker-prod:restart`.

[Aptible]: https://aptible.com
[Aptible toolbelt]: https://www.aptible.com/support/toolbelt/
[staging]: https://app-5428.on-aptible.com
[yarn]: https://yarnpkg.com/lang/en/docs/install/
[.env]: https://drive.google.com/open?id=0B0zLbhxd96u9Z3RBRmdrV09uMzA
[PRD]: https://docs.google.com/document/d/1yfcbwghOUcJ2PlK_J5JxBIUcXaYuArZuR6VN8-NcZ6g/edit?usp=sharing
[modheader]: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj
[apollo tools]: https://github.com/apollographql/graphql-tools
[Objection.js]: https://github.com/Vincit/objection.js
[knex]: http://knexjs.org/
[PostgreSQL Documentation]: https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html
[Docker]: https://docs.docker.com/engine/installation/
