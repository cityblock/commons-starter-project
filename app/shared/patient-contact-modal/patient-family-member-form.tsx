import * as React from 'react';
import { AddressInput } from '../../graphql/types';
import AddressForm from '../address-modal/address-form';
import Button from '../library/button/button';
import FormLabel from '../library/form-label/form-label';
import * as styles from '../library/form/css/form.css';
import RadioGroup from '../library/radio-group/radio-group';
import RadioInput from '../library/radio-input/radio-input';
import TextInput from '../library/text-input/text-input';

interface IProps {
  emailAddress?: string | null;
  phoneNumber?: string | null;
  address?: AddressInput | null;
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  description?: string | null;
  canContact?: boolean | null;
  isEmergencyContact?: boolean | null;
  onChange: (e?: any) => void;
  onAddresssChange: (e?: any) => void;
  onRadioChange: (e?: any) => void;
  hasFieldError: { [key: string]: boolean };
}

interface IState {
  showAddressForm: boolean;
  showDescriptionForm: boolean;
}

export class PatientFamilyMemberForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showAddressForm: false,
      showDescriptionForm: false,
    };
  }

  handleAddAddressClick = () => {
    this.setState({ showAddressForm: true });
  };

  handleAddDescriptionClick = () => {
    this.setState({ showDescriptionForm: true });
  };

  renderAddressSection() {
    const { onAddresssChange } = this.props;
    const { showAddressForm } = this.state;
    const address = this.props.address || {};
    const { street1, street2, state, city, zip } = address;

    if (showAddressForm || street1 || street2 || state || city || zip) {
      return (
        <AddressForm
          street1={street1}
          street2={street2}
          zip={zip}
          city={city}
          state={state}
          onChange={onAddresssChange}
          hideDescription={true}
        />
      );
    }

    return (
      <Button
        className={styles.addButton}
        onClick={this.handleAddAddressClick}
        fullWidth={true}
        messageId="patientContact.addAddress"
      />
    );
  }

  renderDescriptionSection() {
    const { onChange, description } = this.props;
    const { showDescriptionForm } = this.state;

    if (showDescriptionForm || description) {
      return (
        <div className={styles.field}>
          <FormLabel messageId="patientContact.note" />
          <TextInput name="description" value={description || ''} onChange={onChange} />
        </div>
      );
    }

    return (
      <Button
        className={styles.addButton}
        onClick={this.handleAddDescriptionClick}
        fullWidth={true}
        messageId="patientContact.addNote"
      />
    );
  }

  render() {
    const {
      onChange,
      onRadioChange,
      emailAddress,
      phoneNumber,
      firstName,
      lastName,
      relationToPatient,
      hasFieldError,
      isEmergencyContact,
      canContact,
    } = this.props;

    return (
      <div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientContact.firstName" />
            <TextInput
              name="firstName"
              value={firstName || ''}
              onChange={onChange}
              required={true}
              errorMessageId="patientContact.fieldEmptyError"
              hasError={hasFieldError.firstName}
            />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientContact.lastName" />
            <TextInput
              name="lastName"
              value={lastName || ''}
              onChange={onChange}
              required={true}
              errorMessageId="patientContact.fieldEmptyError"
              hasError={hasFieldError.lastName}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientContact.phoneNumber" />
            <TextInput
              name="phoneNumber"
              value={phoneNumber || ''}
              onChange={onChange}
              required={true}
              errorMessageId="patientContact.fieldEmptyError"
              hasError={hasFieldError.phoneNumber}
            />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientContact.emailAddress" />
            <TextInput name="emailAddress" value={emailAddress || ''} onChange={onChange} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientContact.relationToPatient" />
            <TextInput
              name="relationToPatient"
              value={relationToPatient || ''}
              onChange={onChange}
              required={true}
              errorMessageId="patientContact.fieldEmptyError"
              hasError={hasFieldError.relationToPatient}
            />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientContact.isEmergencyContact" />
            <RadioGroup>
              <RadioInput
                name="isEmergencyContact"
                value="false"
                checked={!isEmergencyContact}
                label="No"
                onChange={onRadioChange}
              />
              <RadioInput
                name="isEmergencyContact"
                value="true"
                checked={!!isEmergencyContact}
                label="Yes"
                onChange={onRadioChange}
              />
            </RadioGroup>
          </div>
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientContact.canContact" />
          <RadioGroup>
            <RadioInput
              name="canContact"
              value="false"
              checked={!canContact}
              label="No"
              onChange={onRadioChange}
            />
            <RadioInput
              name="canContact"
              value="true"
              checked={!!canContact}
              label="Yes"
              onChange={onRadioChange}
            />
          </RadioGroup>
        </div>

        {this.renderAddressSection()}
        {this.renderDescriptionSection()}
      </div>
    );
  }
}

export default PatientFamilyMemberForm;
