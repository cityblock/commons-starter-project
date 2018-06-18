import { ApolloError } from 'apollo-client';
import classNames from 'classnames';
import { get, groupBy, keys, mapValues } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup as closePopupAction, openPopup } from '../actions/popup-action';
import computedFieldSuggestionsQuery from '../graphql/queries/get-care-plan-suggestions-from-computed-fields-for-patient.graphql';
import riskAreaAssessmentSuggestionsQuery from '../graphql/queries/get-care-plan-suggestions-from-risk-area-assessments-for-patient.graphql';
import screeningToolSuggestionsQuery from '../graphql/queries/get-care-plan-suggestions-from-screening-tools-for-patient.graphql';
import riskAreaGroupsQuery from '../graphql/queries/get-risk-area-groups.graphql';
import {
  getCarePlanSuggestionsFromComputedFieldsForPatientQuery,
  getCarePlanSuggestionsFromRiskAreaAssessmentsForPatientQuery,
  getCarePlanSuggestionsFromScreeningToolsForPatientQuery,
  getRiskAreaGroupsQuery,
  FullCarePlanSuggestionForPatientFragment,
} from '../graphql/types';
import Button from '../shared/library/button/button';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import { IState as IAppState } from '../store';
import PatientCarePlanSuggestions, {
  ISuggestionGroups,
} from './care-plan-suggestions/patient-care-plan-suggestions';
import SuggestionCategorySelect, {
  ILabels,
  ISuggestionFilters,
} from './care-plan-suggestions/suggestion-category-select';
import { SectionName } from './care-plan-suggestions/suggestions-section';
import styles from './css/patient-care-plan.css';
import PatientMap from './patient-map';
import sharedStyles from './patient-three-sixty/css/shared.css';
import PrintMapButton from './print-map-button';

type SelectableTabs = 'active' | 'suggestions';

interface IProps {
  match: {
    params: {
      patientId: string;
      subTab?: SelectableTabs;
      taskId?: string;
      goalId?: string;
    };
  };
  glassBreakId: string | null;
}

interface IStateProps {
  isPopupOpen: boolean;
}

interface IDispatchProps {
  addConcern: () => void;
  closePopup: () => void;
}

interface IGraphqlProps {
  computedFieldSuggestionsError?: ApolloError | null;
  computedFieldSuggestions?: getCarePlanSuggestionsFromComputedFieldsForPatientQuery['carePlanSuggestionsFromComputedFieldsForPatient'];
  riskAreaAssessmentSuggestionsError?: ApolloError | null;
  riskAreaAssessmentSuggestions?: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatientQuery['carePlanSuggestionsFromRiskAreaAssessmentsForPatient'];
  screeningToolSuggestionsError?: ApolloError | null;
  screeningToolSuggestions?: getCarePlanSuggestionsFromScreeningToolsForPatientQuery['carePlanSuggestionsFromScreeningToolsForPatient'];
  riskAreaGroupsLoading?: boolean;
  riskAreaGroupsError?: ApolloError | null;
  riskAreaGroups?: getRiskAreaGroupsQuery['riskAreaGroups'];
}

export type allProps = IProps & IStateProps & IDispatchProps & IGraphqlProps;

interface ISuggestionSections {
  computedFieldGroups: ISuggestionGroups | null;
  riskAreaAssessmentGroups: ISuggestionGroups | null;
  screeningToolGroups: ISuggestionGroups | null;
  riskAreaLabels: ILabels;
  screeningToolLabels: ILabels;
}

interface IState {
  selectedSectionName: SectionName | null;
  selectedGroupId: string | null;
}

export class PatientCarePlanView extends React.Component<allProps, IState> {
  state = {
    selectedGroupId: null,
    selectedSectionName: null,
  };

  onContainerClick = () => {
    const { isPopupOpen, closePopup } = this.props;
    if (isPopupOpen) closePopup(); // only dispatch action if needed
  };

  handleFilterChange = (sectionName: SectionName | null, groupId: string | null) => {
    this.setState({ selectedSectionName: sectionName, selectedGroupId: groupId });
  };

  getRouteInfo() {
    const { match } = this.props;
    const routeBase = `/patients/${match.params.patientId}/map`;
    const isSuggestions = match.params.subTab === 'suggestions';

    return { routeBase, isSuggestions };
  }

