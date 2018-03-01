import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientAdvancedDirectiveFormsQuery from '../../graphql/queries/get-patient-advanced-directive-forms.graphql';
import * as createPatientAdvancedDirectiveFormMutationGraphql from '../../graphql/queries/patient-advanced-directive-form-create-mutation.graphql';
import * as deletePatientAdvancedDirectiveFormMutationGraphql from '../../graphql/queries/patient-advanced-directive-form-delete-mutation.graphql';
import {
  getPatientAdvancedDirectiveFormsQuery,
  patientAdvancedDirectiveFormCreateMutation,
  patientAdvancedDirectiveFormCreateMutationVariables,
  patientAdvancedDirectiveFormDeleteMutation,
  patientAdvancedDirectiveFormDeleteMutationVariables,
} from '../../graphql/types';
import CreatePatientFormModal from './create-patient-form-modal';
import * as styles from './css/patient-forms-section.css';
import PatientAdvancedDirectiveForm from './patient-advanced-directive-form';

export interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  createPatientAdvancedDirectiveFormMutation: (
    options: { variables: patientAdvancedDirectiveFormCreateMutationVariables },
  ) => { data: patientAdvancedDirectiveFormCreateMutation };
  deletePatientAdvancedDirectiveFormMutation: (
    options: { variables: patientAdvancedDirectiveFormDeleteMutationVariables },
  ) => { data: patientAdvancedDirectiveFormDeleteMutation };
  patientAdvancedDirectiveForms?: getPatientAdvancedDirectiveFormsQuery['patientAdvancedDirectiveFormsForPatient'];
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

export class PatientAdvancedDirectives extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { isModalVisible: false, formId: null, formTitle: null };
  }

  onDelete = async (patientAdvancedDirectiveFormId: string) => {
    const { deletePatientAdvancedDirectiveFormMutation } = this.props;
    await deletePatientAdvancedDirectiveFormMutation({
      variables: { patientAdvancedDirectiveFormId },
    });
  };

  onCreate = async (formId: string, signedAt: string) => {
    const { patientId, createPatientAdvancedDirectiveFormMutation } = this.props;
    try {
      this.setState({ createLoading: true });
      await createPatientAdvancedDirectiveFormMutation({
        variables: { patientId, formId, signedAt },
      });
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

  renderPatientAdvancedDirectiveForms() {
    const { patientAdvancedDirectiveForms } = this.props;

    if (!patientAdvancedDirectiveForms) {
      return null;
    }

    return patientAdvancedDirectiveForms.map(patientAdvancedDirectiveForm => (
      <PatientAdvancedDirectiveForm
        key={patientAdvancedDirectiveForm.formId}
        patientAdvancedDirectiveForm={patientAdvancedDirectiveForm}
        onDelete={this.onDelete}
        onCreate={this.onShowModal}
      />
    ));
  }

  render(): JSX.Element {
    const { isModalVisible, formId, formTitle } = this.state;

    return (
      <div className={styles.section}>
        <FormattedMessage id={'patientDocuments.patientAdvancedDirectives'}>
          {(message: string) => <h2 className={styles.header}>{message}</h2>}
        </FormattedMessage>
        <div className={styles.patientForms}>{this.renderPatientAdvancedDirectiveForms()}</div>
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
  graphql<IGraphqlProps, IProps, allProps>(patientAdvancedDirectiveFormsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientAdvancedDirectiveForms: data
        ? (data as any).patientAdvancedDirectiveFormsForPatient
        : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(
    createPatientAdvancedDirectiveFormMutationGraphql as any,
    {
      name: 'createPatientAdvancedDirectiveFormMutation',
      options: {
        refetchQueries: ['getPatientAdvancedDirectiveForms'],
      },
    },
  ),
  graphql<IGraphqlProps, IProps, allProps>(
    deletePatientAdvancedDirectiveFormMutationGraphql as any,
    {
      name: 'deletePatientAdvancedDirectiveFormMutation',
      options: {
        refetchQueries: ['getPatientAdvancedDirectiveForms'],
      },
    },
  ),
)(PatientAdvancedDirectives);
