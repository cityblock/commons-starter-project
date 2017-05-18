/**
 * This module maps from Athena's property naming to consistent camelCase.
 */
import { IPatient, IPatientMedication, IPatientMedications } from 'schema';
import Patient from '../../models/patient';
import {
  IPatientInfoAthena,
  IPatientMedicationsResponse,
  IPatientMedicationEvent,
  IPatientMedicationResource,
} from './types';

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

export function formatPatientMedications(
  medicationsResponse: IPatientMedicationsResponse,
): IPatientMedications {
  if (medicationsResponse.nomedicationsreported) {
    return {
      medications: {
        active: [],
        inactive: [],
      },
    };
  } else {
    const active: IPatientMedication[] = [];
    const inactive: IPatientMedication[] = [];
    const medications = medicationsResponse.medications;

    for (const medicationHistory of medications) {
      const sortedResources = medicationHistory.sort(sortMedicationResources);
      const currentResource = sortedResources[0];
      const sortedEvents = currentResource.events
        .sort(sortMedicationEvents)
        .map(event => ({ date: event.eventdate, event: event.type }));

      const medication = {
        name: currentResource.medication,
        medicationId: currentResource.medicationid,
        quantity: currentResource.quantity,
        quantityUnit: currentResource.quantityunit,
        refillsAllowed: currentResource.refillsallowed,
        renewable: currentResource.issafetorenew,
        dosageInstructions: currentResource.unstructuredsig,
        source: currentResource.source,
        status: sortedEvents[0].event,
        lastUpdated: sortedEvents[0].date,
        history: {
          events: sortedEvents,
        },
      };

      if (medication.status === 'END' || medication.status === 'HIDE') {
        inactive.push(medication);
      } else {
        active.push(medication);
      }
    }

    return {
      medications: {
        active: active.sort(sortMedicationEvents),
        inactive: inactive.sort(sortMedicationEvents),
      },
    };
  }
}

function sortMedicationResources(
  resourceA: IPatientMedicationResource,
  resourceB: IPatientMedicationResource,
): number {
  const resourceASortedEvents = resourceA.events.sort(sortMedicationEvents);
  const resourceBSortedEvents = resourceB.events.sort(sortMedicationEvents);

  const resourceALatestEventDate = new Date(resourceASortedEvents[0].eventdate);
  const resourceBLatestEventDate = new Date(resourceBSortedEvents[0].eventdate);

  return reverseCompareDates(resourceALatestEventDate, resourceBLatestEventDate);
}

function sortMedicationEvents(
  eventA: IPatientMedicationEvent & IPatientMedication,
  eventB: IPatientMedicationEvent & IPatientMedication,
): number {
  const eventADate = new Date(eventA.eventdate || eventA.lastUpdated);
  const eventBDate = new Date(eventB.eventdate || eventB.lastUpdated);
  const dateComparison = reverseCompareDates(eventADate, eventBDate);

  if (dateComparison !== 0) {
    return dateComparison;
  } else {
    const comparableAType = eventA.type || eventA.status;
    const comparableBType = eventB.type || eventB.status;

    return reverseCompareMedicationEventTypes(comparableAType, comparableBType);
  }
}

function reverseCompareDates(dateA: Date, dateB: Date): number {
  if (dateA > dateB) {
    return -1;
  } else if (dateA < dateB) {
    return 1;
  } else {
    return 0;
  }
}

function reverseCompareMedicationEventTypes(typeA: string, typeB: string): number {
  const typeHierarchy = ['ENTER', 'ORDER', 'START', 'FILL', 'END', 'HIDE'];
  const typeAIndex = typeHierarchy.indexOf(typeA);
  const typeBIndex = typeHierarchy.indexOf(typeB);

  if (typeAIndex > typeBIndex) {
    return -1;
  } else if (typeAIndex < typeBIndex) {
    return 1;
  } else {
    return 0;
  }
}
