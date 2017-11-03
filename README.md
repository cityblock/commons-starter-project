# Commons

[![Coverage Status](https://coveralls.io/repos/github/cityblock/commons/badge.svg?branch=master&t=WGaPTr)](https://coveralls.io/github/cityblock/commons?branch=master)
[![CircleCI](https://circleci.com/gh/cityblock/commons.svg?style=svg&circle-token=ff9336cd2c27998733f1abe9a3c3bcbba62a045f)](https://circleci.com/gh/cityblock/commons)
[![NSP Status](https://nodesecurity.io/orgs/cityblock/projects/c914cd48-0065-4791-8267-b5b15f6b7e80/badge)](https://nodesecurity.io/orgs/cityblock/projects/c914cd48-0065-4791-8267-b5b15f6b7e80)

Tech wise, this app is an Express server running GraphQL and PostgreSQL (Objection.js) written in TypeScript. Tested using Jest. Hosted on [Aptible][].

## Meta

* __State:__ development
* __Production:__ https://app-6170.on-aptible.com | [Aptible](https://dashboard.aptible.com/apps/6170)
* __Github:__ https://github.com/sidewalklabs/commons
* __CI:__ [CircleCi](https://circleci.com/gh/sidewalklabs/commons); merged PRs to `sidewalklabs/commons#master` are automatically deployed
* __Point People:__ @zamiang, @loganhasson
* __Pingdom:__ http://stats.pingdom.com/8uqm3ndqqgmh
* __Trace:__ https://trace.risingstack.com/app/#/infrastructure/5915e849e665183589dd7506/dashboard
* __AppCanary:__ https://appcanary.com/monitors/2283
* __Logentries:__ https://logentries.com/app/87be99c5#/sets
* __Model Documentation:__ https://docs.google.com/document/d/1L1MX7QPJl2Mn3DC1icvPGIkufepJORtJA4SxdKqbIAg/edit
* __Tools Documentation:__: https://docs.google.com/document/d/1LZPlWvR3O8bpP86bQRHnuYWxKlWG9ADfIPsuh3RyjIA/edit

### Installation

- Install [nvm][] and node 8.9
- Install [yarn][]
- Create a `.env` file in the project root (see: [.env][])
- Install [Zenhub][]
- Create a Postgres database:

    ```
    brew install postgres  # if necessary
    createdb commons
    createdb commons_test
    psql -d commons -c "create extension if not exists btree_gist"
    psql -d commons_test -c "create extension if not exists btree_gist"
    ```

- Seed development database with `yarn seed`
- [Add your user account](#add-a-new-user)

### Development

    yarn run dev

### Testing locally

Our test database uses postgres. Before running tests, ensure that postgres is running and create the database `commons_test` and role `root` (`psql -c "create database commons_test"; psql -c "create role root with login"; psql -d commons_test -c "create extension btree_gist"`)

Next run:

    NODE_ENV=test yarn migrate

This will setup the test database and you should be good to go.

### Making changes

Important: Never commit directly to the master branch. Ensure changes are small and incremental.

To make a change:
- clone the repo locally
- branch from master
- make your changes
- write and run tests for your code
- push your branch to the remote
- submit a pull request
- assign another engineer on the team as a reviewer

Before you can merge your code into master, the engineer you assigned must approve your code via the GitHub approval UI. As the code's author, it is your responsibility to merge your code to master (using 'merge and squash' in Github) and then to ensure your code is deployed without error.

For reverting code in master, use Github's [revert functionality][].

### Performing code review

This is a handy checklist for when you are performing code review for others. Modified from [Fog Creek code review][] docs. You should respond within ~2 business hours to requests for code review.

__General__

- Does the code work? Does it perform its intended function, the logic is correct etc.
- Is all the code easily understood?
- Is the coding style consistent with our existing style? (linting should solve this)
- Is there any commented out code?
- Is there any redundant or duplicate code?
- Is the code as modular as possible?
- Can any of the code be replaced with library functions?
- Can any logging or debugging code be removed?
- Does the code explicitly return booleans? Perhaps could be written in a better way
- Does the code wrap in a large if statement rather than early exit?

__Security__

- Are all data inputs checked and encoded? (GraphQl + Objection.js handle much of this for us)
- Are access controls for data correctly checked at the API level?
- Are invalid parameter values handled?

__Documentation__

- Do comments exist and describe the intent of the code if code is not easily understood?
- Is any unusual behavior or edge-case handling described?
- Is the use and function of third-party libraries documented?
- Are data structures and units of measurement explained?
- Is there any incomplete code? If so, should it be removed or flagged with a suitable marker like ‘TODO’?

__Testing__

- Is the code testable? i.e. don’t add too many or hide dependencies, unable to initialize objects, test frameworks can use methods etc.
- Do tests exist and are they comprehensive?
- Do unit tests actually test that the code is performing the intended functionality?
- Could any test code be replaced with the use of an existing API?

### Production

The app is hosted on [Aptible][]. If you do not have an account please ask Point People.
Once you have an account, add your SSH Keys, install the [Aptible toolbelt][] and log in via the toolbelt.

Deploy manually via:

    git remote add aptible git@beta.aptible.com:sidewalk-labs/commons.git
    git push aptible master

You should see the changes at our [staging][] endpoint.

## Security

- In production, we scan software installed on our servers using [AppCanary][]
- In development, we use [NSP][] to scan external dependencies of our Node app for vulnerabilities daily and check dependency changes for vulnerabilities
We follow the Microsoft [Secure Development Lifecycle][] through security focused ts-lint rules- We maintain 80% test coverage to reduce the chance of unintended disclosure of PHI
- We prefer standard or popular libraries with institutional backing
- Commiting directly to master is disabled via Github 'Protected Branches'
- All commits to master must be made through a pull request that is approved by another engineer

## How-to

### Use GraphiQL

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

### Revert a PR merge into master

1. As quickly as possible, cancel the build of master on CircleCI so that there is no deploy to production.
2. Click the 'Revert' button on GitHub that appears near the bottom of the page on the merged PR.
3. GitHub will generate a revert PR on your behalf.
4. Merge the generated PR.

### To automatically fix linter errors, run:

    yarn lint --fix

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

    yarn test -u

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

### Add a new user

Before a new user can log in, they need to be added to the database. To do so, run the following command:

`EMAIL=email@email.com FIRST_NAME=firstName LAST_NAME=lastName PROVIDER_ID=athenaProviderId yarn user:add:dev`

When running on production, replace `user:add:dev` with `user:add:production`. You may also provide a `USER_ROLE` environment variable in front of the command if you would like the user to be anything other than a physician.

### Remove a user

To remove a user, run the following command:

`EMAIL=email@email.com yarn user:remove:dev`

When running on production, replace `user:remove:dev` with `user:remove:production`.

### Create a new migration

Create a migration (using [knex][]) with:

    yarn knex migrate:make initial-migration --knexfile=server/models/knexfile.js

Run a migration with:

    yarn migrate


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
5. If you make changes to the application and wish to see them, the application container will need to be rebuilt and restarted. To do this, in another terminal window, run `yarn run docker-prod:restart`.
6. To stop the application, run: `yarn run docker-prod:stop`.

[nvm]: https://github.com/creationix/nvm
[Zenhub]: https://www.zenhub.com/
[Aptible]: https://aptible.com
[Aptible toolbelt]: https://www.aptible.com/support/toolbelt/
[staging]: https://app-5428.on-aptible.com
[yarn]: https://yarnpkg.com/lang/en/docs/install/
[.env]: https://drive.google.com/open?id=0ByoS7xhzfIR0b296cS1jSW9nNzA
[PRD]: https://docs.google.com/document/d/1yfcbwghOUcJ2PlK_J5JxBIUcXaYuArZuR6VN8-NcZ6g/edit?usp=sharing
[modheader]: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj
[apollo tools]: https://github.com/apollographql/graphql-tools
[Objection.js]: https://github.com/Vincit/objection.js
[knex]: http://knexjs.org/
[PostgreSQL Documentation]: https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html
[Docker]: https://docs.docker.com/engine/installation/
[Tech Design Doc]: https://docs.google.com/document/d/1KlSX20FgUv1BllA6n8jJdg6beQ55ikrpaOOE8RnfQkE
[Fog Creek code review]: https://blog.fogcreek.com/increase-defect-detection-with-our-code-review-checklist-example/]
[revert functionality]: https://help.github.com/desktop/guides/contributing/reverting-a-commit/
[AppCanary]: https://appcanary.com/monitors/2283
[NSP]: https://nodesecurity.io
[Secure Development Lifecycle]: https://github.com/Microsoft/tslint-microsoft-contrib/wiki/TSLint-and-the-Microsoft-Security-Development-Lifecycle
