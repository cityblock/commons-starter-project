import React from 'react';
import { FullPatientExternalProvider } from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import Text from '../../../shared/library/text/text';
import ConsentDisplayCard from '../consent-display-card';
import styles from '../css/team-member.css';

interface IProps {
  patientExternalProvider: FullPatientExternalProvider;
  onRemoveClick: (patientExternalProviderId: string) => void;
  onEditClick: (patientExternalProviderToEdit: FullPatientExternalProvider) => void;
}

export const PatientExternalProvider: React.StatelessComponent<IProps> = props => {
  const { onRemoveClick, onEditClick, patientExternalProvider } = props;
  const {
    firstName,
    lastName,
    role,
    roleFreeText,
    phone,
    email,
    patientExternalOrganization,
  } = patientExternalProvider;
  const emailAddress = email ? email.emailAddress : 'Unknown Email';
  const phoneNumber = phone ? phone.phoneNumber : 'Unknown Phone';

  const nameText =
    firstName || lastName ? formatFullName(firstName, lastName) : patientExternalOrganization.name;
  const agencyText = firstName || lastName ? patientExternalOrganization.name : null;

  const roleHtml =
    role === 'other' || role === 'otherMedicalSpecialist' ? (
      <Text text={roleFreeText || ''} color="gray" size="medium" />
    ) : (
      <Text messageId={`externalProviderRole.${role}`} color="gray" size="medium" />
    );

  return (
    <ConsentDisplayCard
      member={patientExternalOrganization}
      onRemoveClick={() => onRemoveClick(patientExternalProvider.id)}
      onEditClick={() => onEditClick(patientExternalProvider)}
    >
      <div className={styles.row}>
        <div className={styles.column}>
          <Text text={nameText} color="black" size="largest" isBold={true} />
          {roleHtml}
        </div>

        <div className={styles.column}>
          <Text text={phoneNumber} color="black" size="medium" />
          <Text text={emailAddress} color="black" size="medium" />
        </div>

        <Text text={agencyText || ''} color="black" size="medium" className={styles.column} />
      </div>
    </ConsentDisplayCard>
  );
};

export default PatientExternalProvider;
