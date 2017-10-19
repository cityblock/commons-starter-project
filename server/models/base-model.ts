import { Model } from 'objection';
import * as uuid from 'uuid/v4';

export default class BaseModel extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
