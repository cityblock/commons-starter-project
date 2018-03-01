import { Transaction } from 'objection';
import Form from './form';

export default class ConsentForm extends Form {
  static tableName = 'consent_form';
  static hasPHI = false;

  static async create(title: string, txn: Transaction): Promise<ConsentForm> {
    return this.query(txn).insertAndFetch({ title });
  }

  static async get(consentFormId: string, txn: Transaction): Promise<ConsentForm> {
    const consentForm = await this.query(txn).findOne({ id: consentFormId, deletedAt: null });

    if (!consentForm) {
      return Promise.reject(`No such consent form: ${consentFormId}`);
    }

    return consentForm;
  }

  static async getAll(txn: Transaction): Promise<ConsentForm[]> {
    return this.query(txn)
      .where({ deletedAt: null })
      .orderBy('createdAt', 'asc');
  }
}
