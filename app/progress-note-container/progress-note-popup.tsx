import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import * as patientAnswersQuery from '../graphql/queries/get-patient-answers.graphql';
import * as questionsQuery from '../graphql/queries/get-questions.graphql';
import * as progressNoteCompleteMutationGraphql from '../graphql/queries/progress-note-complete-mutation.graphql';
import * as progressNoteCompleteSupervisorReviewMutationGraphql from '../graphql/queries/progress-note-complete-supervisor-review-mutation.graphql';
import * as progressNoteEditMutationGraphql from '../graphql/queries/progress-note-edit-mutation.graphql';
import {
  getCurrentUserQuery,
  getPatientAnswersQuery,
  getQuestionsQuery,
  progressNoteCompleteMutation,
  progressNoteCompleteMutationVariables,
  progressNoteCompleteSupervisorReviewMutation,
  progressNoteCompleteSupervisorReviewMutationVariables,
  progressNoteEditMutation,
  progressNoteEditMutationVariables,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
} from '../graphql/types';
import Avatar from '../shared/library/avatar/avatar';
import Button from '../shared/library/button/button';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import ProgressNoteActivity from '../shared/progress-note-activity/progress-note-activity';
import {
  allQuestionsAnswered,
  setupQuestionAnswerHash,
  updateQuestionAnswerHash,
} from '../shared/question/question-helpers';
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
  progressNote: FullProgressNoteFragment;
  progressNoteTemplates: FullProgressNoteTemplateFragment[];
  mutate?: any;
}

interface IGraphqlProps {
  editProgressNote: (
    options: { variables: progressNoteEditMutationVariables },
  ) => { data: progressNoteEditMutation };
  completeProgressNote: (
    options: { variables: progressNoteCompleteMutationVariables },
  ) => { data: progressNoteCompleteMutation };
  completeProgressNoteSupervisorReview: (
    options: { variables: progressNoteCompleteSupervisorReviewMutationVariables },
  ) => { data: progressNoteCompleteSupervisorReviewMutation };
  questionsLoading?: boolean;
  questionsError?: string | null;
  questions: getQuestionsQuery['questions'];
  patientAnswers?: getPatientAnswersQuery['patientAnswers'];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string | null;
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

  componentDidMount() {
    this.updateReadyToSubmit(this.props);
  }

  componentWillReceiveProps(newProps: allProps) {
    const currentProgressNote = this.props.progressNote;
    const newProgressNote = newProps.progressNote;
    const progressNoteChanged = currentProgressNote.id !== newProgressNote.id;

    if (progressNoteChanged && newProps.currentUser) {
      const isInSupervisorMode = getIsInSupervisorMode(newProps.currentUser, newProgressNote);
      this.setState({
        isInSupervisorMode,
      });
    }
    this.updateReadyToSubmit(newProps);
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

  submitSupervisorReview = async () => {
    const { progressNote } = this.props;
    const { isReadyToSubmit } = this.state;
    if (progressNote && isReadyToSubmit) {
      await this.props.completeProgressNoteSupervisorReview({
        variables: {
          progressNoteId: progressNote.id,
        },
      });
      this.props.close();
    }
    // todo: handle error
  };

  updateReadyToSubmit = (props: allProps) => {
    const { progressNote, patientAnswers, questions } = props;
    const { isInSupervisorMode } = this.state;

    if (isInSupervisorMode) {
      this.setState({ isReadyToSubmit: !!progressNote.supervisorNotes });
    } else {
      if (patientAnswers) {
        const answerData = setupQuestionAnswerHash({}, questions);
        updateQuestionAnswerHash(answerData, patientAnswers || []);

        // update ready to submit
        const hasProgressNoteTemplate = progressNote.progressNoteTemplate ? true : false;
        const hasSummaryAndConcern =
          progressNote.memberConcern && progressNote.summary ? true : false;
        const filledOutCosignitureIfRequired = progressNote.needsSupervisorReview
          ? !!progressNote.supervisor && !!progressNote.supervisor.id
          : true;

        this.setState({
          isReadyToSubmit:
            hasProgressNoteTemplate &&
            hasSummaryAndConcern &&
            filledOutCosignitureIfRequired &&
            allQuestionsAnswered(questions, answerData),
        });
      }
    }
  };

  render() {
    const {
      close,
      progressNoteTemplates,
      progressNote,
      currentUser,
      questions,
      patientAnswers,
    } = this.props;
    const { tab, isReadyToSubmit, isInSupervisorMode } = this.state;

    const context =
      tab === 'context' ? (
        <ProgressNoteContext
          questions={questions}
          patientAnswers={patientAnswers}
          progressNote={progressNote}
          progressNoteTemplates={progressNoteTemplates}
          onChange={this.updateProgressNote}
          currentUser={currentUser}
          disabled={isInSupervisorMode}
          close={close}
        />
      ) : null;
    const activity =
      tab === 'activity' && progressNote ? (
        <ProgressNoteActivity progressNote={progressNote} />
      ) : null;
    const supervisorHtml =
      tab === 'supervisor' && progressNote ? (
        <ProgressNoteSupervisorNotes progressNote={progressNote} />
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
    const submitButton = isInSupervisorMode ? (
      <Button
        onClick={this.submitSupervisorReview}
        disabled={!isReadyToSubmit}
        messageId="progressNote.submitSupervisorReview"
        color="blue"
      />
    ) : (
      <Button
        onClick={this.submit}
        disabled={!isReadyToSubmit}
        messageId="patient.submitProgressNote"
        color="blue"
      />
    );

    return (
      <div>
        <div className={styles.topBar}>
          <div className={styles.topBarLabel}>Progress Note: {progressNoteName}</div>
          <div className={styles.closeButton} onClick={close} />
        </div>
        <div className={styles.middleBar}>
          <Link className={styles.patientContainer} to={`/patients/${progressNote.patientId}`}>
            <Avatar avatarType="patient" size="large" />
            <div className={styles.patientContainerRight}>
              <div className={styles.patientName}>{patientName}</div>
              {openedAt}
            </div>
          </Link>
          {submitButton}
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
    options: {
      refetchQueries: [
        'getProgressNotesForPatient',
        'getProgressNotesForCurrentUser',
        'getProgressNotesForSupervisorReview',
      ],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(
    progressNoteCompleteSupervisorReviewMutationGraphql as any,
    {
      name: 'completeProgressNoteSupervisorReview',
      options: {
        refetchQueries: ['getProgressNotesForPatient', 'getProgressNotesForSupervisorReview'],
      },
    },
  ),
  graphql<IGraphqlProps, IProps, allProps>(questionsQuery as any, {
    skip: (props: IProps) => !props.progressNote.progressNoteTemplate,
    options: (props: IProps) => ({
      variables: {
        filterType: 'progressNoteTemplate',
        filterId: props.progressNote.progressNoteTemplate!.id,
      },
    }),
    props: ({ data }) => ({
      questionsLoading: data ? data.loading : false,
      questionsError: data ? data.error : null,
      questions: data ? (data as any).questions : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'progressNote',
        filterId: props.progressNote.id,
        patientId: props.progressNote.patientId,
      },
    }),
    props: ({ data }) => ({
      patientAnswersLoading: data ? data.loading : false,
      patientAnswersError: data ? data.error : null,
      patientAnswers: data ? (data as any).patientAnswers : null,
    }),
  }),
)(ProgressNotePopup);
