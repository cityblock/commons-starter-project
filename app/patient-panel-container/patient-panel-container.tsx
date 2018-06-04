import { ApolloError } from 'apollo-client';
import { History } from 'history';
import { isNil, omitBy } from 'lodash';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import * as patientPanelQuery from '../graphql/queries/get-patient-panel.graphql';
import {
  getCurrentUserQuery,
  getPatientPanelQuery,
  CurrentPatientState,
  Gender,
  PatientFilterOptions,
} from '../graphql/types';
import Button from '../shared/library/button/button';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import PatientTable, { IFormattedPatient } from '../shared/patient-table/patient-table';
import PatientTablePagination from '../shared/patient-table/patient-table-pagination';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import * as styles from './css/patient-panel.css';
import PatientAssignModal, { filterPatientState, IPatientState } from './patient-assign-modal';
import PatientFilterPanel from './patient-filter-panel';
import PatientPanelHeader from './patient-panel-header';

const INITIAL_PAGE_NUMBER = 0;
const INITIAL_PAGE_SIZE = 10;

interface IGraphqlProps {
  refetchPatientPanel: (variables: { pageNumber: number; pageSize: number }) => void;
  loading: boolean;
  error: ApolloError | null | undefined;
  patientPanel?: getPatientPanelQuery['patientPanel'];
  currentUser?: getCurrentUserQuery['currentUser'];
}

interface IStateProps {
  filters: PatientFilterOptions;
  pageNumber: number;
  pageSize: number;
  showAllPatients: boolean;
}

interface IProps {
  history: History;
  location: Location;
}

type allProps = IGraphqlProps & IProps & IStateProps & IInjectedProps;

interface IState {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isPanelOpen: boolean | null;
  isPopupVisible: boolean;
  pendingFilters: PatientFilterOptions;
  patientSelectState: IPatientState;
  isGloballySelected: boolean;
  isAllPatientsSelected: boolean;
}

