/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getItem
// ====================================================

export interface getItem_item {
  id: string;
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface getItem {
  item: getItem_item | null;
}

export interface getItemVariables {
  itemId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPokemon
// ====================================================

export interface getPokemon_pokemon_item {
  id: string;
  name: string;
}

export interface getPokemon_pokemon {
  id: string;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
  item: getPokemon_pokemon_item[];
}

export interface getPokemon {
  pokemon: getPokemon_pokemon | null;
}

export interface getPokemonVariables {
  pokemonId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPokemons
// ====================================================

export interface getPokemons_pokemons {
  id: string;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
}

export interface getPokemons {
  pokemons: getPokemons_pokemons[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BaseItem
// ====================================================

export interface BaseItem {
  id: string;
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BasePokemon
// ====================================================

export interface BasePokemon {
  id: string;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
