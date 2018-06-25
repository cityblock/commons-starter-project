import React from 'react';
import { FullCarePlanSuggestionForPatient, FullGoalSuggestionTemplate } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import styles from '../css/patient-care-plan.css';
import PopupPatientCarePlanSuggestionAccepted from './popup-patient-care-plan-suggestion-accepted';
import PopupPatientCarePlanSuggestionDismissed from './popup-patient-care-plan-suggestion-dismissed';
import SuggestionsSection, { SectionName } from './suggestions-section';

export interface IAcceptedGoalSuggestion {
  goalSuggestionTemplate: FullGoalSuggestionTemplate;
  concernId: string | null;
  concernTitle: string | null;
  taskTemplateIds: string | null[];
}

export interface ISuggestionGroups {
  [key: string]: FullCarePlanSuggestionForPatient[];
}

export type SuggestionTypes = 'goal' | 'concern';

interface IProps {
  patientId: string;
  routeBase: string;
  glassBreakId: string | null;
  computedFieldSuggestionGroups: ISuggestionGroups | null;
  riskAreaAssessmentSuggestionGroups: ISuggestionGroups | null;
  screeningToolSuggestionGroups: ISuggestionGroups | null;
  allSuggestions: FullCarePlanSuggestionForPatient[];
  riskAreaLabels: { [key: string]: string };
  screeningToolLabels: { [key: string]: string };
  sectionNameFilter: SectionName | null;
  groupIdFilter: string | null;
}

interface IState {
  acceptModalVisible: boolean;
  acceptedSuggestion: FullCarePlanSuggestionForPatient | null;
  acceptedTaskTemplateIds: string[];
  dismissModalVisible: boolean;
  dismissedSuggestion: FullCarePlanSuggestionForPatient | null;
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
    acceptedSuggestion: FullCarePlanSuggestionForPatient,
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

  handleDismissSuggestion = (dismissedSuggestion: FullCarePlanSuggestionForPatient) => {
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

  renderSection(
    sectionName: SectionName,
    suggestionGroups: ISuggestionGroups | null,
    labels: { [key: string]: string },
  ) {
    const { sectionNameFilter, groupIdFilter } = this.props;
    const { selectedGroupId, selectedSection } = this.state;

    const sectionGroupIdFilter = sectionNameFilter === sectionName ? groupIdFilter : null;
    const selectedSectionGroupId = selectedSection === sectionName ? selectedGroupId : null;
    const isHidden = !!sectionNameFilter && sectionNameFilter !== sectionName;

    return (
      <SuggestionsSection
        name={sectionName}
        titleMessageId={`suggestionsSection.${sectionName}`}
        suggestionGroups={suggestionGroups}
        onAccept={this.handleAcceptSuggestion}
        onDismiss={this.handleDismissSuggestion}
        onGroupClick={this.handleGroupClick}
        selectedGroupId={selectedSectionGroupId}
        labels={labels}
        groupIdFilter={sectionGroupIdFilter}
        isHidden={isHidden}
      />
    );
  }

  renderSections() {
    const {
      computedFieldSuggestionGroups,
      riskAreaAssessmentSuggestionGroups,
      screeningToolSuggestionGroups,
      riskAreaLabels,
      screeningToolLabels,
    } = this.props;

    const riskAreaAssessmentSection = this.renderSection(
      'riskAreaAssessment',
      riskAreaAssessmentSuggestionGroups,
      riskAreaLabels,
    );
    const screeningToolSection = this.renderSection(
      'screeningTool',
      screeningToolSuggestionGroups,
      screeningToolLabels,
    );
    const computedFieldSection = this.renderSection(
      'computedField',
      computedFieldSuggestionGroups,
      riskAreaLabels,
    );

    return (
      <React.Fragment>
        {riskAreaAssessmentSection}
        {screeningToolSection}
        {computedFieldSection}
      </React.Fragment>
    );
  }

  render() {
    const {
      acceptedSuggestion,
      acceptModalVisible,
      acceptedTaskTemplateIds,
      dismissedSuggestion,
      dismissModalVisible,
    } = this.state;
    const { patientId, allSuggestions, glassBreakId } = this.props;

    return (
      <React.Fragment>
        {this.renderSections()}
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
          glassBreakId={glassBreakId}
          suggestion={dismissedSuggestion}
          patientId={patientId}
          onDismiss={this.handleDismissModalDismiss}
        />
      </React.Fragment>
    );
  }
}

export default PatientCarePlanSuggestions;
