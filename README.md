# Commons starter project: Pokedex

## Onboarding

### Setup

- Install [nvm][] and node 10.15
  - make sure you follow the brew postintall commans (put `export NVM_DIR="$HOME/.nvm; . /usr/local/opt/nvm/nvm.sh`in your shell's startup file)
- Install core utils (with Homebrew, `brew install coreutils` )
- Install xcode-select (`xcode-select --install`)
- Install Postgres via [Postgres.app](https://postgresapp.com/) and [Postgres CLI](https://postgresapp.com/documentation/cli-tools.html)
  - make sure you open the Postgres app and click `Initialize` to start the server
- Install [Postico](https://eggerapps.at/postico/) for a clean UI to look at Postgres data
- [Create a local database](#create-a-local-database)
- [Create a database for running tests](#create-a-test-postgres-database)
- Install [VS Code](https://code.visualstudio.com/docs/setup/mac) as our preferred text editor
- Clone this repo locally
- `npm install && npm ci`
- `createdb pokedex && createdb pokedex_test`

### Development

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

    createdb pokedex_test
    psql pokedex_test -c "create extension btree_gist; create extension pg_trgm; alter database pokedex_test owner to root"

### Create a local database

    dropdb pokedex
    createdb pokedex
    psql -d pokedex -c "CREATE ROLE aptible LOGIN"

### To automatically fix linter errors, run

    npx lint --fix
    # for style changes
    npx stylelint --fix

### Update jest snapshots

    npx test -u

### Create a new migration

Create a migration (using [knex][]) with:

    npx knex migrate:make migration-name-here --knexfile=server/models/knexfile.js

Run a migration with:

    npx migrate

[npm]: https://docs.npmjs.com/cli/npm
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
