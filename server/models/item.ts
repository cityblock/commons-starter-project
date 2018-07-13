import { Model } from 'objection';
import uuid from 'uuid/v4';

// interface IItemCreateFields {
//   name: string;
//   pokemonId: string;
//   price: number;
//   happiness: number;
//   imageUrl: string;
// }

// interface IItemEditFields {
//   name?: string;
//   pokemonId?: string;
//   price?: number;
//   happiness?: number;
//   imageUrl?: string;
// }

/* tslint:disable member-ordering */
export default class Item extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
/* tslint:enable member-ordering */
