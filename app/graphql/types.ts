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
  pokemonId: string;
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
// GraphQL query operation: getAllPokemon
// ====================================================

export interface getAllPokemon_pokemonAll {
  pokemonNumber: number;
  name: string | null;
  attack: number | null;
  defense: number | null;
  pokeType: string | null;
  moves: (string | null)[] | null;
  imageUrl: string | null;
  deletedAt: any | null;
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
