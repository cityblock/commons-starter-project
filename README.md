# Commons

[![CircleCI](https://circleci.com/gh/cityblock/commons.svg?style=svg&circle-token=ff9336cd2c27998733f1abe9a3c3bcbba62a045f)](https://circleci.com/gh/cityblock/commons)
[![NSP Status](https://nodesecurity.io/orgs/cityblock/projects/c914cd48-0065-4791-8267-b5b15f6b7e80/badge)](https://nodesecurity.io/orgs/cityblock/projects/c914cd48-0065-4791-8267-b5b15f6b7e80)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcityblock%2Fcommons.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcityblock%2Fcommons?ref=badge_shield)

This app is an Express server running GraphQL and PostgreSQL (Objection.js) written in
TypeScript. Tested using Jest. Hosted on [Aptible][].

## Meta

* **State:** development
* **Staging:** [https://commons-staging.cityblock.com](https://commons-staging.cityblock.com)
* **Demo:** [https://commons-demo.cityblock.com](https://commons-demo.cityblock.com)
* **Production:** [https://commons.cityblock.com](https://commons.cityblock.com)
* **Kue Staging:** [http://commons-staging.cityblock.com/kue](http://commons-staging.cityblock.com/kue) Username: jobManager, Password: KUE_UI_PASSWORD
* **Kue Demo:** [http://commons-demo.cityblock.com/kue](http://commons-demo.cityblock.com/kue) Username: jobManager, Password: KUE_UI_PASSWORD
* **Kue Production:** [http://commons.cityblock.com/kue](http://commons.cityblock.com/kue) Username: jobManager, Password: KUE_UI_PASSWORD
* **Github:** [https://github.com/cityblock/commons](https://github.com/cityblock/commons)
* **CI:** [CircleCi](https://circleci.com/gh/cityblock/commons); merged PRs to
  `cityblock/commons#master` are automatically deployed to staging
* **Point People:** @zamiang, @loganhasson
* **Stackdriver:** [https://app.google.stackdriver.com/?project=commons-183915](https://app.google.stackdriver.com/?project=commons-183915)
* **Datadog:** [https://app.datadoghq.com/dash/536514/aptible-app-and-db](https://app.datadoghq.com/dash/536514/aptible-app-and-db)
* **Pagerduty:** [https://cityblock.pagerduty.com](https://cityblock.pagerduty.com)
* **Data Model Documentation:** [https://docs.google.com/document/d/1L1MX7QPJl2Mn3DC1icvPGIkufepJORtJA4SxdKqbIAg/edit](https://docs.google.com/document/d/1L1MX7QPJl2Mn3DC1icvPGIkufepJORtJA4SxdKqbIAg/edit)
* **Tools Documentation:** [https://docs.google.com/document/d/1LZPlWvR3O8bpP86bQRHnuYWxKlWG9ADfIPsuh3RyjIA/edit](https://docs.google.com/document/d/1LZPlWvR3O8bpP86bQRHnuYWxKlWG9ADfIPsuh3RyjIA/edit)

## Features

The goal of this section give us high visibility of both documentation and test plans for features in order to keep us accountable when they are missing. Also to indicate point people for questions.

| **Feature**                   | **Eng who built** | **Test Plan**                                                                                                            | **Design / UX Doc**                                                                      | **PRD**                                                                                     |
| ----------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Progress Note                 | Brennan           | [Test Plan](https://docs.google.com/document/d/1JDekPxDBsGFs3SEUwfEmdYNLSLB4hwgCCBD8um_gDMc/edit#heading=h.se1fcozgemyu) |                                                                                          | [PRD](https://docs.google.com/document/d/1NK0qMw_nnK6rsh1schnzmphksJQ_QJ4zfUbgDyhLp4M/edit) |
| Timeline                      | Brennan / Logan   | See Progress Note Test Plan                                                                                              |                                                                                          |                                                                                             |
| Patient Left Nav              | Laura             | [Test Plan](https://docs.google.com/document/d/1xO7gVauPy1nDsoift2pHm4PQO7H0Ey8H1H7I3W-wFH8/edit)                        | [Designs](https://cityblock.invisionapp.com/d/main/#/console/13463529/283336293/preview) | [PRD](https://docs.google.com/document/d/1GDH4wv4_Ay3iT9a4xlr528EqSf8VRcPFGRBnrIHYmeQ/edit) |
| Screening Tool                | Logan             | [Test Plan](https://docs.google.com/document/d/1hnCzCKb_YhqG1GzETN1p00oVYIfstGibzM1qJIK1ttI/edit)                        |                                                                                          | [PRD](https://docs.google.com/document/d/15iDja4IOfIpBKX0kyZqVxXpX5fR_klxavMHcZOjY_D8/edit) |
| 360 Profile                   | Laura             | [Test Plan](https://docs.google.com/document/d/1aoCrvgFj5OLft7ZWlv_aydE7t71I7D18JTqfmHtcnlg/edit#)                       |                                                                                          | [PRD](https://docs.google.com/document/d/1ad4vUTD-vh7w8zxlUXqY9f1OAEFlHD42IudpKeMRLuE/edit) |
| Patient Intake                | Cristina / Logan  | [Test Plan](https://docs.google.com/document/d/1tfUgGhZPtKI270U41RzZDMttzWmnb4nQYeSaiI6UtB8/edit#heading=h.sgioobag91v3) | [Designs](https://cityblock.invisionapp.com/d/main/#/console/13213473/276399118/preview) | [PRD](https://docs.google.com/document/d/1xpxxmGDc9ZV1FhTRUteqbXjEerw2qofCM0iMvGqFwpc/edit) |
| MAP                           | Cross team        | [Test Plan](https://docs.google.com/document/d/1B8iDeO1Nh-4zW_VPv1xEUnoe1AMNSkoukoASENYpnaI/edit#)                       |                                                                                          | [PRD](https://docs.google.com/document/d/1EzMO7015cKSBcrALBDMFavUSpqB6SYUaRfmIpogzlr8/edit) |
| Care team management          | Cristina          | [Test Plan](https://docs.google.com/document/d/1bZiI18MMcBykHihv5AK49XG4R6WXmV9OTKacUIJ03Xw/edit#)                       |                                                                                          | [PRD](https://docs.google.com/document/d/1dsEqCz2I5K2v3Z3STK9tQiDaRAj0IaiXiTPOmcxGBTY/edit) |
| Outreach assignment           | Cristina / Logan  | See care team management test plan                                                                                       |                                                                                          | [PRD](https://docs.google.com/document/d/1fkVKD936NxHAZObixIl912tTU2VTLnGxYhPf_fOzkQA/edit) |
| Patient Comms                 | Laura             | [Test Plan](https://docs.google.com/document/d/1eWY2554I5ptA1qfQMG58AhDECZJ9P0AQxmgC9JqKaqk/edit)                        |                                                                                          | [PRD](https://docs.google.com/document/d/10ajWed84-PnmC9iUba9zmTEWSJNmV74_L4pX3ilNZvc/edit) |
| My tasks                      | Cross team        | [Test Plan](https://docs.google.com/document/d/1fFscYItoN_GoRqSEaD6XtG1Nz9_XHkHANpEhgLNsb90/edit#)                       |                                                                                          |                                                                                             |
| Break the glass               | Laura             | [Test Plan](https://docs.google.com/document/d/1CGFHzS9z297SQ4hfscv7oeev_ho1MyuqG3_ltmOwO2E/edit#heading=h.njnce6z3td4n) |                                                                                          |                                                                                             |
| Role and Permissions          | Laura             | [Test Plan](https://docs.google.com/document/d/1jjQUK0PxQkvz-FLwpL1zTRtULCMEklglVLuZphmJsh8/edit)                        |                                                                                          | [PRD](https://docs.google.com/document/d/1qgRtEvrp7fOyjw3zs_-hjAbCmHyAx_XNRNpvPeStKAw/edit) |
| Mattermost careworker comms   | Laura             | [Test Plan](https://docs.google.com/document/d/1SY01xY0r8WQvKQarwDZOEbrHUkXVIefu26fQQzUGohk/edit)                        |                                                                                          | [PRD](https://docs.google.com/document/d/1-11lJaOadMnsW-TwOBqS-iAPrEvfLZvJ8P4LB4nq6bI/edit) |
| CBO Referral                  | Laura             | [Test Plan](https://docs.google.com/document/d/1bNNUkkVQtum62rR4txlX_P5U2AEG0Yq79210Jzbh8r4/edit)                        |                                                                                          | [PRD](https://docs.google.com/document/d/1Vs7H3E3Rgi3mRNFpK4jz-9SgPvW0lNabEP13lx24Nsg/edit) |
| Member search                 | Laura             | [Test Plan](https://docs.google.com/document/d/1Yk0Df7a3OpffZS46KlJ0Qb4vX66XQVaDWNQG9-v-tEw/edit)                        |                                                                                          | [PRD](https://docs.google.com/document/d/1jpwYeayBkCAwhKsHVdht7aqW6xuSUjKKrPUUncY9Ff4/edit) |
| Care team dash                | Laura             | [Test Plan](https://docs.google.com/document/d/1OeyX3NQcK_6iKyBwyBjma7ZT-2Ey7eIkyiV4M2lfrmo/edit)                        |                                                                                          | [PRD](https://docs.google.com/document/d/1G0En_1H1fv_36uVSmRfjAj88f5AxbMHxusx-cocBvQs/edit) |
| Love your body Doc Management | Cristina          | See Patient Intake                                                                                                       | [Designs](https://cityblock.invisionapp.com/d/main/#/console/13747699/286876704/preview) | [PRD](https://docs.google.com/document/d/1w0OqN8nZ_gRMaRbvrGaGDQdRmAMXLPcSu1EnawhdPkE/edit) |
| Calendar Support in Commons   | Cristina          | NA                                                                                                                       |                                                                                          | [PRD](https://docs.google.com/document/d/1iS5vae_ua6yt-0JrynUmIGoWhvw8H2NbtR76cm2q0dk/edit) |
| Printable MAP                 | Laura             | See MAP test plan                                                                                                        | [Designs](https://cityblock.invisionapp.com/d/main/#/projects/prototypes/13504486)       | [PRD](https://docs.google.com/document/d/1l0kxaJTLjXUeSpiYU0R_uitpvQvomY7spbDdpG76XvU/edit) |
| Worry Score                   | Laura             | See Progress Note Test Plan                                                                                              |                                                                                          | [PRD](https://docs.google.com/document/d/1HUsvUirz1-Md6VaHteKyE7q1ZGjDAn-fKs_OBsAkuqA/edit) |

NOTE: This is an auto-generated table from a subset of @rachel1392's spreadsheet. If you want to update this, first update Rachel's document, then DM Brennan or run [MarkdownTableMaker][]

### Installation

* Install [nvm][] and node 8.11
* Install [yarn][]
* Create a `.env` file in the project root (see: [.env][])
* Install [Zenhub][]
* [Setup your local database](#create-local-postgres-database)
* [Install Redis](#install-redis)
* Ask a Point Person to add you as a user in staging and change your user permissions to 'green' (user role does not affect permissions).
* [Copy staging database to your local database](#copying-staging-database-to-local-database)

### Create test postgres database

Setup your database. First install postgres 10 from brew or postgresapp.

    createdb commons_test
    psql -d commons_test -c "create extension if not exists btree_gist"
    psql -d commons_test -c "create extension pg_trgm"
    psql -c "alter database commons_test owner to root"

### Development

Ensure you have copied from staging to local and have your user created in staging by another employee via Manager. Ensure you have a redis server running:

    redis-server

Then run:

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

### Deploying to production

We use a ‘pipeline’ deployment process which means we have well defined steps and all steps must be accomplished in order to do a deployment.

The pipeline steps are:

1.  submit a pull request
1.  run the automated tests [automatic via circleci]
1.  merge the pull request
1.  release on test/qa/staging environment [automatic via circleci]
1.  create a release using github releases
1.  release on production [automatic via circleci]

### Performing code review

This is a handy checklist for when you are performing code review for others. Modified from [Fog
Creek code review][] docs. You should respond within ~2 business hours to requests for code review.

#### General

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

#### Security

* Are all data inputs checked and encoded? (GraphQl + Objection.js handle much of this for us)
* Are access controls for data correctly checked at the API level?
* Are invalid parameter values handled?

#### Documentation

* Do comments exist and describe the intent of the code if code is not easily understood?
* Is any unusual behavior or edge-case handling described?
* Is the use and function of third-party libraries documented?
* Are data structures and units of measurement explained?
* Is there any incomplete code? If so, should it be removed or flagged with a suitable marker like
  ‘TODO’?

#### Testing

* Is the code testable? i.e. don’t add too many or hide dependencies, unable to initialize objects,
  test frameworks can use methods etc.
* Do tests exist and are they comprehensive?
* Do unit tests actually test that the code is performing the intended functionality?
* Could any test code be replaced with the use of an existing API?

## Security Practices

* In development, we use [NSP][] to scan external dependencies of our Node app for vulnerabilities
  daily and check dependency changes for vulnerabilities We follow the Microsoft [Secure Development
  Lifecycle][] through security focused ts-lint rules.
* We prefer standard or popular libraries with institutional backing
* Commiting directly to master is disabled via Github 'Protected Branches'
* All commits to master must be made through a pull request that is approved by another engineer

## Builder in production

Tables represented in Builder are not editable in production. Builder is edited in staging and then deployed to production by copying the builder associated tables from staging to production. For more info, see the [builder stability in production][] document.

To copy builder data from staging to production, run `yarn copy-builder-staging-to-production`. If that does not work, or if there are new columns or tables, continue reading.

As we add models or modify tables that are represented in builder, we will need to recreate the foreign tables ([FDW][]) in production. If tables are modified, first run `yarn update-fdw-production` but if new tables were added or removed, add the tables to `setup-fdw-production.sql` and run `yarn update-fdw-production`.

After ensuring the foreign data wrapper is up to date, we then need to copy the builder tables from staging to production. If new columns or tables were added, add them to `aptible-copy-builder-staging-to-production.sql`. Then, once the migrations have run on production, run `yarn copy-builder-staging-to-production`.

## How-to

### Use GraphiQL

GraphiQL is accessible locally at [http://localhost:3000/graphiql](http://localhost:3000/graphiql). All endpoints
except login require you to be authenticated. In order to pass auth information we need to...

1.  create a user (NOTE: You may need to disable authentication checks locally in the `createUser`
    mutation resolver.) `mutation { createUser(input: {email: "your-name@cityblock.com"}) { user { id } } }`
1.  log in via your google account
1.  copy `authToken` from local storage
1.  pass auth information via [modheader][] for future requests
1.  add `auth_token` to the request header (note underscore!)

### Revert a PR merge into master

1.  As quickly as possible, cancel the build of master on CircleCI so that there is no deploy to
    staging or production if a production deploy was started.
1.  Click the 'Revert' button on GitHub that appears near the bottom of the page on the merged PR.
1.  GitHub will generate a revert PR on your behalf.
1.  Merge the generated PR.

### To automatically fix linter errors, run

    yarn lint --fix
    # for style changes
    yarn stylelint --fix

### To print config vars or env vars from aptible production or staging

Once you've added the aptible git remote, you can use Aptible toolbelt to interface with the app:

    aptible config --app=commons-staging # prints environment variables from staging
    aptible config --app=commons-production  # prints environment variables from production

### To connect to the Aptible database from your machine, run

    yarn prod-db

Or, alternatively, use `aptible db:tunnel commons-staging` or `aptible db:tunnel commons-production`. Note: If you get an auth error here, you may need to login to Aptible again. Login tokens last 12 hours.

### To push your local version of the server to Aptible, run

    git push aptible HEAD:master

Be careful, though! Your changes will go live immediately, then be overridden by the next push to
master.

### Update custom tslint rules (such as checkIsAllowedRule)

Our custom rule to check if `accessControls.isAllowed` is run in graphql resolvers. To recompile this rule after changes. First, ensure you have typescript installed globally (`yarn global install typescript`). Then run:

    cd rules
    tsc checkIsAllowedRule.ts

### Update react jest snapshots

    yarn test -u

### Create a new migration

Create a migration (using [knex][]) with:

    yarn knex migrate:make migration-name-here --knexfile=server/models/knexfile.js

Run a migration with:

    yarn migrate

### PostgreSQL

#### Log Settings

We've modified the default PostgreSQL logging behavior to give us more visibility into the database.
A good description of what all of these different settings can be found in the [PostgreSQL
Documentation][]. All of these settings are modified by running the following statements against the
database:

1.  `ALTER SYSTEM SET desired_setting = value;`
1.  `SELECT pg_reload_conf();`

The settings are as follows:

1.  `log_statement = 'all'`
1.  `log_connections = true`
1.  `log_disconnections = true`
1.  `log_duration = true`
1.  `log_min_duration_statement = -1`
1.  `log_min_messages = 'DEBUG2'`

#### Spotlight Optimization

Running the test suite causes a lot of database churning. This can cause low performance when
Spotlight is attempting to index every change to your database files. To prevent this, [add][] your
Postgres data directory (with a Homebrew install, typically `/usr/local/var/postgres`) to
Spotlight's privacy list.

### Running in Production Mode Locally Using Docker

We are able to run the application locally using Docker and Docker Compose. For now, this means
running the web application with a postgres database. To get started, download and
install [Docker][]. After you have Docker installed and running, follow these steps:

1.  Start the application and database by running `yarn run docker-prod:start`. The first time you do
    this, you will have to wait a little while.
1.  In a separate terminal window, run: `yarn run docker-prod:migrate`.
1.  To set up an initial user, run: `yarn run docker-prod:ts-node` and follow the usual steps.
    1.  Alternatively, connect to the database using Postico (user is 'postgres', port is '5431', and database is 'db').
1.  Visit `localhost:3000` in your browser.
1.  If you make changes to the application and wish to see them, the application container will need
    to be rebuilt and restarted. To do this, in another terminal window, run `yarn run docker-prod:restart`.
1.  To stop the application, run: `yarn run docker-prod:stop`.

### Copying staging database to local database

Note: this will eventually become untenable but for now it is convenient.

First, login with `aptible login`, then:

    aptible db:dump commons-staging
    dropdb commons
    createdb commons
    psql -d commons -c "CREATE ROLE aptible LOGIN"
    psql commons < commons-staging.dump
    rm commons-staging.dump

### Create a database schema explorer

To get started with [Schemaspy][] which creates an interactive website to explore the schema, first, download and install [Docker][]. After you have Docker installed and running, follow these steps:

    cd some-new-directoy
    docker run -v "$PWD:/output" schemaspy/schemaspy:snapshot -t pgsql -db commons -u insertYourDbUsernameHere -host docker.for.mac.localhost -hq
    open some-new-directoy/index.html

To get started with [Schemacrawler][], which creates a somewhat nicer image of the schema but is not interactive, first, setup docker and then follow these steps:

    docker run -v $(pwd):/share --rm -i -t --entrypoint=/bin/bash sualeh/schemacrawler ./schemacrawler.sh -server=pgsql -user= insertYourDbUsernameHere -database=commons -host=docker.for.mac.localhost -infolevel=maximum -routines= -command=schema -outputfile=/share/sc_db.png
    exit
    open sc_db.png

### Test PubSub locally

To get started, install the [Google Cloud SDK][] along with the [JDK][] (verision 7 or 8).

Next, install the Google PubSub Emulator by running the following commands:

    gcloud components install pubsub-emulator
    gcloud components update

The following instructions assume you have a recent version of Ruby installed:

First, ensure that you have the google-cloud gem installed:

    gem install google-cloud

Then, run:

    gcloud beta emulators pubsub start

In a fresh Terminal tab, run:

    $(gcloud beta emulators pubsub env-init)

In the same tab, open an IRB session, and execute the following commands, substituting data where required:

    require 'google/cloud/pubsub'
    pubsub = Google::Cloud::Pubsub.new(project_id: 'whatever_you_want')
    topic = pubsub.create_topic('this_does_not_matter')
    subscription = topic.create_subscription('this_also_does_not_matter')
    subscription.endpoint = 'http://localhost:3000/pubsub/push'
    data = '{"patientId":"VALID_PATIENT_ID_HERE","slug":"VALID_COMPUTED_FIELD_SLUG_HERE","value":"VALID_ANSWER_VALUE_HERE","jobId":"this_does_not_matter"}'
    hmac = OpenSSL::HMAC.hexdigest('SHA256', 'supertopsecret', data)
    topic.publish(data, hmac: hmac)

### Import ICD-10 Codes

On development, run:

    yarn import:icd:dev

On production, run:

    yarn import:icd:production

For exact script usage instructions, read the comments at the top of 'scripts/import-icd-ten-codes.ts'

### Install Redis

We use [Kue][] as our system for delayed jobs. As a backend, this relies on the open source in-memory store, [Redis][]. In order to run Commons, you will need to install Redis locally. The easiest way to do this is using [Homebrew][]. To install, run the following command:

    brew install redis

Alternatively, you can install following the instructions on the [Redis download page][].

### View status of background jobs

[Kue][] comes with a barebones UI that can be used to see the status of all jobs. To see it visit localhost:3000/kue (substitute correct host depending on environment). It lives behind basic auth, and the username and password can be found either in code or in env variables.

[nvm]: https://github.com/creationix/nvm
[zenhub]: https://www.zenhub.com/
[add]: http://osxdaily.com/2011/12/30/exclude-drives-or-folders-from-spotlight-index-mac-os-x/
[aptible]: https://aptible.com
[aptible toolbelt]: https://www.aptible.com/support/toolbelt/
[staging]: https://commons-staging.cityblock.com
[yarn]: https://yarnpkg.com/lang/en/docs/install/
[.env]: https://drive.google.com/open?id=1wWe8wGskk-X4AzblpmSLYGBsfWxb3EVC
[prd]: https://docs.google.com/document/d/1yfcbwghOUcJ2PlK_J5JxBIUcXaYuArZuR6VN8-NcZ6g/edit?usp=sharing
[modheader]: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj
[apollo tools]: https://github.com/apollographql/graphql-tools
[objection.js]: https://github.com/Vincit/objection.js
[knex]: http://knexjs.org/
[postgresql documentation]: https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html
[docker]: https://docs.docker.com/engine/installation/
[tech design doc]: https://docs.google.com/document/d/1KlSX20FgUv1BllA6n8jJdg6beQ55ikrpaOOE8RnfQkE
[fog creek code review]: https://blog.fogcreek.com/increase-defect-detection-with-our-code-review-checklist-example/
[revert functionality]: https://help.github.com/desktop/guides/contributing/reverting-a-commit/
[appcanary]: https://appcanary.com/monitors/2283
[nsp]: https://nodesecurity.io
[secure development lifecycle]: https://github.com/Microsoft/tslint-microsoft-contrib/wiki/TSLint-and-the-Microsoft-Security-Development-Lifecycle
[schemaspy]: https://github.com/schemaspy/schemaspy
[schemacrawler]: https://github.com/sualeh/SchemaCrawler
[google cloud sdk]: https://cloud.google.com/sdk/downloads
[jdk]: http://www.oracle.com/technetwork/java/javase/downloads/index.html
[kue]: https://github.com/Automattic/kue
[redis]: https://redis.io/
[redis download page]: https://redis.io/download
[fdw]: https://www.postgresql.org/docs/10/static/sql-createforeigndatawrapper.html
[builder stability in production]: https://docs.google.com/document/d/1BYb66YeQlRTFkdXBtPowrVvR-wyhoaNUM9Hog-7MzkI/edit#heading=h.8jov09o8e1fb
[mardowntablemaker]: https://chrome.google.com/webstore/detail/markdowntablemaker/cofkbgfmijanlcdooemafafokhhaeold?hl=en
