import { keys } from 'lodash';
import * as React from 'react';
import { FullCarePlanSuggestionForPatientFragment } from '../../graphql/types';
import TextDivider from '../../shared/library/text-divider/text-divider';
import * as styles from '../css/patient-care-plan.css';
import { ISuggestionGroups } from './patient-care-plan-suggestions';
import SuggestionsGroup from './suggestions-group';

interface IProps {
  name: SectionName;
  titleMessageId: string;
  suggestionGroups: ISuggestionGroups | null;
  selectedGroupId?: string | null;
  labels: { [key: string]: string };
  onAccept: (
    suggestion: FullCarePlanSuggestionForPatientFragment,
    refetchSectionName: SectionName,
    taskTemplateIds?: string[],
  ) => void;
  onDismiss: (
    suggestion: FullCarePlanSuggestionForPatientFragment,
    refetchSectionName: SectionName,
  ) => void;
  onGroupClick: (sectionName: SectionName | null, groupId: string | null) => void;
}

export type SectionName = 'riskAreaAssessment' | 'computedField' | 'screeningTool';

export class SuggestionsSection extends React.Component<IProps> {
  renderSuggestionGroups() {
    const {
      suggestionGroups,
      onAccept,
      onDismiss,
      onGroupClick,
      selectedGroupId,
      labels,
      name,
    } = this.props;
    if (!suggestionGroups) {
      return;
    }

    return keys(suggestionGroups).map(groupId => {
      const isSelected = groupId === selectedGroupId;
      const clickedGroupId = isSelected ? null : groupId;
      const clickedSectionName = isSelected ? null : name;

      return (
        <SuggestionsGroup
          key={`suggestionGroup-${groupId}`}
          title={labels[groupId] || ''}
          suggestions={suggestionGroups[groupId]}
          isSelected={isSelected}
          onAccept={(suggestion, taskTemplateIds) => onAccept(suggestion, name, taskTemplateIds)}
          onDismiss={suggestion => onDismiss(suggestion, name)}
          onClick={() => onGroupClick(clickedSectionName, clickedGroupId)}
        />
      );
    });
  }

  render() {
    const { titleMessageId, suggestionGroups } = this.props;
    const suggestionsHtml = this.renderSuggestionGroups();

    const bodyHtml = suggestionGroups ? (
      <div>{suggestionsHtml}</div>
    ) : (
      <div className={styles.emptyCarePlanSuggestionsContainer}>
        <div className={styles.loadingLabel}>Loading...</div>
      </div>
    );

    const dividerHtml =
      !suggestionGroups || keys(suggestionGroups).length ? (
        <TextDivider messageId={titleMessageId} color="navy" />
      ) : null;

    return (
      <div className={styles.section}>
        {dividerHtml}
        {bodyHtml}
      </div>
    );
  }
}

export default SuggestionsSection;
