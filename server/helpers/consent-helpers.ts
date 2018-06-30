import { toNumber } from 'lodash';
import { QueryBuilder } from 'objection';
import BaseModel from '../models/base-model';

export class ConsentModel extends BaseModel {
  id!: string;
  patientId!: string;
  isConsentedForSubstanceUse!: boolean;
  isConsentedForHiv!: boolean;
  isConsentedForStd!: boolean;
  isConsentedForGeneticTesting!: boolean;
  isConsentedForFamilyPlanning!: boolean;
  isConsentedForMentalHealth!: boolean;
  consentDocumentId!: string | null;
  isConsentDocumentOutdated!: boolean;
  deletedAt!: string;
}

export function getQueryForAllForConsents<T extends ConsentModel>(
  queryBuilder: QueryBuilder<T, T[], T[]>,
  patientId: string,
  maxEntities: number,
  orderByKey: string,
) {
  return queryBuilder
    .where({ patientId, deletedAt: null })
    .where(builder => {
      builder
        .where({ isConsentedForFamilyPlanning: true })
        .orWhere({ isConsentedForGeneticTesting: true })
        .orWhere({ isConsentedForHiv: true })
        .orWhere({ isConsentedForMentalHealth: true })
        .orWhere({ isConsentedForStd: true })
        .orWhere({ isConsentedForSubstanceUse: true });
    })
    .orderBy(orderByKey, 'asc')
    .limit(maxEntities);
}

export function getQueryForAllNewlyUnconsented<T extends ConsentModel>(
  queryBuilder: QueryBuilder<T, T[], T[]>,
  patientId: string,
) {
  return queryBuilder
    .where({ patientId, deletedAt: null, isConsentDocumentOutdated: true })
    .where(builder => {
      builder
        .where({ isConsentedForFamilyPlanning: false })
        .orWhere({ isConsentedForGeneticTesting: false })
        .orWhere({ isConsentedForHiv: false })
        .orWhere({ isConsentedForMentalHealth: false })
        .orWhere({ isConsentedForStd: false })
        .orWhere({ isConsentedForSubstanceUse: false });
    });
}

export async function getCountUndocumentedSharingConsentedForPatient<T extends ConsentModel>(
  queryBuilder: QueryBuilder<T, T[], T[]>,
  patientId: string,
): Promise<number> {
  const undocumentedCount = (await queryBuilder
    .where({ patientId, deletedAt: null, isConsentDocumentOutdated: true })
    .count()) as any;

  return undocumentedCount && undocumentedCount.length ? toNumber(undocumentedCount[0].count) : 0;
}
