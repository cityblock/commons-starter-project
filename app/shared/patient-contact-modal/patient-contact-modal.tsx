import { get, isNil } from 'lodash';
import * as React from 'react';
import { AddressInput, EmailInput, PhoneInput } from '../../graphql/types';
import Modal from '../library/modal/modal';
import PatientFamilyMemberForm from './patient-family-member-form';
import PatientProxyForm from './patient-proxy-form';

export type ContactType = 'healthcareProxy' | 'familyMember' | 'emergencyContact';

export interface IPatientContact {
  firstName: string;
  lastName: string;
  relationToPatient: string;
  phone: PhoneInput;
  email?: EmailInput | null;
  address?: AddressInput | null;
  description?: string | null;
  isHealthcareProxy?: boolean | null;
  isEmergencyContact?: boolean | null;
  canContact?: boolean | null;
}

interface IProps {
  saveContact: (patientContact: IPatientContact) => Promise<any>;
  closePopup: () => void;
  onSaved: (response: any) => void;
  isVisible: boolean;
  contactType?: ContactType;
  patientContact?: IPatientContact | null;
  titleMessageId?: string;
  subTitleMessageId?: string;
}

interface IEditableFieldState {
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  description?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  isEmergencyContact?: boolean | null;
  canContact?: boolean | null;
  address?: AddressInput | null;
}

interface IState {
  saveError?: string | null;
  hasFieldError?: { [key: string]: boolean };
}

type allState = IState & IEditableFieldState;

const REQUIRED_FIELDS = ['firstName', 'lastName', 'phoneNumber', 'relationToPatient'];

class PatientContactModal extends React.Component<IProps, allState> {
  constructor(props: IProps) {
    super(props);
    const { contactType } = props;
    const patientContact = props.patientContact || ({} as any);

    this.state = {
      firstName: patientContact.firstName,
      lastName: patientContact.lastName,
      relationToPatient: patientContact.relationToPatient,
      description: patientContact.description,
      emailAddress: get(patientContact, 'email.emailAddress'),
      phoneNumber: get(patientContact, 'phone.phoneNumber'),
      address: patientContact.address,
      isEmergencyContact: patientContact.isEmergencyContact || contactType === 'emergencyContact',
      canContact: patientContact.canContact,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { patientContact, contactType } = nextProps;
    const oldPatientContact = this.props.patientContact;

    if (contactType === 'emergencyContact') {
      this.setState({ isEmergencyContact: true });
    }

    if (patientContact && !oldPatientContact) {
      this.setState({
        firstName: patientContact.firstName,
        lastName: patientContact.lastName,
        relationToPatient: patientContact.relationToPatient,
        description: patientContact.description,
        emailAddress: get(patientContact, 'email.emailAddress'),
        phoneNumber: get(patientContact, 'phone.phoneNumber'),
        address: patientContact.address,
        isEmergencyContact: patientContact.isEmergencyContact,
        canContact: patientContact.canContact,
      });
    }
  }

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

    this.setState({ hasFieldError: errors });
    return !!Object.keys(errors).length;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value });
  };

  handleRadioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const booleanValue = value === 'true';
    this.setState({ [name as any]: booleanValue });
  };

  handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const { address } = this.state;

    this.setState({
      address: {
        ...address,
        [name as any]: value,
      },
    });
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
      phoneNumber,
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
      phone: { phoneNumber: phoneNumber! },
      description,
      isEmergencyContact,
      canContact,
      email: isNil(emailAddress) ? null : { emailAddress },
      address: this.getContactAddress(),
    } as any;

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
      address,
      firstName,
      lastName,
      relationToPatient,
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
          firstName={firstName}
          lastName={lastName}
          relationToPatient={relationToPatient}
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
        address={address}
        firstName={firstName}
        lastName={lastName}
        relationToPatient={relationToPatient}
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
