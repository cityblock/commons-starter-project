import { ApolloError } from 'apollo-client';
import { get, isNil } from 'lodash';
import React from 'react';
import {
  EmailInput,
  ExternalProviderOptions,
  PhoneCreateInput,
  PhoneTypeOptions,
} from '../../../graphql/types';
import Modal from '../../../shared/library/modal/modal';
import PatientExternalProviderForm from './patient-external-provider-form';

export interface IPatientExternalProvider {
  firstName?: string | null;
  lastName?: string | null;
  role: ExternalProviderOptions;
  roleFreeText?: string | null;
  agencyName: string;
  phone: PhoneCreateInput;
  email?: EmailInput | null;
  description?: string | null;
}

interface IProps {
  saveExternalProvider: (
    patientExternalProvider: IPatientExternalProvider,
  ) => Promise<{ data: any; errors?: ApolloError[] }>;
  closePopup: () => void;
  isVisible: boolean;
  patientExternalProvider?: IPatientExternalProvider | null;
  titleMessageId?: string;
  subTitleMessageId?: string;
}

interface IEditableFieldState {
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  roleFreeText?: string | null;
  agencyName?: string | null;
  description?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  phoneType?: PhoneTypeOptions | null;
}

interface IState {
  saveError?: string | null;
  hasFieldError?: { [key: string]: boolean };
}

type allState = IState & IEditableFieldState;

const REQUIRED_FIELDS = ['role', 'agencyName', 'phoneNumber', 'phoneType'];

class PatientExternalProviderModal extends React.Component<IProps, allState> {
  static getDerivedStateFromProps(nextProps: IProps, prevState: allState) {
    const { patientExternalProvider } = nextProps;
    const oldPatientExternalProvider = prevState;

    if (patientExternalProvider && !oldPatientExternalProvider.firstName) {
      return {
        firstName: patientExternalProvider.firstName,
        lastName: patientExternalProvider.lastName,
        role: patientExternalProvider.role,
        roleFreeText: patientExternalProvider.roleFreeText,
        agencyName: patientExternalProvider.agencyName,
        description: patientExternalProvider.description,
        emailAddress: get(patientExternalProvider, 'email.emailAddress'),
        phoneNumber: get(patientExternalProvider, 'phone.phoneNumber'),
        phoneType: get(patientExternalProvider, 'phone.type'),
      };
    }
    return null;
  }

  state = {
    firstName: null,
    lastName: null,
    role: null,
    roleFreeText: null,
    agencyName: null,
    description: null,
    emailAddress: null,
    phoneNumber: null,
    phoneType: null,
    saveError: null,
    hasFieldError: undefined,
  };

  clearState() {
    const clearedFields = {} as any;
    Object.keys(this.state).forEach(field => {
      clearedFields[field] = null;
    }, {});

    this.setState({
      ...clearedFields,
    });
  }

  validateFields() {
    const errors: any = {};
    REQUIRED_FIELDS.forEach(fieldName => {
      if (!get(this.state, fieldName)) {
        errors[fieldName] = true;
      }
    });

    // if other is selected for role, the user must provide text for the other role
    if (
      (this.state.role === 'other' || this.state.role === 'otherMedicalSpecialist') &&
      !this.state.roleFreeText
    ) {
      errors.roleFreeText = true;
    }

    this.setState({ hasFieldError: errors });
    return !!Object.keys(errors).length;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value });
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  handleSubmit = async () => {
    const { saveExternalProvider } = this.props;
    const {
      firstName,
      lastName,
      role,
      roleFreeText,
      agencyName,
      phoneNumber,
      phoneType,
      emailAddress,
      description,
    } = this.state;

    const hasErrors = this.validateFields();
    if (hasErrors) {
      return;
    }

    const updatedPatientExternalProvider = {
      role: role!,
      agencyName: agencyName!,
      phone: { phoneNumber: phoneNumber!, type: phoneType! },
      roleFreeText,
      firstName,
      lastName,
      description,
      email: isNil(emailAddress) ? null : { emailAddress },
    } as any;

    try {
      const response = await saveExternalProvider(updatedPatientExternalProvider);
      if (response.errors) {
        return this.setState({ saveError: response.errors[0].message });
      }
      this.handleClose();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message });
    }
  };

  renderForm() {
    const {
      emailAddress,
      phoneNumber,
      phoneType,
      firstName,
      lastName,
      role,
      roleFreeText,
      agencyName,
      description,
      hasFieldError,
    } = this.state;

    return (
      <PatientExternalProviderForm
        emailAddress={emailAddress}
        phoneNumber={phoneNumber}
        phoneType={phoneType}
        firstName={firstName}
        lastName={lastName}
        role={role}
        roleFreeText={roleFreeText}
        agencyName={agencyName}
        description={description}
        onChange={this.handleChange}
        hasFieldError={hasFieldError || {}}
      />
    );
  }

  render() {
    const { isVisible, titleMessageId, subTitleMessageId } = this.props;
    const { saveError } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        titleMessageId={titleMessageId}
        subTitleMessageId={subTitleMessageId}
        cancelMessageId="patientExternalProvider.cancel"
        submitMessageId="patientExternalProvider.save"
        errorMessageId="patientExternalProvider.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}

export default PatientExternalProviderModal;
