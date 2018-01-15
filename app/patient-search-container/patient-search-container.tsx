import { History } from 'history';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as patientSearchQuery from '../graphql/queries/get-patient-search.graphql';
import { getPatientSearchQuery, FullPatientSearchResultFragment } from '../graphql/types';
import Pagination from '../shared/library/pagination/pagination';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-search-container.css';
import PatientSearchHeader from './header';
import PatientSearchInput from './input';
import PatientSearchResults from './results';

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
  loading: boolean;
  error?: string;
  searchResults?: getPatientSearchQuery['patientSearch'];
}

type allProps = IProps & IStateProps & IGraphqlProps;

interface IState {
  searchTerm: string;
}

export class PatientSearchContainer extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { searchTerm: '' };
  }

  componentWillReceiveProps(nextProps: allProps) {
    // reset search input field if linking back to search page
    if (this.props.query && !nextProps.query) {
      this.setState({ searchTerm: '' });
    }
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

  onPaginate = (pageBack: boolean): void => {
    const { history, query, pageNumber, pageSize, searchResults } = this.props;
    let newPageNumber = pageBack ? pageNumber - 1 : pageNumber + 1;
    // extra security, though UI should not allow this
    if (newPageNumber < 0) newPageNumber = 0;
    if (searchResults && newPageNumber > Math.ceil(searchResults.totalCount / pageSize)) {
      newPageNumber = Math.ceil(searchResults.totalCount / pageSize);
    }

    const newParams = querystring.stringify({
      query,
      pageNumber: newPageNumber,
      pageSize,
    });
    history.push({ search: newParams });
  };

  render(): JSX.Element {
    const { searchTerm } = this.state;
    const { query, pageNumber, pageSize, loading, searchResults } = this.props;
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
        <PatientSearchResults
          query={query}
          searchResults={formattedSearchResults as FullPatientSearchResultFragment[]}
          loading={loading}
        />
        {!!searchResults &&
          searchResults.totalCount && (
            <Pagination
              pageInfo={searchResults.pageInfo}
              totalCount={searchResults.totalCount}
              pageNumber={pageNumber}
              pageSize={pageSize}
              onPaginate={this.onPaginate}
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
  graphql<IGraphqlProps, IProps & IStateProps, allProps>(patientSearchQuery as any, {
    skip: (props: IProps & IStateProps) => !props.query,
    options: ({ query, pageNumber, pageSize }) => ({
      variables: { query, pageNumber, pageSize },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      searchResults: data ? (data as any).patientSearch : null,
    }),
  }),
)(PatientSearchContainer);
