

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllItem
// ====================================================

export interface getAllItem_allItem {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface getAllItem {
  allItem: (getAllItem_allItem | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllPokemon
// ====================================================

export interface getAllPokemon_allPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface getAllPokemon {
  allPokemon: (getAllPokemon_allPokemon | null)[] | null;
}


/* tslint:disable */
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
  createdAt: string;
  updatedAt: string;
}

export interface getItem {
  item: getItem_item;
}

export interface getItemVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPokemon
// ====================================================

export interface getPokemon_pokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface getPokemon {
  pokemon: getPokemon_pokemon;
}

export interface getPokemonVariables {
  pokemonId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: itemCreate
// ====================================================

export interface itemCreate_itemCreate {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface itemCreate {
  itemCreate: itemCreate_itemCreate;
}

export interface itemCreateVariables {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: itemEdit
// ====================================================

export interface itemEdit_itemEdit {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface itemEdit {
  itemEdit: itemEdit_itemEdit;
}

export interface itemEditVariables {
  id: string;
  name?: string | null;
  price?: number | null;
  happiness?: number | null;
  imageUrl?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonCreate
// ====================================================

export interface pokemonCreate_pokemonCreate {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface pokemonCreate {
  pokemonCreate: pokemonCreate_pokemonCreate;
}

export interface pokemonCreateVariables {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string;
  imageUrl: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonDelete
// ====================================================

export interface pokemonDelete_pokemonDelete {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface pokemonDelete {
  pokemonDelete: pokemonDelete_pokemonDelete;
}

export interface pokemonDeleteVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pokemonEdit
// ====================================================

export interface pokemonEdit_pokemonEdit {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface pokemonEdit {
  pokemonEdit: pokemonEdit_pokemonEdit;
}

export interface pokemonEditVariables {
  id: string;
  pokemonNumber?: number | null;
  name?: string | null;
  attack?: number | null;
  defense?: number | null;
  pokeType?: PokeType | null;
  moves?: string[] | null;
  imageUrl?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPokemon
// ====================================================

export interface FullPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
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