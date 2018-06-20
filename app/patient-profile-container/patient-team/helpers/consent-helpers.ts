import { pick } from 'lodash';

export interface IConsentSettings {
  isConsentedForSubstanceUse?: boolean | null;
  isConsentedForHiv?: boolean | null;
  isConsentedForStd?: boolean | null;
  isConsentedForGeneticTesting?: boolean | null;
  isConsentedForFamilyPlanning?: boolean | null;
  isConsentedForMentalHealth?: boolean | null;
}

export type ConsentLevel = 'fullConsent' | 'partialConsent' | 'noConsent';

export const getConsentLevel = (consentSettings: IConsentSettings): ConsentLevel => {
  const {
    isConsentedForFamilyPlanning,
    isConsentedForHiv,
    isConsentedForGeneticTesting,
    isConsentedForStd,
    isConsentedForSubstanceUse,
    isConsentedForMentalHealth,
  } = consentSettings;

  const levelAnd =
    isConsentedForFamilyPlanning &&
    isConsentedForHiv &&
    isConsentedForGeneticTesting &&
    isConsentedForStd &&
    isConsentedForSubstanceUse &&
    isConsentedForMentalHealth;

  if (levelAnd === true) {
    return 'fullConsent';
  } else {
    const levelOr =
      isConsentedForFamilyPlanning ||
      isConsentedForHiv ||
      isConsentedForGeneticTesting ||
      isConsentedForStd ||
      isConsentedForSubstanceUse ||
      isConsentedForMentalHealth;

    if (levelOr) {
      return 'partialConsent';
    }
    return 'noConsent';
  }
};

export const getConsentSettingsObject = (supersetObject: IConsentSettings): IConsentSettings => {
  return pick(supersetObject, [
    'isConsentedForFamilyPlanning',
    'isConsentedForGeneticTesting',
    'isConsentedForHiv',
    'isConsentedForMentalHealth',
    'isConsentedForStd',
    'isConsentedForSubstanceUse',
  ]);
};
