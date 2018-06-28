import { ApolloError } from 'apollo-client';
import { get, isNil } from 'lodash';
import React from 'react';
import { AddressInput } from '../../../graphql/types';
import Modal from '../../../shared/library/modal/modal';
import PatientExternalOrganizationForm from './patient-external-organization-form';

export interface IPatientExternalOrganization {
  name: string;
  description?: string | null;
  phoneNumber?: string | null;
  faxNumber?: string | null;
  address?: AddressInput | null;
}

interface IProps {
  patientId: string;
  saveExternalOrganization: (
    patientExternalOrganization: IPatientExternalOrganization,
  ) => Promise<{ data: any; errors?: ApolloError[] }>;
  closePopup: () => void;
  isVisible: boolean;
  patientExternalOrganization?: IPatientExternalOrganization | null;
  titleMessageId?: string;
  subTitleMessageId?: string;
}

interface IEditableFieldState {
  name?: string | null;
  description?: string | null;
  phoneNumber?: string | null;
  faxNumber?: string | null;
  zip?: string | null;
  street1?: string | null;
  street2?: string | null;
  state?: string | null;
  city?: string | null;
}

interface IState {
  saveError?: string | null;
  hasFieldError?: { [key: string]: boolean };
  isLoading: boolean;
}

type allState = IState & IEditableFieldState;

const REQUIRED_FIELDS = ['name'];

export class PatientExternalOrganizationModal extends React.Component<IProps, allState> {
  static getDerivedStateFromProps(nextProps: IProps, prevState: allState) {
    const { patientExternalOrganization } = nextProps;
    const oldPatientExternalOrganization = prevState;

    if (patientExternalOrganization && isNil(oldPatientExternalOrganization.name)) {
      return {
        name: patientExternalOrganization.name,
        description: patientExternalOrganization.description,
        phoneNumber: patientExternalOrganization.phoneNumber,
        faxNumber: patientExternalOrganization.faxNumber,
        zip: get(patientExternalOrganization, 'address.zip'),
        street1: get(patientExternalOrganization, 'address.street1'),
        street2: get(patientExternalOrganization, 'address.street2'),
        state: get(patientExternalOrganization, 'address.state'),
        city: get(patientExternalOrganization, 'address.city'),
      };
    }
    return null;
  }

  state = this.getInitialState();

  getInitialState() {
    return {
      name: null,
      description: null,
      phoneNumber: null,
      faxNumber: null,
      zip: null,
      street1: null,
      street2: null,
      state: null,
      city: null,
      saveError: null,
      hasFieldError: undefined,
      isLoading: false,
    };
  }

  clearState() {
    this.setState(this.getInitialState());
  }

  validateFields() {
    const errors: any = {};
    REQUIRED_FIELDS.forEach(fieldName => {
      if (!get(this.state, fieldName)) {
        errors[fieldName] = true;
      }
    });

    this.setState({ hasFieldError: errors });
    return !!Object.keys(errors).length;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value } as any);
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  handleSubmit = async () => {
    const { saveExternalOrganization } = this.props;
    const {
      name,
      description,
      phoneNumber,
      faxNumber,
      zip,
      street1,
      street2,
      state,
      city,
    } = this.state;

    const hasErrors = this.validateFields();
    if (hasErrors) {
      return;
    }

    const updatedPatientExternalOrganization = {
      name: name!,
      description,
      phoneNumber,
      faxNumber,
      address:
        !isNil(zip) || !isNil(city) || !isNil(street1) || !isNil(street2) || !isNil(state)
          ? { zip, city, street1, street2, state }
          : null,
    } as any;

    try {
      this.setState({ isLoading: true });
      const response = await saveExternalOrganization(updatedPatientExternalOrganization);
      this.setState({ isLoading: false });

      if (response.errors) {
        return this.setState({ saveError: response.errors[0].message });
      }
      this.handleClose();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message, isLoading: false });
    }
  };

  renderForm() {
    const {
      name,
      description,
      phoneNumber,
      faxNumber,
      zip,
      street1,
      street2,
      state,
      city,
      hasFieldError,
    } = this.state;

    return (
      <PatientExternalOrganizationForm
        name={name}
        description={description}
        phoneNumber={phoneNumber}
        faxNumber={faxNumber}
        zip={zip}
        street1={street1}
        street2={street2}
        state={state}
        city={city}
        onChange={this.handleChange}
        hasFieldError={hasFieldError || {}}
      />
    );
  }

  render() {
    const { isVisible, titleMessageId, subTitleMessageId } = this.props;
    const { saveError, isLoading } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        isLoading={isLoading}
        titleMessageId={titleMessageId}
        subTitleMessageId={subTitleMessageId}
        cancelMessageId="patientExternalOrganization.cancel"
        submitMessageId="patientExternalOrganization.save"
        errorMessageId="patientExternalOrganization.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}

export default PatientExternalOrganizationModal;
