import classNames from 'classnames';
import { values } from 'lodash';
import React from 'react';
import { AddressInput, PatientRelationOptions, PhoneTypeOptions } from '../../graphql/types';
import AddressForm from '../address-modal/address-form';
import Button from '../library/button/button';
import FormLabel from '../library/form-label/form-label';
import styles from '../library/form/css/form.css';
import RadioGroup from '../library/radio-group/radio-group';
import RadioInput from '../library/radio-input/radio-input';
import Select from '../library/select/select';
import TextInput from '../library/text-input/text-input';

interface IProps {
  emailAddress?: string | null;
  phoneNumber?: string | null;
  phoneType?: PhoneTypeOptions | null;
  address?: AddressInput | null;
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  relationFreeText?: string | null;
  description?: string | null;
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
  state = {
    showAddressForm: false,
    showDescriptionForm: false,
  };

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
      phoneType,
      firstName,
      lastName,
      relationToPatient,
      relationFreeText,
      hasFieldError,
      isEmergencyContact,
    } = this.props;

    const isOtherRelation = relationToPatient === 'other';

    return (
      <div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientContact.firstName" className={styles.required} />
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
            <FormLabel messageId="patientContact.lastName" className={styles.required} />
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
            <FormLabel messageId="patientContact.phoneNumber" className={styles.required} />
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
            <FormLabel messageId="phone.type" className={styles.required} />
            <Select
              name="phoneType"
              value={phoneType || ''}
              prefix="phone"
              onChange={onChange}
              options={values(PhoneTypeOptions)}
              large={true}
              errorMessageId="patientContact.fieldEmptyError"
              hasError={hasFieldError.phoneType}
              hasPlaceholder={true}
            />
          </div>
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientContact.emailAddress" />
          <TextInput name="emailAddress" value={emailAddress || ''} onChange={onChange} />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientContact.relationToPatient" className={styles.required} />
            <Select
              name="relationToPatient"
              value={relationToPatient || ''}
              hasPlaceholder={true}
              onChange={onChange}
              required={true}
              errorMessageId="patientContact.fieldEmptyError"
              hasError={hasFieldError.relationToPatient}
              options={values(PatientRelationOptions)}
              large={true}
            />
          </div>

          <div className={classNames(styles.field, { [styles.invisible]: !isOtherRelation })}>
            <FormLabel messageId="patientContact.relationFreeText" className={styles.required} />
            <TextInput
              name="relationFreeText"
              value={relationFreeText || ''}
              onChange={onChange}
              required={true}
              errorMessageId="patientContact.fieldEmptyError"
              hasError={hasFieldError.relationFreeText}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
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

        {this.renderAddressSection()}
        {this.renderDescriptionSection()}
      </div>
    );
  }
}

export default PatientFamilyMemberForm;
