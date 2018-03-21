import { transaction } from 'objection';
import Db from '../../db';
import AdvancedDirectiveForm from '../advanced-directive-form';

describe('advanced directive form model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(AdvancedDirectiveForm.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get an advanced directive form', async () => {
    const advancedDirectiveForms = await AdvancedDirectiveForm.getAll(txn);
    expect(advancedDirectiveForms.length).toEqual(0);

    const advancedDirectiveForm = await AdvancedDirectiveForm.create('Cityblock', txn);
    const refetchedAdvancedDirectiveForms = await AdvancedDirectiveForm.getAll(txn);
    expect(refetchedAdvancedDirectiveForms.length).toEqual(1);
    expect(refetchedAdvancedDirectiveForms[0]).toMatchObject(advancedDirectiveForm);

    const fetchedAdvancedDirectiveForm = await AdvancedDirectiveForm.get(
      advancedDirectiveForm.id,
      txn,
    );
    expect(fetchedAdvancedDirectiveForm).toMatchObject(advancedDirectiveForm);
  });

  it('should get all advanced directive forms', async () => {
    const advancedDirectiveForms = await AdvancedDirectiveForm.getAll(txn);
    expect(advancedDirectiveForms.length).toEqual(0);

    const hcpForm = await AdvancedDirectiveForm.create('HCP', txn);
    const molstForm = await AdvancedDirectiveForm.create('MOLST', txn);

    const refetchedAdvancedDirectiveForms = await AdvancedDirectiveForm.getAll(txn);
    const refetchedAdvancedDirectiveFormIds = refetchedAdvancedDirectiveForms.map(form => form.id);
    expect(refetchedAdvancedDirectiveForms.length).toEqual(2);
    expect(refetchedAdvancedDirectiveFormIds).toContain(hcpForm.id);
    expect(refetchedAdvancedDirectiveFormIds).toContain(molstForm.id);
  });
});
