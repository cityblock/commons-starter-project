import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import * as progressNotesQuery from '../../graphql/queries/get-progress-notes-for-patient.graphql';
import { getProgressNotesForPatientQuery, FullProgressNoteFragment } from '../../graphql/types';
import * as sortSearchStyles from '../../shared/css/sort-search.css';
import Button from '../../shared/library/button/button';
import * as patientInfoStyles from './../css/patient-info.css';
import * as styles from './css/patient-timeline.css';
import { ProgressNoteLoadingError } from './progress-note-loading-error';
import ProgressNoteRow from './progress-note-row';
import QuickCallPopup from './quick-call-popup';

interface IProps {
  match: {
    params: {
      patientId: string;
    };
  };
}

interface IDispatchProps {
  openProgressNotePopup: (progressNoteId: string) => any;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  progressNotes?: getProgressNotesForPatientQuery['progressNotesForPatient'];
}

interface IState {
  loading?: boolean;
  error: string | null;
  isQuickCallPopupVisible: boolean;
}

type allProps = IProps & IGraphqlProps & IDispatchProps;

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
    progressNotes: getProgressNotesForPatientQuery['progressNotesForPatient'],
  ) => {
    const { loading, error } = this.state;
    if (progressNotes && progressNotes.length) {
      return progressNotes
        .filter(progressNote => progressNote && progressNote.completedAt)
        .map(this.renderPatientEncounter);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo} />
          <div className={styles.emptyLabel}>No encounter history for this patient</div>
          <div className={styles.emptySubtext}>
            Future encounters with this patient will be displayed here.
          </div>
        </div>
      );
    } else {
      return <ProgressNoteLoadingError error={error} loading={loading} />;
    }
  };

  renderPatientEncounter = (progressNote: FullProgressNoteFragment | null, index: number) => {
    if (progressNote) {
      return (
        <ProgressNoteRow
          key={index}
          progressNote={progressNote}
          patientId={this.props.match.params.patientId}
        />
      );
    }
  };

  showNewProgressNotePopup = () => {
    // TODO
    return false;
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
    const { isQuickCallPopupVisible } = this.state;
    const { progressNotes, match } = this.props;
    const patientId = match.params.patientId;
    const progressNotesList = progressNotes || [];

    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.topBar)}>
          <div className={patientInfoStyles.saveButtonGroup}>
            <Button
              color="teal"
              messageId="quickCallNote.new"
              onClick={this.showNewQuickCallPopup}
              className={styles.buttonSpacing}
            />
            <Button messageId="progressNote.new" onClick={this.showNewProgressNotePopup} />
          </div>
        </div>
        <div className={styles.progressNotesContainer}>
          <div className={styles.progressNotes}>{this.renderProgressNotes(progressNotesList)}</div>
        </div>
        <QuickCallPopup
          patientId={patientId}
          visible={isQuickCallPopupVisible}
          close={this.hideNewQuickCallPopup}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): IDispatchProps {
  return {
    openProgressNotePopup: (progressNoteId: string) =>
      dispatch(
        openPopup({
          name: 'PROGRESS_NOTE',
          options: {
            progressNoteId,
          },
        }),
      ),
  };
}

export default compose(
  connect<{}, IDispatchProps, allProps>(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(progressNotesQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
        completed: true,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      progressNotes: data ? (data as any).progressNotesForPatient : null,
    }),
  }),
)(PatientTimeline);
