import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import * as progressNoteQuery from '../graphql/queries/get-progress-note.graphql';
import * as progressNoteCompleteMutationGraphql from '../graphql/queries/progress-note-complete-mutation.graphql';
import * as progressNoteEditMutationGraphql from '../graphql/queries/progress-note-edit-mutation.graphql';
import {
  getCurrentUserQuery,
  progressNoteCompleteMutation,
  progressNoteCompleteMutationVariables,
  progressNoteCreateMutation,
  progressNoteCreateMutationVariables,
  progressNoteEditMutation,
  progressNoteEditMutationVariables,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
} from '../graphql/types';
import { DEFAULT_PATIENT_AVATAR_URL } from '../patient-profile-container/patient-left-nav-info';
import Button from '../shared/library/button/button';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import ProgressNoteActivity from '../shared/progress-note-activity/progress-note-activity';
import { getPatientFullName } from '../shared/util/patient-name';
import * as styles from './css/progress-note-popup.css';
import ProgressNoteContext from './progress-note-context';
import ProgressNoteCosignature from './progress-note-cosignature';
import ProgressNoteSupervisorNotes from './progress-note-supervisor-notes';

export interface IUpdateProgressNoteOptions {
  progressNoteTemplateId: string | null;
  startedAt: string | null;
  location: string | null;
  summary: string | null;
  memberConcern: string | null;
  needsSupervisorReview: boolean | null;
  supervisorId: string | null;
}

interface IProps {
  currentUser: getCurrentUserQuery['currentUser'];
  close: () => void;
  progressNoteId: string;
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
  isReadyToSubmit: boolean;
  isInSupervisorMode: boolean;
}

type Tab = 'context' | 'activity' | 'supervisor';

type allProps = IProps & IGraphqlProps;

const getIsInSupervisorMode = (
  currentUser: getCurrentUserQuery['currentUser'],
  progressNote?: FullProgressNoteFragment,
) => {
  return currentUser &&
    progressNote &&
    progressNote.supervisor &&
    currentUser.id === progressNote.supervisor.id
    ? true
    : false;
};

export class ProgressNotePopup extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      tab: 'context',
      isReadyToSubmit: false,
      isInSupervisorMode: getIsInSupervisorMode(props.currentUser, props.progressNote),
    };
  }

  componentWillReceiveProps(newProps: allProps) {
    if (newProps.currentUser && newProps.progressNote) {
      this.setState({
        isInSupervisorMode: getIsInSupervisorMode(newProps.currentUser, newProps.progressNote),
      });
    }
  }

  updateProgressNote = async (options: IUpdateProgressNoteOptions) => {
    const { progressNote } = this.props;

    if (progressNote) {
      await this.props.editProgressNote({
        variables: {
          progressNoteId: progressNote.id,
          progressNoteTemplateId: options.progressNoteTemplateId,
          location: options.location,
          summary: options.summary,
          memberConcern: options.memberConcern,
          needsSupervisorReview: options.needsSupervisorReview,
          supervisorId: options.supervisorId,
        },
      });
    }
  };

  selectTab = (tab: Tab) => {
    this.setState({ tab });
  };

  submit = async () => {
    const { progressNote } = this.props;
    const { isReadyToSubmit } = this.state;
    if (progressNote && isReadyToSubmit) {
      await this.props.completeProgressNote({
        variables: {
          progressNoteId: progressNote.id,
        },
      });
      this.props.close();
    }
    // todo: handle error
  };

  updateReadyToSubmit = (isReadyToSubmit: boolean) => {
    this.setState({ isReadyToSubmit });
  };

  render() {
    const { close, visible, progressNoteTemplates, progressNote, currentUser } = this.props;
    const { tab, isReadyToSubmit, isInSupervisorMode } = this.state;

    const patientId = progressNote ? progressNote.patientId : null;
    const containerStyles = classNames(styles.container, {
      [styles.visible]: visible,
    });

    const context =
      tab === 'context' ? (
        <ProgressNoteContext
          updateReadyToSubmit={this.updateReadyToSubmit}
          progressNote={progressNote}
          progressNoteTemplates={progressNoteTemplates}
          onChange={this.updateProgressNote}
          currentUser={currentUser}
          disabled={isInSupervisorMode}
        />
      ) : null;
    const activity =
      tab === 'activity' && progressNote ? (
        <ProgressNoteActivity progressNote={progressNote} />
      ) : null;
    const supervisorHtml =
      tab === 'supervisor' && progressNote ? (
        <ProgressNoteSupervisorNotes
          progressNote={progressNote}
          updateReadyToSubmit={this.updateReadyToSubmit}
        />
      ) : null;

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
    // only render cosignature if progress note template has been selected
    const cosignature =
      progressNoteName && tab === 'context' ? (
        <ProgressNoteCosignature
          progressNote={progressNote}
          updateProgressNote={this.updateProgressNote}
          disabled={isInSupervisorMode}
        />
      ) : null;
    const supervisorTab = isInSupervisorMode ? (
      <UnderlineTab
        onClick={() => this.selectTab('supervisor')}
        messageId="progressNote.supervisorReview"
        selected={tab === 'supervisor'}
      />
    ) : null;
    return (
      <div className={containerStyles}>
        <div className={styles.topBar}>
          <div className={styles.topBarLabel}>Progress Note: {progressNoteName}</div>
          <div className={styles.closeButton} onClick={close} />
        </div>
        <div className={styles.middleBar}>
          <Link className={styles.patientContainer} to={`/patients/${patientId}`}>
            <div
              className={styles.patientPhoto}
              style={{ backgroundImage: `url('${DEFAULT_PATIENT_AVATAR_URL}')` }}
            />
            <div className={styles.patientContainerRight}>
              <div className={styles.patientName}>{patientName}</div>
              {openedAt}
            </div>
          </Link>
          <Button
            onClick={this.submit}
            disabled={!isReadyToSubmit}
            messageId="patient.submitProgressNote"
            color="blue"
          />
        </div>
        <UnderlineTabs>
          <UnderlineTab
            onClick={() => this.selectTab('context')}
            messageId="patient.context"
            selected={tab === 'context'}
          />
          <UnderlineTab
            onClick={() => this.selectTab('activity')}
            messageId="patient.activity"
            selected={tab === 'activity'}
          />
          {supervisorTab}
        </UnderlineTabs>
        <div className={styles.bottomSection}>
          {context}
          {activity}
          {supervisorHtml}
          {cosignature}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(progressNoteCompleteMutationGraphql as any, {
    name: 'completeProgressNote',
    options: { refetchQueries: ['getProgressNotesForPatient', 'getProgressNotesForCurrentUser'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteEditMutationGraphql as any, {
    name: 'editProgressNote',
    options: { refetchQueries: ['getProgressNotesForPatient', 'getProgressNotesForCurrentUser'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteQuery as any, {
    skip: (props: IProps) => !props.progressNoteId,
    options: (props: IProps) => ({
      variables: {
        progressNoteId: props.progressNoteId,
      },
    }),
    props: ({ data }) => ({
      progressNoteLoading: data ? data.loading : false,
      progressNoteError: data ? data.error : null,
      progressNote: data ? (data as any).progressNote : null,
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
