import { History } from 'history';
import { debounce } from 'lodash-es';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as clinicsQuery from '../graphql/queries/clinics-get.graphql';
import * as patientAnswersCreateMutationGraphql from '../graphql/queries/patient-answers-create-mutation.graphql';
import {
  getClinicsQuery,
  getPatientAnswersQuery,
  getQuestionsQuery,
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
  FullQuestionFragment,
} from '../graphql/types';
import FormLabel from '../shared/library/form-label/form-label';
import Icon from '../shared/library/icon/icon';
import Select from '../shared/library/select/select';
import Textarea from '../shared/library/textarea/textarea';
import PatientQuestion from '../shared/question/patient-question';
import {
  getQuestionVisibility,
  setupQuestionAnswerHash,
  updateQuestionAnswerHash,
  IQuestionAnswerHash,
} from '../shared/question/question-helpers';
import * as styles from './css/progress-note-context.css';
import { ProgressNoteLocation } from './progress-note-location';
import { getCurrentTime, ProgressNoteTime } from './progress-note-time';
import ScreeningToolDropdown from './screening-tool-dropdown';

interface IProps {
  disabled: boolean;
  progressNote: FullProgressNoteFragment;
  progressNoteTemplates: FullProgressNoteTemplateFragment[];
  patientAnswers?: getPatientAnswersQuery['patientAnswers'];
  questions: getQuestionsQuery['questions'];
  onChange: (
    options: {
      progressNoteTemplateId: string;
      startedAt: string | null;
      location: string | null;
      summary: string | null;
      memberConcern: string | null;
    },
  ) => void;
  history: History;
}

interface IGraphqlProps {
  clinics: getClinicsQuery['clinics'];
  clinicsLoading?: boolean;
  clinicsError?: string | null;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
}

type allProps = IGraphqlProps & IProps;

interface IState {
  progressNoteTime: string | null;
  progressNoteLocation: string | null;
  progressNoteTemplateId: string | null;
  progressNoteSummary: string | null;
  progressNoteMemberConcern: string | null;
  loading?: boolean;
  error: string | null;
}

const SAVE_TIMEOUT_MILLISECONDS = 500;

export class ProgressNoteContext extends React.Component<allProps, IState> {
  deferredSaveProgressNote: () => void;

  constructor(props: allProps) {
    super(props);
    const defaultDate = getCurrentTime();
    const { progressNote } = props;
    this.deferredSaveProgressNote = debounce(this.saveProgressNote, SAVE_TIMEOUT_MILLISECONDS);
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
    };
  }

  componentWillReceiveProps(newProps: allProps) {
    // setup default state
    if (newProps.progressNote && !this.props.progressNote) {
      this.setDefaultProgressNoteFields(newProps);
    }
  }

  setDefaultProgressNoteFields(props: allProps) {
    const defaultDate = getCurrentTime();
    const { progressNote } = props;
    this.setState({
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
    });
  }

  onChange = async (
    questionId: string,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => {
    const { progressNote, createPatientAnswers } = this.props;
    if (progressNote && createPatientAnswers) {
      const patientAnswers = answers.map(answer => ({
        questionId,
        answerId: answer.answerId,
        answerValue: String(answer.value),
        patientId: progressNote.patientId,
        applicable: true,
      }));

      await createPatientAnswers({
        variables: {
          progressNoteId: progressNote.id,
          patientId: progressNote.patientId,
          patientAnswers,
          questionIds: [questionId],
        },
      });
    }
  };

  renderQuestion = (
    question: FullQuestionFragment,
    index: number,
    answerData: IQuestionAnswerHash,
    editable: boolean,
  ) => {
    const visible = getQuestionVisibility(question, answerData);
    const dataForQuestion = answerData[question.id] || [];
    return (
      <PatientQuestion
        editable={editable}
        displayHamburger={false}
        visible={visible}
        answerData={dataForQuestion}
        onChange={this.onChange}
        key={question.id}
        question={question}
      />
    );
  };

  renderQuestions(editable: boolean) {
    const { questions, patientAnswers } = this.props;

    const answerData = setupQuestionAnswerHash({}, questions);
    updateQuestionAnswerHash(answerData, patientAnswers || []);

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

  saveProgressNote = () => {
    const {
      progressNoteTime,
      progressNoteLocation,
      progressNoteTemplateId,
      progressNoteSummary,
      progressNoteMemberConcern,
    } = this.state;
    if (progressNoteTemplateId) {
      this.props.onChange({
        progressNoteTemplateId,
        startedAt: progressNoteTime,
        location: progressNoteLocation,
        summary: progressNoteSummary,
        memberConcern: progressNoteMemberConcern,
      });
    }
  };

  redirectToMap = () => {
    const { history, progressNote } = this.props;
    return history.push(`/patients/${progressNote.patientId}/map/active`);
  };

  redirectTo360 = () => {
    const { history, progressNote } = this.props;
    return history.push(`/patients/${progressNote.patientId}/360`);
  };

  render() {
    const { progressNoteTemplates, clinics, disabled, progressNote } = this.props;
    const {
      progressNoteTime,
      progressNoteLocation,
      error,
      progressNoteTemplateId,
      progressNoteSummary,
      progressNoteMemberConcern,
    } = this.state;
    const encounterTypes = progressNoteTemplates.map(template => (
      <option key={template.id} value={template.id}>
        {template.title}
      </option>
    ));
    return (
      <div>
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
            <div className={styles.navTextContainer} onClick={this.redirectTo360}>
              <FormLabel
                className={styles.navText}
                messageId="progressNote.update360"
                htmlFor="contextAndPlan"
              />
              <Icon name={'keyboardArrowRight'} className={styles.icon} />
            </div>
          </div>
          <ScreeningToolDropdown patientId={progressNote.patientId} />
          <br />
          <br />
          <Textarea
            disabled={disabled}
            value={progressNoteMemberConcern || ''}
            onChange={this.onProgressNoteMemberConcernChange}
          />
        </div>
        <div className={styles.summaryContainer}>
          <div className={styles.titleLinkGroup}>
            <FormLabel messageId="progressNote.contextAndPlan" htmlFor="contextAndPlan" />
            <div className={styles.navTextContainer} onClick={this.redirectToMap}>
              <FormLabel
                className={styles.navText}
                messageId="progressNote.updateMap"
                htmlFor="contextAndPlan"
              />
              <Icon name={'keyboardArrowRight'} className={styles.icon} />
            </div>
          </div>
          <Textarea
            disabled={disabled}
            value={progressNoteSummary || ''}
            onChange={this.onProgressNoteSummaryChange}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersCreateMutationGraphql as any, {
    name: 'createPatientAnswers',
    options: { refetchQueries: ['getPatientAnswers'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(clinicsQuery as any, {
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
  }),
)(ProgressNoteContext);
