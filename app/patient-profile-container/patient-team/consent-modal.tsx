import { ApolloError } from 'apollo-client';
import { isNil } from 'lodash';
import React from 'react';
import Modal from '../../shared/library/modal/modal';
import ConsentForm from './consent-form';
import {
  getConsentLevel,
  getConsentSettingsObject,
  ConsentLevel,
  IConsentSettings,
} from './helpers/consent-helpers';

interface IProps {
  saveConsentSettings: (
    patientExternalProvider: IConsentSettings,
  ) => Promise<{ data: any; errors?: ApolloError[] }>;
  closePopup: () => void;
  isVisible: boolean;
  consentSettings: IConsentSettings;
  consenterId: string;
}

interface IState extends IConsentSettings {
  consentSelectState: ConsentLevel | null;
  consenterId: string;
  hasFieldError: { [key: string]: boolean };
  saveError: string | null;
  isLoading: boolean;
}

export class ConsentModal extends React.Component<IProps, IState> {
  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    if (nextProps.consenterId !== prevState.consenterId) {
      const newState = getConsentSettingsObject(nextProps.consentSettings) as any;
      newState.consentSelectState = getConsentLevel(newState);
      newState.consenterId = nextProps.consenterId;
      return newState;
    }
    return null;
  }

  state = this.getInitialState();

  getInitialState() {
    return {
      ...getConsentSettingsObject(this.props.consentSettings),
      consenterId: this.props.consenterId,
      consentSelectState: getConsentLevel(getConsentSettingsObject(this.props.consentSettings)),
      hasFieldError: {},
      saveError: null,
      isLoading: false,
    };
  }

  clearState() {
    this.setState(this.getInitialState());
  }

  validateFields() {
    const errors: any = {};
    const { consentSelectState } = this.state;
    if (
      consentSelectState === ('partialConsent' as ConsentLevel) &&
      isNil(this.state.isConsentedForFamilyPlanning) &&
      isNil(this.state.isConsentedForGeneticTesting) &&
      isNil(this.state.isConsentedForHiv) &&
      isNil(this.state.isConsentedForMentalHealth) &&
      isNil(this.state.isConsentedForStd) &&
      isNil(this.state.isConsentedForSubstanceUse)
    ) {
      errors.consentSettings = true;
    }

    this.setState({ hasFieldError: errors });
    return !!Object.keys(errors).length;
  }

  handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value } as any);
  };

  handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    this.setState({ [value as any]: !checked } as any);
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  handleSubmit = async () => {
    const { saveConsentSettings, consentSettings } = this.props;
    const { consentDocumentId } = consentSettings;
    const { consentSelectState } = this.state;
    const hasErrors = this.validateFields();
    if (hasErrors) {
      return;
    }

    let updatedConsentSettings: IConsentSettings = {};
    if (consentSelectState === 'fullConsent') {
      updatedConsentSettings = {
        isConsentedForFamilyPlanning: true,
        isConsentedForGeneticTesting: true,
        isConsentedForHiv: true,
        isConsentedForMentalHealth: true,
        isConsentedForStd: true,
        isConsentedForSubstanceUse: true,
        isConsentDocumentOutdated: true,
      };
    } else if (consentSelectState === 'noConsent') {
      updatedConsentSettings = {
        isConsentedForFamilyPlanning: false,
        isConsentedForGeneticTesting: false,
        isConsentedForHiv: false,
        isConsentedForMentalHealth: false,
        isConsentedForStd: false,
        isConsentedForSubstanceUse: false,
        isConsentDocumentOutdated: !!consentDocumentId,
      };
    } else {
      updatedConsentSettings = {
        ...getConsentSettingsObject(this.state),
        isConsentDocumentOutdated: true,
      };
    }

    try {
      this.setState({ isLoading: true });
      const response = await saveConsentSettings(updatedConsentSettings);
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

  render() {
    const { isVisible } = this.props;
    const { saveError, hasFieldError, consentSelectState, isLoading } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        isLoading={isLoading}
        titleMessageId="sharingConsent.title"
        subTitleMessageId="sharingConsent.subtitle"
        cancelMessageId="sharingConsent.cancel"
        submitMessageId="sharingConsent.save"
        errorMessageId="sharingConsent.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        <ConsentForm
          consentSettings={getConsentSettingsObject(this.state)}
          hasFieldError={hasFieldError}
          consentSelectState={consentSelectState}
          onCheckChange={this.handleCheckChange}
          onSelectChange={this.handleSelectChange}
        />
      </Modal>
    );
  }
}

export default ConsentModal;