  getGroupedSuggestions() {
    const {
      computedFieldSuggestions,
      riskAreaAssessmentSuggestions,
      screeningToolSuggestions,
    } = this.props;

    const computedFieldGroups = computedFieldSuggestions
      ? groupBy(
          computedFieldSuggestions,
          suggestion => get(suggestion, 'computedField.riskArea.id') as string,
        )
      : null;
    const riskAreaAssessmentGroups = riskAreaAssessmentSuggestions
      ? groupBy(
          riskAreaAssessmentSuggestions,
          suggestion => get(suggestion, 'riskArea.id') as string,
        )
      : null;
    const screeningToolGroups = screeningToolSuggestions
      ? groupBy(
          screeningToolSuggestions,
          suggestion => get(suggestion, 'screeningTool.id') as string,
        )
      : null;

    return {
      computedFieldGroups,
      riskAreaAssessmentGroups,
      screeningToolGroups,
    };
  }

  getRiskAreaLabels() {
    const { riskAreaGroups } = this.props;
    const riskAreaLabels: ILabels = {};
    (riskAreaGroups || []).forEach(riskAreaGroup => {
      const assessmentTypes = groupBy(riskAreaGroup.riskAreas, 'assessmentType');
      const manualRiskAreas = assessmentTypes.manual || [];
      const automatedRiskAreas = assessmentTypes.automated || [];

      manualRiskAreas.forEach(riskArea => {
        let label = riskAreaGroup.title;
        label = manualRiskAreas.length > 1 ? `${label}: ${riskArea.title}` : label;
        riskAreaLabels[riskArea.id] = label;
      });
      automatedRiskAreas.forEach(riskArea => {
        let label = riskAreaGroup.title;
        label = automatedRiskAreas.length > 1 ? `${label}: ${riskArea.title}` : label;
        riskAreaLabels[riskArea.id] = label;
      });
    });

    return riskAreaLabels;
  }

  renderHeader(suggestionFilters: ISuggestionFilters): JSX.Element {
    const { match, addConcern } = this.props;
    const { patientId } = match.params;
    const { routeBase, isSuggestions } = this.getRouteInfo();
    const { selectedSectionName, selectedGroupId } = this.state;

    const actionsHtml = isSuggestions ? (
      <SuggestionCategorySelect
        {...suggestionFilters}
        onChange={this.handleFilterChange}
        selectedSectionName={selectedSectionName}
        selectedGroupId={selectedGroupId}
      />
    ) : (
      <div>
        <PrintMapButton patientId={patientId} />
        <Button messageId="concernCreate.addConcern" onClick={addConcern} />
      </div>
    );

    return (
      <UnderlineTabs className={styles.navBar}>
        <div onClick={this.onContainerClick}>
          <UnderlineTab
            messageId="patient.activeCarePlan"
            href={`${routeBase}/active`}
            selected={!isSuggestions}
          />
          <UnderlineTab
            messageId="patient.carePlanSuggestions"
            href={`${routeBase}/suggestions`}
            selected={isSuggestions}
          />
        </div>
        {actionsHtml}
      </UnderlineTabs>
    );
  }

  renderBody(suggestionSections: ISuggestionSections): JSX.Element {
    const {
      match,
      glassBreakId,
      computedFieldSuggestions,
      riskAreaAssessmentSuggestions,
      screeningToolSuggestions,
    } = this.props;
    const { selectedSectionName, selectedGroupId } = this.state;
    const { patientId, taskId, goalId } = match.params;
    const { routeBase, isSuggestions } = this.getRouteInfo();
    const {
      computedFieldGroups,
      riskAreaAssessmentGroups,
      screeningToolGroups,
      riskAreaLabels,
      screeningToolLabels,
    } = suggestionSections;

    let suggestions: FullCarePlanSuggestionForPatientFragment[] = [];
    suggestions = computedFieldSuggestions
      ? suggestions.concat(computedFieldSuggestions)
      : suggestions;
    suggestions = riskAreaAssessmentSuggestions
      ? suggestions.concat(riskAreaAssessmentSuggestions)
      : suggestions;
    suggestions = screeningToolSuggestions
      ? suggestions.concat(screeningToolSuggestions)
      : suggestions;

    return isSuggestions ? (
      <div
        onClick={this.onContainerClick}
        className={classNames(sharedStyles.body, sharedStyles.scroll)}
      >
        <PatientCarePlanSuggestions
          routeBase={routeBase}
          patientId={patientId}
          glassBreakId={glassBreakId}
          computedFieldSuggestionGroups={computedFieldGroups}
          riskAreaAssessmentSuggestionGroups={riskAreaAssessmentGroups}
          screeningToolSuggestionGroups={screeningToolGroups}
          allSuggestions={suggestions}
          riskAreaLabels={riskAreaLabels}
          screeningToolLabels={screeningToolLabels}
          sectionNameFilter={selectedSectionName}
          groupIdFilter={selectedGroupId}
        />
      </div>
    ) : (
      <PatientMap
        routeBase={`${routeBase}/active`}
        patientId={patientId}
        taskId={taskId || null}
        goalId={goalId || null}
        glassBreakId={glassBreakId}
      />
    );
  }

