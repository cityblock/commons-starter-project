import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as riskAreaAssessmentSubmissionForPatientQuery from '../../graphql/queries/get-risk-area-assessment-submission-for-patient.graphql';
import * as riskAreaQuery from '../../graphql/queries/get-risk-area.graphql';
import * as riskAreaAssessmentSubmissionCompleteMutationGraphql from '../../graphql/queries/risk-area-assessment-submission-complete-mutation.graphql';
import * as riskAreaAssessmentSubmissionCreateMutationGraphql from '../../graphql/queries/risk-area-assessment-submission-create-mutation.graphql';
import {
  riskAreaAssessmentSubmissionCompleteMutation,
  riskAreaAssessmentSubmissionCompleteMutationVariables,
  riskAreaAssessmentSubmissionCreateMutation,
  riskAreaAssessmentSubmissionCreateMutationVariables,
  FullRiskAreaAssessmentSubmissionFragment,
  FullRiskAreaFragment,
} from '../../graphql/types';
import * as sortSearchStyles from '../../shared/css/sort-search.css';
import BackLink from '../../shared/library/back-link/back-link';
import Button from '../../shared/library/button/button';
import { Popup } from '../../shared/popup/popup';
import ScreeningToolsPopup from '../screening-tool/screening-tools-popup';
import ComputedFieldFlagModal from './computed-field-flag-modal';
import * as styles from './css/risk-area-assessment.css';
import RiskAreaAssessmentQuestions from './risk-area-assessment-questions';
import RiskAreaAssessmentResultsPopup from './risk-area-assessment-results-popup';

export interface IProps {
  riskAreaId: string;
  patientId: string;
  routeBase: string;
  patientRoute: string;
}

interface IGraphqlProps {
  riskArea?: FullRiskAreaFragment;
  loading?: boolean;
  error?: string | null;
  riskAreaAssessmentSubmissionCreate?: (
    options: { variables: riskAreaAssessmentSubmissionCreateMutationVariables },
  ) => { data: riskAreaAssessmentSubmissionCreateMutation };
  riskAreaAssessmentSubmissionComplete?: (
    options: { variables: riskAreaAssessmentSubmissionCompleteMutationVariables },
  ) => { data: riskAreaAssessmentSubmissionCompleteMutation };
  riskAreaAssessmentSubmissionLoading?: boolean;
  riskAreaAssessmentSubmissionError: string | null;
  riskAreaAssessmentSubmission?: FullRiskAreaAssessmentSubmissionFragment;
}

type allProps = IGraphqlProps & IProps;

