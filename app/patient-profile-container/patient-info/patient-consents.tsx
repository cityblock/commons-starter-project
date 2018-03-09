import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientConsentFormsQuery from '../../graphql/queries/get-patient-consent-forms.graphql';
import * as createPatientConsentFormMutationGraphql from '../../graphql/queries/patient-consent-form-create-mutation.graphql';
import * as deletePatientConsentFormMutationGraphql from '../../graphql/queries/patient-consent-form-delete-mutation.graphql';
import {
  getPatientConsentFormsQuery,
  patientConsentFormCreateMutation,
  patientConsentFormCreateMutationVariables,
  patientConsentFormDeleteMutation,
  patientConsentFormDeleteMutationVariables,
} from '../../graphql/types';
import CreatePatientFormModal from './create-patient-form-modal';
import * as styles from './css/patient-forms-section.css';
import PatientConsentForm from './patient-consent-form';

export interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  createPatientConsentFormMutation: (
    options: { variables: patientConsentFormCreateMutationVariables },
  ) => { data: patientConsentFormCreateMutation };
  deletePatientConsentFormMutation: (
    options: { variables: patientConsentFormDeleteMutationVariables },
  ) => { data: patientConsentFormDeleteMutation };
  patientConsentForms?: getPatientConsentFormsQuery['patientConsentFormsForPatient'];
  isLoading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps;

interface IState {
  isModalVisible: boolean;
  formId: string | null;
  formTitle: string | null;
  createError?: string;
  createLoading?: boolean;
}

export class PatientConsents extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { isModalVisible: false, formId: null, formTitle: null };
  }

  onDelete = async (patientConsentFormId: string) => {
    const { deletePatientConsentFormMutation } = this.props;
    await deletePatientConsentFormMutation({ variables: { patientConsentFormId } });
  };

  onCreate = async (formId: string, signedAt: string) => {
    const { patientId, createPatientConsentFormMutation } = this.props;
    try {
      this.setState({ createLoading: true, createError: undefined });
      await createPatientConsentFormMutation({ variables: { patientId, formId, signedAt } });
      this.setState({ formId: null, formTitle: null, isModalVisible: false, createLoading: false });
    } catch (err) {
      this.setState({ createError: err.message, createLoading: false });
    }
  };

  onShowModal = (formId: string, formTitle: string) => {
    this.setState({ formId, formTitle, isModalVisible: true });
  };

  onCancelCreate = () => {
    this.setState({ formId: null, formTitle: null, isModalVisible: false });
  };

  renderPatientConsentForms() {
    const { patientConsentForms } = this.props;

    if (!patientConsentForms) {
      return null;
    }

    return patientConsentForms.map(patientConsentForm => (
      <PatientConsentForm
        key={patientConsentForm.formId}
        patientConsentForm={patientConsentForm}
        onDelete={this.onDelete}
        onCreate={this.onShowModal}
      />
    ));
  }

  render(): JSX.Element {
    const { isModalVisible, formId, formTitle } = this.state;

    return (
      <div className={styles.section}>
        <FormattedMessage id={'patientDocuments.patientConsents'}>
          {(message: string) => <h2 className={styles.header}>{message}</h2>}
        </FormattedMessage>
        <div className={styles.patientForms}>{this.renderPatientConsentForms()}</div>
        <CreatePatientFormModal
          onSubmit={this.onCreate}
          onCancel={this.onCancelCreate}
          isVisible={isModalVisible}
          formId={formId}
          formTitle={formTitle}
        />
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientConsentFormsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientConsentForms: data ? (data as any).patientConsentFormsForPatient : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(createPatientConsentFormMutationGraphql as any, {
    name: 'createPatientConsentFormMutation',
    options: {
      refetchQueries: ['getPatientConsentForms'],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(deletePatientConsentFormMutationGraphql as any, {
    name: 'deletePatientConsentFormMutation',
    options: {
      refetchQueries: ['getPatientConsentForms'],
    },
  }),
)(PatientConsents);
