import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import * as progressNoteIdsQuery from '../../graphql/queries/get-progress-note-ids-for-patient.graphql';
import * as progressNoteCreateMutationGraphql from '../../graphql/queries/progress-note-create.graphql';
import {
  getProgressNoteIdsForPatientQuery,
  progressNoteCreateMutation,
  progressNoteCreateMutationVariables,
} from '../../graphql/types';
import * as sortSearchStyles from '../../shared/css/sort-search.css';
import Button from '../../shared/library/button/button';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
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
  glassBreakId: string | null;
}

interface IDispatchProps {
  openProgressNotePopup: (progressNoteId: string) => any;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  progressNoteIds?: getProgressNoteIdsForPatientQuery['progressNoteIdsForPatient'];
  progressNoteCreate?: (
    options: { variables: progressNoteCreateMutationVariables },
  ) => { data: progressNoteCreateMutation };
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

  showNewProgressNotePopup = async () => {
    const { progressNoteCreate, openProgressNotePopup } = this.props;
    if (progressNoteCreate) {
      const progressNote = await progressNoteCreate({
        variables: {
          patientId: this.props.match.params.patientId,
        },
      });
      if (progressNote.data.progressNoteCreate) {
        openProgressNotePopup(progressNote.data.progressNoteCreate.id);
      }
      // todo handle error
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
    const { isQuickCallPopupVisible } = this.state;
    const { progressNoteIds, match } = this.props;
    const patientId = match.params.patientId;
    const progressNotesList = progressNoteIds || [];

    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.topBar)}>
          <div className={styles.saveButtonGroup}>
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
  graphql<IGraphqlProps, IProps, allProps>(progressNoteCreateMutationGraphql as any, {
    name: 'progressNoteCreate',
    options: { refetchQueries: ['getProgressNotesForCurrentUser'] },
  }),
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
