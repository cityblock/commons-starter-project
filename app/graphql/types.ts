/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createItem
// ====================================================

export interface createItem_createItem {
  id: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface createItem {
  createItem: createItem_createItem;
}

export interface createItemVariables {
  name: string;
  pokemonId: string;
  happiness: number;
  price: number;
  imageUrl: string;
}

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
  createPokemon: pokemonCreate_createPokemon;
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
// GraphQL mutation operation: deleteItem
// ====================================================

export interface deleteItem_deleteItem {
  id: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface deleteItem {
  deleteItem: deleteItem_deleteItem;
}

export interface deleteItemVariables {
  itemId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonDelete
// ====================================================

export interface pokemonDelete_deletePokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
}

export interface pokemonDelete {
  deletePokemon: pokemonDelete_deletePokemon;
}

export interface pokemonDeleteVariables {
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
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface editItem {
  editItem: editItem_editItem;
}

export interface editItemVariables {
  id: string;
  name: string;
  pokemonId: string;
  happiness: number;
  price: number;
  imageUrl: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonEdit
// ====================================================

export interface pokemonEdit_editPokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
}

export interface pokemonEdit {
  editPokemon: pokemonEdit_editPokemon;
}

export interface pokemonEditVariables {
  id: string;
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
// GraphQL query operation: getItem
// ====================================================

export interface getItem_singleItem {
  id: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface getItem {
  singleItem: getItem_singleItem;
}

export interface getItemVariables {
  itemId: string;
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
  price: number;
  happiness: number;
  imageUrl: string;
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