interface IState {
  inProgress: boolean;
  selectingScreeningTool: boolean;
}

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class RiskAreaAssessment extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      inProgress: false,
      selectingScreeningTool: false,
    };
  }

  async componentWillMount() {
    const {
      riskAreaAssessmentSubmissionCreate,
      riskAreaId,
      patientId,
      riskAreaAssessmentSubmission,
    } = this.props;

    // Handle returning to a risk area after completing the risk area
    // We set in progress to false, forcing the popup to close and the use to re-start the
    // submission by creating / fetching a new submission
    if (
      riskAreaAssessmentSubmissionCreate &&
      riskAreaAssessmentSubmission &&
      riskAreaAssessmentSubmission.createdAt
    ) {
      await riskAreaAssessmentSubmissionCreate({
        variables: {
          riskAreaId,
          patientId,
        },
      });
    }
  }

  onStart = async () => {
    const { riskAreaAssessmentSubmissionCreate, riskAreaId, patientId } = this.props;
    if (riskAreaAssessmentSubmissionCreate) {
      const result = await riskAreaAssessmentSubmissionCreate({
        variables: {
          riskAreaId,
          patientId,
        },
      });
      if (result.data.riskAreaAssessmentSubmissionCreate) {
        this.setState({ inProgress: true });
      } else {
        // TODO handle error
        throw new Error('risk area assessment not created');
      }
    }
  };

  onCancel = () => {
    this.setState({ inProgress: false });
  };

  onSubmit = async () => {
    const { riskAreaAssessmentSubmissionComplete, riskAreaAssessmentSubmission } = this.props;

    if (riskAreaAssessmentSubmission && riskAreaAssessmentSubmissionComplete) {
      await riskAreaAssessmentSubmissionComplete({
        variables: {
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
      });
      // TODO: Show care plan suggestions here
      this.onCancel();
    }
  };

  onClickToSelectScreeningTool = () => {
    this.setState({ selectingScreeningTool: true });
  };

  onDismissScreeningToolSelect = () => {
    this.setState({ selectingScreeningTool: false });
  };

  render() {
    const {
      riskArea,
      riskAreaId,
      patientId,
      routeBase,
      patientRoute,
      loading,
      error,
      riskAreaAssessmentSubmission,
    } = this.props;
    const { inProgress, selectingScreeningTool } = this.state;

    const automatedAssessment = riskArea && riskArea.assessmentType === 'automated';

    const toolsButtonStyles = classNames(styles.toolsButton, {
      [styles.hidden]: inProgress || automatedAssessment,
    });
    const cancelButtonStyles = classNames(styles.cancelButton, {
      [styles.hidden]: !inProgress || automatedAssessment,
    });
    const saveButtonStyles = classNames(styles.saveButton, {
      [styles.hidden]: !inProgress || automatedAssessment,
    });
    const startButtonStyles = classNames({
      [styles.hidden]: inProgress || automatedAssessment,
    });
    const navigationStyles = classNames(sortSearchStyles.sortSearchBar, styles.buttonBar, {
      [styles.flexEnd]: !automatedAssessment,
    });

    const assessmentHtml = riskArea ? (
      <RiskAreaAssessmentQuestions
        riskArea={riskArea}
        routeBase={routeBase}
        patientRoute={patientRoute}
        patientId={patientId}
        inProgress={inProgress}
        riskAreaAssessmentSubmission={riskAreaAssessmentSubmission}
      />
    ) : null;

    const patientScreeningToolSubmissionId = riskAreaAssessmentSubmission
      ? riskAreaAssessmentSubmission.id
      : null;
    const popupVisible =
      riskAreaAssessmentSubmission && riskAreaAssessmentSubmission.completedAt ? true : false;
    const backLink = automatedAssessment ? (
      <BackLink href={`${routeBase}/${riskArea!.riskAreaGroup.id}`} />
    ) : null;

    return (
      <div>
        {automatedAssessment && <ComputedFieldFlagModal />}
        <div className={navigationStyles}>
          {backLink}
          <Button
            color="white"
            messageId="riskAreaAssessment.cancel"
            className={cancelButtonStyles}
            onClick={this.onCancel}
          />
          <Button
            color="white"
            messageId="riskAreaAssessment.administer"
            className={toolsButtonStyles}
            onClick={this.onClickToSelectScreeningTool}
          />
          <Button
            messageId="riskAreaAssessment.save"
            className={saveButtonStyles}
            onClick={this.onSubmit}
            disabled={loading || !!error}
          />
          <Button
            messageId="riskAreaAssessment.start"
            className={startButtonStyles}
            onClick={this.onStart}
            disabled={loading || !!error}
          />
        </div>
        <div className={styles.riskAreasPanel}>{assessmentHtml}</div>
        <Popup visible={popupVisible} style={'small-padding'}>
          <RiskAreaAssessmentResultsPopup
            patientRoute={patientRoute}
            riskAreaAssessmentSubmissionId={patientScreeningToolSubmissionId}
          />
        </Popup>
        <Popup visible={selectingScreeningTool} style={'small-padding'}>
          <ScreeningToolsPopup
            riskAreaId={riskAreaId}
            onDismiss={this.onDismissScreeningToolSelect}
            patientRoute={patientRoute}
          />
        </Popup>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(
    riskAreaAssessmentSubmissionCompleteMutationGraphql as any,
    {
      name: 'riskAreaAssessmentSubmissionComplete',
    },
  ),
  graphql<IGraphqlProps, IProps, allProps>(
    riskAreaAssessmentSubmissionCreateMutationGraphql as any,
    {
      name: 'riskAreaAssessmentSubmissionCreate',
      options: { refetchQueries: ['getRiskAreaAssessmentSubmissionForPatient'] },
    },
  ),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      riskArea: data ? (data as any).riskArea : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaAssessmentSubmissionForPatientQuery as any, {
    skip: (props: IProps) => !props.riskAreaId,
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
        patientId: props.patientId,
        completed: false,
      },
    }),
    props: ({ data }) => ({
      riskAreaAssessmentSubmissionLoading: data ? data.loading : false,
      riskAreaAssessmentSubmissionError: data ? data.error : null,
      riskAreaAssessmentSubmission: data
        ? (data as any).riskAreaAssessmentSubmissionForPatient
        : null,
    }),
  }),
)(RiskAreaAssessment);
