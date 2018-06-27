import { isNil, omitBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import {
  ContactMethodOptions,
  ContactTimeOptions,
  Gender,
  MaritalStatus,
  Transgender,
} from 'schema';
import { PhoneTypeOptions } from 'schema';
import uuid from 'uuid/v4';
import { formatPhoneNumberForTwilio, VALID_PHONE_NUMBER_LENGTH } from '../helpers/twilio-helpers';
import Address from './address';
import ComputedPatientStatus from './computed-patient-status';
import Email from './email';
import Patient from './patient';
import PatientAddress from './patient-address';
import PatientEmail from './patient-email';
import PatientPhone from './patient-phone';
import Phone from './phone';

const EAGER_QUERY = `[
  primaryAddress,
  primaryEmail,
  primaryPhone,
]`;

export interface IInitialPatientInfoOptions {
  patientId: string;
  updatedById: string;
  gender?: Gender;
  language?: string | null;
  maritalStatus?: MaritalStatus;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  email: string | null;
  phone: string;
}

export interface IPatientInfoOptions {
  patientId: string;
  updatedById: string;
  preferredName?: string;
  gender?: Gender;
  genderFreeText?: string;
  transgender?: Transgender;
  maritalStatus?: MaritalStatus;
  language?: string;
  isMarginallyHoused?: boolean;
  primaryAddressId?: string;
  hasEmail?: boolean;
  primaryEmailId?: string;
  primaryPhoneId?: string;
  preferredContactMethod?: ContactMethodOptions;
  preferredContactTime?: ContactTimeOptions;
  canReceiveCalls?: boolean;
  hasHealthcareProxy?: boolean;
  hasMolst?: boolean;
  hasDeclinedPhotoUpload?: boolean;
  needToKnow?: string;
  isWhite?: boolean;
  isBlack?: boolean;
  isAmericanIndianAlaskan?: boolean;
  isAsian?: boolean;
  isHawaiianPacific?: boolean;
  isOtherRace?: boolean;
  isHispanic?: boolean;
  raceFreeText?: string;
}

interface IEditPatientInfo {
  updatedById: string;
  preferredName?: string;
  gender?: Gender;
  genderFreeText?: string;
  transgender?: Transgender;
  maritalStatus?: MaritalStatus;
  language?: string;
  isMarginallyHoused?: boolean;
  primaryAddressId?: string | null;
  hasEmail?: boolean;
  primaryEmailId?: string | null;
  primaryPhoneId?: string | null;
  preferredContactMethod?: ContactMethodOptions;
  preferredContactTime?: ContactTimeOptions;
  canReceiveCalls?: boolean;
  hasHealthcareProxy?: boolean;
  hasMolst?: boolean;
  hasDeclinedPhotoUpload?: boolean;
  hasUploadedPhoto?: boolean;
  needToKnow?: string;
  googleCalendarId?: string;
  isWhite?: boolean;
  isBlack?: boolean;
  isAmericanIndianAlaskan?: boolean;
  isAsian?: boolean;
  isHawaiianPacific?: boolean;
  isOtherRace?: boolean;
  isHispanic?: boolean;
  raceFreeText?: string;
}

/* tslint:disable:member-ordering */
export default class PatientInfo extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  patientId!: string;
  patient!: Patient;
  preferredName!: string;
  gender!: Gender;
  genderFreeText!: string;
  transgender!: Transgender;
  maritalStatus!: MaritalStatus;
  language!: string;
  isMarginallyHoused!: boolean;
  primaryAddressId!: string | null;
  primaryAddress!: Address;
  hasEmail!: boolean;
  primaryEmailId!: string | null;
  primaryEmail!: Email;
  primaryPhoneId!: string | null;
  primaryPhone!: Phone;
  preferredContactMethod!: ContactMethodOptions;
  preferredContactTime!: ContactTimeOptions | null;
  canReceiveCalls!: boolean;
  hasHealthcareProxy!: boolean;
  hasMolst!: boolean;
  hasDeclinedPhotoUpload!: boolean;
  hasUploadedPhoto!: boolean;
  needToKnow!: string | null;
  googleCalendarId!: string;
  createdAt!: string;
  updatedAt!: string;
  isWhite!: boolean;
  isBlack!: boolean;
  isAmericanIndianAlaskan!: boolean;
  isAsian!: boolean;
  isHawaiianPacific!: boolean;
  isOtherRace!: boolean;
  isHispanic!: boolean;
  raceFreeText!: string;

  $beforeInsert() {
    this.id = uuid();
    // NOTE: We are NOT setting updatedAt on insert. This is so we can know when first updated.
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'patient_info';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      preferredName: { type: 'string' },
      language: { type: 'string' },
      gender: { type: 'string', enum: ['male', 'female', 'nonbinary', 'selfDescribed', 'pass'] },
      genderFreeText: { type: ['string', 'null'] },
      transgender: { type: 'string', enum: ['yes', 'no', 'pass'] },
      maritalStatus: {
        type: 'string',
        enum: ['currentlyMarried', 'widowed', 'divorced', 'separated', 'neverMarried'],
      },
      isMarginallyHoused: { type: 'boolean' },
      primaryAddressId: { type: ['string', 'null'], format: 'uuid' },
      hasEmail: { type: 'boolean' },
      primaryEmailId: { type: ['string', 'null'], format: 'uuid' },
      primaryPhoneId: { type: ['string', 'null'], format: 'uuid' },
      preferredContactMethod: { type: 'string', enum: ['text', 'phone', 'email'] },
      preferredContactTime: { type: 'string', enum: ['morning', 'afternoon', 'evening'] },
      canReceiveCalls: { type: 'boolean' },
      hasHealthcareProxy: { type: 'boolean' },
      hasMolst: { type: 'boolean' },
      hasDeclinedPhotoUpload: { type: 'boolean' },
      hasUploadedPhoto: { type: 'boolean' },
      needToKnow: { type: 'text' },
      isWhite: { type: 'boolean' },
      isBlack: { type: 'boolean' },
      isAmericanIndianAlaskan: { type: 'boolean' },
      isAsian: { type: 'boolean' },
      isHawaiianPacific: { type: 'boolean' },
      isOtherRace: { type: 'boolean' },
      isHispanic: { type: 'boolean' },
      raceFreeText: { type: ['string', 'null'] },
      googleCalendarId: { type: 'string' },
      updatedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'updatedById'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_info.patientId',
          to: 'patient.id',
        },
      },

      primaryAddress: {
        relation: Model.BelongsToOneRelation,
        modelClass: Address,
        join: {
          from: 'address.id',
          to: 'patient_info.primaryAddressId',
        },
      },

      primaryEmail: {
        relation: Model.BelongsToOneRelation,
        modelClass: Email,
        join: {
          from: 'email.id',
          to: 'patient_info.primaryEmailId',
        },
      },

      primaryPhone: {
        relation: Model.BelongsToOneRelation,
        modelClass: Phone,
        join: {
          from: 'phone.id',
          to: 'patient_info.primaryPhoneId',
        },
      },
    };
  }

  static async get(patientInfoId: string, txn: Transaction): Promise<PatientInfo> {
    const patientInfo = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientInfoId);

    if (!patientInfo) {
      return Promise.reject(`No such patient info: ${patientInfoId}`);
    }
    return patientInfo;
  }

  static async createInitialPatientInfo(input: IInitialPatientInfoOptions, txn: Transaction) {
    let primaryAddressId: string | null = null;
    let primaryPhoneId: string | null = null;
    let primaryEmailId: string | null = null;
    const formattedPhoneNumber = formatPhoneNumberForTwilio(input.phone);

    if (!primaryAddressId) {
      const address = await Address.create(
        {
          updatedById: input.updatedById,
          zip: input.zip,
          street1: input.addressLine1,
          street2: input.addressLine2,
          city: input.city,
          state: input.state,
        },
        txn,
      );
      primaryAddressId = address.id;

      await PatientAddress.create({ addressId: primaryAddressId, patientId: input.patientId }, txn);
    }

    if (!primaryPhoneId && formattedPhoneNumber.length === VALID_PHONE_NUMBER_LENGTH) {
      const existingPatientIdWithPhone = await PatientPhone.getPatientIdForPhoneNumber(
        formattedPhoneNumber,
        txn,
      );

      if (!existingPatientIdWithPhone) {
        const phone = await Phone.create(
          {
            phoneNumber: formattedPhoneNumber,
            type: 'other' as PhoneTypeOptions,
          },
          txn,
        );
        primaryPhoneId = phone.id;

        await PatientPhone.create({ phoneId: primaryPhoneId, patientId: input.patientId }, txn);
      }
    }

    if (!primaryEmailId && input.email && input.email.length > 1) {
      const email = await Email.create(
        {
          updatedById: input.updatedById,
          emailAddress: input.email,
        },
        txn,
      );
      primaryEmailId = email.id;

      await PatientEmail.create({ emailId: primaryEmailId, patientId: input.patientId }, txn);
    }

    const filteredInput = omitBy(
      {
        patientId: input.patientId,
        updatedById: input.updatedById,
        gender: input.gender,
        language: input.language,
        maritalStatus: input.maritalStatus,
        primaryAddressId,
        primaryPhoneId,
        primaryEmailId,
      },
      isNil,
    );

    return this.query(txn).insertAndFetch(filteredInput as any);
  }

  static async edit(
    patientInfo: IEditPatientInfo,
    patientInfoId: string,
    txn: Transaction,
  ): Promise<PatientInfo> {
    const updatedPatientInfo = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientInfoId, patientInfo);

    await ComputedPatientStatus.updateForPatient(
      updatedPatientInfo.patientId,
      patientInfo.updatedById,
      txn,
    );

    return updatedPatientInfo;
  }
}
/* tslint:enable:member-ordering */
