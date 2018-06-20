import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import patientAnswersGraphql from '../graphql/queries/get-patient-answers.graphql';
import questionsGraphql from '../graphql/queries/get-questions.graphql';
import progressNoteCompleteGraphql from '../graphql/queries/progress-note-complete-mutation.graphql';
import progressNoteCompleteSupervisorReviewGraphql from '../graphql/queries/progress-note-complete-supervisor-review-mutation.graphql';
import progressNoteEditGraphql from '../graphql/queries/progress-note-edit-mutation.graphql';
import {
  getCurrentUser,
  getPatientAnswers,
  getQuestions,
  progressNoteComplete,
  progressNoteCompleteSupervisorReview,
  progressNoteCompleteSupervisorReviewVariables,
  progressNoteCompleteVariables,
  progressNoteEdit,
  progressNoteEditVariables,
  FullProgressNote,
  FullProgressNoteTemplate,
} from '../graphql/types';
import Button from '../shared/library/button/button';
import PatientPhoto from '../shared/library/patient-photo/patient-photo';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import ProgressNoteActivity from '../shared/progress-note-activity/progress-note-activity';
import { allQuestionsAnswered, getQuestionAnswerHash } from '../shared/question/question-helpers';
import { getPatientFullName } from '../shared/util/patient-name';
import withCurrentUser, {
  IInjectedProps as ICurrentUserProps,
} from '../shared/with-current-user/with-current-user';
import styles from './css/progress-note-popup.css';
import ProgressNoteContext from './progress-note-context';
import ProgressNoteCosignature from './progress-note-cosignature';
import ProgressNoteSupervisorNotes from './progress-note-supervisor-notes';

export interface IUpdateProgressNoteOptions {
  progressNoteTemplateId: string | null;
  startedAt: string | null;
  location: string | null;
  summary: string | null;
  memberConcern: string | null;
  needsSupervisorReview?: boolean | null;
  supervisorId?: string | null;
  worryScore: number | null;
}

interface IProps {
  close: () => void;
  progressNote: FullProgressNote;
  progressNoteTemplates: FullProgressNoteTemplate[];
  mutate?: any;
}

interface IGraphqlProps {
  editProgressNote: (
    options: { variables: progressNoteEditVariables },
  ) => { data: progressNoteEdit };
  completeProgressNote: (
    options: { variables: progressNoteCompleteVariables },
  ) => { data: progressNoteComplete };
  completeProgressNoteSupervisorReview: (
    options: { variables: progressNoteCompleteSupervisorReviewVariables },
  ) => { data: progressNoteCompleteSupervisorReview };
  questionsLoading?: boolean;
  questionsError?: string | null;
  questions: getQuestions['questions'];
  patientAnswers?: getPatientAnswers['patientAnswers'];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string | null;
}

interface IState {
  tab: Tab;
  isReadyToSubmit: boolean;
  isInSupervisorMode: boolean;
}

type Tab = 'context' | 'activity' | 'supervisor';

type allProps = IProps & IGraphqlProps & ICurrentUserProps;

const getIsInSupervisorMode = (
  currentUser: getCurrentUser['currentUser'],
  progressNote?: FullProgressNote,
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

  componentWillReceiveProps(nextProps: allProps) {
    const currentProgressNote = this.props.progressNote;
    const newProgressNote = nextProps.progressNote;
    const progressNoteChanged = currentProgressNote.id !== newProgressNote.id;

    if (progressNoteChanged && nextProps.currentUser) {
      const isInSupervisorMode = getIsInSupervisorMode(nextProps.currentUser, newProgressNote);
      this.setState({
        isInSupervisorMode,
      });
    }
    this.updateReadyToSubmit(nextProps);
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
          worryScore: options.worryScore,
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
        const answerData = getQuestionAnswerHash(patientAnswers);

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
            !!progressNote.worryScore &&
            allQuestionsAnswered(questions, answerData),
        });
      }
    }
  };

  render() {
    const { close, progressNoteTemplates, progressNote, questions, patientAnswers } = this.props;
    const { tab, isReadyToSubmit, isInSupervisorMode } = this.state;

    const context =
      tab === 'context' ? (
        <ProgressNoteContext
          key={progressNote.id}
          questions={questions}
          patientAnswers={patientAnswers}
          progressNote={progressNote}
          progressNoteTemplates={progressNoteTemplates}
          onChange={this.updateProgressNote}
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

    const { gender, hasUploadedPhoto } = progressNote.patient.patientInfo;

    return (
      <div>
        <div className={styles.topBar}>
          <div className={styles.topBarLabel}>Progress Note: {progressNoteName}</div>
          <div className={styles.closeButton} onClick={close} />
        </div>
        <div className={styles.middleBar}>
          <Link className={styles.patientContainer} to={`/patients/${progressNote.patientId}`}>
            <PatientPhoto
              patientId={progressNote.patientId}
              gender={gender}
              hasUploadedPhoto={!!hasUploadedPhoto}
              type="circleLarge"
            />
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
  withCurrentUser(),
  graphql(progressNoteCompleteGraphql, {
    name: 'completeProgressNote',
    options: {
      refetchQueries: [
        'getProgressNotesForPatient',
        'getProgressNotesForCurrentUser',
        'getPatientComputedPatientStatus',
        'getPatient',
        'getProgressNoteLatestForPatient',
      ],
    },
  }),
  graphql(progressNoteEditGraphql, {
    name: 'editProgressNote',
    options: {
      refetchQueries: [
        'getProgressNotesForPatient',
        'getProgressNotesForCurrentUser',
        'getProgressNotesForSupervisorReview',
      ],
    },
  }),
  graphql(progressNoteCompleteSupervisorReviewGraphql, {
    name: 'completeProgressNoteSupervisorReview',
    options: {
      refetchQueries: ['getProgressNotesForPatient', 'getProgressNotesForSupervisorReview'],
    },
  }),
  graphql(questionsGraphql, {
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
  graphql(patientAnswersGraphql, {
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
)(ProgressNotePopup) as React.ComponentClass<IProps>;
