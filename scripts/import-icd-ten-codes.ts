/*
 * USAGE
 *
 * NOTE: This script can be run multiple times without fear of creating duplicates
 *
 * Step 1: Download latest ICD-10 codes from CMS (in tabular order)
 *         (2018 link: https://www.cms.gov/Medicare/Coding/ICD10/2018-ICD-10-CM-and-GEMs.html)
 * Step 2: Unzip
 * Step 3: Run this script, passing in the following environment variables:
 *         CODESET_FILE_PATH: path to unzipped file containing codes in tabular order
 *         CODESET_VERSION: version of the codeset
*/

/* tslint:disable no-console */
import fs from 'fs';
import Knex from 'knex';
import { transaction, Model } from 'objection';

/* tslint:disable no-var-requires */
const knexConfig = require('../server/models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

import DiagnosisCode from '../server/models/diagnosis-code';

const filePath = process.env.CODESET_FILE_PATH;
const version = process.env.CODESET_VERSION;

export async function importCodeset() {
  if (!filePath || !version) {
    console.log(
      'Must provide the following environment variables: CODESET_FILE_PATH, CODESET_VERSION',
    );
    return process.exit(1);
  }

  const codesToImport = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(Boolean);

  let successCount = 0;
  let failureCount = 0;

  for (const codeLine of codesToImport) {
    try {
      const regexp = /^(\S+)\s+(.+)$/;
      const matched = codeLine.trim().match(regexp) as string[];
      const code = matched[1];
      const label = matched[2];

      if (!!code && !!label) {
        console.log(`Importing code: ${code} - ${label}`);
        const txn = await transaction.start(DiagnosisCode.knex());
        await DiagnosisCode.create(
          {
            codesetName: 'ICD-10',
            label,
            code,
            version,
          },
          txn,
        );
        await txn.commit();
      }

      successCount += 1;
    } catch (err) {
      console.log(`Error importing code: ${err.message}`);
      failureCount += 1;
    }
  }

  console.log(`Total Codes To Import: ${codesToImport.length}`);
  console.log(`Success Count: ${successCount}`);
  console.log(`Failure Count: ${failureCount}`);
}

importCodeset().then(() => {
  process.exit(0);
});
/* tslint:enable no-console */
