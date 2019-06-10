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

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
