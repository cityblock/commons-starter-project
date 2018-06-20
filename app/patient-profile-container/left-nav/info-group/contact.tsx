import { capitalize } from 'lodash';
import React from 'react';
import { FullPatientForProfile } from '../../../graphql/types';
import {
  formatAddressFirstLine,
  formatAddressSecondLine,
} from '../../../shared/helpers/format-helpers';
import { Accordion } from '../left-nav';
import InfoGroupContainer from './container';
import styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

interface IProps {
  isOpen: boolean;
  onClick: (clicked: Accordion) => void;
  patient: FullPatientForProfile;
}

const Contact: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isOpen, onClick, patient } = props;
  const {
    primaryPhone,
    primaryEmail,
    preferredContactMethod,
    preferredContactTime,
    primaryAddress,
  } = patient.patientInfo;

  const formattedPhone = primaryPhone ? primaryPhone.phoneNumber : null;
  const formattedEmail = primaryEmail ? primaryEmail.emailAddress : null;
  const formattedPreferredMethod = preferredContactMethod
    ? capitalize(preferredContactMethod)
    : null;
  const formattedPreferredTime = preferredContactTime ? capitalize(preferredContactTime) : null;
  const formattedAddressLine1 = primaryAddress ? formatAddressFirstLine(primaryAddress) : null;
  const formattedAddressLine2 = primaryAddress ? formatAddressSecondLine(primaryAddress) : null;

  return (
    <div className={styles.container}>
      <InfoGroupHeader selected="contact" isOpen={isOpen} onClick={onClick} />
      <InfoGroupContainer isOpen={isOpen}>
        <InfoGroupItem
          labelMessageId="contact.phone"
          value={formattedPhone}
          emptyValueMessageId="patientInfo.notOnFile"
        />
        <InfoGroupItem
          labelMessageId="contact.email"
          value={formattedEmail}
          emptyValueMessageId="patientInfo.notOnFile"
        />
        <InfoGroupItem labelMessageId="contact.preferredMethod" value={formattedPreferredMethod} />
        <InfoGroupItem labelMessageId="contact.preferredTime" value={formattedPreferredTime} />
        <InfoGroupItem
          labelMessageId="contact.address"
          value={formattedAddressLine1}
          emptyValueMessageId="patientInfo.notOnFile"
        />
        {formattedAddressLine2 && (
          <InfoGroupItem
            labelMessageId={null}
            value={formattedAddressLine2}
            emptyValueMessageId="patientInfo.notOnFile"
          />
        )}
      </InfoGroupContainer>
    </div>
  );
};

export default Contact;
