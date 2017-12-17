# Commons

[![CircleCI](https://circleci.com/gh/cityblock/commons.svg?style=svg&circle-token=ff9336cd2c27998733f1abe9a3c3bcbba62a045f)](https://circleci.com/gh/cityblock/commons)
[![NSP Status](https://nodesecurity.io/orgs/cityblock/projects/c914cd48-0065-4791-8267-b5b15f6b7e80/badge)](https://nodesecurity.io/orgs/cityblock/projects/c914cd48-0065-4791-8267-b5b15f6b7e80)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcityblock%2Fcommons.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcityblock%2Fcommons?ref=badge_shield)

This app is an Express server running GraphQL and PostgreSQL (Objection.js) written in
TypeScript. Tested using Jest. Hosted on [Aptible][].

## Meta

* **State:** development
* **Staging:** https://commons.cityblock.com |
  [Aptible](https://dashboard.aptible.com/apps/6170)
* **Github:** https://github.com/cityblock/commons
* **CI:** [CircleCi](https://circleci.com/gh/cityblock/commons); merged PRs to
  `cityblock/commons#master` are automatically deployed
* **Point People:** @zamiang, @loganhasson
* **Pingdom:** http://stats.pingdom.com/8uqm3ndqqgmh
* **AppCanary:** https://appcanary.com/monitors/2283
* **Logentries:** https://logentries.com/app/87be99c5#/sets
* **Model Documentation:** https://docs.google.com/document/d/1L1MX7QPJl2Mn3DC1icvPGIkufepJORtJA4SxdKqbIAg/edit
* **Tools Documentation:** https://docs.google.com/document/d/1LZPlWvR3O8bpP86bQRHnuYWxKlWG9ADfIPsuh3RyjIA/edit

### Installation

* Install [nvm][] and node 8.9
* Install [yarn][]
* Create a `.env` file in the project root (see: [.env][])
* Install [Zenhub][]
* [Setup your local database](#create-local-postgres-database)
* Ask a Point Person to add you as a user in staging and change your user role to Admin.
* [Copy staging database to your local database](#copying-staging-database-to-local-database)

### Create test postgres database

Setup your database. First install postgres 10 from brew or postgresapp.

    createdb commons_test
    psql -d commons_test -c "create extension if not exists btree_gist"
    psql -d commons_test -c "create extension pg_trgm"


### Development

Ensure you have copied from staging to local. Then run:

    yarn run dev

### Testing locally

Our test database uses postgres. Before running tests, ensure that postgres is running and use:

    yarn test

### Making changes

Important: Never commit directly to the master branch. Commit to branches and ensure changes are small and incremental.

To make a change:

* clone the repo locally
* branch from master
* make your changes
* write and run tests for your code
* push your branch to the remote
* submit a pull request
* assign another engineer on the team as a reviewer

Before you can merge your code into master, the engineer you assigned must approve your code via the
GitHub approval UI. As the code's author, it is your responsibility to merge your code to master
(using 'merge and squash' in Github) and then to ensure your code is deployed without error.

For reverting code in master, use Github's [revert functionality][].

### Performing code review

This is a handy checklist for when you are performing code review for others. Modified from [Fog
Creek code review][] docs. You should respond within ~2 business hours to requests for code review.

**General**

* Does the code work? Does it perform its intended function, the logic is correct etc.
* Is all the code easily understood?
* Is the coding style consistent with our existing style? (linting should solve this)
* Is there any commented out code?
* Is there any redundant or duplicate code?
* Is the code as modular as possible?
* Can any of the code be replaced with library functions?
* Can any logging or debugging code be removed?
* Does the code explicitly return booleans? Perhaps could be written in a better way
* Does the code wrap in a large if statement rather than early exit?

**Security**

* Are all data inputs checked and encoded? (GraphQl + Objection.js handle much of this for us)
* Are access controls for data correctly checked at the API level?
* Are invalid parameter values handled?

**Documentation**

* Do comments exist and describe the intent of the code if code is not easily understood?
* Is any unusual behavior or edge-case handling described?
* Is the use and function of third-party libraries documented?
* Are data structures and units of measurement explained?
* Is there any incomplete code? If so, should it be removed or flagged with a suitable marker like
  ‘TODO’?

**Testing**

* Is the code testable? i.e. don’t add too many or hide dependencies, unable to initialize objects,
  test frameworks can use methods etc.
* Do tests exist and are they comprehensive?
* Do unit tests actually test that the code is performing the intended functionality?
* Could any test code be replaced with the use of an existing API?

### Production

The app is hosted on [Aptible][]. If you do not have an account please ask Point People. Once you
have an account, add your SSH Keys, install the [Aptible toolbelt][] and log in via the toolbelt.

Deploy manually via:

    git remote add aptible git@beta.aptible.com:sidewalk-labs/commons.git
    git push aptible master

You should see the changes at our [staging][] endpoint.

## Security

* In production, we scan software installed on our servers using [AppCanary][]
* In development, we use [NSP][] to scan external dependencies of our Node app for vulnerabilities
  daily and check dependency changes for vulnerabilities We follow the Microsoft [Secure Development
  Lifecycle][] through security focused ts-lint rules- We maintain 80% test coverage to reduce the
  chance of unintended disclosure of PHI
* We prefer standard or popular libraries with institutional backing
* Commiting directly to master is disabled via Github 'Protected Branches'
* All commits to master must be made through a pull request that is approved by another engineer

## How-to

### Use GraphiQL

GraphiQL is accessible locally at [http://localhost:3000/graphiql](http://localhost:3000/graphiql)
and on production at
[https://app-6170.on-aptible.com/graphiql](https://app-6170.on-aptible.com/graphiql). All endpoints
except login require you to be authenticated. In order to pass auth information we need to...

1. create a user (NOTE: You may need to disable authentication checks locally in the `createUser`
   mutation resolver.)

       mutation {
         createUser(input: {email: "your-name@cityblock.com", password: "password"}) {
           user { id }
         }
       }

2. log in and get `authToken`

       mutation {
         login(input: {email: "your-name@cityblock.com", password: "password"}) {
           authToken
         }
       }

3. pass auth information via [modheader][] for future requests

* copy `authToken`
* download [modheader][] for Chrome
* add `auth_token` to the request header (note underscore!)

### Revert a PR merge into master

1. As quickly as possible, cancel the build of master on CircleCI so that there is no deploy to
   production.
2. Click the 'Revert' button on GitHub that appears near the bottom of the page on the merged PR.
3. GitHub will generate a revert PR on your behalf.
4. Merge the generated PR.

### To automatically fix linter errors, run:

    yarn lint --fix
    # for style changes
    yarn stylelint --fix

Once you've added the aptible git remote, you can use Aptible toolbelt to interface with the app:

    aptible config  # prints environment variables from aptible

### To connect to the Aptible database from your machine, run:

    yarn prod-db

Or, alternatively, use `aptible db:tunnel commons`. Note: If you get an auth error here, you may
need to login to Aptible again. Login tokens last 1 week.

### To push your local version of the server to Aptible, run:

    git push aptible HEAD:master

Be careful, though! Your changes will go live immediately, then be overridden by the next push to
master.

### Update custom tslint rules (such as checkIsAllowedRule).

    cd rules
    tsc checkIsAllowedRule.ts

### Update react jest snapshots

    yarn test -u


### Add a new user

Before a new user can log in, they need to be added to the database. To do so, run the following
command:

`EMAIL=email@email.com FIRST_NAME=firstName LAST_NAME=lastName PROVIDER_ID=[some integer] yarn
user:add:dev`

When running on production, replace `user:add:dev` with `user:add:production`. You may also provide
a `USER_ROLE` environment variable in front of the command if you would like the user to be anything
other than a physician.

### Remove a user

To remove a user, run the following command:

`EMAIL=email@email.com yarn user:remove:dev`

When running on production, replace `user:remove:dev` with `user:remove:production`.

### Create a new migration

Create a migration (using [knex][]) with:

    yarn knex migrate:make initial-migration --knexfile=server/models/knexfile.js

Run a migration with:

    yarn migrate

### PostgreSQL

#### Log Settings

We've modified the default PostgreSQL logging behavior to give us more visibility into the database.
A good description of what all of these different settings can be found in the [PostgreSQL
Documentation][]. All of these settings are modified by running the following statements against the
database:

1. `ALTER SYSTEM SET desired_setting = value;`
2. `SELECT pg_reload_conf();`

The settings are as follows:

1. `log_statement = 'all'`
2. `log_connections = true`
3. `log_disconnections = true`
4. `log_duration = true`
5. `log_min_duration_statement = -1`
6. `log_min_messages = 'DEBUG2'`

#### Spotlight Optimization

Running the test suite causes a lot of database churning. This can cause low performance when
Spotlight is attempting to index every change to your database files. To prevent this, [add][] your
Postgres data directory (with a Homebrew install, typically `/usr/local/var/postgres`) to
Spotlight's privacy list.

### Running in Production Mode Locally Using Docker

We are able to run the application locally using Docker and Docker Compose. For now, this means
running the web application with a postgres database. To get started, download and
install [Docker][]. After you have Docker installed and running, follow these steps:

1. Start the application and database by running `yarn run docker-prod:start`. The first time you do
   this, you will have to wait a little while.
2. In a separate terminal window, run: `yarn run docker-prod:migrate`.
3. To set up an initial user, run: `yarn run docker-prod:ts-node` and follow the usual steps.
4. Visit `localhost:3000` in your browser.
5. If you make changes to the application and wish to see them, the application container will need
   to be rebuilt and restarted. To do this, in another terminal window, run `yarn run
   docker-prod:restart`.
6. To stop the application, run: `yarn run docker-prod:stop`.

### Copying staging database to local database

Note: this will eventually become untenable but for now it is convenient.

  aptible login
  aptible db:dump commons
  dropdb commons
  createdb commons 
  psql commons < commons.dump
  rm commons.dump

### Create a database schema explorer 

To get started with [Schemaspy][] which creates an interactive website to explore the schema, first, download and install [Docker][]. After you have Docker installed and running, follow these steps:

  cd some-new-directoy  
  docker run -v "$PWD:/output" schemaspy/schemaspy:snapshot -t pgsql -db commons -u insertYourDbUsernameHere -host docker.for.mac.localhost -hq
  open some-new-directoy/index.html

To get started with [Schemacrawler][], which creates a somewhat nicer image of the schema but is not interactive, first, setup docker and then follow these steps:

  docker run -v $(pwd):/share --rm -i -t --entrypoint=/bin/bash sualeh/schemacrawler
  ./schemacrawler.sh -server=pgsql -user= insertYourDbUsernameHere -database=commons -host=docker.for.mac.localhost -infolevel=maximum -routines= -command=schema -outputfile=/share/sc_db.png
  exit
  open sc_db.png



[nvm]: https://github.com/creationix/nvm
[zenhub]: https://www.zenhub.com/
[add]: http://osxdaily.com/2011/12/30/exclude-drives-or-folders-from-spotlight-index-mac-os-x/
[aptible]: https://aptible.com
[aptible toolbelt]: https://www.aptible.com/support/toolbelt/
[staging]: https://app-5428.on-aptible.com
[yarn]: https://yarnpkg.com/lang/en/docs/install/
[.env]: https://drive.google.com/open?id=0ByoS7xhzfIR0b296cS1jSW9nNzA
[prd]: https://docs.google.com/document/d/1yfcbwghOUcJ2PlK_J5JxBIUcXaYuArZuR6VN8-NcZ6g/edit?usp=sharing
[modheader]: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj
[apollo tools]: https://github.com/apollographql/graphql-tools
[objection.js]: https://github.com/Vincit/objection.js
[knex]: http://knexjs.org/
[postgresql documentation]: https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html
[docker]: https://docs.docker.com/engine/installation/
[tech design doc]: https://docs.google.com/document/d/1KlSX20FgUv1BllA6n8jJdg6beQ55ikrpaOOE8RnfQkE
[Fog Creek code review]: https://blog.fogcreek.com/increase-defect-detection-with-our-code-review-checklist-example/] 
[revert functionality]: https://help.github.com/desktop/guides/contributing/reverting-a-commit/ 
[AppCanary]: https://appcanary.com/monitors/2283 
[NSP]: https://nodesecurity.io 
[Secure Development Lifecycle]: https://github.com/Microsoft/tslint-microsoft-contrib/wiki/TSLint-and-the-Microsoft-Security-Development-Lifecycle
[Schemaspy]: https://github.com/schemaspy/schemaspy
[Schemacrawler]: https://github.com/sualeh/SchemaCrawler
