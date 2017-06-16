import { IPatientHealthRecord } from 'schema';
import { IAthenaEditPatient } from '../index';
import { IPatientInfoAthena } from '../types';

// Note: This drops some fields returned by athena
export const formatPatientHealthRecord = (
  p: IPatientInfoAthena, patientId: string,
): IPatientHealthRecord => ({
  id: patientId,
  firstName: p.firstname,
  middleName: p.middlename,
  lastName: p.lastname,
  suffix: p.suffix,
  preferredName: p.preferredname,
  raceName: p.racename,
  dateOfBirth: p.dob,
  gender: p.sex,
  race: p.race[0],
  ethnicityCode: p.ethnicitycode,
  status: p.status,
  ssn: p.ssn,
  homebound: p.homebound,
  language6392code: p.language6392code,
  maritalStatus: p.maritalstatus,
  maritalStatusName: p.maritalstatusname,
  patientPhoto: p.patientphoto,
  patientPhotoUrl: p.patientphotourl,
  contact: {
    email: p.email,
    lastEmail: p.lastemail,
    emailExists: p.emailexists,
    homePhone: p.homephone,
    mobilePhone: p.mobilephone,
    hasMobile: p.hasmobile,
    consentToCall: p.consenttocall,
    consentToText: p.consenttotext,
  },
  guarantor: {
    firstName: p.guarantorfirstname,
    lastName: p.guarantorlastname,
    suffix: p.guarantorsuffix,
    SSN: p.guarantorssn,
    dateOfBirth: p.guarantordob,
    phone: p.guarantorphone,
    email: p.guarantoremail,
    relationshipToPatient: p.guarantorrelationshiptopatient,
    employerId: p.guarantoremployerid,
    address: {
      addressSameAsPatient: p.guarantoraddresssameaspatient,
      address1: p.guarantoraddress1,
      city: p.guarantorcity,
      zip: p.guarantorzip,
      state: p.guarantorstate,
      countryCode: p.guarantorcountrycode,
      countryCode3166: p.guarantorcountrycode3166,
    },
  },
  employer: {
    id: p.employerid,
    phone: p.employerphone,
    city: p.employercity,
    state: p.employerstate,
    name: p.employername,
    address: p.employeraddress,
    zip: p.employerzip,
  },
  address: {
    city: p.city,
    address1: p.address1,
    countryCode: p.countrycode,
    countryCode3166: p.countrycode3166,
    state: p.state,
    zip: p.zip,
  },
});

export function formatEditPatientHealthRecordOptions(options: IAthenaEditPatient) {
  return {
    firstname: options.firstName,
    lastname: options.lastName,
    middlename: options.middleName,
    sex: options.gender,
    zip: String(options.zip),
    dob: options.dateOfBirth,

    suffix: options.suffix,
    preferredname: options.preferredName,
    race: options.race,
    ethnicitycode: options.ethnicityCode,
    status: options.status,
    ssn: options.ssn,
    homebound: options.homebound ? 'T' : 'F',
    language6392code: options.language6392code,
    maritalstatus: options.maritalStatus,

    email: options.email,
    homephone: options.homePhone,
    mobilephone: options.mobilePhone,
    consenttocall: options.consentToCall ? 'T' : 'F',
    consenttotext: options.consentToText ? 'T' : 'F',

    city: options.city,
    address1: options.address1,
    countrycode: options.countryCode,
    countrycode3166: options.countryCode3166,
    state: options.state,
  };
}
