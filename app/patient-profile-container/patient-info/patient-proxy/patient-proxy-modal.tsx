import { get, isNil } from 'lodash';
import * as React from 'react';
import Modal from '../../../shared/library/modal/modal';
import PatientProxyForm from './patient-proxy-form';

export interface IEmail {
  emailAddress?: string | null;
  id?: string;
}

export interface IPhone {
  phoneNumber?: string | null;
  id?: string;
}

export interface IPatientProxy {
  firstName: string;
  lastName: string;
  relationToPatient: string;
  phoneNumber: string;
  emailAddress?: string;
  description?: string | null;
}

export interface IPatientProxyInput {
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  description?: string | null;
  primaryPhone?: IPhone | null;
  primaryEmail?: IEmail | null;
}

interface IUpdatedProxy {
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  description?: string | null;
  phoneNumber?: IPhone | null;
  emailAddress?: IEmail | null;
}

interface IProps {
  saveProxy: (patientProxy: IPatientProxy) => Promise<any>;
  closePopup: () => void;
  onSaved: (response: any) => void;
  isVisible: boolean;
  patientProxy?: IPatientProxyInput | null;
  titleMessageId?: string;
}

interface IState {
  firstName?: string | null;
  lastName?: string | null;
  relationToPatient?: string | null;
  description?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  saveError?: string | null;
  hasFieldError?: { [key: string]: boolean };
}

class PatientProxyModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasFieldError: {},
    };
  }

  clearState() {
    this.setState({
      saveError: null,
      firstName: null,
      lastName: null,
      relationToPatient: null,
      description: null,
      emailAddress: null,
      phoneNumber: null,
      hasFieldError: {},
    });
  }

  validateFields(updatedProxy: IUpdatedProxy) {
    const errors: any = {};

    if (!updatedProxy.firstName) {
      errors.firstName = true;
    }
    if (!updatedProxy.lastName) {
      errors.lastName = true;
    }
    if (!updatedProxy.relationToPatient) {
      errors.relationToPatient = true;
    }
    if (!updatedProxy.phoneNumber) {
      errors.phoneNumber = true;
    }

    this.setState({ hasFieldError: errors });
    if (!Object.keys(errors).length) {
      return {
        ...updatedProxy,
        firstName: updatedProxy.firstName!,
        lastName: updatedProxy.lastName!,
        relationToPatient: updatedProxy.relationToPatient!,
        phoneNumber: updatedProxy.phoneNumber!,
      } as IPatientProxy;
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value });
  };

  handleSubmit = async () => {
    const { patientProxy, saveProxy, onSaved } = this.props;
    const originalProxy = patientProxy || {};
    const {
      firstName,
      lastName,
      relationToPatient,
      description,
      emailAddress,
      phoneNumber,
    } = this.state;

    const updatedProxy: IUpdatedProxy = {
      firstName: firstName || originalProxy.firstName,
      lastName: lastName || originalProxy.lastName,
      relationToPatient: relationToPatient || originalProxy.relationToPatient,
      description: description || originalProxy.description,
      emailAddress: emailAddress || get(originalProxy, 'primaryEmail.emailAddress'),
      phoneNumber: phoneNumber || get(originalProxy, 'primaryPhone.phoneNumber'),
    };

    const errorFreeProxy = this.validateFields(updatedProxy);
    if (!errorFreeProxy) {
      return;
    }

    try {
      const response = await saveProxy(errorFreeProxy);
      onSaved(response);
      this.handleClose();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message });
    }
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  render() {
    const { isVisible, titleMessageId } = this.props;
    const patientProxy = this.props.patientProxy || {};
    const {
      saveError,
      emailAddress,
      phoneNumber,
      firstName,
      lastName,
      relationToPatient,
      description,
      hasFieldError,
    } = this.state;

    const updatedEmailAddress = isNil(emailAddress)
      ? get(patientProxy, 'primaryEmail.emailAddress')
      : emailAddress;
    const updatedPhoneNumber = isNil(phoneNumber)
      ? get(patientProxy, 'primaryPhone.phoneNumber')
      : phoneNumber;
    const updatedFirstName = isNil(firstName) ? patientProxy.firstName : firstName;
    const updatedLastName = isNil(lastName) ? patientProxy.lastName : lastName;
    const updatedRelationToPatient = isNil(relationToPatient)
      ? patientProxy.relationToPatient
      : relationToPatient;
    const updatedDescription = isNil(description) ? patientProxy.description : description;

    return (
      <Modal
        isVisible={isVisible}
        titleMessageId={titleMessageId}
        cancelMessageId="patientContact.cancel"
        submitMessageId="patientContact.save"
        errorMessageId="patientContact.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        <PatientProxyForm
          emailAddress={updatedEmailAddress}
          phoneNumber={updatedPhoneNumber}
          firstName={updatedFirstName}
          lastName={updatedLastName}
          relationToPatient={updatedRelationToPatient}
          description={updatedDescription}
          onChange={this.handleChange}
          hasFieldError={hasFieldError || {}}
        />
      </Modal>
    );
  }
}

export default PatientProxyModal;
