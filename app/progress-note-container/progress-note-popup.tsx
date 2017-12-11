import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage, FormattedRelative } from 'react-intl';
/* tslint:disable:max-line-length */
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import * as progressNotesQuery from '../graphql/queries/get-progress-notes-for-patient.graphql';
import * as progressNoteCompleteMutationGraphql from '../graphql/queries/progress-note-complete-mutation.graphql';
import * as progressNoteCreateMutationGraphql from '../graphql/queries/progress-note-create.graphql';
import * as progressNoteEditMutationGraphql from '../graphql/queries/progress-note-edit-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  progressNoteCompleteMutation,
  progressNoteCompleteMutationVariables,
  progressNoteCreateMutation,
  progressNoteCreateMutationVariables,
  progressNoteEditMutation,
  progressNoteEditMutationVariables,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
} from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import Button from '../shared/library/button/button';
import ProgressNoteActivity from '../shared/progress-note-activity/progress-note-activity';
import { getPatientFullName } from '../shared/util/patient-name';
import * as styles from './css/progress-note-popup.css';
import ProgressNoteContext from './progress-note-context';
import ProgressNoteTasks from './progress-note-tasks';

interface IProps {
  close: () => void;
  patientId: string | null;
  visible: boolean;
  mutate?: any;
}

interface IGraphqlProps {
  editProgressNote: (
    options: { variables: progressNoteEditMutationVariables },
  ) => { data: progressNoteEditMutation };
  completeProgressNote: (
    options: { variables: progressNoteCompleteMutationVariables },
  ) => { data: progressNoteCompleteMutation };
  createProgressNote: (
    options: { variables: progressNoteCreateMutationVariables },
  ) => { data: progressNoteCreateMutation };
  progressNoteTemplatesLoading?: boolean;
  progressNoteTemplatesError?: string | null;
  progressNoteTemplates: FullProgressNoteTemplateFragment[];
  progressNoteError?: string | null;
  progressNoteLoading?: boolean;
  progressNote?: FullProgressNoteFragment;
}

interface IState {
  tab: Tab;
  readyToSubmit: boolean;
}

type Tab = 'context' | 'activity' | 'tasks';

type allProps = IProps & IGraphqlProps;

export class ProgressNotePopup extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      tab: 'context',
      readyToSubmit: false,
    };
  }

  componentWillReceiveProps(newProps: allProps) {
    if (newProps.patientId && !newProps.progressNote && !newProps.progressNoteLoading) {
      this.props.createProgressNote({ variables: { patientId: newProps.patientId } });
    }
  }

  updateProgressNote = async (options: {
    progressNoteTemplateId: string;
    startedAt: string | null;
    location: string | null;
    summary: string | null;
  }) => {
    const { progressNote } = this.props;

    if (progressNote) {
      await this.props.editProgressNote({
        variables: {
          progressNoteId: progressNote.id,
          progressNoteTemplateId: options.progressNoteTemplateId,
          startedAt: options.startedAt,
          location: options.location,
          summary: options.summary,
        },
      });
    }
  };

  selectTab = (tab: Tab) => {
    this.setState({ tab });
  };

  submit = async () => {
    const { progressNote } = this.props;
    const { readyToSubmit } = this.state;
    if (progressNote && readyToSubmit) {
      await this.props.completeProgressNote({
        variables: {
          progressNoteId: progressNote.id,
        },
      });
      this.props.close();
    }
    // todo: handle error
  };

  updateReadyToSubmit = (readyToSubmit: boolean) => {
    this.setState({ readyToSubmit });
  };

  render() {
    const { close, visible, patientId, progressNoteTemplates, progressNote } = this.props;
    const { tab, readyToSubmit } = this.state;

    const contextStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'context',
    });
    const containerStyles = classNames(styles.container, {
      [styles.visible]: visible,
    });
    const activityTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'activity',
    });
    const tasksTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'tasks',
    });
    const context =
      tab === 'context' ? (
        <ProgressNoteContext
          updateReadyToSubmit={this.updateReadyToSubmit}
          patientId={patientId}
          progressNote={progressNote}
          progressNoteTemplates={progressNoteTemplates}
          onChange={this.updateProgressNote}
        />
      ) : null;
    const activity =
      tab === 'activity' ? (
        <ProgressNoteActivity progressNote={progressNote} patientId={patientId} />
      ) : null;
    const tasks = tab === 'tasks' && patientId ? <ProgressNoteTasks patientId={patientId} /> : null;

    let progressNoteName = null;
    if (progressNote && progressNote.progressNoteTemplate) {
      progressNoteName = progressNote.progressNoteTemplate.title;
    }
    const patientName =
      progressNote && progressNote.patient ? getPatientFullName(progressNote.patient) : 'Unknown';
    const openedAt = progressNote ? (
      <FormattedRelative value={progressNote.createdAt}>
        {(date: string) => <div className={styles.openedAt}>Opened: {date}</div>}
      </FormattedRelative>
    ) : null;
    return (
      <div className={containerStyles}>
        <div className={styles.topBar}>
          <div className={styles.topBarLabel}>Progress Note: {progressNoteName}</div>
          <div className={styles.closeButton} onClick={close} />
        </div>
        <div className={styles.middleBar}>
          <div className={styles.patientContainer}>
            <div
              className={styles.patientPhoto}
              style={{ backgroundImage: `url('http://bit.ly/2vaOMQJ')` }}
            />
            <div className={styles.patientContainerRight}>
              <div className={styles.patientName}>{patientName}</div>
              {openedAt}
            </div>
          </div>
          <Button
            onClick={this.submit}
            className={readyToSubmit ? null : styles.buttonInactive}
            messageId="patient.submitProgressNote"
            color="blue"
          />
        </div>
        <div className={tabStyles.tabs}>
          <FormattedMessage id="patient.context">
            {(message: string) => (
              <a onClick={() => this.selectTab('context')} className={contextStyles}>
                {message}
              </a>
            )}
          </FormattedMessage>
          <FormattedMessage id="patient.activity">
            {(message: string) => (
              <a onClick={() => this.selectTab('activity')} className={activityTabStyles}>
                {message}
              </a>
            )}
          </FormattedMessage>
          <FormattedMessage id="patient.tasks">
            {(message: string) => (
              <a onClick={() => this.selectTab('tasks')} className={tasksTabStyles}>
                {message}
              </a>
            )}
          </FormattedMessage>
        </div>
        <div className={styles.bottomSection}>
          {context}
          {activity}
          {tasks}
        </div>
      </div>
    );
  }
}

function getProgressNote(data: any) {
  if (data && data.progressNotesForPatient) {
    return data.progressNotesForPatient[0];
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(progressNoteCompleteMutationGraphql as any, {
    name: 'completeProgressNote',
    options: { refetchQueries: ['getProgressNotesForPatient', 'getProgressNotesForCurrentUser'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteCreateMutationGraphql as any, {
    name: 'createProgressNote',
    options: { refetchQueries: ['getProgressNotesForPatient', 'getProgressNotesForCurrentUser'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteEditMutationGraphql as any, {
    name: 'editProgressNote',
    options: { refetchQueries: ['getProgressNotesForPatient', 'getProgressNotesForCurrentUser'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNotesQuery as any, {
    skip: (props: IProps) => !props.patientId,
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
        completed: false,
      },
    }),
    props: ({ data }) => ({
      progressNoteLoading: data ? data.loading : false,
      progressNoteError: data ? data.error : null,
      progressNote: data ? getProgressNote(data as any) : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteTemplatesQuery as any, {
    props: ({ data }) => ({
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
)(ProgressNotePopup);
