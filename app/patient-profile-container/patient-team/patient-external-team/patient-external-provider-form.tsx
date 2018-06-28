import classNames from 'classnames';
import { reduce, values } from 'lodash';
import React from 'react';
import { FullPatientExternalOrganization, PhoneTypeOptions } from '../../../graphql/types';
import Button from '../../../shared/library/button/button';
import FormLabel from '../../../shared/library/form-label/form-label';
import styles from '../../../shared/library/form/css/form.css';
import Select from '../../../shared/library/select/select';
import TextInput from '../../../shared/library/text-input/text-input';
import ExternalProviderRoleSelect from './external-provider-role-select';

interface IProps {
  patientExternalOrganizations: FullPatientExternalOrganization[];
  emailAddress?: string | null;
  phoneNumber?: string | null;
  phoneType?: PhoneTypeOptions | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  roleFreeText?: string | null;
  patientExternalOrganizationId?: string | null;
  description?: string | null;
  onChange: (e?: any) => void;
  hasFieldError: { [key: string]: boolean };
}

interface IState {
  showDescriptionForm: boolean;
}

export class PatientExternalProviderForm extends React.Component<IProps, IState> {
  state = {
    showDescriptionForm: false,
  };

  handleAddDescriptionClick = () => {
    this.setState({ showDescriptionForm: true });
  };

  renderDescriptionSection() {
    const { onChange, description } = this.props;
    const { showDescriptionForm } = this.state;

    if (showDescriptionForm || description) {
      return (
        <div className={styles.field}>
          <FormLabel messageId="patientExternalProvider.note" />
          <TextInput name="description" value={description || ''} onChange={onChange} />
        </div>
      );
    }

    return (
      <Button
        className={styles.addButton}
        onClick={this.handleAddDescriptionClick}
        fullWidth={true}
        messageId="patientExternalProvider.addNote"
      />
    );
  }

  render() {
    const {
      onChange,
      emailAddress,
      phoneNumber,
      phoneType,
      firstName,
      lastName,
      role,
      roleFreeText,
      patientExternalOrganizationId,
      patientExternalOrganizations,
      hasFieldError,
    } = this.props;

    if (!patientExternalOrganizations || !patientExternalOrganizations.length) {
      return;
    }

    const isOtherRole = role === 'other' || role === 'otherMedicalSpecialist';
    const organizationOptions = reduce(
      patientExternalOrganizations,
      (result, value) => {
        result[value.id] = value.name;
        return result;
      },
      {} as any,
    );

    return (
      <div>
        <div className={styles.field}>
          <FormLabel messageId="patientExternalProvider.organization" className={styles.required} />
          <Select
            name="patientExternalOrganizationId"
            value={patientExternalOrganizationId || ''}
            onChange={onChange}
            large={true}
            errorMessageId="patientExternalProvider.fieldEmptyError"
            hasError={hasFieldError.patientExternalOrganizationId}
            optionsObject={organizationOptions}
            hasPlaceholder={true}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientExternalProvider.firstName" />
            <TextInput name="firstName" value={firstName || ''} onChange={onChange} />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientExternalProvider.lastName" />
            <TextInput name="lastName" value={lastName || ''} onChange={onChange} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientExternalProvider.role" className={styles.required} />
            <ExternalProviderRoleSelect
              value={role || ''}
              onChange={onChange}
              isLarge={true}
              errorMessageId="patientExternalProvider.fieldEmptyError"
              hasError={hasFieldError.role}
            />
          </div>

          <div className={classNames(styles.field, { [styles.invisible]: !isOtherRole })}>
            <FormLabel
              messageId="patientExternalProvider.roleFreeText"
              className={styles.required}
            />
            <TextInput
              name="roleFreeText"
              value={roleFreeText || ''}
              onChange={onChange}
              errorMessageId="patientExternalProvider.fieldEmptyError"
              hasError={hasFieldError.roleFreeText}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel
              messageId="patientExternalProvider.phoneNumber"
              className={styles.required}
            />
            <TextInput
              name="phoneNumber"
              value={phoneNumber || ''}
              onChange={onChange}
              required={true}
              errorMessageId="patientExternalProvider.fieldEmptyError"
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
          <FormLabel messageId="patientExternalProvider.emailAddress" />
          <TextInput name="emailAddress" value={emailAddress || ''} onChange={onChange} />
        </div>

        {this.renderDescriptionSection()}
      </div>
    );
  }
}

export default PatientExternalProviderForm;
