import React from 'react';
import OptGroup from '../../shared/library/optgroup/optgroup';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import Text from '../../shared/library/text/text';
import styles from './css/suggestion-category-select.css';
import { SectionName } from './suggestions-section';

export interface ILabels {
  [key: string]: string;
}

export interface ISuggestionFilters {
  computedFieldFilters: string[];
  riskAreaAssessmentFilters: string[];
  screeningToolFilters: string[];
  riskAreaLabels: ILabels;
  screeningToolLabels: ILabels;
}

interface IProps extends ISuggestionFilters {
  onChange: (sectionName: SectionName | null, groupId: string | null) => void;
  selectedSectionName?: SectionName | null;
  selectedGroupId?: string | null;
}

const getFilterValueString = (sectionName?: SectionName | null, groupId?: string | null) => {
  if (!sectionName) {
    return '';
  }
  return groupId ? `${sectionName}/${groupId}` : sectionName;
};

const getSelectedFromFilterValueString = (filterValue: string) => {
  if (!filterValue) {
    return { selectedSectionName: null, selectedGroupId: null };
  }

  const valueParts = filterValue.split('/');
  if (valueParts.length > 1) {
    return { selectedSectionName: valueParts[0] as SectionName, selectedGroupId: valueParts[1] };
  }
  return { selectedSectionName: valueParts[0] as SectionName, selectedGroupId: null };
};

class SuggestionCategorySelect extends React.Component<IProps> {
  componentWillUnmount() {
    // unset the filter state when you switch tabs
    this.props.onChange(null, null);
  }

  handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const { selectedSectionName, selectedGroupId } = getSelectedFromFilterValueString(value);
    this.props.onChange(selectedSectionName, selectedGroupId);
  };

  renderOptions(filters: string[], labels: ILabels, sectionName: SectionName) {
    const groupFilters = filters.map(groupId => {
      const value = getFilterValueString(sectionName, groupId);
      return (
        <Option key={`option-${sectionName}-${groupId}`} value={value} label={labels[groupId]} />
      );
    });

    return (
      <React.Fragment>
        <Option
          value={getFilterValueString(sectionName)}
          messageId={`suggestionCategorySelect.${sectionName}`}
        />
        {groupFilters}
      </React.Fragment>
    );
  }

  renderOptionGroups() {
    const {
      computedFieldFilters,
      riskAreaAssessmentFilters,
      screeningToolFilters,
      riskAreaLabels,
      screeningToolLabels,
    } = this.props;

    const computedFieldOptGroup =
      computedFieldFilters.length && riskAreaLabels ? (
        <OptGroup messageId="suggestionsSection.computedField">
          {this.renderOptions(computedFieldFilters, riskAreaLabels, 'computedField')}
        </OptGroup>
      ) : null;

    const riskAreaAssessmentOptGroup =
      riskAreaAssessmentFilters.length && riskAreaLabels ? (
        <OptGroup messageId="suggestionsSection.riskAreaAssessment">
          {this.renderOptions(riskAreaAssessmentFilters, riskAreaLabels, 'riskAreaAssessment')}
        </OptGroup>
      ) : null;

    const screeningToolOptGroup =
      screeningToolFilters.length && screeningToolLabels ? (
        <OptGroup messageId="suggestionsSection.screeningTool">
          {this.renderOptions(screeningToolFilters, screeningToolLabels, 'screeningTool')}
        </OptGroup>
      ) : null;

    return (
      <React.Fragment>
        {riskAreaAssessmentOptGroup}
        {screeningToolOptGroup}
        {computedFieldOptGroup}
      </React.Fragment>
    );
  }

  render() {
    const { selectedGroupId, selectedSectionName } = this.props;
    const selectedValue = getFilterValueString(selectedSectionName, selectedGroupId);

    return (
      <div className={styles.container}>
        <Text messageId="suggestionCategorySelect.title" color="gray" size="large" />
        <Select value={selectedValue} onChange={this.handleOptionChange} className={styles.select}>
          <Option value="" messageId="suggestionCategorySelect.all" />
          {this.renderOptionGroups()}
        </Select>
      </div>
    );
  }
}

export default SuggestionCategorySelect;
