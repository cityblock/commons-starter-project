import { debounce } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientScratchPadQuery from '../../graphql/queries/get-patient-scratch-pad.graphql';
import * as savePatientScratchPadMutationGraphql from '../../graphql/queries/patient-scratch-pad-edit-mutation.graphql';
import {
  getPatientScratchPadQuery,
  patientScratchPadEditMutation,
  patientScratchPadEditMutationVariables,
} from '../../graphql/types';
import TextArea from '../../shared/library/textarea/textarea';
import * as styles from './css/left-nav-scratchpad.css';
import LeftNavScratchPadStatus from './left-nav-scratchpad-status';

const SAVE_TIMEOUT_MILLISECONDS = 500;
const SAVE_SUCCESS_TIMEOUT_MILLISECONDS = 2000;
export const MAX_SCRATCHPAD_LENGTH = 1400;

export interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  scratchPad: getPatientScratchPadQuery['patientScratchPad'];
  loading: boolean;
  error: string | null;
  saveScratchPad: (
    options: { variables: patientScratchPadEditMutationVariables },
  ) => { data: patientScratchPadEditMutation };
  refetchScratchPad: (variables: { patientId: string }) => void;
}

interface IState {
  saveSuccess: boolean;
  saveError: boolean;
  editedScratchPad: string;
}

type allProps = IProps & IGraphqlProps;

export class LeftNavScratchPad extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.saveScratchPad = debounce(this.saveScratchPad.bind(this), SAVE_TIMEOUT_MILLISECONDS);

    this.state = {
      saveSuccess: false,
      saveError: false,
      editedScratchPad: '',
    };
  }

  componentWillReceiveProps(nextProps: allProps): void {
    if (!this.state.editedScratchPad) {
      this.setState({
        editedScratchPad: (nextProps.scratchPad && nextProps.scratchPad.body) || '',
      });
    }
  }

  saveScratchPad = async (): Promise<void> => {
    const { saveScratchPad, scratchPad } = this.props;
    const { editedScratchPad } = this.state;

    this.setState({ saveError: false, saveSuccess: false });

    try {
      await saveScratchPad({
        variables: { patientScratchPadId: scratchPad.id, body: editedScratchPad },
      });
      this.setState({ saveSuccess: true, saveError: false });
      setTimeout(() => this.setState({ saveSuccess: false }), SAVE_SUCCESS_TIMEOUT_MILLISECONDS);
    } catch (err) {
      this.setState({ saveSuccess: false, saveError: true });
    }
  };

  onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const editedScratchPad = e.currentTarget.value;

    if (editedScratchPad.length <= MAX_SCRATCHPAD_LENGTH) {
      this.setState({ editedScratchPad, saveSuccess: false });
      this.saveScratchPad();
    }
  };

  render(): JSX.Element {
    const { loading, error } = this.props;
    const { saveSuccess, saveError, editedScratchPad } = this.state;

    const disabled = loading || !!error || saveError;
    const placeholderMessageId = loading ? 'scratchPad.loading' : 'scratchPad.empty';

    return (
      <div className={styles.container}>
        <TextArea
          disabled={disabled}
          className={styles.textarea}
          value={editedScratchPad}
          placeholderMessageId={placeholderMessageId}
          onChange={this.onChange}
        />
        <LeftNavScratchPadStatus
          saveSuccess={saveSuccess}
          saveError={saveError}
          charCount={editedScratchPad.length}
          resaveScratchPad={this.saveScratchPad}
        />
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(savePatientScratchPadMutationGraphql as any, {
    name: 'saveScratchPad',
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientScratchPadQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
        glassBreakId: props.glassBreakId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      scratchPad: data ? (data as any).patientScratchPad : null,
      refetchScratchPad: data ? data.refetch : null,
    }),
  }),
)(LeftNavScratchPad);
