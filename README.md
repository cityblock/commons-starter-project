# Commons starter project: Pokedex

Welcome to Cityblock! Our goal these first few weeks is to get you acquainted with the tools we use to build our products. In this project, we will be creating our own version of App Academy’s [Pokedex](http://aa-pokedex.herokuapp.com/), using Cityblock’s tech stack! This guide will provide a rough outline for what needs to be done at each step as we work from building the features from the backend to the frontend. The instructions given are very broad as we want you to get used to reading documentation and looking at Commons code for examples of how to do things. However, keep in mind that if you are stuck, ask questions! We are here to help you learn :)

### Installation & Setup

- install x-code (from apple app store) and run it to install additional components
- Create a bash profile in your home directory if you don't already have one (`touch ~/.bash_profile`)
- Install [nvm](https://github.com/nvm-sh/nvm) and node 10.16
  - follow instructions in the link above, the first command posted is mandatory
  - either restart your terminal, or follow the brew postintall commans (put `export NVM_DIR="$HOME/.nvm; . /usr/local/opt/nvm/nvm.sh` in your shell's startup file)
  - `nvm install 10.16`
  - to be sure, check that this is still the node version on the package.json file within this repo (this will avoid you later headaches)
- install [brew](https://brew.sh/)
  - this should install x-code command line tools, and if not run the following: - Install xcode-select (`xcode-select --install`)
  - there are some issues with this set-up currently, so if you run across any issues, please improve docs
- Install core utils (with Homebrew, `brew install coreutils` )
- Install Postgres via [Postgres.app](https://postgresapp.com/) and [Postgres CLI](https://postgresapp.com/documentation/cli-tools.html)
  - make sure you open the Postgres app and click `Initialize` to start the server
- Install [Postico](https://eggerapps.at/postico/) for a clean UI to look at Postgres data

### Repository Setup

- Clone this repo locally
  - if you hit permissioning issues, try generating an SSH key and adding it to your git profile (`ssh-keygen -t rsa`)
  - Run `npm install` to set up all the dependency modules
- Create a local database

  `dropdb pokedex; createdb pokedex; psql -d pokedex -c "CREATE ROLE aptible LOGIN"`

- Create a local test database

  `createdb pokedex_test; psql -d pokedex_test -c "CREATE ROLE root LOGIN"; psql pokedex_test -c "create extension btree_gist; create extension pg_trgm; alter database pokedex_test owner to root"`

- Install [VS Code](https://code.visualstudio.com/docs/setup/mac) as our preferred text editor

_At this point, you have completed most of the setup for the project. As you make changes to this repository locally, please keep in mind the following kind-Collaborator engineering etiquette:_

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

For reverting code in master, use Github's [revert functionality](https://www.atlassian.com/git/tutorials/resetting-checking-out-and-reverting).

# Project Instructions

## Branch from Master

From master, checkout a development branch that will serve as your personal base branch for pull requests.
For naming, use <your name>-development. For example:
`git checkout -b alda-development`

## Migrations

Let's write some migrations you can generate tables in your local database. Keep in mind that Commons table names are in the singular form. For pokemon, the singular and plural form is the same: pokemon.

Create a migration file template (using [knex](http://perkframework.com/v1/guides/database-migrations-knex.html)) with the following command:

    npx knex migrate:make migration-name-here --knexfile=server/models/knexfile.ts

After you run the command, you should see a file with that name (you can search for it with `cmd + p` in Visual Studio Code). Enter that file, and write a migration for the Pokemon table with the following characteristics. Here is a [fleshed out commons migration](https://github.com/cityblock/commons/blob/master/server/models/migrations/20180417100700_create-phone-call.js) from Commons. Let's call this table `pokemon`.

- id (primary key, unique, [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier), not null) ­ note we use uuid rather than integer ids
- pokemonNumber (integer, not null, unique)
- name (string, not null, unique)
- attack (integer, not null)
- defense (integer, not null)
- pokeType ([enum](https://knexjs.org/#Schema-enum), not null, one of: normal, grass, fire, water, electric, psychic, ghost, dark, fairy, rock, ground, steel, flying, fighting, bug, ice, dragon, poison)
- moves ([json](https://knexjs.org/#Schema-json), not null, default [])
- imageUrl (string, not null)
- createdAt (timestamp, default to the current time)
- updatedAt (timestamp, default to the current time)
- deletedAt (timestamp, nullable) ­ note we mark things as deleted, but rarely ever actually delete them in our database (“soft deletion”)

Run your migration with:

    npm run migrate

Open up Postico and see if you can connect to your local database. You should see a table called “pokemon” now! See if you can click on it and visualize the structure (the content should be blank as it has no data yet).

Now repeat the process for the item table. The examples above are still relevant. Let's call this table `item`. The schema is:

- id (primary key, uuid, not null, unique)
- name (string, not null)
- pokemonId (foreign key, uuid, not null) ­ points to which Pokemon the item belongs to. You can find an example of [this in this Commons migration folder](https://github.com/cityblock/commons/blob/master/server/models/migrations/20180417100700_create-phone-call.js).
- price (integer, not null)
- happiness (integer, not null)
- imageUrl (string, not null)
- createdAt (timestamp, default to the current time)
- updatedAt (timestamp, default to the current time)
- deletedAt (timestamp, nullable)

Again, run the migration, and refresh Postico to see your changes. Make sure you see the items table!

After you feel good about your migrations, run the command `npm run seed` to populate your database with pokemons and items.

Once again, refresh Postico. At this point, your tables should be populated with Pokemon and their items!

Finally, make a pull request for us to review!

## Data models & Tests

You are now ready to start writing data models. We use [Objection.js](https://vincit.github.io/objection.js/) as our ORM, which is actually built on top of Knex.js.

First, write out the model for accessing your pokemon table in `pokemon.ts`. For reference, here is our [patient model](https://github.com/cityblock/commons/blob/master/server/models/patient.ts) from Commons.

You can also see all models in Commons [here](https://github.com/cityblock/commons/tree/master/server/models).

The methods your model should include are:

- getAll(txn: [Transaction](https://stackoverflow.com/questions/974596/what-is-a-database-transaction)) ­ returns all Pokemon, ordered by pokemonNumber ascending
- get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated
  items
- create(input: IPokemonCreateInput, txn: Transaction) ­ creates and returns a Pokemon
- edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) ­ edits an existing Pokemon
- delete(pokemonId: string, txn: Transaction) ­ marks a Pokemon as deleted, but does not actually delete it from the database

_Note: All model methods need to take a transaction (as you see above)._

After you have written the model for Pokemon, create a test file called `pokemon.spec.ts` inside a `__tests__` folder inside the `models` folder. This will contain your tests be sure to write at least one test per method. Here is [a skeleton](https://github.com/cityblock/commons-starter-project/blob/test-feature/server/models/__tests__/puppy.spec.ts) of a test file, as well as [the tests for the patient model](https://github.com/cityblock/commons/blob/master/server/models/__tests__/patient.spec.ts). You can also check out [other model tests here](https://github.com/cityblock/commons/tree/master/server/models/__tests__).

At this point, make another pull request for us to review!

After that is all set, write the model for items in `Item.ts`, including the same model methods as for Pokemon. Again, be sure to include at least one test per method. Finally, make another pull request!

## CONTINUE WORK HERE

### Issues, tissues and debugging tips:

- how to test that my models are written right?
- how to start up the application? `npx dev`

## Debugging Tips

If you run into database related issues while running your tests, consider these items:

- Make sure Postgres is running and contains the test database
- Knexfile.js contains configuration details for your test database in the test property.
  Make sure that the Postgres user specified there does in fact exist.
- If Objection/Knex/Postgres complains about duplicate fields, make sure that you did not save data to your pokedex_test database during the test that was not cleared after the tests completed.

## The How-To Library:

### To spin up your app locally

    npx dev

    or

    npm run dev

### Testing locally

Our test database uses postgres. Before running tests, ensure that postgres is running and use:

    npx test

### To automatically fix linter errors, run

    npx lint --fix
    # for style changes
    npx stylelint --fix

### Update jest snapshots

    npx test -u

## Documentation Library

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
