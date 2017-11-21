import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as progressNotesQuery from '../graphql/queries/get-progress-notes-for-patient.graphql';
import { getProgressNotesForPatientQuery, FullProgressNoteFragment } from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as patientInfoStyles from './css/patient-info.css';
import * as styles from './css/patient-timeline.css';
import { ProgressNoteLoadingError } from './progress-note-loading-error';
import ProgressNotePopup from './progress-note-popup';
import ProgressNoteRow from './progress-note-row';

interface IProps {
  match: {
    params: {
      patientId: string;
    };
  };
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string;
  progressNotes?: getProgressNotesForPatientQuery['progressNotesForPatient'];
}

interface IState {
  loading?: boolean;
  error?: string;
  isProgressNotePopupVisible: boolean;
}

type allProps = IProps & IGraphqlProps;

export class PatientTimeline extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      loading: props.loading,
      error: props.error,
      isProgressNotePopupVisible: false,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
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

  renderPatientEncounter(progressNote: FullProgressNoteFragment | null, index: number) {
    if (progressNote) {
      return <ProgressNoteRow key={index} progressNote={progressNote} />;
    }
  }

  showNewProgressNotePopup = () => {
    this.setState({
      isProgressNotePopupVisible: true,
    });
  };

  hideNewProgressNotePopup = () => {
    this.setState({
      isProgressNotePopupVisible: false,
    });
  };

  render() {
    const { isProgressNotePopupVisible } = this.state;
    const { progressNotes, match } = this.props;
    const patientId = match.params.patientId;
    const progressNotesList = progressNotes || [];
    const saveButtonStyles = classNames(patientInfoStyles.button, patientInfoStyles.saveButton);
    return (
      <div>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select defaultValue="Newest first">
                <option value="Newest first">Newest first</option>
              </select>
            </div>
            <div className={classNames(sortSearchStyles.search, sortSearchStyles.searchLeftPad)}>
              <input defaultValue="" type="text" placeholder="Search by user or keywords" />
            </div>
          </div>
          <div className={patientInfoStyles.saveButtonGroup}>
            <div className={saveButtonStyles} onClick={this.showNewProgressNotePopup}>
              <FormattedMessage id="patient.newProgressNote">
                {(message: string) => <span>{message}</span>}
              </FormattedMessage>
            </div>
          </div>
        </div>
        <div className={styles.progressNotesContainer}>
          <div className={styles.progressNotes}>{this.renderProgressNotes(progressNotesList)}</div>
        </div>
        <ProgressNotePopup
          patientId={patientId}
          visible={isProgressNotePopupVisible}
          close={this.hideNewProgressNotePopup}
        />
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(progressNotesQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      progressNotes: data ? (data as any).progressNotesForPatient : null,
    }),
  }),
)(PatientTimeline);
