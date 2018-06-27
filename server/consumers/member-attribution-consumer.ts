import { toNumber } from 'lodash';
import { transaction, Transaction } from 'objection';
import { Gender } from 'schema';
import { IMemberAttributionMessageData } from '../handlers/pubsub/push-handler';
import Mattermost from '../mattermost';
import Clinic from '../models/clinic';
import Patient from '../models/patient';

export async function processNewMemberAttributionMessage(
  data: IMemberAttributionMessageData,
  existingTxn?: Transaction,
) {
  // Note: existingTxn is only for use in tests
  const {
    patientId,
    cityblockId,
    gender,
    firstName,
    middleName,
    lastName,
    ssn,
    dob,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    email,
    phone,
    language,
    nmi,
    externalIds,
    productDescription,
    lineOfBusiness,
    medicaidPremiumGroup,
    pcpName,
    pcpPractice,
    pcpPhone,
    pcpAddress,
    memberId,
    insurance,
    inNetwork,
  } = data;

  if (!patientId || !cityblockId || !firstName || !lastName || !dob) {
    return Promise.reject('Missing either patientId, cityblockId, firstName, lastName, or dob');
  }

  await transaction(existingTxn || Patient.knex(), async txn => {
    const patient = await Patient.getById(patientId, txn);
    const homeClinic = await Clinic.findOrCreateAttributionClinic(txn);
    const ssnEnd = ssn ? ssn.slice(5, 9) : null;
    const mrn =
      externalIds && externalIds.acpny && externalIds.acpny.length
        ? externalIds.acpny[0].externalId
        : null;

    // If a patient exists, update it
    if (patient) {
      return Patient.updateFromAttribution(
        {
          patientId,
          firstName,
          middleName,
          lastName,
          dateOfBirth: dob,
          ssn,
          ssnEnd,
          nmi,
          mrn,
          productDescription,
          lineOfBusiness,
          medicaidPremiumGroup,
          pcpName,
          pcpPractice,
          pcpPhone,
          pcpAddress,
          memberId,
          insurance,
          inNetwork,
        },
        txn,
      );
      // else, create a new one
    } else {
      let formattedGender: Gender | null = null;

      if (gender === 'M') {
        formattedGender = 'male' as Gender;
      } else if (gender === 'F') {
        formattedGender = 'female' as Gender;
      }

      const newPatient = await Patient.create(
        {
          patientId,
          cityblockId: toNumber(cityblockId), // Everything is a string in Redis land
          firstName,
          middleName,
          lastName,
          homeClinicId: homeClinic.id,
          dateOfBirth: dob,
          ssn,
          ssnEnd,
          gender: formattedGender,
          language,
          addressLine1,
          addressLine2,
          city,
          state,
          zip,
          email,
          phone,
          nmi,
          mrn,
          productDescription,
          lineOfBusiness,
          medicaidPremiumGroup,
          pcpName,
          pcpPractice,
          pcpPhone,
          pcpAddress,
          memberId,
          insurance,
          inNetwork,
        },
        txn,
      );
      // and create associated patient channel in mattermost
      const mattermost = Mattermost.get();
      return mattermost.createChannelForPatient(newPatient);
    }
  });
}
