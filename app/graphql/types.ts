/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonCreate
// ====================================================

export interface pokemonCreate_pokemonCreate {
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
}

export interface pokemonCreate {
  pokemonCreate: pokemonCreate_pokemonCreate | null;
}

export interface pokemonCreateVariables {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllPokemon
// ====================================================

export interface getAllPokemon_pokemonAll {
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
}

export interface getAllPokemon {
  pokemonAll: getAllPokemon_pokemonAll[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: fullPokemon
// ====================================================

export interface fullPokemon {
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
}

/* tslint:disable */
/* eslint-disable */
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
