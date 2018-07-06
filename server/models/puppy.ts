import { Model, Transaction } from 'objection';
import uuid from 'uuid/v4';

export interface IPuppyCreateFields {
  name: string;
}

export default class Puppy extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  name!: string;
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

  static tableName = 'puppy';

  static async create(input: IPuppyCreateFields, txn: Transaction): Promise<Puppy> {
    return this.query(txn).insertAndFetch(input);
  }

  static async getAll(txn: Transaction): Promise<Puppy[]> {
    return this.query(txn).orderBy('name', 'ASC');
  }
}
