import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientCarePlanSuggestionsQuery from '../graphql/queries/get-patient-care-plan-suggestions.graphql';
import * as patientCareTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import {
  getPatientCarePlanSuggestionsQuery,
  getPatientCareTeamQuery,
  FullCarePlanSuggestionFragment,
  FullGoalSuggestionTemplateFragment,
} from '../graphql/types';
import * as styles from './css/patient-care-plan.css';
import PatientCarePlanSuggestion from './patient-care-plan-suggestion';
import PopupPatientCarePlanSuggestionAccepted from './popup-patient-care-plan-suggestion-accepted';
import PopupPatientCarePlanSuggestionDismissed from './popup-patient-care-plan-suggestion-dismissed';

export interface IAcceptedGoalSuggestion {
  goalSuggestionTemplate: FullGoalSuggestionTemplateFragment;
  concernId: string | null;
  concernTitle: string | null;
  taskTemplateIds: string | null[];
}

export type SuggestionTypes = 'goal' | 'concern';

interface IProps {
  patientId: string;
  routeBase: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  carePlanSuggestions?: getPatientCarePlanSuggestionsQuery['carePlanSuggestionsForPatient'];
  refetchCarePlanSuggestions?: () => any;
  careTeam?: getPatientCareTeamQuery['patientCareTeam'];
}

interface IState {
  acceptModalVisible: boolean;
  acceptedSuggestion: FullCarePlanSuggestionFragment | null;
  acceptedTaskTemplateIds: string[];
  dismissModalVisible: boolean;
  dismissedSuggestion: FullCarePlanSuggestionFragment | null;
}

export class PatientCarePlanSuggestions extends React.Component<IProps & IGraphqlProps, IState> {
  constructor(props: IProps & IGraphqlProps) {
    super(props);

    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.defaultSuggestionsHtml = this.defaultSuggestionsHtml.bind(this);
    this.onAcceptSuggestion = this.onAcceptSuggestion.bind(this);
    this.onAcceptModalDismiss = this.onAcceptModalDismiss.bind(this);
    this.onDismissSuggestion = this.onDismissSuggestion.bind(this);
    this.onDismissModalDismiss = this.onDismissModalDismiss.bind(this);
    this.renderSuggestionsHtml = this.renderSuggestionsHtml.bind(this);
    this.renderEmptySuggestionsHtml = this.renderEmptySuggestionsHtml.bind(this);

    this.state = {
      acceptModalVisible: false,
      dismissModalVisible: false,
      acceptedTaskTemplateIds: [],
      acceptedSuggestion: null,
      dismissedSuggestion: null,
    };
  }

  onAcceptSuggestion(
    acceptedSuggestion: FullCarePlanSuggestionFragment,
    taskTemplateIds?: string[],
  ) {
    this.setState({
      acceptModalVisible: true,
      acceptedSuggestion,
      acceptedTaskTemplateIds: taskTemplateIds || [],
      dismissedSuggestion: null,
      dismissModalVisible: false,
    });
  }

  onAcceptModalDismiss() {
    this.setState({
      acceptModalVisible: false,
      acceptedSuggestion: null,
      acceptedTaskTemplateIds: [],
    });
  }

  onDismissSuggestion(dismissedSuggestion: FullCarePlanSuggestionFragment) {
    this.setState({
      acceptModalVisible: false,
      acceptedSuggestion: null,
      acceptedTaskTemplateIds: [],
      dismissModalVisible: true,
      dismissedSuggestion,
    });
  }

  onDismissModalDismiss() {
    this.setState({
      dismissModalVisible: false,
      dismissedSuggestion: null,
    });
  }

  defaultSuggestionsHtml(suggestionType: SuggestionTypes) {
    const { loading } = this.props;

    return (
      <div className={styles.carePlanSuggestionsLoading}>
        {loading ? 'Loading...' : `No suggested ${suggestionType}s.`}
      </div>
    );
  }

  renderSuggestions(suggestionType: SuggestionTypes) {
    const { carePlanSuggestions, careTeam } = this.props;

    const defaultHtml = this.defaultSuggestionsHtml(suggestionType);

    if (!carePlanSuggestions) {
      return defaultHtml;
    }

    const suggestionsToUse = carePlanSuggestions.filter(
      carePlanSuggestion =>
        carePlanSuggestion && carePlanSuggestion.suggestionType === suggestionType,
    );

    if (suggestionsToUse.length) {
      return suggestionsToUse.map(
        suggestion =>
          suggestion ? (
            <PatientCarePlanSuggestion
              key={suggestion.id}
              onAccept={this.onAcceptSuggestion}
              onDismiss={this.onDismissSuggestion}
              careTeam={careTeam}
              suggestion={suggestion}
            />
          ) : null,
      );
    } else {
      return defaultHtml;
    }
  }

  renderSuggestionsHtml() {
    const {
      acceptedSuggestion,
      acceptModalVisible,
      acceptedTaskTemplateIds,
      dismissedSuggestion,
      dismissModalVisible,
    } = this.state;
    const { patientId, carePlanSuggestions } = this.props;

    return (
      <div>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionTitle}>Suggested Concerns</div>
            <div className={styles.sectionDivider} />
            <div className={styles.sectionHamburger} />
          </div>
          <div>{this.renderSuggestions('concern')}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionTitle}>Suggested Goals</div>
            <div className={styles.sectionDivider} />
            <div className={styles.sectionHamburger} />
          </div>
          <div>{this.renderSuggestions('goal')}</div>
        </div>
        <PopupPatientCarePlanSuggestionAccepted
          visible={acceptModalVisible}
          patientId={patientId}
          carePlanSuggestions={carePlanSuggestions}
          suggestion={acceptedSuggestion!}
          taskTemplateIds={acceptedTaskTemplateIds}
          onDismiss={this.onAcceptModalDismiss}
        />
        <PopupPatientCarePlanSuggestionDismissed
          visible={dismissModalVisible}
          suggestion={dismissedSuggestion}
          onDismiss={this.onDismissModalDismiss}
        />
      </div>
    );
  }

  renderEmptySuggestionsHtml() {
    const { loading } = this.props;

    const html = loading ? (
      <div className={styles.emptyCarePlanSuggestionsContainer}>
        <div className={styles.loadingLabel}>Loading...</div>
      </div>
    ) : (
      <div className={styles.emptyCarePlanSuggestionsContainer}>
        <div className={styles.emptyCarePlanSuggestionsLogo} />
        <div className={styles.emptyCarePlanSuggestionsLabel}>
          No Care Plan suggestions for this patient
        </div>
        <div className={styles.emptyCarePlanSuggestionsSubtext}>
          Any new suggestions will be displayed here
        </div>
      </div>
    );

    return html;
  }

  render() {
    const { carePlanSuggestions } = this.props;
    const suggestionsHtml =
      carePlanSuggestions && carePlanSuggestions.length
        ? this.renderSuggestionsHtml()
        : this.renderEmptySuggestionsHtml();

    return <div className={styles.carePlanSuggestions}>{suggestionsHtml}</div>;
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(patientCarePlanSuggestionsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'cache-and-network', // Always get the latest suggestions, but return cache first
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      carePlanSuggestions: data ? (data as any).carePlanSuggestionsForPatient : null,
      refetchCarePlanSuggestions: data ? data.refetch : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(patientCareTeamQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      careTeam: data ? (data as any).patientCareTeam : null,
    }),
  }),
)(PatientCarePlanSuggestions);
