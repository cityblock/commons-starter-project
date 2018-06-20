import React from 'react';
import { FullPatientExternalOrganization } from '../../../graphql/types';
import {
  formatAddressFirstLine,
  formatAddressSecondLine,
} from '../../../shared/helpers/format-helpers';
import TextInfo from '../../../shared/library/text-info/text-info';
import Text from '../../../shared/library/text/text';
import ConsentDisplayCard from '../consent-display-card';
import styles from '../css/team-member.css';

interface IProps {
  patientExternalOrganization: FullPatientExternalOrganization;
  onRemoveClick: (patientExternalOrganizationId: string) => void;
  onEditClick: (patientExternalOrganizationToEdit: FullPatientExternalOrganization) => void;
}

export const PatientExternalOrganization: React.StatelessComponent<IProps> = props => {
  const { patientExternalOrganization, onRemoveClick, onEditClick } = props;
  const { name, address, phoneNumber, faxNumber } = patientExternalOrganization;

  const addressHtml = address ? (
    <div className={styles.column}>
      <Text text={formatAddressFirstLine(address) || ''} color="black" size="medium" />
      <Text text={formatAddressSecondLine(address) || ''} color="black" size="medium" />
    </div>
  ) : (
    <Text
      messageId="patientTeam.noAddress"
      color="lightGray"
      size="medium"
      className={styles.column}
    />
  );

  return (
    <ConsentDisplayCard
      member={patientExternalOrganization}
      onRemoveClick={onRemoveClick}
      onEditClick={onEditClick}
    >
      <div className={styles.row}>
        <div className={styles.column}>
          <Text text={name} color="black" size="largest" isBold={true} />
        </div>

        <div className={styles.column}>
          <TextInfo
            messageId="patientExternalOrganization.phone"
            text={phoneNumber || 'Unknown'}
            messageColor="black"
            size="medium"
          />
          <TextInfo
            messageId="patientExternalOrganization.fax"
            text={faxNumber || 'Unknown'}
            messageColor="black"
            size="medium"
          />
        </div>

        {addressHtml}
      </div>
    </ConsentDisplayCard>
  );
};

export default PatientExternalOrganization;
