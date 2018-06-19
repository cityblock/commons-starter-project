import { ApolloError } from 'apollo-client';
import { get, isNil } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router';
import patientExternalOrganizationsQuery from '../../../graphql/queries/get-patient-external-organizations.graphql';
import {
  getPatientExternalOrganizationsQuery,
  EmailInput,
  ExternalProviderOptions,
  PhoneCreateInput,
  PhoneTypeOptions,
} from '../../../graphql/types';
import Icon from '../../../shared/library/icon/icon';
import styles from '../../../shared/library/modal/css/modal.css';
import Modal from '../../../shared/library/modal/modal';
import Text from '../../../shared/library/text/text';
import PatientExternalProviderForm from './patient-external-provider-form';

export interface IPatientExternalProvider {
  firstName?: string | null;
  lastName?: string | null;
  role: ExternalProviderOptions;
  roleFreeText?: string | null;
  patientExternalOrganizationId: string;
  phone: PhoneCreateInput;
  email?: EmailInput | null;
  description?: string | null;
}

interface IProps {
  patientId: string;
  saveExternalProvider: (
    patientExternalProvider: IPatientExternalProvider,
  ) => Promise<{ data: any; errors?: ApolloError[] }>;
  closePopup: () => void;
  isVisible: boolean;
  patientExternalProvider?: IPatientExternalProvider | null;
  titleMessageId?: string;
  subTitleMessageId?: string;
}

interface IGraphqlProps {
  patientExternalOrganizations?: getPatientExternalOrganizationsQuery['patientExternalOrganizations'];
  isLoading?: boolean;
  error?: ApolloError | null;
}

export type allProps = IGraphqlProps & IProps & RouteComponentProps<IProps & IGraphqlProps>;

interface IEditableFieldState {
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  roleFreeText?: string | null;
  patientExternalOrganizationId?: string | null;
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

const REQUIRED_FIELDS = ['role', 'patientExternalOrganizationId', 'phoneNumber', 'phoneType'];

export class PatientExternalProviderModal extends React.Component<allProps, allState> {
  static getDerivedStateFromProps(nextProps: IProps, prevState: allState) {
    const { patientExternalProvider } = nextProps;
    const oldPatientExternalProvider = prevState;

    if (patientExternalProvider && !oldPatientExternalProvider.role) {
      return {
        firstName: patientExternalProvider.firstName,
        lastName: patientExternalProvider.lastName,
        role: patientExternalProvider.role,
        roleFreeText: patientExternalProvider.roleFreeText,
        patientExternalOrganizationId: patientExternalProvider.patientExternalOrganizationId,
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
    patientExternalOrganizationId: null,
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

  handleGoToOrganizations = () => {
    const { patientId, history } = this.props;
    history.push(`/patients/${patientId}/team/organizations`);
  };

  handleSubmit = async () => {
    const { saveExternalProvider } = this.props;
    const {
      firstName,
      lastName,
      role,
      roleFreeText,
      patientExternalOrganizationId,
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
      patientExternalOrganizationId: patientExternalOrganizationId!,
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
      patientExternalOrganizationId,
      description,
      hasFieldError,
    } = this.state;
    const { patientExternalOrganizations } = this.props;

    if (!patientExternalOrganizations || !patientExternalOrganizations.length) {
      return (
        <div className={styles.empty}>
          <Icon name="errorOutline" color="red" isExtraLarge={true} className={styles.icon} />
          <Text messageId="patientExternalProvider.noOrganzitions" color="gray" size="largest" />
        </div>
      );
    }

    return (
      <PatientExternalProviderForm
        emailAddress={emailAddress}
        phoneNumber={phoneNumber}
        phoneType={phoneType}
        firstName={firstName}
        lastName={lastName}
        role={role}
        roleFreeText={roleFreeText}
        patientExternalOrganizationId={patientExternalOrganizationId}
        patientExternalOrganizations={patientExternalOrganizations}
        description={description}
        onChange={this.handleChange}
        hasFieldError={hasFieldError || {}}
      />
    );
  }

  render() {
    const {
      isVisible,
      titleMessageId,
      subTitleMessageId,
      patientExternalOrganizations,
    } = this.props;
    const { saveError } = this.state;
    const noOrganizations = !patientExternalOrganizations || !patientExternalOrganizations.length;
    const submitMessageId = noOrganizations
      ? 'patientExternalProvider.goToOrganizations'
      : 'patientExternalProvider.save';
    const onSubmit = noOrganizations ? this.handleGoToOrganizations : this.handleSubmit;

    return (
      <Modal
        isVisible={isVisible}
        titleMessageId={titleMessageId}
        subTitleMessageId={subTitleMessageId}
        cancelMessageId="patientExternalProvider.cancel"
        submitMessageId={submitMessageId}
        errorMessageId="patientExternalProvider.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={onSubmit}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  graphql(patientExternalOrganizationsQuery, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }): IGraphqlProps => ({
      isLoading: data ? data.loading : false,
      error: data ? data.error : null,
      patientExternalOrganizations: data ? (data as any).patientExternalOrganizations : null,
    }),
  }),
)(PatientExternalProviderModal) as React.ComponentClass<IProps>;
