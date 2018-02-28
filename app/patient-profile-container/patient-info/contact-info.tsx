import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ISavedEmail } from '../../shared/email-modal/email-modal';
import { ISavedPhone } from '../../shared/phone-modal/phone-modal';
import * as styles from './css/patient-demographics.css';
import EmailInfo from './email-info/email-info';
import { IEditableFieldState } from './patient-info';
import PhoneInfo from './phone-info/phone-info';

export interface IContactInfo {
  patientId: string;
  patientInfoId: string;
  primaryEmail?: ISavedEmail | null;
  emails?: ISavedEmail[];
  primaryPhone?: ISavedPhone | null;
  phones?: ISavedPhone[];
}

interface IProps {
  contactInfo: IContactInfo;
  onChange: (fields: IEditableFieldState) => void;
}

export default class ContactInfo extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = { isModalVisible: false };
  }

  render() {
    const { onChange, contactInfo } = this.props;
    const { emails, primaryEmail, phones, primaryPhone, patientId, patientInfoId } = contactInfo;

    return (
      <div className={styles.section}>
        <FormattedMessage id="contactInfo.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <PhoneInfo
          patientId={patientId}
          patientInfoId={patientInfoId}
          onChange={onChange}
          primaryPhone={primaryPhone}
          phones={phones}
          className={styles.subSection}
        />
        <EmailInfo
          patientId={patientId}
          patientInfoId={patientInfoId}
          onChange={onChange}
          primaryEmail={primaryEmail}
          emails={emails}
          className={styles.subSection}
        />
      </div>
    );
  }
}
