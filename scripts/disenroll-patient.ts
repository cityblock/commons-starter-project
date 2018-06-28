/*

USAGE

This script disenrolls a single patient from Commons

ARGUMENT 1: Patient id
ARGUMENT 2: User id (your user id)
ARGUMENT 3: Reason - must be one of:
  'transferPlan', 'moved', 'dissatisfied', 'ineligible', 'deceased', 'other'
ARGUMENT 4: Free text explanation (optional) - must pass in quotes

EXAMPLE

yarn run patients:disenroll:dev patientId userId other "why are they disenrolled"
yarn run patients:disenroll:dev patientId userId moved

*/

import Knex from 'knex';
import { transaction, Model, Transaction } from 'objection';
import ComputedPatientStatus from '../server/models/computed-patient-status';
import PatientDisenrollment, { DisenrollmentType } from '../server/models/patient-disenrollment';
/* tslint:disable no-var-requires */
const knexConfig = require('../server/models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const args = process.argv;
const env = process.env.NODE_ENV;

/* tslint:disable no-console */
export async function disenrollPatient(variables: string[], testTransaction?: Transaction) {
  const patientId = variables[2];
  const userId = variables[3];
  const reason = variables[4];
  const note = variables[5];

  console.log(`Disenrolling patient ${patientId} for reason: ${reason} with note: ${note}`);

  try {
    await transaction(testTransaction || PatientDisenrollment.knex(), async txn => {
      await PatientDisenrollment.create(
        {
          patientId,
          reason: reason as DisenrollmentType,
          note,
        },
        txn,
      );

      await ComputedPatientStatus.updateForPatient(patientId, userId, txn);
    });
  } catch (err) {
    console.log(`Error disenrolling patient: ${err.message}`);
  }
}

if (env !== 'test') {
  disenrollPatient(args).then(() => {
    process.exit(0);
  });
}

/* tslint:enable no-console */