  render(): JSX.Element {
    const {
      computedFieldGroups,
      riskAreaAssessmentGroups,
      screeningToolGroups,
    } = this.getGroupedSuggestions();
    const riskAreaLabels = this.getRiskAreaLabels();
    const screeningToolLabels = mapValues(screeningToolGroups, group => {
      return group[0].screeningTool!.title;
    });

    const headerHtml = this.renderHeader({
      computedFieldFilters: keys(computedFieldGroups),
      riskAreaAssessmentFilters: keys(riskAreaAssessmentGroups),
      screeningToolFilters: keys(screeningToolGroups),
      riskAreaLabels,
      screeningToolLabels,
    });
    const bodyHtml = this.renderBody({
      computedFieldGroups,
      riskAreaAssessmentGroups,
      screeningToolGroups,
      riskAreaLabels,
      screeningToolLabels,
    });

    return (
      <React.Fragment>
        {headerHtml}
        {bodyHtml}
      </React.Fragment>
    );
  }
}

const getPatientId = (props: IProps): string => props.match.params.patientId;

const mapStateToProps = (state: IAppState): IStateProps => {
  const isPopupOpen = !!state.popup.name;
  return { isPopupOpen };
};

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => {
  const addConcern = () =>
    dispatch(
      openPopup({
        name: 'CREATE_PATIENT_CONCERN',
        options: { patientId: getPatientId(ownProps) },
      }),
    );

  return {
    addConcern,
    closePopup: () => dispatch(closePopupAction()),
  };
};

const shouldSkip = (props: IProps) => props.match.params.subTab !== 'suggestions';

export default compose(
  connect<IStateProps, IDispatchProps, IProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(computedFieldSuggestionsQuery, {
    skip: shouldSkip,
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
        glassBreakId: props.glassBreakId,
      },
    }),
    props: ({ data }) => ({
      computedFieldSuggestionsError: data ? data.error : null,
      computedFieldSuggestions: data
        ? (data as any).carePlanSuggestionsFromComputedFieldsForPatient
        : null,
    }),
  }),
  graphql(riskAreaAssessmentSuggestionsQuery, {
    skip: shouldSkip,
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
        glassBreakId: props.glassBreakId,
      },
    }),
    props: ({ data }) => ({
      riskAreaAssessmentSuggestionsError: data ? data.error : null,
      riskAreaAssessmentSuggestions: data
        ? (data as any).carePlanSuggestionsFromRiskAreaAssessmentsForPatient
        : null,
    }),
  }),
  graphql(screeningToolSuggestionsQuery, {
    skip: shouldSkip,
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
        glassBreakId: props.glassBreakId,
      },
    }),
    props: ({ data }) => ({
      screeningToolSuggestionsError: data ? data.error : null,
      screeningToolSuggestions: data
        ? (data as any).carePlanSuggestionsFromScreeningToolsForPatient
        : null,
    }),
  }),
  graphql(riskAreaGroupsQuery, {
    skip: shouldSkip,
    props: ({ data }) => ({
      riskAreaGroupsLoading: data ? data.loading : false,
      riskAreaGroupsError: data ? data.error : null,
      riskAreaGroups: data ? (data as any).riskAreaGroups : null,
    }),
  }),
)(PatientCarePlanView);
