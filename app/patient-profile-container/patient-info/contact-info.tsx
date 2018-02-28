import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ISavedEmail } from '../../shared/email-modal/email-modal';
import * as styles from './css/patient-demographics.css';
import EmailInfo from './email-info/email-info';
import { IEditableFieldState } from './patient-info';

export interface IContactInfo {
  patientId: string;
  patientInfoId: string;
  primaryEmail?: ISavedEmail | null;
  emails?: ISavedEmail[];
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
    const { emails, primaryEmail, patientId, patientInfoId } = contactInfo;

    return (
      <div className={styles.section}>
        <FormattedMessage id="contactInfo.sectionTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <EmailInfo
          patientId={patientId}
          patientInfoId={patientInfoId}
          onChange={onChange}
          primaryEmail={primaryEmail}
          emails={emails}
        />
      </div>
    );
  }
}
