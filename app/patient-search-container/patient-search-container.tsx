import { ApolloError } from 'apollo-client';
import { History } from 'history';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as patientSearchQuery from '../graphql/queries/get-patient-search.graphql';
import { getPatientSearchQuery, FullPatientTableRowFragment } from '../graphql/types';
import PatientTable from '../shared/patient-table/patient-table';
import PatientTablePagination from '../shared/patient-table/patient-table-pagination';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-search-container.css';
import PatientSearchHeader from './header';
import PatientSearchInput from './input';

const INITIAL_PAGE_NUMBER = 0;
const INITIAL_PAGE_SIZE = 10;

interface IProps {
  location: Location;
  history: History;
}

interface IStateProps {
  query: string;
  pageNumber: number;
  pageSize: number;
}

interface IGraphqlProps {
  refetch: ((variables: { pageNumber: number; pageSize: number }) => void) | null;
  loading: boolean;
  error: ApolloError | undefined | null;
  searchResults?: getPatientSearchQuery['patientSearch'];
}

type allProps = IProps & IStateProps & IGraphqlProps;

interface IState {
  searchTerm: string;
}

export class PatientSearchContainer extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.reloadCurrentPage = this.reloadCurrentPage.bind(this);
    this.state = { searchTerm: '' };
  }

  componentWillReceiveProps(nextProps: allProps) {
    // reset search input field if linking back to search page
    if (this.props.query && !nextProps.query) {
      this.setState({ searchTerm: '' });
    }
  }

  async reloadCurrentPage() {
    await this.props.refetch!({
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
    });
  }

  onSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchTerm: e.currentTarget.value });
  };

  onSearch = (): void => {
    const { history, pageSize } = this.props;
    const { searchTerm } = this.state;

    const newParams = querystring.stringify({
      query: searchTerm,
      pageNumber: INITIAL_PAGE_NUMBER,
      pageSize,
    });
    history.push({ search: newParams });
  };

  createQueryString = (pageNumber: number, pageSize: number) => {
    return querystring.stringify({
      query: this.props.query,
      pageNumber,
      pageSize,
    });
  };

  render(): JSX.Element {
    const { searchTerm } = this.state;
    const { query, pageNumber, pageSize, loading, searchResults, error } = this.props;
    const formattedSearchResults =
      searchResults && searchResults.edges ? searchResults.edges.map(result => result.node) : [];

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <PatientSearchHeader
            query={query}
            totalResults={searchResults ? searchResults.totalCount : null}
          />
          <PatientSearchInput
            searchTerm={searchTerm}
            onChange={this.onSearchTermChange}
            onSearch={this.onSearch}
          />
        </div>
        <PatientTable
          patients={formattedSearchResults as FullPatientTableRowFragment[]}
          isLoading={loading}
          error={error}
          messageIdPrefix="patientSearch"
          isQueried={!!query}
          onRetryClick={this.reloadCurrentPage}
          query={query}
        />
        {!!searchResults && (
          <PatientTablePagination
            pageInfo={searchResults.pageInfo}
            totalCount={searchResults.totalCount}
            pageNumber={pageNumber}
            pageSize={pageSize}
            getQuery={this.createQueryString}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, props: IProps): IStateProps => {
  const searchParams = querystring.parse(props.location.search.substring(1));

  return {
    query: (searchParams.query as string) || '',
    pageNumber: Number(searchParams.pageNumber || INITIAL_PAGE_NUMBER),
    pageSize: Number(searchParams.pageSize || INITIAL_PAGE_SIZE),
  };
};

export default compose(
  withRouter,
  connect<IStateProps, {}>(mapStateToProps as (args?: any) => IStateProps),
  graphql(patientSearchQuery as any, {
    skip: (props: IProps & IStateProps) => !props.query,
    options: ({ query, pageNumber, pageSize }: IProps & IStateProps) => ({
      variables: { query, pageNumber, pageSize },
    }),
    props: ({ data }): IGraphqlProps => ({
      refetch: data ? data.refetch : null,
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      searchResults: data ? (data as any).patientSearch : null,
    }),
  }),
)(PatientSearchContainer);
