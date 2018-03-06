import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientCarePlanSuggestionsQuery from '../graphql/queries/get-patient-care-plan-suggestions.graphql';
import {
  getPatientCarePlanSuggestionsQuery,
  FullCarePlanSuggestionForPatientFragment,
  FullGoalSuggestionTemplateFragment,
} from '../graphql/types';
import EmptyPlaceholder from '../shared/library/empty-placeholder/empty-placeholder';
import TextDivider from '../shared/library/text-divider/text-divider';
import CarePlanSuggestion from './care-plan-suggestions/care-plan-suggestion';
import GoalSuggestions from './care-plan-suggestions/goal-suggestions';
import * as styles from './css/patient-care-plan.css';
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
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  carePlanSuggestions?: getPatientCarePlanSuggestionsQuery['carePlanSuggestionsForPatient'];
  refetchCarePlanSuggestions?: () => any;
}

interface IState {
  acceptModalVisible: boolean;
  acceptedSuggestion: FullCarePlanSuggestionForPatientFragment | null;
  acceptedTaskTemplateIds: string[];
  dismissModalVisible: boolean;
  dismissedSuggestion: FullCarePlanSuggestionForPatientFragment | null;
}

export class PatientCarePlanSuggestions extends React.Component<IProps & IGraphqlProps, IState> {
  constructor(props: IProps & IGraphqlProps) {
    super(props);

    this.state = {
      acceptModalVisible: false,
      dismissModalVisible: false,
      acceptedTaskTemplateIds: [],
      acceptedSuggestion: null,
      dismissedSuggestion: null,
    };
  }

  onAcceptSuggestion = (
    acceptedSuggestion: FullCarePlanSuggestionForPatientFragment,
    taskTemplateIds?: string[],
  ) => {
    this.setState({
      acceptModalVisible: true,
      acceptedSuggestion,
      acceptedTaskTemplateIds: taskTemplateIds || [],
      dismissedSuggestion: null,
      dismissModalVisible: false,
    });
  };

  onAcceptModalDismiss = () => {
    this.setState({
      acceptModalVisible: false,
      acceptedSuggestion: null,
      acceptedTaskTemplateIds: [],
    });
  };

  onDismissSuggestion = (dismissedSuggestion: FullCarePlanSuggestionForPatientFragment) => {
    this.setState({
      acceptModalVisible: false,
      acceptedSuggestion: null,
      acceptedTaskTemplateIds: [],
      dismissModalVisible: true,
      dismissedSuggestion,
    });
  };

  onDismissModalDismiss = () => {
    this.setState({
      dismissModalVisible: false,
      dismissedSuggestion: null,
    });
  };

  defaultSuggestionsHtml = (suggestionType: SuggestionTypes) => {
    const { loading } = this.props;

    return (
      <div className={styles.carePlanSuggestionsLoading}>
        {loading ? 'Loading...' : `No suggested ${suggestionType}s.`}
      </div>
    );
  };

  renderConcerns(suggestions: FullCarePlanSuggestionForPatientFragment[]) {
    return suggestions.map(suggestion => (
      <CarePlanSuggestion
        key={suggestion.id}
        suggestion={suggestion}
        onAccept={() => this.onAcceptSuggestion(suggestion)}
        onDismiss={() => this.onDismissSuggestion(suggestion)}
      />
    ));
  }

  renderGoals(suggestions: FullCarePlanSuggestionForPatientFragment[]) {
    return (
      <GoalSuggestions
        suggestions={suggestions}
        onAccept={this.onAcceptSuggestion}
        onDismiss={this.onDismissSuggestion}
      />
    );
  }

  renderSuggestions(suggestionType: SuggestionTypes) {
    const { carePlanSuggestions } = this.props;

    const defaultHtml = this.defaultSuggestionsHtml(suggestionType);

    if (!carePlanSuggestions) {
      return defaultHtml;
    }

    const suggestionsToUse = carePlanSuggestions.filter(
      carePlanSuggestion =>
        carePlanSuggestion && carePlanSuggestion.suggestionType === suggestionType,
    );

    if (suggestionsToUse.length && suggestionType === 'concern') {
      return this.renderConcerns(suggestionsToUse as FullCarePlanSuggestionForPatientFragment[]);
    } else if (suggestionsToUse.length && suggestionType === 'goal') {
      return this.renderGoals(suggestionsToUse as FullCarePlanSuggestionForPatientFragment[]);
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
          <TextDivider messageId="carePlanSuggestions.concerns" color="navy" />
          <div>{this.renderSuggestions('concern')}</div>
        </div>
        <div className={styles.section}>
          <TextDivider messageId="carePlanSuggestions.goals" color="black" />
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
      <div className={styles.empty}>
        <EmptyPlaceholder
          headerMessageId="carePlanSuggestions.emptyTitle"
          detailMessageId="carePlanSuggestions.emptyBody"
        />
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
        glassBreakId: props.glassBreakId,
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
)(PatientCarePlanSuggestions);
