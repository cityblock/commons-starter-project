import { transaction } from 'objection';
import Db from '../../db';
import ConsentForm from '../consent-form';

describe('consent form model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a consent form', async () => {
    await transaction(ConsentForm.knex(), async txn => {
      const consentForms = await ConsentForm.getAll(txn);
      expect(consentForms.length).toEqual(0);

      const consentForm = await ConsentForm.create('Cityblock', txn);
      const refetchedConsentForms = await ConsentForm.getAll(txn);
      expect(refetchedConsentForms.length).toEqual(1);
      expect(refetchedConsentForms[0]).toMatchObject(consentForm);

      const fetchedConsentForm = await ConsentForm.get(consentForm.id, txn);
      expect(fetchedConsentForm).toMatchObject(consentForm);
    });
  });

  it('should get all consent forms', async () => {
    await transaction(ConsentForm.knex(), async txn => {
      const consentForms = await ConsentForm.getAll(txn);
      expect(consentForms.length).toEqual(0);

      const cityblockConsentForm = await ConsentForm.create('Cityblock', txn);
      const hipaaConsentForm = await ConsentForm.create('HIPAA', txn);
      const healthixConsentForm = await ConsentForm.create('HIE/Healthix', txn);

      const refetchedConsentForms = await ConsentForm.getAll(txn);
      const refetchedConsentFormIds = refetchedConsentForms.map(form => form.id);
      expect(refetchedConsentForms.length).toEqual(3);
      expect(refetchedConsentFormIds).toContain(cityblockConsentForm.id);
      expect(refetchedConsentFormIds).toContain(hipaaConsentForm.id);
      expect(refetchedConsentFormIds).toContain(healthixConsentForm.id);
    });
  });
});
