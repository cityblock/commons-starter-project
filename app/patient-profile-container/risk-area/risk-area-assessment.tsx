import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import * as riskAreaAssessmentSubmissionForPatientQuery from '../../graphql/queries/get-risk-area-assessment-submission-for-patient.graphql';
import * as getRiskAreaGroupForPatientGraphql from '../../graphql/queries/get-risk-area-group-for-patient.graphql';
import * as riskAreaQuery from '../../graphql/queries/get-risk-area.graphql';
import * as riskAreaAssessmentSubmissionCompleteMutationGraphql from '../../graphql/queries/risk-area-assessment-submission-complete-mutation.graphql';
import * as riskAreaAssessmentSubmissionCreateMutationGraphql from '../../graphql/queries/risk-area-assessment-submission-create-mutation.graphql';
import {
  getRiskAreaGroupForPatientQuery,
  riskAreaAssessmentSubmissionCompleteMutation,
  riskAreaAssessmentSubmissionCompleteMutationVariables,
  riskAreaAssessmentSubmissionCreateMutation,
  riskAreaAssessmentSubmissionCreateMutationVariables,
  AssessmentType,
  FullCarePlanSuggestionFragment,
  FullRiskAreaAssessmentSubmissionFragment,
  FullRiskAreaFragment,
} from '../../graphql/types';
import BackLink from '../../shared/library/back-link/back-link';
import Button from '../../shared/library/button/button';
import ModalButtons from '../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../shared/library/modal-header/modal-header';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import { Popup } from '../../shared/popup/popup';
import ComputedFieldFlagModal from './computed-field-flag-modal';
import * as styles from './css/risk-area-assessment.css';
import RiskAreaAssessmentQuestions from './risk-area-assessment-questions';

export interface IProps {
  riskAreaId: string;
  riskAreaGroupId: string;
  patientId: string;
  routeBase: string;
  patientRoute: string;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  riskArea?: FullRiskAreaFragment;
  riskAreaLoading?: boolean;
  riskAreaError?: ApolloError | null;
  riskAreaAssessmentSubmissionCreate?: (
    options: { variables: riskAreaAssessmentSubmissionCreateMutationVariables },
  ) => { data: riskAreaAssessmentSubmissionCreateMutation };
  riskAreaAssessmentSubmissionComplete?: (
    options: { variables: riskAreaAssessmentSubmissionCompleteMutationVariables },
  ) => { data: riskAreaAssessmentSubmissionCompleteMutation };
  riskAreaAssessmentSubmissionLoading?: boolean;
  riskAreaAssessmentSubmissionError: string | null;
  riskAreaAssessmentSubmission?: FullRiskAreaAssessmentSubmissionFragment;
  riskAreaGroup: getRiskAreaGroupForPatientQuery['riskAreaGroupForPatient'];
  riskAreaGroupLoading?: boolean;
  riskAreaGroupError?: ApolloError | null;
}

interface IDispatchProps {
  openSuggestionsPopup: (carePlanSuggestions: FullCarePlanSuggestionFragment[]) => void;
}

type allProps = IGraphqlProps & IProps & IDispatchProps;

