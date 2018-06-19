import React from 'react';
import AddressForm from '../../../shared/address-modal/address-form';
import Button from '../../../shared/library/button/button';
import FormLabel from '../../../shared/library/form-label/form-label';
import styles from '../../../shared/library/form/css/form.css';
import TextInput from '../../../shared/library/text-input/text-input';

interface IProps {
  name?: string | null;
  description?: string | null;
  phoneNumber?: string | null;
  faxNumber?: string | null;
  zip?: string | null;
  street1?: string | null;
  street2?: string | null;
  state?: string | null;
  city?: string | null;
  onChange: (e?: any) => void;
  hasFieldError: { [key: string]: boolean };
}

interface IState {
  showDescriptionForm: boolean;
}

export class PatientExternalOrganizationForm extends React.Component<IProps, IState> {
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
          <FormLabel messageId="patientExternalOrganization.note" />
          <TextInput name="description" value={description || ''} onChange={onChange} />
        </div>
      );
    }

    return (
      <Button
        className={styles.addButton}
        onClick={this.handleAddDescriptionClick}
        fullWidth={true}
        messageId="patientExternalOrganization.addNote"
      />
    );
  }

  render() {
    const {
      onChange,
      name,
      phoneNumber,
      faxNumber,
      zip,
      street1,
      street2,
      state,
      city,
      hasFieldError,
    } = this.props;

    return (
      <div>
        <div className={styles.field}>
          <FormLabel messageId="patientExternalOrganization.name" className={styles.required} />
          <TextInput
            name="name"
            value={name || ''}
            onChange={onChange}
            errorMessageId="patientExternalOrganization.fieldEmptyError"
            hasError={hasFieldError.name}
          />
        </div>

        <AddressForm
          street1={street1}
          street2={street2}
          state={state}
          city={city}
          zip={zip}
          onChange={onChange}
          hideDescription={true}
        />

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientExternalOrganization.phoneNumber" />
            <TextInput name="phoneNumber" value={phoneNumber || ''} onChange={onChange} />
          </div>

          <div className={styles.field}>
            <FormLabel messageId="patientExternalOrganization.faxNumber" />
            <TextInput name="faxNumber" value={faxNumber || ''} onChange={onChange} />
          </div>
        </div>

        {this.renderDescriptionSection()}
      </div>
    );
  }
}

export default PatientExternalOrganizationForm;
