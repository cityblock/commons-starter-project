/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: readPokemons
// ====================================================

export interface readPokemons_queryAllPokemon {
  id: string;
  pokemonNumber: number | null;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[];
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface readPokemons {
  queryAllPokemon: (readPokemons_queryAllPokemon | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: readPokemon
// ====================================================

export interface readPokemon_queryOnePokemon_items {
  id: string;
  name: string | null;
  pokemonId: string | null;
  price: number | null;
  happiness: number | null;
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface readPokemon_queryOnePokemon {
  id: string;
  pokemonNumber: number | null;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[];
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
  items: (readPokemon_queryOnePokemon_items | null)[];
}

export interface readPokemon {
  queryOnePokemon: readPokemon_queryOnePokemon | null;
}

export interface readPokemonVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: readItem
// ====================================================

export interface readItem_queryOneItem {
  id: string;
  name: string | null;
  pokemonId: string | null;
  price: number | null;
  happiness: number | null;
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface readItem {
  queryOneItem: readItem_queryOneItem | null;
}

export interface readItemVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPokemon
// ====================================================

export interface editPokemon_mutatePokemonEdit {
  id: string;
  pokemonNumber: number | null;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[];
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface editPokemon {
  mutatePokemonEdit: editPokemon_mutatePokemonEdit | null;
}

export interface editPokemonVariables {
  id: string;
  pokemonNumber?: number | null;
  name?: string | null;
  attack?: number | null;
  defense?: number | null;
  pokeType?: PokeType | null;
  moves?: (string | null)[] | null;
  imageUrl?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editItem
// ====================================================

export interface editItem_mutateItemEdit {
  id: string;
  name: string | null;
  pokemonId: string | null;
  price: number | null;
  happiness: number | null;
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface editItem {
  mutateItemEdit: editItem_mutateItemEdit | null;
}

export interface editItemVariables {
  id: string;
  name?: string | null;
  pokemonId: string;
  price?: number | null;
  happiness?: number | null;
  imageUrl?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deletePokemon
// ====================================================

export interface deletePokemon_mutatePokemonDelete {
  id: string;
  pokemonNumber: number | null;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[];
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface deletePokemon {
  mutatePokemonDelete: deletePokemon_mutatePokemonDelete | null;
}

export interface deletePokemonVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteItem
// ====================================================

export interface deleteItem_mutateItemDelete {
  id: string;
  name: string | null;
  pokemonId: string | null;
  price: number | null;
  happiness: number | null;
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface deleteItem {
  mutateItemDelete: deleteItem_mutateItemDelete | null;
}

export interface deleteItemVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPokemon
// ====================================================

export interface createPokemon_mutatePokemonCreate {
  id: string;
  pokemonNumber: number | null;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[];
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface createPokemon {
  mutatePokemonCreate: createPokemon_mutatePokemonCreate | null;
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
// GraphQL mutation operation: createItem
// ====================================================

export interface createItem_mutateItemCreate {
  id: string;
  name: string | null;
  pokemonId: string | null;
  price: number | null;
  happiness: number | null;
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

export interface createItem {
  mutateItemCreate: createItem_mutateItemCreate | null;
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
// GraphQL fragment: poke_frag
// ====================================================

export interface poke_frag {
  id: string;
  pokemonNumber: number | null;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: PokeType | null;
  moves: (string | null)[];
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  deletedAt: any | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: item_frag
// ====================================================

export interface item_frag {
  id: string;
  name: string | null;
  pokemonId: string | null;
  price: number | null;
  happiness: number | null;
  imageUrl: string | null;
  createdAt: any | null;
  updatedAt: any | null;
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
