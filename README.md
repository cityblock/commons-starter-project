# Commons starter project

## Onboarding

### Setup

- Install [nvm][] and node 8.12
  - make sure you follow the brew postintall commans (put `export NVM_DIR="$HOME/.nvm; . /usr/local/opt/nvm/nvm.sh`in your shell's startup file)
- Install [npm][] 6.4 (`rm -rf node_modules/ && npm i -g npm@6.4.1 && npm i -g npm && npm ci`)
- Install `husky` (`npm install husky --save-dev`)
- Install core utils (with Homebrew, `brew install coreutils` )
- Install xcode-select (`xcode-select --install`)
- Install Postgres via [Postgres.app](https://postgresapp.com/) and [Postgres CLI](https://postgresapp.com/documentation/cli-tools.html)
  - make sure you open the Postgres app and click `Initialize` to start the server
- Install [Postico](https://eggerapps.at/postico/) for a clean UI to look at Postgres data
- [Create a local database](#create-a-local-database)
- [Create a database for running tests](#create-a-test-postgres-database)
- Install [VS Code](https://code.visualstudio.com/docs/setup/mac) as our preferred text editor
- Clone this repo locally

### Development

Ensure you have copied from staging to local and have your user created in staging by another employee via Manager.

Then run:

    npx dev

### Testing locally

Our test database uses postgres. Before running tests, ensure that postgres is running and use:

    npx test

### Making changes

Important: Never commit directly to the master branch. Commit to branches and ensure changes are small and incremental.

To make a change:

- clone the repo locally
- branch from master
- make your changes
- write and run tests for your code
- push your branch to the remote
- submit a pull request
- assign another engineer on the team as a reviewer

Before you can merge your code into master, the engineer you assigned must approve your code via the
GitHub approval UI. As the code's author, it is your responsibility to merge your code to master
(using 'merge and squash' in Github) and then to ensure your code is deployed without error.

For reverting code in master, use Github's [revert functionality][].

## How-to

### Create a test postgres database

Setup your database. First install postgres 10 from brew or postgresapp.

    createdb commons_test
    psql commons_test -c "create extension btree_gist; create extension pg_trgm; alter database commons_test owner to root"


### Create a local database

    dropdb commons
    createdb commons
    psql -d commons -c "CREATE ROLE aptible LOGIN"


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

    npx lint --fix
    # for style changes
    npx stylelint --fix

### Update react jest snapshots

    npx test -u

### Create a new migration

Create a migration (using [knex][]) with:

    npx knex migrate:make migration-name-here --knexfile=server/models/knexfile.js

Run a migration with:

    npx migrate

### PostgreSQL


[nvm]: https://github.com/creationix/nvm
[zenhub]: https://www.zenhub.com/
[add]: http://osxdaily.com/2011/12/30/exclude-drives-or-folders-from-spotlight-index-mac-os-x/
[aptible]: https://aptible.com
[aptible toolbelt]: https://www.aptible.com/support/toolbelt/
[staging]: https://commons-staging.cityblock.com
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
[markdowntablemaker]: https://chrome.google.com/webstore/detail/markdowntablemaker/cofkbgfmijanlcdooemafafokhhaeold?hl=en
[pghero]: https://github.com/ankane/pghero
[#debt]: https://github.com/cityblock/commons/labels/debt
[type generation]: https://docs.google.com/document/d/1LZPlWvR3O8bpP86bQRHnuYWxKlWG9ADfIPsuh3RyjIA/edit#heading=h.9jhyau11lgxt
