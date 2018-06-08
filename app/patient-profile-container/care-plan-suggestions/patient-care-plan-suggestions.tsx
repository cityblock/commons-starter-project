import { mapValues } from 'lodash';
import * as React from 'react';
import {
  FullCarePlanSuggestionForPatientFragment,
  FullGoalSuggestionTemplateFragment,
} from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import * as styles from '../css/patient-care-plan.css';
import PopupPatientCarePlanSuggestionAccepted from './popup-patient-care-plan-suggestion-accepted';
import PopupPatientCarePlanSuggestionDismissed from './popup-patient-care-plan-suggestion-dismissed';
import SuggestionsSection, { SectionName } from './suggestions-section';

export interface IAcceptedGoalSuggestion {
  goalSuggestionTemplate: FullGoalSuggestionTemplateFragment;
  concernId: string | null;
  concernTitle: string | null;
  taskTemplateIds: string | null[];
}

export interface ISuggestionGroups {
  [key: string]: FullCarePlanSuggestionForPatientFragment[];
}

export type SuggestionTypes = 'goal' | 'concern';

interface IProps {
  patientId: string;
  routeBase: string;
  glassBreakId: string | null;
  computedFieldSuggestionGroups: ISuggestionGroups | null;
  riskAreaAssessmentSuggestionGroups: ISuggestionGroups | null;
  screeningToolSuggestionGroups: ISuggestionGroups | null;
  allSuggestions: FullCarePlanSuggestionForPatientFragment[];
  riskAreaLabels: { [key: string]: string };
}

interface IState {
  acceptModalVisible: boolean;
  acceptedSuggestion: FullCarePlanSuggestionForPatientFragment | null;
  acceptedTaskTemplateIds: string[];
  dismissModalVisible: boolean;
  dismissedSuggestion: FullCarePlanSuggestionForPatientFragment | null;
  selectedSection?: SectionName | null;
  selectedGroupId?: string | null;
}

export class PatientCarePlanSuggestions extends React.Component<IProps, IState> {
  state = {
    acceptModalVisible: false,
    dismissModalVisible: false,
    acceptedTaskTemplateIds: [],
    acceptedSuggestion: null,
    dismissedSuggestion: null,
  } as IState;

  handleAcceptSuggestion = (
    acceptedSuggestion: FullCarePlanSuggestionForPatientFragment,
    refetchSectionName: SectionName,
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

  handleAcceptModalDismiss = () => {
    this.setState({
      acceptModalVisible: false,
      acceptedSuggestion: null,
      acceptedTaskTemplateIds: [],
    });
  };

  handleDismissSuggestion = (
    dismissedSuggestion: FullCarePlanSuggestionForPatientFragment,
    refetchSectionName: SectionName,
  ) => {
    this.setState({
      acceptModalVisible: false,
      acceptedSuggestion: null,
      acceptedTaskTemplateIds: [],
      dismissModalVisible: true,
      dismissedSuggestion,
    });
  };

  handleDismissModalDismiss = () => {
    this.setState({
      dismissModalVisible: false,
      dismissedSuggestion: null,
    });
  };

  handleGroupClick = (sectionName: SectionName | null, groupId: string | null) => {
    this.setState({
      selectedSection: sectionName,
      selectedGroupId: groupId,
    });
  };

  renderEmptySuggestionsHtml() {
    const {
      computedFieldSuggestionGroups,
      riskAreaAssessmentSuggestionGroups,
      screeningToolSuggestionGroups,
    } = this.props;

    if (
      !computedFieldSuggestionGroups ||
      !riskAreaAssessmentSuggestionGroups ||
      !screeningToolSuggestionGroups ||
      Object.keys(computedFieldSuggestionGroups).length ||
      Object.keys(riskAreaAssessmentSuggestionGroups).length ||
      Object.keys(screeningToolSuggestionGroups).length
    ) {
      return null;
    }

    return (
      <div className={styles.empty}>
        <EmptyPlaceholder
          headerMessageId="carePlanSuggestions.emptyTitle"
          detailMessageId="carePlanSuggestions.emptyBody"
        />
      </div>
    );
  }

  render() {
    const {
      acceptedSuggestion,
      acceptModalVisible,
      acceptedTaskTemplateIds,
      dismissedSuggestion,
      dismissModalVisible,
      selectedGroupId,
      selectedSection,
    } = this.state;
    const {
      patientId,
      computedFieldSuggestionGroups,
      riskAreaAssessmentSuggestionGroups,
      screeningToolSuggestionGroups,
      allSuggestions,
      riskAreaLabels,
    } = this.props;
    const selectedRiskAreaAssessmentGroupId =
      selectedSection === 'riskAreaAssessment' ? selectedGroupId : null;
    const selectedScreeningToolGroupId =
      selectedSection === 'screeningTool' ? selectedGroupId : null;
    const selectedComputedFieldGroupId =
      selectedSection === 'computedField' ? selectedGroupId : null;
    const screeningToolLabels = mapValues(screeningToolSuggestionGroups, group => {
      return group[0].screeningTool!.title;
    });

    return (
      <React.Fragment>
        <SuggestionsSection
          name="riskAreaAssessment"
          titleMessageId="suggestionsSection.riskAreaAssessments"
          suggestionGroups={riskAreaAssessmentSuggestionGroups}
          onAccept={this.handleAcceptSuggestion}
          onDismiss={this.handleDismissSuggestion}
          onGroupClick={this.handleGroupClick}
          selectedGroupId={selectedRiskAreaAssessmentGroupId}
          labels={riskAreaLabels}
        />
        <SuggestionsSection
          name="screeningTool"
          titleMessageId="suggestionsSection.screeningTools"
          suggestionGroups={screeningToolSuggestionGroups}
          onAccept={this.handleAcceptSuggestion}
          onDismiss={this.handleDismissSuggestion}
          onGroupClick={this.handleGroupClick}
          selectedGroupId={selectedScreeningToolGroupId}
          labels={screeningToolLabels}
        />
        <SuggestionsSection
          name="computedField"
          titleMessageId="suggestionsSection.computedFields"
          suggestionGroups={computedFieldSuggestionGroups}
          onAccept={this.handleAcceptSuggestion}
          onDismiss={this.handleDismissSuggestion}
          onGroupClick={this.handleGroupClick}
          selectedGroupId={selectedComputedFieldGroupId}
          labels={riskAreaLabels}
        />
        {this.renderEmptySuggestionsHtml()}
        <PopupPatientCarePlanSuggestionAccepted
          visible={acceptModalVisible}
          patientId={patientId}
          carePlanSuggestions={allSuggestions}
          suggestion={acceptedSuggestion!}
          taskTemplateIds={acceptedTaskTemplateIds}
          onDismiss={this.handleAcceptModalDismiss}
        />
        <PopupPatientCarePlanSuggestionDismissed
          visible={dismissModalVisible}
          suggestion={dismissedSuggestion}
          onDismiss={this.handleDismissModalDismiss}
        />
      </React.Fragment>
    );
  }
}

export default PatientCarePlanSuggestions;
