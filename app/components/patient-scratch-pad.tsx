import { debounce } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as styles from '../css/components/patient-scratch-pad.css';
import { getQuery } from '../graphql/helpers';
import {
  FullPatientScratchPadFragment,
  PatientScratchPadEditMutationVariables,
} from '../graphql/types';
import { PatientScratchPadStatus } from './patient-scratch-pad-status';

interface IProps {
  patientId: string;
  scratchPad?: {
    text: string;
  };
  loading?: boolean;
  error?: string;
  saveScratchPad: (
    options: { variables: PatientScratchPadEditMutationVariables },
  ) => { data: { patientScratchPad: FullPatientScratchPadFragment } };
  refetchScratchPad: (variables: { patientId: string }) => any;
}

interface IState {
  scratchPad?: string;
  saveSuccess: boolean;
  saveError: boolean;
}

const SAVE_TIMEOUT_MILLISECONDS = 500;
const SAVE_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

class PatientScratchPad extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.saveScratchPad = debounce(
      this.saveScratchPad.bind(this),
      SAVE_TIMEOUT_MILLISECONDS,
    );
    this.clearSaveSuccess = this.clearSaveSuccess.bind(this);
    this.reloadPatientScratchPad = this.reloadPatientScratchPad.bind(this);

    this.state = {
      scratchPad: this.getScratchPadTextFromProps(props),
      saveSuccess: false,
      saveError: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState(() => ({ scratchPad: this.getScratchPadTextFromProps(nextProps) }));
  }

  getScratchPadTextFromProps(props: IProps) {
    const { scratchPad } = props;

    let scratchPadText: string = '';

    if (scratchPad) {
      scratchPadText = scratchPad.text || scratchPadText;
    }

    return scratchPadText;
  }

  clearSaveSuccess() {
    this.setState(() => ({ saveSuccess: false }));
  }

  async saveScratchPad() {
    const { saveScratchPad, patientId } = this.props;
    const { scratchPad } = this.state;

    // TODO: you can't actually delete the scratch pad completely
    if (scratchPad) {
      try {
        await saveScratchPad({ variables: { patientId, text: scratchPad } });
        this.setState(() => ({ saveSuccess: true, saveError: false }));
        setTimeout(this.clearSaveSuccess, SAVE_SUCCESS_TIMEOUT_MILLISECONDS);
      } catch (err) {
        this.setState(() => ({ saveSuccess: false, saveError: true }));
      }
    }
  }

  onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const scratchPad = event.target.value;
    this.setState(() => ({ scratchPad, saveSuccess: false }));
    this.saveScratchPad();
  }

  reloadPatientScratchPad() {
    const { refetchScratchPad, patientId } = this.props;

    refetchScratchPad({ patientId });
  }

  render() {
    const { loading, error } = this.props;
    const placeholderText = loading ? 'Loading...' : '';

    const { saveSuccess, saveError } = this.state;

    return (
      <div className={styles.patientScratchPad}>
        <textarea
          disabled={loading}
          className={styles.textArea}
          value={this.state.scratchPad}
          placeholder={placeholderText}
          onChange={this.onChange}
        />
        <PatientScratchPadStatus
          saveSuccess={saveSuccess}
          saveError={saveError}
          loadingError={error}
          reloadScratchPad={this.reloadPatientScratchPad}
          resaveScratchPad={this.saveScratchPad}
        />
      </div>
    );
  }
}

const patientScratchPadQuery = getQuery('app/graphql/queries/get-patient-scratch-pad.graphql');
const savePatientScratchPadMutation = getQuery(
  'app/graphql/queries/patient-scratch-pad-edit-mutation.graphql',
);

export default (compose as any)(
  graphql(savePatientScratchPadMutation, { name: 'saveScratchPad' }),
  graphql(patientScratchPadQuery, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      scratchPad: (data ? (data as any).patientScratchPad : null),
      refetchScratchPad: (data ? data.refetch : null),
    }),
  }),
)(PatientScratchPad);
