/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonCreate
// ====================================================

export interface pokemonCreate_pokemonCreate {
  id: string;
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: string | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
  deletedAt: any | null;
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
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: string | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
  deletedAt: any | null;
}

export interface pokemonDelete {
  pokemonDelete: pokemonDelete_pokemonDelete | null;
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
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: string | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
  deletedAt: any | null;
}

export interface pokemonEdit {
  pokemonEdit: pokemonEdit_pokemonEdit | null;
}

export interface pokemonEditVariables {
  id: string;
  name?: string | null;
  attack?: number | null;
  defense?: number | null;
  pokeType?: string | null;
  moves?: (string | null)[] | null;
  imageUrl?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: pokemon
// ====================================================

export interface pokemon_pokemon {
  id: string;
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: string | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
  deletedAt: any | null;
}

export interface pokemon {
  pokemon: pokemon_pokemon | null;
}

export interface pokemonVariables {
  pokemonId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: pokemons
// ====================================================

export interface pokemons_pokemons {
  id: string;
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: string | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
  deletedAt: any | null;
}

export interface pokemons {
  pokemons: pokemons_pokemons[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: fullPokemon
// ====================================================

export interface fullPokemon {
  id: string;
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: string | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
  deletedAt: any | null;
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
