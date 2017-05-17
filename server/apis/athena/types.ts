// These interfaces define the request and return types for the Athena API.
// They're based on https://developer.athenahealth.com/io-docs
// Only types which appear in Athena should go here!

export interface ITokenResponse {
  access_token: string;
  expires_in: number; // in seconds
  refresh_token: string;
  token_type: string;
}

export interface IPatientBalanceAthena {
  balance: number | string;
  departmentlist: string;
  providergroupid: number;
  cleanbalance: boolean;
}

export interface IPatientInfoAthena {
  preferredname: string;
  racename: string;
  email: string;
  suffix: string;
  departmentid: string;
  homephone: string;
  guarantorstate: string;
  portalaccessgiven: boolean;
  driverslicense: boolean;
  referralsourceid: string;
  contactpreference_appointment_email: boolean;
  homebound: boolean;
  contactpreference_appointment_sms: boolean;
  contactpreference_billing_phone: boolean;
  ethnicitycode: string;
  contactpreference_announcement_phone: boolean;
  contactpreference: string;
  lastemail: string;
  contactrelationship: string;
  employerid: string;
  contacthomephone: string;
  guarantorssn: string;
  contactpreference_lab_sms: boolean;
  guarantordob: string;
  zip: string;
  guarantoraddresssameaspatient: boolean;
  employerphone: string;
  portaltermsonfile: boolean;
  status: string;
  lastname: string;
  guarantorfirstname: string;
  city: string;
  ssn: string;
  lastappointment: string;
  employercity: string;
  povertylevelincomedeclined: boolean;
  guarantoremail: string;
  guarantorcity: string;
  guarantorzip: string;
  sex: string;
  privacyinformationverified: boolean;
  primarydepartmentid: string;
  contactpreference_lab_email: boolean;
  contactpreference_announcement_sms: boolean;
  emailexists: boolean;
  employerstate: string;
  firstappointment: string;
  language6392code: string;
  primaryproviderid: string;
  patientphoto: boolean;
  consenttocall: boolean;
  defaultpharmacyncpdpid: string;
  povertylevelincomerangedeclined: boolean;
  contactpreference_billing_email: boolean;
  employerzip: string;
  patientphotourl: string;
  mobilephone: string;
  contactpreference_announcement_email: boolean;
  hasmobile: boolean;
  registrationdate: string;
  guarantorsuffix: string;
  caresummarydeliverypreference: string;
  guarantorlastname: string;
  firstname: string;
  guarantorcountrycode: string;
  state: string;
  contactpreference_appointment_phone: boolean;
  patientid: string;
  dob: string;
  guarantorrelationshiptopatient: string;
  address1: string;
  guarantoremployerid: string;
  contactpreference_billing_sms: boolean;
  guarantorphone: string;
  povertylevelfamilysizedeclined: boolean;
  employername: string;
  driverslicenseurl: string;
  employeraddress: string;
  maritalstatus: string;
  countrycode: string;
  guarantoraddress1: string;
  maritalstatusname: string;
  consenttotext: boolean;
  countrycode3166: string;
  onlinestatementonly: boolean;
  contactpreference_lab_phone: boolean;
  guarantorcountrycode3166: string;
  balances: IPatientBalanceAthena[];
  race: string[];
}

export interface IPatientMedicationStructuredSig {
  doseageaction: string;
  dosagequantityvalue: number;
  dosagequantityunit: string;
  dosagefrequencyvalue: number;
  dosagefrequencyunit: string;
  dosagefrequencydescription: string;
  dosageroute: string;
  dosageadditionalinstructions: string;
  dosagedurationvalue: number;
  dosagedurationunit: string;

}

export interface IPatientMedicationEvent {
  type: 'START' | 'END' | 'ORDER' | 'ENTER' | 'FILL' | 'HIDE';
  eventdate: string;
}

export interface IPatientMedicationResource {
  medicationentryid: string;
  medicationid: number;
  medication: string;
  isstructuredsig: boolean;
  unstructuredsig: string;
  source: string;
  encounterid: number;
  createdby: string;
  approvedby: string;
  orderingmode: string;
  quantity: number;
  quantityunit: string;
  refillsallowed: number;
  issafetorenew: boolean;
  stopreason: string;
  providernote: string;
  patientnote: string;
  pharmacyncpdpid: string;
  route: string;
  events: IPatientMedicationEvent[];
  structuredsig?: IPatientMedicationStructuredSig;
}

export type PatientMedicationResource = IPatientMedicationResource[];

export interface IPatientMedicationsResponse {
  lastupdated: string;
  medications: PatientMedicationResource[];
  nomedicationsreported: boolean;
  sectionnote: string;
}
