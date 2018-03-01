import { Transaction } from 'objection';
import ComputedPatientStatus from './computed-patient-status';
import PatientForm, { IPatientFormCreateInput } from './patient-form';

export default class PatientAdvancedDirectiveForm extends PatientForm {
  static tableName = 'patient_advanced_directive_form';
  static hasPHI = false;

  static async create(
    input: IPatientFormCreateInput,
    txn: Transaction,
  ): Promise<PatientAdvancedDirectiveForm> {
    const { formId } = input;

    // Mark any existing patient advanced directive forms as deleted just to be safe
    await this.query(txn)
      .where({ formId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const patientAdvancedDirectiveForm = await this.query(txn).insertAndFetch(input);

    await ComputedPatientStatus.updateForPatient(input.patientId, input.userId, txn);

    return patientAdvancedDirectiveForm;
  }

  static async getAllForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientAdvancedDirectiveForm[]> {
    return this.query(txn).where({ patientId, deletedAt: null });
  }

  static async delete(
    patientFormId: string,
    userId: string,
    txn: Transaction,
  ): Promise<PatientAdvancedDirectiveForm> {
    await this.query(txn)
      .where({ id: patientFormId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const patientAdvancedDirectiveForm = await this.query(txn).findById(patientFormId);

    if (!patientAdvancedDirectiveForm) {
      return Promise.reject(`No such patient advanced directive form: ${patientFormId}`);
    }

    await ComputedPatientStatus.updateForPatient(
      patientAdvancedDirectiveForm.patientId,
      userId,
      txn,
    );

    return patientAdvancedDirectiveForm;
  }
}
