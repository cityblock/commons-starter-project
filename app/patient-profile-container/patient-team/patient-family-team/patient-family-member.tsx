import { Fragment } from 'react';
import React from 'react';
import { FullPatientContact } from '../../../graphql/types';
import {
  formatAddressFirstLine,
  formatAddressSecondLine,
  formatFullName,
  formatPhoneNumber,
} from '../../../shared/helpers/format-helpers';
import Text, { Color } from '../../../shared/library/text/text';
import ConsentDisplayCard from '../consent-display-card';
import styles from '../css/team-member.css';

interface IProps {
  patientContact: FullPatientContact;
  onRemoveClick: (patientContactId: string) => void;
  onEditClick: (patientContactToEdit: FullPatientContact) => void;
  onConsentClick: (patientContactToEdit: FullPatientContact) => void;
}

export const PatientFamilyMember: React.StatelessComponent<IProps> = props => {
  const { onRemoveClick, onEditClick, onConsentClick, patientContact } = props;
  const {
    isEmergencyContact,
    isHealthcareProxy,
    firstName,
    lastName,
    relationToPatient,
    relationFreeText,
    phone,
    email,
    address,
  } = patientContact;
  const emailAddress = email ? email.emailAddress : 'Unknown Email';
  const phoneNumber = phone ? formatPhoneNumber(phone.phoneNumber) : 'Unknown Phone';

  let roleMessageId;
  let color: Color | null = null;
  if (isEmergencyContact) {
    roleMessageId = 'patientContact.emergencyContact';
    color = 'red';
  } else if (isHealthcareProxy) {
    roleMessageId = 'patientContact.healthcareProxy';
    color = 'purple';
  }

  const contactRoleHtml =
    roleMessageId && color ? (
      <Fragment>
        <span className={styles.bullet}>&bull;</span>
        <Text messageId={roleMessageId} color={color} size="medium" />
      </Fragment>
    ) : null;

  const addressFirstLine = address ? formatAddressFirstLine(address) : null;
  const addressSecondLine = address ? formatAddressSecondLine(address) : null;

  const addressHtml =
    addressFirstLine || addressSecondLine ? (
      <div className={styles.column}>
        <Text text={addressFirstLine || 'Unknown Street'} color="black" size="medium" />
        <Text text={addressSecondLine || ''} color="black" size="medium" />
      </div>
    ) : (
      <div className={styles.column}>
        <Text text={'Unknown Address'} color="black" size="medium" />
      </div>
    );

  const relationHtml =
    relationToPatient === 'other' ? (
      <Text text={relationFreeText || ''} color="gray" size="medium" />
    ) : (
      <Text messageId={`relationToPatient.${relationToPatient}`} color="gray" size="medium" />
    );

  return (
    <ConsentDisplayCard
      member={patientContact}
      onRemoveClick={onRemoveClick}
      onEditClick={onEditClick}
      onConsentClick={onConsentClick}
    >
      <div className={styles.row}>
        <div className={styles.column}>
          <Text
            text={formatFullName(firstName, lastName)}
            color="black"
            size="largest"
            isBold={true}
          />
          <div className={styles.row}>
            {relationHtml}
            {contactRoleHtml}
          </div>
        </div>

        <div className={styles.column}>
          <Text text={phoneNumber} color="black" size="medium" />
          <Text text={emailAddress} color="black" size="medium" />
        </div>

        {addressHtml}
      </div>
    </ConsentDisplayCard>
  );
};

export default PatientFamilyMember;
