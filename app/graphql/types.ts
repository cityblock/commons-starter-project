/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: allPokemon
// ====================================================

export interface allPokemon_getAllPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: any;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

export interface allPokemon {
  getAllPokemon: (allPokemon_getAllPokemon | null)[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPokemon
// ====================================================

export interface getPokemon_pokemonItems_items {
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

export interface getPokemon_pokemonItems {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: any;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
  items: (getPokemon_pokemonItems_items | null)[] | null;
}

export interface getPokemon {
  pokemonItems: getPokemon_pokemonItems | null;
}

export interface getPokemonVariables {
  pokemonId: string;
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
