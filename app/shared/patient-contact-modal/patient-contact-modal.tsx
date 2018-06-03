import { get, isNil } from 'lodash';
import * as React from 'react';
import {
  patientContactCreateMutationVariables,
  patientContactEditMutationVariables,
  AddressInput,
  FullPatientContactFragment,
  PhoneTypeOptions,
} from '../../graphql/types';
import Modal from '../library/modal/modal';
import PatientFamilyMemberForm from './patient-family-member-form';
import PatientProxyForm from './patient-proxy-form';

export type ContactType = 'healthcareProxy' | 'familyMember' | 'emergencyContact';

interface IProps {
  saveContact: (patientContact: any) => Promise<any>; // NOTE: Patient contact should be either the create or edit mutation variables
  closePopup: () => void;
  onSaved: (response: any) => void;
  isVisible: boolean;
  contactType?: ContactType;
  patientContact?: FullPatientContactFragment | null;
  titleMessageId?: string;
  subTitleMessageId?: string;
}

interface IEditableFieldState {
  id: string | null;
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  relationFreeText?: string | null;
  description?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  phoneType?: PhoneTypeOptions | null;
  isEmergencyContact?: boolean | null;
  canContact?: boolean | null;
  address?: AddressInput | null;
}

interface IState {
  saveError?: string | null;
  hasFieldError?: { [key: string]: boolean };
}

type allState = IState & IEditableFieldState;

const REQUIRED_FIELDS = ['firstName', 'lastName', 'phoneNumber', 'phoneType', 'relationToPatient'];

class PatientContactModal extends React.Component<IProps, allState> {
  static getDerivedStateFromProps(nextProps: IProps, prevState: allState) {
    const { patientContact, contactType } = nextProps;
    const oldPatientContact = prevState;

    if (patientContact) {
      if (!oldPatientContact || !oldPatientContact.id) {
        return {
          id: patientContact.id,
          firstName: patientContact.firstName,
          lastName: patientContact.lastName,
          relationToPatient: patientContact.relationToPatient,
          relationFreeText: patientContact.relationFreeText,
          description: patientContact.description,
          emailAddress: get(patientContact, 'email.emailAddress'),
          phoneNumber: get(patientContact, 'phone.phoneNumber'),
          phoneType: get(patientContact, 'phone.type'),
          address: patientContact.address,
          isEmergencyContact:
            patientContact.isEmergencyContact || contactType === 'emergencyContact',
          canContact: patientContact.canContact,
        };
      }
    }

    if (contactType === 'emergencyContact') {
      return { ...prevState, isEmergencyContact: true };
    }

    return null;
  }

  state: allState = {
    id: null,
    firstName: null,
    lastName: null,
    relationToPatient: null,
    relationFreeText: null,
    description: null,
    emailAddress: null,
    phoneNumber: null,
    phoneType: null,
    address: null,
    isEmergencyContact: null,
    canContact: null,
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
    if (this.state.relationToPatient === 'other' && !this.state.relationFreeText) {
      errors.relationFreeText = true;
    }

    this.setState({ hasFieldError: errors });
    return !!Object.keys(errors).length;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value } as any);
  };

  handleRadioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const booleanValue = value === 'true';
    this.setState({ [name as any]: booleanValue } as any);
  };

  handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const { address } = this.state;
    if (address) {
      this.setState({
        address: {
          ...address,
          [name as any]: value,
        },
      });
    }
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  handleSubmit = async () => {
    const { saveContact, onSaved, contactType } = this.props;
    const {
      firstName,
      lastName,
      relationToPatient,
      relationFreeText,
      phoneNumber,
      phoneType,
      emailAddress,
      description,
      isEmergencyContact,
      canContact,
    } = this.state;

    const hasErrors = this.validateFields();
    if (hasErrors) {
      return;
    }

    const updatedPatientContact = {
      firstName: firstName!,
      lastName: lastName!,
      relationToPatient: relationToPatient!,
      phone: { phoneNumber: phoneNumber!, type: phoneType! },
      description,
      isEmergencyContact,
      canContact,
      email: isNil(emailAddress) ? null : { emailAddress },
      address: this.getContactAddress(),
      relationFreeText,
    } as patientContactCreateMutationVariables | patientContactEditMutationVariables;

    if (contactType === 'healthcareProxy') {
      updatedPatientContact.isHealthcareProxy = true;
    }

    try {
      const response = await saveContact(updatedPatientContact);
      onSaved(response);
      this.handleClose();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message });
    }
  };

  getContactAddress() {
    const currentAddress = this.state.address || {};
    const { street1, street2, state, city, zip } = currentAddress;

    if (isNil(street1) && isNil(street2) && isNil(state) && isNil(city) && isNil(zip)) {
      return null;
    }

    return { street1, street2, state, city, zip };
  }

  renderForm() {
    const { contactType } = this.props;
    const {
      emailAddress,
      phoneNumber,
      phoneType,
      address,
      firstName,
      lastName,
      relationToPatient,
      relationFreeText,
      description,
      canContact,
      isEmergencyContact,
      hasFieldError,
    } = this.state;

    if (contactType === 'healthcareProxy') {
      return (
        <PatientProxyForm
          emailAddress={emailAddress}
          phoneNumber={phoneNumber}
          phoneType={phoneType}
          firstName={firstName}
          lastName={lastName}
          relationToPatient={relationToPatient}
          relationFreeText={relationFreeText}
          description={description}
          onChange={this.handleChange}
          hasFieldError={hasFieldError || {}}
        />
      );
    }

    return (
      <PatientFamilyMemberForm
        emailAddress={emailAddress}
        phoneNumber={phoneNumber}
        phoneType={phoneType}
        address={address}
        firstName={firstName}
        lastName={lastName}
        relationToPatient={relationToPatient}
        relationFreeText={relationFreeText}
        description={description}
        isEmergencyContact={isEmergencyContact}
        canContact={canContact}
        onChange={this.handleChange}
        onAddresssChange={this.handleAddressChange}
        onRadioChange={this.handleRadioChange}
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
        cancelMessageId="patientContact.cancel"
        submitMessageId="patientContact.save"
        errorMessageId="patientContact.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}

export default PatientContactModal;
