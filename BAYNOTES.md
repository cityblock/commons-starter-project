# Questions

Why is every class method for our ORM models implemented as a transaction? Makes sense I guess for "getAll", but seems expensive and unnecessary for simple lookups and edits?
--> rails (active record) does this for you, and transactions are on threads so easy
--> in node/objection you have to manually specify your transaction and then pass the reference around
--> commons has tons of transactions because so many requests have nested lookups/edits

Do you really have to manually implement hooks for "created_at" "updated_at" and UID in model?
That's not handled by ORM natively? I implemented a base class to handle.
--> this is another thing that would be handled by active record

I wanted to write a single definition of PokeType enum and then reference it globally.
I saw Aster handled this by implementing Enum once in graphql schema file, then generating TS schema file, then including and refering object from that file. Is that a good practice? What is that central schema file?
(created via: npm run update-schema )
--> Yes good best practice

In the graphql schema file, why use "implements" with very basic and even fully repetitive small interfaces like ID?
And what's the point of an implements if you have to repeat the attrbutes anyways? There's no DRY savings..
https://github.com/graphql/graphql-spec/issues/500
--> ask jose

Apollo seems to be everwhere, what do we use them for? Whats the company?
--> We use apollo server, hosts a little graphql server thats like a module within our broader Express server.
--> the make_executable_schema is what generates that server for us.
--> sort of comparable to redux
--> we also use apollo studio which is a great metrics env for graphql. passes to data dog

In queries file, is there someway to just pass through arg{} reference? Declaring all the local vars and then calling method with them feels very annoying.

In schema graphql file, I wanted to put () after queryAllPokemon, but it has no arguments, and fails.
Can you not use empty parenthesis on references for methods w/o arguments?

## How this maps together

# Schema:

- Defines the shapes for the graphql API layer
- Also acts as a header file for the queries and mutator method calls in app/

# Queries and Mutators

- Query and mutator methods live in /app directory
- Each query method's name is referenced in "make-executable" file, and acts as a sort of route
- Each query method implements the method call that matches header in schema

# Make Executable file

- The query and mutator method names are mapped to resolver methods

# Resolvers

- sit on server, and act as controller layer, calling ORM logic

# ORM

- defined through the model code
