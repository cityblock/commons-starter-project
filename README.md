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

  `db pokedex; createdb pokedex; psql -d pokedex -c "CREATE ROLE aptible LOGIN"`

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

Make a replica of master in origin by running `git push origin master:<name>-pokedex`; From now on, you'll use this branch to submit your work and merge after pull requests are approved (so that your reviewers can be looking at incremental work).

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

First, write out the model for accessing your pokemon table in `pokemon.ts`. For reference, here is our [patient model](https://github.com/cityblock/commons/blob/master/server/models/patient.ts) from Commons. For the JSON schema, ensure Objection reads your Postgres JSON data types as arrays of strings.

You can also see all models in Commons [here](https://github.com/cityblock/commons/tree/master/server/models).

The methods your model should include are:

- getAll(txn: [Transaction](https://stackoverflow.com/questions/974596/what-is-a-database-transaction)) ­ returns all Pokemon, ordered by pokemonNumber ascending
- get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated
  items
- create(input: IPokemonCreateInput, txn: Transaction) ­ creates and returns a Pokemon
- edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) ­ edits an existing Pokemon
- delete(pokemonId: string, txn: Transaction) ­ marks a Pokemon as deleted, but does not actually delete it from the database

_Note: All model methods need to take a transaction (as you see above)._ In order to be able to eager load the items (the the pokemon get() method) you will need to generate the skeleton of the items file in tandem.

After that is all set, write the model for items in `Item.ts`:

- get(itemId: string, txn: Transaction) ­ returns a single item
- create(input: IItemCreateInput, txn: Transaction) ­ creates and returns an item
- edit(itemId: string, pokemon: IItemEditInput, txn: Transaction) ­ edits an existing item
- delete(itemId: string, txn: Transaction) ­ marks an item as deleted, but does not actually delete it from the database

Again, be sure to include at least one test per method. Finally, make another pull request! For your Model data model to be properly typed, you will want to define and import the item interface.

Take note here that graphQL best practice is to make all objects needed in the front end available through singular queries. For the sake of this exercise, we are implementing this only in Pokemon.get() for practice.

After you have written your data models, create a test file called `pokemon.spec.ts` and `item.spec.ts` inside a `__tests__` folder, inside the `models` folder. This will contain your tests be sure to write at least one test per method. Here are [the tests for the patient model](https://github.com/cityblock/commons/blob/master/server/models/__tests__/patient.spec.ts). You can also check out [other model tests here](https://github.com/cityblock/commons/tree/master/server/models/__tests__).

In order for you to run your tests, you'll want to run the migrations against your pokedex_test database and load it up with the seed file.

    NODE_ENV=test npm run migrate

Make sure on Postico that you can see the tables in your test database

    NODE_ENV=test npm run seed

Check that your test database has mock data.

Run all of your tests using:

    npm run test

Once these pass, make another pull request for us to review!

## The Controller Layer (+ tests!)

The next step is to build out our “controller” layer by adding GraphQL endpoints for the basic CRUD model methods that you wrote previously.

### STEP 1: Graphql schemas

Graphql schemas set allowable queries and mutations on Pokemon and Item objects, and specify which fields to use for each database transaction. Here is [our schema from Commons](https://github.com/cityblock/commons/blob/master/server/graphql/schema.graphql). Your job is to define the schemas for Pokemon and Items for every CRUD transaction. It’s recommended to write schemas, queries and tests for one transaction at a time, i.e., Create first, then Read, etc., to catch any errors and best learn the workflow.

After you have defined a schema, run `npm run update-schema`, which automagically generates a typescript file for your schema. Check out the result in `declarations/schema.d.ts`!

### STEP 2: Graphql Queries

Write a [graphQL query](https://graphql.org/learn/queries/) that we eventually will use on the client-side to fetch Pokemon. In app/graphql, create a file get-all-pokemon.graphql that specifies allowable fields for Pokemon objects.

Here is [an example](https://github.com/cityblock/commons/blob/master/app/graphql/queries/get-concerns.graphql) from Commons. In the Commons example, notice the use of the [Graphql fragment](https://graphql.org/learn/queries/#fragments) to specify which fields from the underlying schema to expose. Even though the Pokemon queries are not a great use case, it’s good practice to get in the habit of using a fragments for your queries. [Here](https://github.com/cityblock/commons/tree/master/app/graphql) is the folder of queries and fragments in Commons to get a better sense of how they’re used.

After you have defined a query, run `npm run codegen` to generate corresponding typescript types for your query, to be used by the client-side application. Check out the file `app/graphql/types.ts` to see the generated result!

FinePrint: `npm run typegen` will run both `npm run update-schema` and `npm run codegen` if you find yourself wanting to update both schema types and query types at the same time (our team does this quite a lot). If there is a schema or query diff between your Git staging area or working directory and your HEAD commit, the type generating scripts above will exit by design. If you have to update a schema, query, or both, run `npm run typegen` to generate `types.ts` and `documents.json`. The script will exit, but once you commit and run `npm run typegen` again, it will not exit.

### STEP 3: Resolvers

Create a file called `pokemon-resolver.ts` in the `server/graphql` folder. In it, write the resolver resolvePokemon that will call your model method to get all Pokemon. Use [this resolver](https://github.com/cityblock/commons/blob/master/server/graphql/phone-resolver.ts) from Commons as a guide. You can find even more examples from Commons [here](https://github.com/cityblock/commons/tree/master/server/graphql).

Fineprint: you can return your Pokemon methods for CRUD transactions directly in your resolvers. It’s not necessary to pass them to transaction as a callback.

Then, add your resolver to the `make-executable-schema` file. This file maps requests sent from the client (queries and mutations) to the appropriate resolver function on the server. Pay special attention to `resolveFunctions` where we map all queries in our API to resolvers under the `RootQueryType` key and all mutations under `RootMutationType`. For more color, check out the [same file](https://github.com/cityblock/commons/blob/master/server/graphql/make-executable-schema.ts) in Commons.

Finally, we must end with tests. `In the server/graphql/__tests__` folder, create a `pokemon-resolver.spec.ts` file that will contain our tests. We will be ensuring that our written query and resolver works as intended. Here is [an example](https://github.com/cityblock/commons/blob/master/server/graphql/__tests__/concern-resolver.spec.ts) from Commons. You can find even more example test files [here](https://github.com/cityblock/commons/tree/master/server/graphql/__tests__).

After you have that working, make a PR so we can see how it’s going!

Next, write the rest of resolvers for Pokemon, and make another PR. Make sure you cover the basic CRUD operations that you wrote model methods for previously. Finally, do the same for items! Note that you can break up PRs even further if you find it helpful.

## Building out the Frontend

### STEP 1: Start the server

Run `npm run dev` and then go to `localhost:3000` to see a basic app render!

NOTE: you may have to `run npm install` again if packages are not up to date.

NOTE: The purpose of this is to stretch in new areas like using TypeScript with React and [GraphQL/Apollo](https://www.apollographql.com/docs/react/api/react-apollo/#graphql). Do not stress or spend too much time on “bells and whistles” like pixel perfect CSS, loading spinners, etc. Also make sure to make a Pull Request after each chunk of work (left rail, Pokemon detail, create Pokemon form).

### STEP 2: Build Routes

Routes will be stored [here](https://github.com/cityblock/commons-starter-project/blob/master/app/routes.tsx) in `routes.tsx`, and for our MVP we only need two:

1. `/` – home page that will eventually contain the create Pokemon form
2. `/pokemon/:pokemonId` – for viewing the detail of a specific pokemon. The left rail listing all Pokemon will be present on all pages.

We will start with building out the left rail component that lists all `Pokemon`.

We will want to wrap our `<Switch>` component in routes with a component that will be present on all pages - see the [<Main> container](https://github.com/cityblock/commons/blob/master/app/main-container/main-container.tsx) and how it wraps all routes in the [Commons routes file](https://github.com/cityblock/commons/blob/master/app/routes.tsx). Here, we will want to run our GraphQL query to get all Pokemon and render the results. [Here](https://github.com/cityblock/commons/blob/fc32cc1c7e3e7d61c387c83eaae97588a1da5534/app/settings-container/settings-container.tsx) is an example of running a query.

Next, inside your `<Main>` component, create a new route for `/pokemon/:pokemonId` that will render a new component you create (something along the lines of PokemonDetail). This route should be hit when clicking on your Pokemon on the sidebar (using React Router's `Link` may be helpful). This should run a query, but in this case it will be to get a specific Pokemon. [Here](https://github.com/cityblock/commons/blob/master/app/patient-profile-container/patient-profile-container.tsx) is an example of passing a variable to a query in Commons.

Finally, beef up the `/` route by adding a create Pokemon form. You will need to ensure that your mutation is passed as a prop to the React component. [Here](https://github.com/cityblock/commons/blob/master/app/builder-container/concern-create.tsx) is an example from Commons (focus on the GraphQL part).

## Testing the front end

We’re on the homestretch of Pokedex now! Let’s finish off the project by adding in testing for each of our front end components.

We use [Enzyme](https://airbnb.io/enzyme/docs/api/shallow.html) as a supplement to the Jest testing framework for testing our frontend React components. Specifically, we use their shallow rendering API linked just above. As a default, do not use snapshot testing.

As an overview, we look at testing React components to make sure of 2 things: (1) that what DOM elements we expect to render on the page has rendered and (2) that what has rendered has also received the correct props and holds the correct state. (To clarify this means you are NOT testing queries and mutations, that has already been done in the resolver). Thus, we test the unwrapped component (not the higher order component that composes a graphQL query). In other words, pass in the props manually and don't try to compose the component with graphQL.

For an example of how we handle those things, check out a more complex example in the Commons spec for [risk-area-assessment.tsx](https://github.com/cityblock/commons/blob/master/app/patient-profile-container/risk-area/__tests__/risk-area-assessment.spec.tsx).

Note a couple key tests to poke around with a bit more:

- # We use `shallow` wrappers for rendering components (to mock components for testing). We do this to keep tests insular -- taking care to not test anything outside the scope of this one front end component. You'll see for example that we pass in fake functions where needed by calling `jest.fn()`. That's just to test that a functional prop exists and is called when expected, but we don’t care about it returning the appropriate thing. (If we want to test that a callback changes props or state, see `.setState()` and `.setProps` below)
- Our use of `shallow` wrappers for rendering components, which we do all the time to mock components for testing. We do this to keep tests insular -- taking care to not test anything outside the scope of this one front end component. You'll see for example that we pass in fake functions where needed by calling `jest.fn()`. That's just to test that a functional prop exists and is called when expected, but we don’t care about it returning the appropriate thing. (If we want to test that a callback changes props or state, see #4 and #5 below)
  > > > > > > > 8dfee84e006e7f8581a62ccac5f31ec348e8a11a
- `.find(component)` for locating a native component or a custom component (don't forget to import it if using a custom component!)
- `.at(number)` used with `.find()` if there are multiple of that component
- `.props()` for testing any expected props, and `.state()` for expected state
- `.setState()` and `.setProps` respectively for testing how components will change with new state and props

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
