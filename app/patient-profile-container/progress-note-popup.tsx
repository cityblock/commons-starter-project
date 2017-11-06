import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage, FormattedRelative } from 'react-intl';
/* tslint:disable:max-line-length */
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import * as progressNoteCompleteMutationGraphql from '../graphql/queries/progress-note-complete-mutation.graphql';
import * as progressNoteEditMutationGraphql from '../graphql/queries/progress-note-edit-mutation.graphql';
import * as progressNoteGetOrCreateMutationGraphql from '../graphql/queries/progress-note-get-or-create.graphql';
/* tslint:enable:max-line-length */
import {
  progressNoteCompleteMutation,
  progressNoteCompleteMutationVariables,
  progressNoteEditMutation,
  progressNoteEditMutationVariables,
  progressNoteGetOrCreateMutation,
  progressNoteGetOrCreateMutationVariables,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
  ShortPatientFragment,
} from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import { Popup } from '../shared/popup/popup';
import { getPatientFullName } from '../shared/util/patient-name';
import * as styles from './css/progress-note-popup.css';
import ProgressNoteActivity from './progress-note-activity';
import ProgressNoteContext from './progress-note-context';
import ProgressNoteTasks from './progress-note-tasks';

interface IProps {
  close: () => void;
  patientId: string;
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
  getOrCreateProgressNote: (
    options: { variables: progressNoteGetOrCreateMutationVariables },
  ) => { data: progressNoteGetOrCreateMutation };
  progressNoteTemplatesLoading?: boolean;
  progressNoteTemplatesError?: string;
  progressNoteTemplates: FullProgressNoteTemplateFragment[];
  patientLoading?: boolean;
  patientError?: string;
  patient?: ShortPatientFragment;
}

interface IState {
  tab: Tab;
  progressNote?: FullProgressNoteFragment | null;
}

type Tab = 'context' | 'activity' | 'tasks';

type allProps = IProps & IGraphqlProps;

export class ProgressNotePopup extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.selectTab = this.selectTab.bind(this);
    this.submit = this.submit.bind(this);
    this.updateProgressNote = this.updateProgressNote.bind(this);

    this.state = {
      tab: 'context',
    };
  }

  componentWillMount() {
    this.setProgressNote();
  }

  async setProgressNote() {
    const { patientId } = this.props;
    const response = await this.props.getOrCreateProgressNote({ variables: { patientId } });
    this.setState({
      progressNote: response.data.progressNoteGetOrCreate,
    });
  }

  selectTab(tab: Tab) {
    this.setState({ tab });
  }

  async updateProgressNote(progressNoteTemplateId: string) {
    const { progressNote } = this.state;
    if (progressNote) {
      const response = await this.props.editProgressNote({
        variables: {
          progressNoteId: progressNote.id,
          progressNoteTemplateId,
        },
      });
      if (response.data && response.data.progressNoteEdit) {
        this.setState({
          progressNote: response.data.progressNoteEdit,
        });
      }
    }
  }

  async submit() {
    const { progressNote } = this.state;
    if (progressNote) {
      await this.props.completeProgressNote({
        variables: {
          progressNoteId: progressNote.id,
        },
      });
    }
  }

  render() {
    const { close, visible, patientId, progressNoteTemplates, patient } = this.props;
    const { tab, progressNote } = this.state;

    const contextStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'context',
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
          patientId={patientId}
          progressNoteTemplates={progressNoteTemplates}
          onChange={this.updateProgressNote}
        />
      ) : null;
    const activity = tab === 'activity' ? <ProgressNoteActivity patientId={patientId} /> : null;
    const tasks = tab === 'tasks' ? <ProgressNoteTasks patientId={patientId} /> : null;

    let progressNoteName = null;
    if (progressNote && progressNote.progressNoteTemplate) {
      progressNoteName = progressNote.progressNoteTemplate.title;
    }
    const patientName = patient ? getPatientFullName(patient) : 'Unknown';
    const openedAt = progressNote ? (
      <FormattedRelative value={progressNote.createdAt}>
        {(date: string) => <div className={styles.openedAt}>Opened: {date}</div>}
      </FormattedRelative>
    ) : null;
    return (
      <Popup visible={visible} style={'no-padding'}>
        <div>
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
            <FormattedMessage id="patient.submitProgressNote">
              {(message: string) => (
                <div onClick={this.submit} className={styles.button}>
                  {message}
                </div>
              )}
            </FormattedMessage>
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
          {context}
          {activity}
          {tasks}
        </div>
      </Popup>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(progressNoteCompleteMutationGraphql as any, {
    name: 'completeProgressNote',
  }),
  graphql<IGraphqlProps, IProps>(progressNoteGetOrCreateMutationGraphql as any, {
    name: 'getOrCreateProgressNote',
  }),
  graphql<IGraphqlProps, IProps>(progressNoteEditMutationGraphql as any, {
    name: 'editProgressNote',
  }),
  graphql<IGraphqlProps, IProps>(patientQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'cache-only',
    }),
    props: ({ data }) => ({
      patientLoading: data ? data.loading : false,
      patientError: data ? data.error : null,
      patient: data ? (data as any).patient : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(progressNoteTemplatesQuery as any, {
    props: ({ data }) => ({
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
)(ProgressNotePopup);
