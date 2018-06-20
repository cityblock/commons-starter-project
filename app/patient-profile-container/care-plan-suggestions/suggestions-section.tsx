import classNames from 'classnames';
import { keys } from 'lodash';
import React from 'react';
import { FullCarePlanSuggestionForPatient } from '../../graphql/types';
import TextDivider from '../../shared/library/text-divider/text-divider';
import styles from '../css/patient-care-plan.css';
import { ISuggestionGroups } from './patient-care-plan-suggestions';
import SuggestionsGroup from './suggestions-group';

interface IProps {
  name: SectionName;
  titleMessageId: string;
  suggestionGroups: ISuggestionGroups | null;
  selectedGroupId?: string | null;
  labels: { [key: string]: string };
  groupIdFilter: string | null;
  isHidden: boolean;
  onAccept: (suggestion: FullCarePlanSuggestionForPatient, taskTemplateIds?: string[]) => void;
  onDismiss: (suggestion: FullCarePlanSuggestionForPatient) => void;
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
      groupIdFilter,
      labels,
      name,
    } = this.props;
    if (!suggestionGroups) {
      return;
    }

    return keys(suggestionGroups).map(groupId => {
      const isFiltered = !!groupIdFilter;
      const isHidden = isFiltered && groupIdFilter !== groupId;
      const isSelected = groupId === selectedGroupId || isFiltered;
      const clickedGroupId = isSelected ? null : groupId;
      const clickedSectionName = isSelected ? null : name;

      return (
        <SuggestionsGroup
          key={`suggestionGroup-${groupId}`}
          title={labels[groupId] || ''}
          suggestions={suggestionGroups[groupId]}
          isSelected={isSelected}
          isHidden={isHidden}
          onAccept={onAccept}
          onDismiss={onDismiss}
          onClick={() => onGroupClick(clickedSectionName, clickedGroupId)}
        />
      );
    });
  }

  render() {
    const { titleMessageId, suggestionGroups, isHidden } = this.props;
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
      <div className={classNames(styles.section, { [styles.hidden]: isHidden })}>
        {dividerHtml}
        {bodyHtml}
      </div>
    );
  }
}

export default SuggestionsSection;
