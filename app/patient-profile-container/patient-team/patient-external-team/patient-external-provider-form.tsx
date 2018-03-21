import * as classNames from 'classnames';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import FormLabel from '../../../shared/library/form-label/form-label';
import * as styles from '../../../shared/library/form/css/form.css';
import TextInput from '../../../shared/library/text-input/text-input';
import ExternalProviderRoleSelect from './external-provider-role-select';

interface IProps {
  emailAddress?: string | null;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  roleFreeText?: string | null;
  agencyName?: string | null;
  description?: string | null;
  onChange: (e?: any) => void;
  hasFieldError: { [key: string]: boolean };
}

interface IState {
  showDescriptionForm: boolean;
}

export class PatientFamilyMemberForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showDescriptionForm: false,
    };
  }

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
      firstName,
      lastName,
      role,
      roleFreeText,
      agencyName,
      hasFieldError,
    } = this.props;

    const isOtherRole = role === 'other' || role === 'otherMedicalSpecialist';

    return (
      <div>
        <div className={styles.field}>
          <FormLabel messageId="patientExternalProvider.agencyName" />
          <TextInput
            name="agencyName"
            value={agencyName || ''}
            onChange={onChange}
            required={true}
            errorMessageId="patientExternalProvider.fieldEmptyError"
            hasError={hasFieldError.agencyName}
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
            <FormLabel messageId="patientExternalProvider.role" />
            <ExternalProviderRoleSelect
              value={role || ''}
              onChange={onChange}
              isLarge={true}
              errorMessageId="patientExternalProvider.fieldEmptyError"
              hasError={hasFieldError.role}
            />
          </div>

          <div className={classNames(styles.field, { [styles.hidden]: !isOtherRole })}>
            <FormLabel messageId="patientExternalProvider.roleFreeText" />
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
            <FormLabel messageId="patientExternalProvider.phoneNumber" />
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
            <FormLabel messageId="patientExternalProvider.emailAddress" />
            <TextInput name="emailAddress" value={emailAddress || ''} onChange={onChange} />
          </div>
        </div>

        {this.renderDescriptionSection()}
      </div>
    );
  }
}

export default PatientFamilyMemberForm;
