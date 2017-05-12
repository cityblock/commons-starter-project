// These interfaces define the request and return types for the Athena API.
// They're based on https://developer.athenahealth.com/io-docs
// Only types which appear in Athena should go here!

export interface IPatientName {
  given: string[];
  use: string;
  family: string[];
}

export interface IPatientIdentifier {
  system: string;
  use: string;
  value: string;
}

export interface IPatientAddress {
  country: string;
  city: string;
  use: string;
  postalCode: string;
  state: string;
  line: string[];
}

export interface IPatientDisplayCoding {
  system: string;
  display: string;
  code?: string;
}

export interface IPatientLanguagePreference {
  text: string;
  coding: IPatientDisplayCoding[];
}

export interface IPatientCommunicationPreference {
  language: IPatientLanguagePreference;
}

export interface IPatientTelecom {
  use?: string;
  system: string;
  value: string;
}

export interface IPatientValueCodeableConcept {
  coding: IPatientDisplayCoding[];
  text?: string;
}

export interface IPatientExtension {
  valueCodeableConcept: IPatientValueCodeableConcept;
  url: string;
}

export interface IPatientInfoAthena {
  extension: IPatientExtension[];
  resourceType: string;
  name: IPatientName[];
  birthDate: string;
  identifier: IPatientIdentifier[];
  id: string;
  address: IPatientAddress[];
  communication: IPatientCommunicationPreference[];
  telecom: IPatientTelecom[];
  gender: string;
}

export interface ITokenResponse {
  access_token: string;
  expires_in: number; // in seconds
  refresh_token: string;
  token_type: string;
}
