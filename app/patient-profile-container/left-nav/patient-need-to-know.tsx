import { debounce } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import patientNeedToKnow from '../../graphql/queries/get-patient-need-to-know.graphql';
import savePatientNeedToKnowGraphql from '../../graphql/queries/patient-need-to-know-edit-mutation.graphql';
import { patientNeedToKnowEdit, patientNeedToKnowEditVariables } from '../../graphql/types';
import styles from './css/patient-need-to-know.css';
import { PatientNeedToKnowStatus } from './patient-need-to-know-status';

export interface IProps {
  patientInfoId: string;
  mutate?: any;
}

interface IGraphqlProps {
  needToKnow?: {
    text: string;
  };
  loading?: boolean;
  error: string | null;
  saveNeedToKnow: (
    options: { variables: patientNeedToKnowEditVariables },
  ) => { data: patientNeedToKnowEdit };
  refetchNeedToKnow: (variables: { patientInfoId: string }) => any;
}

interface IState {
  loading?: boolean;
  error: string | null;
  needToKnow: string | null;
  saveSuccess: boolean;
  saveError: boolean;
}

type allProps = IProps & IGraphqlProps;

const SAVE_TIMEOUT_MILLISECONDS = 500;
const SAVE_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

class PatientNeedToKnow extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    const { loading, error } = props;

    this.onChange = this.onChange.bind(this);
    this.saveNeedToKnow = debounce(this.saveNeedToKnow.bind(this), SAVE_TIMEOUT_MILLISECONDS);
    this.clearSaveSuccess = this.clearSaveSuccess.bind(this);
    this.reloadPatientNeedToKnow = this.reloadPatientNeedToKnow.bind(this);

    this.state = {
      saveSuccess: false,
      saveError: false,
      loading,
      error,
      needToKnow: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { needToKnow } = this.state;
    const { loading, error } = nextProps;

    if (!needToKnow) {
      this.setState({
        loading,
        error,
        needToKnow: this.getneedToKnowTextFromProps(nextProps),
      });
    }
  }

  getneedToKnowTextFromProps(props: allProps) {
    const { needToKnow } = props;

    let needToKnowText: string = '';

    if (needToKnow) {
      needToKnowText = needToKnow.text || needToKnowText;
    }

    return needToKnowText;
  }

  clearSaveSuccess() {
    this.setState({ saveSuccess: false });
  }

  async saveNeedToKnow() {
    const { saveNeedToKnow, patientInfoId } = this.props;
    const { needToKnow } = this.state;

    // TODO: you can't actually delete the scratch pad completely
    if (needToKnow) {
      this.setState({ saveError: false, saveSuccess: false });

      try {
        await saveNeedToKnow({ variables: { patientInfoId, text: needToKnow } });
        this.setState({ saveSuccess: true, saveError: false });
        setTimeout(this.clearSaveSuccess, SAVE_SUCCESS_TIMEOUT_MILLISECONDS);
      } catch (err) {
        this.setState({ saveSuccess: false, saveError: true });
      }
    }
  }

  onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const needToKnow = event.target.value;
    this.setState({ needToKnow, saveSuccess: false });
    this.saveNeedToKnow();
  }

  async reloadPatientNeedToKnow() {
    const { refetchNeedToKnow, patientInfoId } = this.props;

    try {
      this.setState({ loading: true, error: null });
      await refetchNeedToKnow({ patientInfoId });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  render() {
    const { loading, error } = this.state;
    const placeholderText = loading ? 'Loading...' : '';

    const { saveSuccess, saveError } = this.state;

    const disabled = loading || !!error || saveError;

    return (
      <div className={styles.patientScratchPad}>
        <textarea
          disabled={disabled}
          className={styles.textArea}
          value={this.state.needToKnow || ''}
          placeholder={placeholderText}
          onChange={this.onChange}
        />
        <PatientNeedToKnowStatus
          saveSuccess={saveSuccess}
          saveError={saveError}
          loadingError={error}
          reloadNeedToKnow={this.reloadPatientNeedToKnow}
          resaveNeedToKnow={this.saveNeedToKnow}
        />
      </div>
    );
  }
}

export default compose(
  graphql(savePatientNeedToKnowGraphql, {
    name: 'saveNeedToKnow',
  }),
  graphql(patientNeedToKnow, {
    options: (props: IProps) => ({
      variables: {
        patientInfoId: props.patientInfoId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      needToKnow: data ? (data as any).patientNeedToKnow : null,
      refetchNeedToKnow: data ? data.refetch : null,
    }),
  }),
)(PatientNeedToKnow) as React.ComponentClass<IProps>;
