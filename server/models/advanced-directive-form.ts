import { Transaction } from 'objection';
import Form from './form';

export const HEALTHCARE_PROXY_FORM_TITLE = 'HCP';
export const MOLST_FORM_TITLE = 'MOLST';

export default class AdvancedDirectiveForm extends Form {
  static tableName = 'advanced_directive_form';
  static hasPHI = false;

  static async create(title: string, txn: Transaction): Promise<AdvancedDirectiveForm> {
    return this.query(txn).insertAndFetch({ title });
  }

  static async get(
    advancedDirectiveFormId: string,
    txn: Transaction,
  ): Promise<AdvancedDirectiveForm> {
    const advancedDirectiveForm = await this.query(txn).findOne({
      id: advancedDirectiveFormId,
      deletedAt: null,
    });

    if (!advancedDirectiveForm) {
      return Promise.reject(`No such advanced directive form: ${advancedDirectiveFormId}`);
    }

    return advancedDirectiveForm;
  }

  static async getAll(txn: Transaction): Promise<AdvancedDirectiveForm[]> {
    return this.query(txn)
      .where({ deletedAt: null })
      .orderBy('createdAt', 'asc');
  }
}