class PatientPanelContainer extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.formattedPatients = this.formattedPatients.bind(this);
    this.state = {
      isPanelOpen: null,
      isPopupVisible: false,
      pendingFilters: {
        ageMin: props.filters.ageMin,
        ageMax: props.filters.ageMax,
        gender: props.filters.gender,
        zip: props.filters.zip,
        careWorkerId: props.filters.careWorkerId,
        patientState: props.filters.patientState,
      },
      patientSelectState: {},
      isGloballySelected: false,
      isAllPatientsSelected: props.showAllPatients,
    };
  }

  async reloadCurrentPage() {
    await this.props.refetchPatientPanel({
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
    });
  }

  formattedPatients() {
    const { patientPanel } = this.props;
    const { patientSelectState }: any = this.state;

    const patients = patientPanel
      ? patientPanel.edges.map(edge => {
          if (edge.node) {
            return { ...edge.node, isSelected: !!patientSelectState[edge.node.id] };
          }
          return edge.node;
        })
      : [];
    return patients as IFormattedPatient[];
  }

  goToIntake = () => this.props.history.push('/patient-intake');

  handleFilterClick = () => {
    this.setState({ isPanelOpen: true });
  };

  handleFilterChange = (filter: PatientFilterOptions) => {
    this.setState({
      pendingFilters: {
        ...this.state.pendingFilters,
        ...filter,
      },
    });
  };

  handleCloseFilterPanel = () => {
    this.setState({ isPanelOpen: false, pendingFilters: this.props.filters });
  };

  handleFilterButtonClick = (filters?: PatientFilterOptions) => {
    const { history, pageSize } = this.props;
    const { pendingFilters, isAllPatientsSelected } = this.state;

    const activeFilters = omitBy<PatientFilterOptions>(filters || pendingFilters, isNil);
    const filterString = querystring.stringify({
      pageNumber: INITIAL_PAGE_NUMBER,
      pageSize,
      showAllPatients: isAllPatientsSelected,
      ...activeFilters,
    });

    history.push({ search: filterString });
    this.setState({
      isPanelOpen: false,
      pendingFilters: activeFilters,
      patientSelectState: {},
      isGloballySelected: false,
    });
  };

  handleShowPatientsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { history, pageSize, filters } = this.props;
    const { value } = event.target;
    const updatedValue = value === 'true';

    const activeFilters = omitBy<PatientFilterOptions>(filters, isNil);
    const filterString = querystring.stringify({
      pageNumber: INITIAL_PAGE_NUMBER,
      pageSize,
      showAllPatients: updatedValue,
      ...activeFilters,
    });

    history.push({ search: filterString });
    this.setState({ isAllPatientsSelected: updatedValue });
  };

  handleModalClose = () => {
    this.setState({ isPopupVisible: false });
  };

  handleAssignMembersClick = () => {
    this.setState({ isPopupVisible: true });
  };

  handlePatientSelectToggle = (selectState: object) => {
    const newSelectState = {
      ...this.state.patientSelectState,
      ...selectState,
    };
    this.setState({ patientSelectState: newSelectState, isGloballySelected: false });
  };

  handleSelectAllToggle = (isSelected: boolean) => {
    const { patientPanel } = this.props;

    if (patientPanel) {
      const selectState = {} as any;
      patientPanel.edges.forEach(({ node }) => {
        if (node) {
          selectState[node.id] = isSelected;
        }
      });
      this.handlePatientSelectToggle(selectState);
      this.setState({ isGloballySelected: isSelected });
    }
  };

  createQueryString = (pageNumber: number, pageSize: number) => {
    const { showAllPatients, filters } = this.props;
    const activeFilters = omitBy<PatientFilterOptions>(filters, isNil);
    return querystring.stringify({
      pageNumber,
      pageSize,
      ...activeFilters,
      showAllPatients,
    });
  };

  renderShowAllPatientsToggle() {
    const { featureFlags } = this.props;
    const { isAllPatientsSelected } = this.state;
    if (!featureFlags.canShowAllMembersInPatientPanel) {
      return null;
    }

    return (
      <div className={styles.boxWrapper}>
        <RadioGroup className={styles.toggle}>
          <RadioInput
            name="showAllPatients"
            value="true"
            checked={isAllPatientsSelected}
            label="All Members"
            onChange={this.handleShowPatientsChange}
          />
          <RadioInput
            name="showAllPatients"
            value="false"
            checked={!isAllPatientsSelected}
            label="My Panel"
            onChange={this.handleShowPatientsChange}
          />
        </RadioGroup>
      </div>
    );
  }

  renderButtons() {
    const { filters, featureFlags } = this.props;
    const { patientSelectState } = this.state;

    const numberPatientsSelected = filterPatientState(patientSelectState).length;
    const filterNames = Object.keys(filters);

    let numberFilters = filterNames.length;
    if (filterNames.includes('ageMin') && filterNames.includes('ageMax')) {
      numberFilters = numberFilters - 1;
    }

    return (
      <div className={styles.boxWrapper}>
        <div className={styles.buttonGroup}>
          <FormattedMessage id="patientPanel.filter">
            {(message: string) => {
              const label = numberFilters ? `${message}s (${numberFilters})` : message;
              return (
                <Button
                  label={label}
                  onClick={this.handleFilterClick}
                  className={styles.button}
                  color="white"
                />
              );
            }}
          </FormattedMessage>
          {featureFlags.canBulkAssign && (
            <Button
              messageId="patientPanel.assignMembers"
              onClick={this.handleAssignMembersClick}
              className={styles.button}
              disabled={!numberPatientsSelected}
            />
          )}
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const {
      loading,
      filters,
      patientPanel,
      pageSize,
      pageNumber,
      error,
      featureFlags,
      showAllPatients,
    } = this.props;
    const {
      isPanelOpen,
      isGloballySelected,
      pendingFilters,
      isPopupVisible,
      patientSelectState,
    } = this.state;
    const memberCount = patientPanel ? patientPanel.totalCount : 0;
    const numberFilters = Object.keys(filters).length;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <PatientPanelHeader filters={filters} totalResults={memberCount} />
          {this.renderShowAllPatientsToggle()}
          {this.renderButtons()}
        </div>
        <div className={styles.patientPanelBody}>
          <PatientTable
            patients={this.formattedPatients()}
            messageIdPrefix="patientPanel"
            isQueried={!!numberFilters}
            isLoading={loading}
            isGloballySelected={isGloballySelected}
            error={error}
            onRetryClick={this.reloadCurrentPage}
            onSelectToggle={featureFlags.canBulkAssign ? this.handlePatientSelectToggle : null}
            onSelectAll={this.handleSelectAllToggle}
          />
          {!!patientPanel && (
            <PatientTablePagination
              pageInfo={patientPanel.pageInfo}
              totalCount={patientPanel.totalCount}
              pageNumber={pageNumber}
              pageSize={pageSize}
              getQuery={this.createQueryString}
            />
          )}
        </div>
        <PatientFilterPanel
          filters={pendingFilters}
          onClickApply={this.handleFilterButtonClick}
          onClickCancel={this.handleCloseFilterPanel}
          onChange={this.handleFilterChange}
          isVisible={isPanelOpen}
        />
        <PatientAssignModal
          isVisible={isPopupVisible}
          closePopup={this.handleModalClose}
          patientSelectState={patientSelectState}
          showAllPatients={showAllPatients}
          filters={filters}
          pageNumber={pageNumber}
          pageSize={pageSize}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IState, props: allProps): IStateProps => {
  const searchParams = querystring.parse(props.location.search.substring(1));
  const showAllPatientsSearchParam = searchParams.showAllPatients as string;
  let showAllPatients = true;

  if (
    showAllPatientsSearchParam === 'false' ||
    !props.featureFlags.canShowAllMembersInPatientPanel
  ) {
    showAllPatients = false;
  }

  const filters = {
    gender: (searchParams.gender as Gender) || null,
    careWorkerId: (searchParams.careWorkerId as string) || null,
    zip: (searchParams.zip as string) || null,
    ageMin: parseInt(searchParams.ageMin as string, 10) || null,
    ageMax: parseInt(searchParams.ageMax as string, 10) || null,
    patientState: (searchParams.patientState as CurrentPatientState) || null,
  };

  const activeFilters = omitBy<PatientFilterOptions>(filters, isNil);
  return {
    filters: activeFilters,
    showAllPatients,
    pageNumber: Number(searchParams.pageNumber || INITIAL_PAGE_NUMBER),
    pageSize: Number(searchParams.pageSize || INITIAL_PAGE_SIZE),
  };
};

export default compose(
  withRouter,
  withCurrentUser(),
  connect<IStateProps, {}>(mapStateToProps as (args?: any) => IStateProps),
  graphql(patientPanelQuery as any, {
    options: ({ pageNumber, pageSize, filters, showAllPatients }: any) => ({
      variables: { pageNumber, pageSize, filters, showAllPatients },
    }),
    props: ({ data }): Partial<IGraphqlProps> => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientPanel: data ? (data as any).patientPanel : null,
    }),
  }),
  graphql(currentUserQuery as any, {
    options: (props: IProps) => ({
      variables: {},
    }),
    props: ({ data }): Partial<IGraphqlProps> => ({
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(PatientPanelContainer) as React.ComponentClass<{}>;
