/**
 * This module maps from Athena's property naming to consistent camelCase.
 */
import { IPatient } from 'schema';
import Patient from '../../models/patient';
import { IPatientInfoAthena } from './types';

// Note: This drops some fields
export const formatPatient = (p: IPatientInfoAthena, patient: Patient): IPatient => ({
  id: patient.id,
  athenaPatientId: Number(p.patientid),
  firstName: p.firstname,
  lastName: p.lastname,
  homeClinicId: patient.homeClinicId,
  suffix: p.suffix,
  preferredName: p.preferredname,
  raceName: p.racename,
  dob: p.dob,
  sex: p.sex,
  race: p.race,
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
    DOB: p.guarantordob,
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
  povertyLevel: {
    povertyLevelIncomeDeclined: p.povertylevelincomedeclined,
    povertyLevelIncomeRangeDeclined: p.povertylevelincomerangedeclined,
    povertyLevelFamilySizeDeclined: p.povertylevelfamilysizedeclined,
  },
  /*
  // unused contact preferences
  contactPreferences: {
    contactHomePhone: p.contacthomephone,
    contactRelationship: p.contactrelationship,

    appointmentEmail: p.contactpreference_appointment_email,
    appointmentSms: p.contactpreference_appointment_sms,
    billingPhone: p.contactpreference_billing_phone,
    announcementPhone: p.contactpreference_appointment_phone,
    contactPreference: p.contactpreference,
    labEmail: p.contactpreference_lab_email,
    announcementSms: p.contactpreference_announcement_sms,
    billingEmail: p.contactpreference_billing_email,
    announcementEmail: p.contactpreference_announcement_email,
    labPhone: p.contactpreference_lab_phone,
    labSms: p.contactpreference_lab_sms,
    appointmentPhone: p.contactpreference_appointment_phone,
    billingSms: p.contactpreference_billing_sms,
  },

  // unused athena preferences. not 100% sure this is the right place for all of these fields
  athena: {
    firstAppointment: p.firstappointment,
    lastAppointment: p.lastappointment,
    primaryProviderId: p.primaryproviderid,
    primaryDepartmentId: p.primarydepartmentid,
    departmentId: p.departmentid,
    referralSourceId: p.referralsourceid,
    registrationDate: p.registrationdate,
    careSummaryDeliveryPreference: p.caresummarydeliverypreference,
    onlineStatementOnly: p.onlinestatementonly,
    portalTermsOnFile: p.portaltermsonfile,
    portalAccessGiven: p.portalaccessgiven,
    defaultPharmacyNcpdpid: p.defaultpharmacyncpdpid,
    privacyInformationVerified: p.privacyinformationverified,
  },
  */
});
