import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import * as progressNotesQuery from '../graphql/queries/get-progress-notes-for-patient.graphql';
import * as progressNoteCompleteMutationGraphql from '../graphql/queries/progress-note-complete-mutation.graphql';
import * as progressNoteCreateMutationGraphql from '../graphql/queries/progress-note-create.graphql';
import * as progressNoteEditMutationGraphql from '../graphql/queries/progress-note-edit-mutation.graphql';
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
import Button from '../shared/library/button/button';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import ProgressNoteActivity from '../shared/progress-note-activity/progress-note-activity';
import { getPatientFullName } from '../shared/util/patient-name';
import * as styles from './css/progress-note-popup.css';
import ProgressNoteContext from './progress-note-context';
import ProgressNoteCosigniture from './progress-note-cosigniture';

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

type Tab = 'context' | 'activity';

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

    const containerStyles = classNames(styles.container, {
      [styles.visible]: visible,
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
      tab === 'activity' && patientId ? (
        <ProgressNoteActivity progressNote={progressNote} patientId={patientId} />
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
    // only render cosigniture if progress note template has been selected
    const cosigniture = progressNoteName ? (
      <ProgressNoteCosigniture
        patientId={patientId}
        progressNote={progressNote}
        updateProgressNote={this.updateProgressNote}
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
              style={{ backgroundImage: `url('http://bit.ly/2vaOMQJ')` }}
            />
            <div className={styles.patientContainerRight}>
              <div className={styles.patientName}>{patientName}</div>
              {openedAt}
            </div>
          </Link>
          <Button
            onClick={this.submit}
            disabled={!readyToSubmit}
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
        </UnderlineTabs>
        <div className={styles.bottomSection}>
          {context}
          {activity}
          {cosigniture}
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
