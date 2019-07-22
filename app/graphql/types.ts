/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonCreate
// ====================================================

export interface pokemonCreate_createPokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
}

export interface pokemonCreate {
  createPokemon: pokemonCreate_createPokemon | null;
}

export interface pokemonCreateVariables {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  moves: string[];
  pokeType: PokeType;
  imageUrl: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllPokemon
// ====================================================

export interface getAllPokemon_allPokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
}

export interface getAllPokemon {
  allPokemon: getAllPokemon_allPokemon[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOnePokemon
// ====================================================

export interface getOnePokemon_singlePokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
}

export interface getOnePokemon {
  singlePokemon: getOnePokemon_singlePokemon;
}

export interface getOnePokemonVariables {
  pokemonId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CoreItem
// ====================================================

export interface CoreItem {
  id: string;
  name: string;
  happiness: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPokemon
// ====================================================

export interface FullPokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
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
