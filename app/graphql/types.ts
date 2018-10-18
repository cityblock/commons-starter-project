

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonCreate
// ====================================================

export interface pokemonCreate_pokemonCreate_items {
  id: string;
  name: string;
  imageUrl: string;
}

export interface pokemonCreate_pokemonCreate {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: (string | null)[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  items: pokemonCreate_pokemonCreate_items[] | null;
}

export interface pokemonCreate {
  pokemonCreate: pokemonCreate_pokemonCreate;
}

export interface pokemonCreateVariables {
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonDelete
// ====================================================

export interface pokemonDelete_pokemonDelete_items {
  id: string;
  name: string;
  imageUrl: string;
}

export interface pokemonDelete_pokemonDelete {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: (string | null)[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  items: pokemonDelete_pokemonDelete_items[] | null;
}

export interface pokemonDelete {
  pokemonDelete: pokemonDelete_pokemonDelete;
}

export interface pokemonDeleteVariables {
  pokemonId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllPokemon
// ====================================================

export interface getAllPokemon_pokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  imageUrl: string;
}

export interface getAllPokemon {
  pokemon: (getAllPokemon_pokemon | null)[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSinglePokemon
// ====================================================

export interface getSinglePokemon_fullPokemon_items {
  id: string;
  name: string;
  imageUrl: string;
}

export interface getSinglePokemon_fullPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: (string | null)[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  items: getSinglePokemon_fullPokemon_items[] | null;
}

export interface getSinglePokemon {
  fullPokemon: getSinglePokemon_fullPokemon;
}

export interface getSinglePokemonVariables {
  pokemonId: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum PokeType {
  bug = "bug",
  dark = "dark",
  dragon = "dragon",
  electric = "electric",
  fairy = "fairy",
  fighting = "fighting",
  fire = "fire",
  flying = "flying",
  ghost = "ghost",
  grass = "grass",
  ground = "ground",
  ice = "ice",
  normal = "normal",
  poison = "poison",
  psychic = "psychic",
  rock = "rock",
  steel = "steel",
  water = "water",
}

//==============================================================
// END Enums and Input Objects
//==============================================================