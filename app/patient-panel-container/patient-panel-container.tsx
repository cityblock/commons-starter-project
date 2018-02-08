import { History } from 'history';
import { isNil, omitBy } from 'lodash-es';
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
  FullPatientTableRowFragment,
  Gender,
  PatientFilterOptions,
} from '../graphql/types';
import Button from '../shared/library/button/button';
import PatientTable from '../shared/patient-table/patient-table';
import PatientTablePagination from '../shared/patient-table/patient-table-pagination';
import * as styles from './css/patient-panel.css';
import PatientFilterPanel from './patient-filter-panel';
import PatientPanelHeader from './patient-panel-header';

const INITIAL_PAGE_NUMBER = 0;
const INITIAL_PAGE_SIZE = 10;

interface IGraphqlProps {
  refetchPatientPanel: (variables: { pageNumber: number; pageSize: number }) => void;
  loading: boolean;
  error?: string;
  patientPanel?: getPatientPanelQuery['patientPanel'];
  currentUser?: getCurrentUserQuery['currentUser'];
}

interface IStateProps {
  filters: PatientFilterOptions;
  pageNumber: number;
  pageSize: number;
}

interface IProps {
  mutate?: any;
  history: History;
  location: Location;
}

type allProps = IGraphqlProps & IProps & IStateProps;

interface IState {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isPanelOpen: boolean | null;
  pendingFilters: PatientFilterOptions;
}

class PatientPanelContainer extends React.Component<allProps, IState> {
  title = 'Members';

  constructor(props: allProps) {
    super(props);

    this.formattedPatients = this.formattedPatients.bind(this);
    this.state = {
      isPanelOpen: null,
      pendingFilters: {
        ageMin: props.filters.ageMin,
        ageMax: props.filters.ageMax,
        gender: props.filters.gender,
        zip: props.filters.zip,
        careWorkerId: props.filters.careWorkerId,
      },
    };
  }

  async reloadCurrentPage() {
    await this.props.refetchPatientPanel({
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
    });
  }

  formattedPatients() {
    const patients = this.props.patientPanel
      ? this.props.patientPanel.edges.map(edge => edge.node)
      : [];
    return patients as FullPatientTableRowFragment[];
  }

  componentDidMount() {
    document.title = `${this.title} | Commons`;
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

  handleFilterButtonClick = (filters?: PatientFilterOptions) => {
    const { history, pageSize } = this.props;
    const { pendingFilters } = this.state;

    const activeFilters = omitBy<PatientFilterOptions>(filters || pendingFilters, isNil);
    const filterString = querystring.stringify({
      pageNumber: INITIAL_PAGE_NUMBER,
      pageSize,
      ...activeFilters,
    });

    history.push({ search: filterString });
    this.setState({ isPanelOpen: false, pendingFilters: activeFilters });
  };

  createQueryString = (pageNumber: number, pageSize: number) => {
    const activeFilters = omitBy<PatientFilterOptions>(this.props.filters, isNil);
    return querystring.stringify({
      pageNumber,
      pageSize,
      ...activeFilters,
    });
  };

  renderButtons() {
    const { currentUser, filters } = this.props;
    const isAdmin = currentUser && currentUser.userRole === 'admin';
    const filterNames = Object.keys(filters);
    let numberFilters = filterNames.length;
    if (filterNames.includes('ageMin') && filterNames.includes('ageMax')) {
      numberFilters = numberFilters - 1;
    }

    return (
      <div>
        <FormattedMessage id="patientPanel.filter">
          {(message: string) => {
            const label = numberFilters ? `${message}s (${numberFilters})` : message;
            return (
              <Button label={label} onClick={this.handleFilterClick} className={styles.button} />
            );
          }}
        </FormattedMessage>
        {isAdmin && (
          <Button
            messageId="patientPanel.addPatient"
            onClick={this.goToIntake}
            className={styles.button}
          />
        )}
      </div>
    );
  }

  render(): JSX.Element {
    const { loading, filters, patientPanel, pageSize, pageNumber, error } = this.props;
    const { isPanelOpen, pendingFilters } = this.state;
    const memberCount = patientPanel ? patientPanel.totalCount : 0;
    const numberFilters = Object.keys(filters).length;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <PatientPanelHeader filters={filters} totalResults={memberCount} />
            {this.renderButtons()}
          </div>
        </div>
        <div className={styles.patientPanelBody}>
          <PatientTable
            patients={this.formattedPatients()}
            messageIdPrefix="patientPanel"
            isQueried={!!numberFilters}
            isLoading={loading}
            error={error}
            onRetryClick={this.reloadCurrentPage}
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
          onClick={this.handleFilterButtonClick}
          onChange={this.handleFilterChange}
          isVisible={isPanelOpen}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IState, props: IProps): IStateProps => {
  const searchParams = querystring.parse(props.location.search.substring(1));

  const filters = {
    gender: (searchParams.gender as Gender) || null,
    careWorkerId: (searchParams.careWorkerId as string) || null,
    zip: (searchParams.zip as string) || null,
    ageMin: parseInt(searchParams.ageMin as string, 10) || null,
    ageMax: parseInt(searchParams.ageMax as string, 10) || null,
  };

  const activeFilters = omitBy<PatientFilterOptions>(filters, isNil);
  return {
    filters: activeFilters,
    pageNumber: Number(searchParams.pageNumber || INITIAL_PAGE_NUMBER),
    pageSize: Number(searchParams.pageSize || INITIAL_PAGE_SIZE),
  };
};

export default compose(
  withRouter,
  connect<IStateProps, {}>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IProps & IStateProps, allProps>(patientPanelQuery as any, {
    options: ({ pageNumber, pageSize, filters }) => ({
      variables: { pageNumber, pageSize, filters },
    }),
    props: ({ data }) => ({
      refetchPatientPanel: data ? data.refetch : null,
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientPanel: data ? (data as any).patientPanel : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(currentUserQuery as any, {
    options: (props: IProps) => ({
      variables: {},
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(PatientPanelContainer);