interface IState {
  inProgress: boolean;
  editPopupVisible: boolean;
  carePlanSuggestions: FullCarePlanSuggestionFragment[];
}

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class RiskAreaAssessment extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = this.getDefaultState();
  }

  async componentDidMount() {
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

  componentWillUnmount() {
    this.setState(this.getDefaultState());
  }

  getDefaultState() {
    return {
      inProgress: false,
      selectingScreeningTool: false,
      editPopupVisible: false,
      carePlanSuggestions: [],
    };
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
    const {
      riskAreaAssessmentSubmissionComplete,
      riskAreaAssessmentSubmission,
      openSuggestionsPopup,
    } = this.props;

    if (riskAreaAssessmentSubmission && riskAreaAssessmentSubmissionComplete) {
      const result = await riskAreaAssessmentSubmissionComplete({
        variables: {
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
      });
      if (result.data.riskAreaAssessmentSubmissionComplete) {
        const carePlanSuggestions =
          result.data.riskAreaAssessmentSubmissionComplete.carePlanSuggestions;
        this.setState({ inProgress: false, carePlanSuggestions });

        // open suggestions popup if needed
        if (carePlanSuggestions.length > 0) {
          openSuggestionsPopup(carePlanSuggestions);
        }
      } else {
        this.onCancel();
      }
    }
  };

  onEditableChangeRequest = () => {
    const { riskArea } = this.props;

    if (riskArea && riskArea.assessmentType === AssessmentType.manual) {
      this.setState({ editPopupVisible: true });
    }
  };

  onEditableChangeConfirm = async () => {
    this.setState({ editPopupVisible: false });
    await this.onStart();
  };

  onEditPopupClose = () => {
    this.setState({ editPopupVisible: false });
  };

  renderEditPopup() {
    return (
      <div>
        <ModalHeader
          titleMessageId="riskAreaAssessment.editModalTitle"
          bodyMessageId="riskAreaAssessment.editModalBody"
          closePopup={this.onEditPopupClose}
          color="white"
        />
        <ModalButtons
          cancelMessageId="riskAreaAssessment.cancel"
          submitMessageId="riskAreaAssessment.editAnswer"
          cancel={this.onEditPopupClose}
          submit={this.onEditableChangeConfirm}
        />
      </div>
    );
  }

  render() {
    const {
      riskArea,
      riskAreaGroup,
      patientId,
      routeBase,
      patientRoute,
      riskAreaLoading,
      riskAreaGroupLoading,
      riskAreaError,
      riskAreaGroupError,
      riskAreaAssessmentSubmission,
      riskAreaAssessmentSubmissionLoading,
      glassBreakId,
    } = this.props;
    const { inProgress, editPopupVisible, carePlanSuggestions } = this.state;
    const isLoading =
      riskAreaAssessmentSubmissionLoading || riskAreaGroupLoading || riskAreaLoading;

    const automatedAssessment = riskArea && riskArea.assessmentType === 'automated';

    const assessmentHtml = riskArea ? (
      <RiskAreaAssessmentQuestions
        riskArea={riskArea}
        routeBase={routeBase}
        patientRoute={patientRoute}
        patientId={patientId}
        inProgress={inProgress}
        riskAreaAssessmentSubmission={riskAreaAssessmentSubmission}
        onEditableChange={this.onEditableChangeRequest}
        glassBreakId={glassBreakId}
      />
    ) : null;

    // Dont show loading if we have care plan suggestions - it shows a weird flash
    if ((carePlanSuggestions.length < 1 && isLoading) || !riskArea) {
      return <Spinner />;
    }

    const loadingOrError = !!(isLoading || riskAreaError || riskAreaGroupError);
    const navButtons = !automatedAssessment ? (
      inProgress ? (
        <div>
          <Button
            messageId="riskAreaAssessment.save"
            onClick={this.onSubmit}
            disabled={loadingOrError}
            className={styles.button}
          />
        </div>
      ) : (
        <div>
          <Button
            messageId="riskAreaAssessment.start"
            onClick={this.onStart}
            disabled={loadingOrError}
            className={styles.button}
          />
        </div>
      )
    ) : null;

    const noAutomated =
      !!riskAreaGroup.riskAreas &&
      !!riskAreaGroup.riskAreas.length &&
      !riskAreaGroup.riskAreas.some(area => {
        return area.assessmentType === 'automated';
      });

    const href = noAutomated ? routeBase : `${routeBase}/${riskArea.riskAreaGroupId}`;

    return (
      <React.Fragment>
        {automatedAssessment && <ComputedFieldFlagModal />}
        <UnderlineTabs>
          <div>
            <BackLink href={href} />
          </div>
          {navButtons}
        </UnderlineTabs>
        <div className={styles.riskAreasPanel}>{assessmentHtml}</div>
        <Popup visible={editPopupVisible} style={'small-padding'}>
          {this.renderEditPopup()}
        </Popup>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => ({
  openSuggestionsPopup: (carePlanSuggestions: FullCarePlanSuggestionFragment[]) =>
    dispatch(
      openPopup({
        name: 'CARE_PLAN_SUGGESTIONS',
        options: {
          patientId: ownProps.patientId,
          carePlanSuggestions,
        },
      }),
    ),
});

export default compose(
  connect<{}, IDispatchProps, IProps & IDispatchProps>(
    null,
    mapDispatchToProps as any,
  ),
  graphql(riskAreaAssessmentSubmissionCompleteMutationGraphql as any, {
    name: 'riskAreaAssessmentSubmissionComplete',
    options: {
      refetchQueries: ['getProgressNotesForCurrentUser'],
    },
  }),
  graphql(riskAreaAssessmentSubmissionCreateMutationGraphql as any, {
    name: 'riskAreaAssessmentSubmissionCreate',
    options: {
      refetchQueries: ['getRiskAreaAssessmentSubmissionForPatient'],
    },
  }),
  graphql(riskAreaQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      riskAreaLoading: data ? data.loading : false,
      riskAreaError: data ? data.error : null,
      riskArea: data ? (data as any).riskArea : null,
    }),
  }),
  graphql(riskAreaAssessmentSubmissionForPatientQuery as any, {
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
  graphql(getRiskAreaGroupForPatientGraphql as any, {
    options: (props: IProps) => {
      const { riskAreaGroupId, patientId, glassBreakId } = props;
      return { variables: { riskAreaGroupId, patientId, glassBreakId } };
    },
    props: ({ data }) => ({
      riskAreaGroupLoading: data ? data.loading : false,
      riskAreaGroupError: data ? data.error : null,
      riskAreaGroup: data ? (data as any).riskAreaGroupForPatient : null,
    }),
  }),
)(RiskAreaAssessment) as React.ComponentClass<IProps>;
