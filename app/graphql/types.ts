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
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
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
// GraphQL mutation operation: itemCreate
// ====================================================

export interface itemCreate_itemCreate {
  id: string;
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface itemCreate {
  itemCreate: itemCreate_itemCreate | null;
}

export interface itemCreateVariables {
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
// GraphQL mutation operation: itemDelete
// ====================================================

export interface itemDelete_itemDelete {
  id: string;
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
  deletedAt: any | null;
}

export interface itemDelete {
  itemDelete: itemDelete_itemDelete;
}

export interface itemDeleteVariables {
  itemId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: itemEdit
// ====================================================

export interface itemEdit_itemEdit {
  id: string;
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface itemEdit {
  itemEdit: itemEdit_itemEdit | null;
}

export interface itemEditVariables {
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
// GraphQL mutation operation: pokemonCreate
// ====================================================

export interface pokemonCreate_pokemonCreate {
  pokemonNumber: number;
  id: string;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
}

export interface pokemonCreate {
  pokemonCreate: pokemonCreate_pokemonCreate | null;
}

export interface pokemonCreateVariables {
  pokemonNumber: number;
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

// ====================================================
// GraphQL mutation operation: pokemonDelete
// ====================================================

export interface pokemonDelete_pokemonDelete {
  id: string;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
  deletedAt: any | null;
}

export interface pokemonDelete {
  pokemonDelete: pokemonDelete_pokemonDelete;
}

export interface pokemonDeleteVariables {
  pokemonId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonEdit
// ====================================================

export interface pokemonEdit_pokemonEdit {
  id: string;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
}

export interface pokemonEdit {
  pokemonEdit: pokemonEdit_pokemonEdit | null;
}

export interface pokemonEditVariables {
  pokemonId: string;
  name?: string | null;
  attack?: number | null;
  defense?: number | null;
  pokeType?: string | null;
  moves?: string[] | null;
  imageUrl?: string | null;
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
