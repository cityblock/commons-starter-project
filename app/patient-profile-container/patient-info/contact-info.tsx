import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ContactMethodOptions } from '../../graphql/types';
import { ISavedEmail } from '../../shared/email-modal/email-modal';
import FormLabel from '../../shared/library/form-label/form-label';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';
import { ISavedPhone } from '../../shared/phone-modal/phone-modal';
import * as styles from './css/patient-demographics.css';
import EmailInfo from './email-info/email-info';
import { IEditableFieldState } from './patient-info';
import PhoneInfo from './phone-info/phone-info';

export interface IContactInfo {
  preferredContactMethod?: ContactMethodOptions | null;
  canReceiveCalls?: boolean | null;
  hasEmail?: boolean | null;
  primaryEmail?: ISavedEmail | null;
  emails?: ISavedEmail[];
  primaryPhone?: ISavedPhone | null;
  phones?: ISavedPhone[];
}

interface IProps {
  contactInfo: IContactInfo;
  patientId: string;
  patientInfoId: string;
  onChange: (fields: IEditableFieldState) => void;
}

export default class ContactInfo extends React.Component<IProps> {
  state = { isModalVisible: false };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, value } = event.target;
    onChange({ [name]: value });
  };

  handleBooleanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { value, name } = event.target;
    const updatedValue = value === 'true';
    onChange({ [name]: updatedValue });
  };

  renderToggles() {
    const { canReceiveCalls, preferredContactMethod } = this.props.contactInfo;

    return (
      <div className={styles.subSection}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="contactInfo.canReceiveCalls" />
            <RadioGroup>
              <RadioInput
                name="canReceiveCalls"
                value="false"
                checked={canReceiveCalls === false}
                label="No"
                onChange={this.handleBooleanChange}
              />
              <RadioInput
                name="canReceiveCalls"
                value="true"
                checked={canReceiveCalls === true}
                label="Yes"
                onChange={this.handleBooleanChange}
              />
            </RadioGroup>
          </div>
        </div>

        <div className={styles.field}>
          <FormLabel messageId="contactInfo.preferredContactMethod" />
          <RadioGroup className={styles.capitalize}>
            <RadioInput
              name="preferredContactMethod"
              value={ContactMethodOptions.phone}
              checked={preferredContactMethod === ContactMethodOptions.phone}
              label={ContactMethodOptions.phone}
              onChange={this.handleChange}
            />
            <RadioInput
              name="preferredContactMethod"
              value={ContactMethodOptions.email}
              checked={preferredContactMethod === ContactMethodOptions.email}
              label={ContactMethodOptions.email}
              onChange={this.handleChange}
            />
            <RadioInput
              name="preferredContactMethod"
              value={ContactMethodOptions.text}
              checked={preferredContactMethod === ContactMethodOptions.text}
              label={ContactMethodOptions.text}
              onChange={this.handleChange}
            />
          </RadioGroup>
        </div>
      </div>
    );
  }

  render() {
    const { onChange, contactInfo, patientId, patientInfoId } = this.props;
    const { primaryEmail, primaryPhone, hasEmail } = contactInfo;

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
          className={styles.subSection}
        />
        <EmailInfo
          patientId={patientId}
          patientInfoId={patientInfoId}
          onChange={onChange}
          primaryEmail={primaryEmail}
          hasEmail={hasEmail}
          className={styles.subSection}
        />
        {this.renderToggles()}
      </div>
    );
  }
}
