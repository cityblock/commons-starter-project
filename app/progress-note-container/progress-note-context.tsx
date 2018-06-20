import { debounce } from 'lodash';
import React from 'react';
import { graphql, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import clinicsGraphql from '../graphql/queries/get-clinics.graphql';
import patientAnswersCreateGraphql from '../graphql/queries/patient-answers-create-mutation.graphql';
import {
  getClinics,
  getPatientAnswers,
  getQuestions,
  patientAnswersCreate,
  patientAnswersCreateVariables,
  AnswerFilterType,
  FullProgressNote,
  FullProgressNoteTemplate,
  FullQuestion,
} from '../graphql/types';
import FormLabel from '../shared/library/form-label/form-label';
import Icon from '../shared/library/icon/icon';
import Select from '../shared/library/select/select';
import { createPatientAnswer } from '../shared/patient-answer-create-mutation/patient-answer-create-mutation';
import PatientQuestion from '../shared/question/patient-question';
import {
  getQuestionAnswerHash,
  getQuestionVisibility,
  IQuestionAnswerHash,
} from '../shared/question/question-helpers';
import styles from './css/progress-note-context.css';
import { ProgressNoteLocation } from './progress-note-location';
import { IUpdateProgressNoteOptions } from './progress-note-popup';
import ProgressNoteTextArea from './progress-note-textarea';

import { getCurrentTime, ProgressNoteTime } from './progress-note-time';
import ProgressNoteWorryScore from './progress-note-worry-score';

interface IProps {
  disabled: boolean;
  close: () => void;
  progressNote: FullProgressNote;
  progressNoteTemplates: FullProgressNoteTemplate[];
  patientAnswers?: getPatientAnswers['patientAnswers'];
  questions: getQuestions['questions'];
  onChange: (options: IUpdateProgressNoteOptions) => void;
}

interface IGraphqlProps {
  clinics: getClinics['clinics'];
  clinicsLoading?: boolean;
  clinicsError?: string | null;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateVariables },
  ) => { data: patientAnswersCreate };
}

type allProps = IGraphqlProps & IProps;

interface IState {
  progressNoteTime: string | null;
  progressNoteLocation: string | null;
  progressNoteTemplateId: string | null;
  progressNoteSummary: string | null;
  progressNoteMemberConcern: string | null;
  progressNoteWorryScore: number | null;
  loading?: boolean;
  error: string | null;
}

const SAVE_TIMEOUT_MILLISECONDS = 500;

export class ProgressNoteContext extends React.Component<allProps, IState> {
  deferredSaveProgressNote: () => void;

  constructor(props: allProps) {
    super(props);
    const { progressNote } = props;
    const defaultDate = getCurrentTime();
    this.deferredSaveProgressNote = debounce(this.saveProgressNote, SAVE_TIMEOUT_MILLISECONDS, {
      leading: false,
      trailing: true,
    });
    this.state = {
      loading: false,
      error: null,
      progressNoteTime: progressNote.startedAt
        ? new Date(progressNote.startedAt).toISOString()
        : defaultDate.toISOString(),
      progressNoteLocation: progressNote.location ? progressNote.location : null,
      progressNoteTemplateId: progressNote.progressNoteTemplate
        ? progressNote.progressNoteTemplate.id
        : null,
      progressNoteSummary: progressNote.summary ? progressNote.summary : '',
      progressNoteMemberConcern:
        progressNote && progressNote.memberConcern ? progressNote.memberConcern : '',
      progressNoteWorryScore: progressNote.worryScore,
    };
  }

  renderQuestion = (
    question: FullQuestion,
    index: number,
    answerData: IQuestionAnswerHash,
    editable: boolean,
  ) => {
    const { progressNote } = this.props;
    const visible = getQuestionVisibility(question, answerData);
    const dataForQuestion = answerData[question.id] || [];
    return (
      <Mutation mutation={patientAnswersCreateGraphql} key={`${question.id}-${index}`}>
        {mutate => (
          <PatientQuestion
            editable={editable}
            displayHamburger={false}
            visible={visible}
            answerData={dataForQuestion}
            key={question.id}
            question={question}
            onChange={createPatientAnswer(
              mutate,
              {
                filterType: 'progressNote' as AnswerFilterType,
                filterId: progressNote.id,
                patientId: progressNote.patientId,
              },
              progressNote.patientId,
              progressNote ? progressNote.id : null,
              'progressNote',
            )}
          />
        )}
      </Mutation>
    );
  };

  renderQuestions(editable: boolean) {
    const { questions, patientAnswers } = this.props;

    const answerData = getQuestionAnswerHash(patientAnswers);

    return (questions || []).map((question, index) =>
      this.renderQuestion(question, index, answerData, editable),
    );
  }

  onLocationChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    await this.setState({ progressNoteLocation: fieldValue });
    this.deferredSaveProgressNote();
  };

  onTimeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldValue = event.currentTarget.value;
    await this.setState({ progressNoteTime: fieldValue });
    this.deferredSaveProgressNote();
  };

  onProgressNoteTemplateType = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await this.setState({
      progressNoteTemplateId: event.currentTarget.value,
    });
    this.deferredSaveProgressNote();
  };

  onProgressNoteSummaryChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    await this.setState({
      progressNoteSummary: event.currentTarget.value,
    });
    this.deferredSaveProgressNote();
  };

  onProgressNoteMemberConcernChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    await this.setState({
      progressNoteMemberConcern: event.currentTarget.value,
    });
    this.deferredSaveProgressNote();
  };

  onProgressNoteWorryScoreChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await this.setState({
      progressNoteWorryScore: Number(event.currentTarget.value),
    });
    this.deferredSaveProgressNote();
  };

  saveProgressNote = () => {
    const {
      progressNoteTime,
      progressNoteLocation,
      progressNoteTemplateId,
      progressNoteSummary,
      progressNoteMemberConcern,
      progressNoteWorryScore,
    } = this.state;

    this.props.onChange({
      progressNoteTemplateId,
      startedAt: progressNoteTime,
      location: progressNoteLocation,
      summary: progressNoteSummary,
      memberConcern: progressNoteMemberConcern,
      worryScore: progressNoteWorryScore,
    });
  };

  render() {
    const { progressNoteTemplates, clinics, disabled, progressNote, close } = this.props;
    const {
      progressNoteTime,
      progressNoteLocation,
      error,
      progressNoteTemplateId,
      progressNoteSummary,
      progressNoteMemberConcern,
      progressNoteWorryScore,
    } = this.state;
    const encounterTypes = progressNoteTemplates.map(template => (
      <option key={template.id} value={template.id}>
        {template.title}
      </option>
    ));
    const linkTo360 = disabled ? null : (
      <Link
        to={`/patients/${progressNote.patientId}/360`}
        className={styles.navTextContainer}
        onClick={close}
      >
        <FormLabel
          className={styles.navText}
          messageId="progressNote.update360"
          htmlFor="contextAndPlan"
        />
        <Icon name={'keyboardArrowRight'} className={styles.icon} />
      </Link>
    );
    const linkToActivity = disabled ? null : (
      <Link
        to={`/patients/${progressNote.patientId}/map/active`}
        className={styles.navTextContainer}
        onClick={close}
      >
        <FormLabel
          className={styles.navText}
          messageId="progressNote.updateMap"
          htmlFor="contextAndPlan"
        />
        <Icon name={'keyboardArrowRight'} className={styles.icon} />
      </Link>
    );

    return (
      <div className={styles.container}>
        <div className={styles.encounterTypeContainer}>
          <FormLabel messageId="progressNote.selectType" htmlFor="contextAndPlan" />
          <Select
            disabled={disabled}
            value={progressNoteTemplateId || ''}
            onChange={this.onProgressNoteTemplateType}
          >
            <option value={''} disabled hidden>
              Select an encounter type template
            </option>
            {encounterTypes}
          </Select>
          <div className={styles.locationTimeRow}>
            <ProgressNoteLocation
              disabled={disabled}
              clinics={clinics}
              progressNoteLocation={progressNoteLocation || ''}
              onLocationChange={this.onLocationChange}
            />
            <ProgressNoteTime
              disabled={disabled}
              progressNoteTime={progressNoteTime || ''}
              onTimeChange={this.onTimeChange}
            />
          </div>
        </div>
        <div className={styles.error}>{error}</div>
        {this.renderQuestions(!disabled)}
        <div className={styles.summaryContainer}>
          <div className={styles.titleLinkGroup}>
            <FormLabel
              messageId="progressNote.memberConcernAndObservation"
              htmlFor="memberConcernAndObservation"
            />
            {linkTo360}
          </div>
          <ProgressNoteTextArea
            disabled={disabled}
            value={progressNoteMemberConcern || ''}
            onChange={this.onProgressNoteMemberConcernChange}
            forceSave={this.deferredSaveProgressNote}
          />
        </div>
        <div className={styles.summaryContainer}>
          <div className={styles.titleLinkGroup}>
            <FormLabel messageId="progressNote.contextAndPlan" htmlFor="contextAndPlan" />
            {linkToActivity}
          </div>
          <ProgressNoteTextArea
            disabled={disabled}
            value={progressNoteSummary || ''}
            onChange={this.onProgressNoteSummaryChange}
            forceSave={this.deferredSaveProgressNote}
          />
        </div>
        <div className={styles.summaryContainer}>
          <ProgressNoteWorryScore
            worryScore={progressNoteWorryScore}
            onChange={this.onProgressNoteWorryScoreChange}
          />
        </div>
      </div>
    );
  }
}

export default graphql<any, any, any, any>(clinicsGraphql, {
  options: {
    variables: {
      pageNumber: 0,
      pageSize: 10,
    },
  },
  props: ({ data }) => ({
    clinicsLoading: data ? data.loading : false,
    clinicsError: data ? data.error : null,
    clinics: data ? (data as any).clinics : null,
  }),
})(ProgressNoteContext) as React.ComponentClass<IProps>;
