import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as progressNoteIdsQuery from '../../graphql/queries/get-progress-note-ids-for-patient.graphql';
import { getProgressNoteIdsForPatientQuery } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import * as styles from './css/patient-timeline.css';
import { ProgressNoteLoadingError } from './progress-note-loading-error';
import ProgressNoteRow from './progress-note-row';

interface IProps {
  match: {
    params: {
      patientId: string;
    };
  };
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  progressNoteIds?: getProgressNoteIdsForPatientQuery['progressNoteIdsForPatient'];
}

interface IState {
  loading?: boolean;
  error: string | null;
  isQuickCallPopupVisible: boolean;
}

type allProps = IProps & IGraphqlProps;

export class PatientTimeline extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      loading: props.loading,
      error: props.error,
      isQuickCallPopupVisible: false,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error } = nextProps;

    this.setState({ loading, error });
  }

  renderProgressNotes = (
    progressNoteIds: getProgressNoteIdsForPatientQuery['progressNoteIdsForPatient'],
  ) => {
    const { loading, error } = this.state;
    if (progressNoteIds && progressNoteIds.length) {
      return progressNoteIds.map(this.renderPatientEncounter);
    } else if (!loading && !error) {
      return (
        <div className={styles.empty}>
          <EmptyPlaceholder
            icon="eventNote"
            headerMessageId="progressNote.emptyHeader"
            detailMessageId="progressNote.emptyDetail"
          />
        </div>
      );
    } else {
      return <ProgressNoteLoadingError error={error} loading={loading} />;
    }
  };

  renderPatientEncounter = (progressNoteId: string, index: number) => {
    if (progressNoteId) {
      return (
        <ProgressNoteRow
          key={index}
          progressNoteId={progressNoteId}
          patientId={this.props.match.params.patientId}
        />
      );
    }
  };

  showNewQuickCallPopup = () => {
    this.setState({
      isQuickCallPopupVisible: true,
    });
  };

  hideNewQuickCallPopup = () => {
    this.setState({
      isQuickCallPopupVisible: false,
    });
  };

  render() {
    const { progressNoteIds } = this.props;
    const progressNotesList = progressNoteIds || [];

    return (
      <div className={styles.progressNotesContainer}>
        <div className={styles.progressNotes}>{this.renderProgressNotes(progressNotesList)}</div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(progressNoteIdsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
        glassBreakId: props.glassBreakId,
        completed: true,
      },
      fetchPolicy: 'cache-and-network', // Always get the latest progress note ids
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      progressNoteIds: data ? (data as any).progressNoteIdsForPatient : null,
    }),
  }),
)(PatientTimeline);
