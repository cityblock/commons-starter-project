

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllPokemon
// ====================================================

export interface getAllPokemon_allPokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  imageUrl: string;
}

export interface getAllPokemon {
  allPokemon: getAllPokemon_allPokemon[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSinglePokemon
// ====================================================

export interface getSinglePokemon_singlePokemon_items {
  id: string;
  name: string;
  imageUrl: string;
}

export interface getSinglePokemon_singlePokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  items: getSinglePokemon_singlePokemon_items[] | null;
}

export interface getSinglePokemon {
  singlePokemon: getSinglePokemon_singlePokemon;
}

export interface getSinglePokemonVariables {
  pokemonId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonCreate
// ====================================================

export interface pokemonCreate_pokemonCreate_items {
  id: string;
  name: string;
  imageUrl: string;
}

export interface pokemonCreate_pokemonCreate {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  items: pokemonCreate_pokemonCreate_items[] | null;
}

export interface pokemonCreate {
  pokemonCreate: pokemonCreate_pokemonCreate;
}

export interface pokemonCreateVariables {
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonEdit
// ====================================================

export interface pokemonEdit_pokemonEdit_items {
  id: string;
  name: string;
  imageUrl: string;
}

export interface pokemonEdit_pokemonEdit {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  items: pokemonEdit_pokemonEdit_items[] | null;
}

export interface pokemonEdit {
  pokemonEdit: pokemonEdit_pokemonEdit;
}

export interface pokemonEditVariables {
  pokemonId: string;
  name?: string | null;
  pokemonNumber?: number | null;
  attack?: number | null;
  defense?: number | null;
  pokeType?: PokeType | null;
  moves?: string[] | null;
  imageUrl?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullItem
// ====================================================

export interface FullItem {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPokemon
// ====================================================

export interface FullPokemon_items {
  id: string;
  name: string;
  imageUrl: string;
}

export interface FullPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  items: FullPokemon_items[] | null;
}

/* tslint:disable */
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