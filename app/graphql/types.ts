/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createItem
// ====================================================

export interface createItem_createItem {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface createItem {
  createItem: createItem_createItem;
}

export interface createItemVariables {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPokemon
// ====================================================

export interface createPokemon_createPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface createPokemon {
  createPokemon: createPokemon_createPokemon;
}

export interface createPokemonVariables {
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
// GraphQL mutation operation: deletePokemon
// ====================================================

export interface deletePokemon_deletePokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface deletePokemon {
  deletePokemon: deletePokemon_deletePokemon;
}

export interface deletePokemonVariables {
  pokemonId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editItem
// ====================================================

export interface editItem_editItem {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface editItem {
  editItem: editItem_editItem;
}

export interface editItemVariables {
  itemId: string;
  name?: string | null;
  pokemonId?: string | null;
  price?: number | null;
  happiness?: number | null;
  imageUrl?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPokemon
// ====================================================

export interface editPokemon_editPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface editPokemon {
  editPokemon: editPokemon_editPokemon;
}

export interface editPokemonVariables {
  pokemonId: string;
  pokemonNumber?: number | null;
  name?: string | null;
  attack?: number | null;
  defense?: number | null;
  pokeType?: PokeType | null;
  moves?: string[] | null;
  imageUrl?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getItem
// ====================================================

export interface getItem_item {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface getItem {
  item: getItem_item;
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

export interface getPokemon_pokemon_items {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface getPokemon_pokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
  items: getPokemon_pokemon_items[];
}

export interface getPokemon {
  pokemon: getPokemon_pokemon;
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
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface getPokemons {
  pokemons: getPokemons_pokemons[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Item
// ====================================================

export interface Item {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Pokemon
// ====================================================

export interface Pokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
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
