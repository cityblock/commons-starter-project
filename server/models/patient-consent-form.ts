import { Transaction } from 'objection';
import ComputedPatientStatus from './computed-patient-status';
import PatientForm, { IPatientFormCreateInput } from './patient-form';

export default class PatientConsentForm extends PatientForm {
  static tableName = 'patient_consent_form';
  static hasPHI = false;

  static async create(
    input: IPatientFormCreateInput,
    txn: Transaction,
  ): Promise<PatientConsentForm> {
    const { formId } = input;

    // Mark any existing patient consent forms as deleted just to be safe
    await this.query(txn)
      .where({ formId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const patientConsentForm = await this.query(txn).insertAndFetch(input);

    await ComputedPatientStatus.updateForPatient(input.patientId, input.userId, txn);

    return patientConsentForm;
  }

  static async getAllForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientConsentForm[]> {
    return this.query(txn).where({ patientId, deletedAt: null });
  }

  static async delete(
    patientFormId: string,
    userId: string,
    txn: Transaction,
  ): Promise<PatientConsentForm> {
    await this.query(txn)
      .where({ id: patientFormId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const patientConsentForm = await this.query(txn).findById(patientFormId);

    if (!patientConsentForm) {
      return Promise.reject(`No such patient consent form: ${patientFormId}`);
    }

    await ComputedPatientStatus.updateForPatient(patientConsentForm.patientId, userId, txn);

    return patientConsentForm;
  }
}
