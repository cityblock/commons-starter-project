import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
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

interface IStateProps {
  query: string;
  pageNumber: number;
  pageSize: number;
}

interface IDispatchProps {
  updateSearchParams: (searchParams: IStateProps) => void;
}

interface IGraphqlProps {
  loading: boolean;
  error?: string;
  searchResults?: getPatientSearchQuery['patientSearch'];
}

type IProps = IStateProps & IDispatchProps;
type allProps = IProps & IGraphqlProps;

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
    const { updateSearchParams, pageSize } = this.props;
    const { searchTerm } = this.state;

    updateSearchParams({
      query: searchTerm,
      pageNumber: INITIAL_PAGE_NUMBER,
      pageSize,
    });
  };

  onPaginate = (pageBack: boolean): void => {
    const { updateSearchParams, query, pageNumber, pageSize, searchResults } = this.props;
    let newPageNumber = pageBack ? pageNumber - 1 : pageNumber + 1;
    // extra security, though UI should not allow this
    if (newPageNumber < 0) newPageNumber = 0;
    if (searchResults && newPageNumber > Math.ceil(searchResults.total / pageSize)) {
      newPageNumber = Math.ceil(searchResults.total / pageSize);
    }

    updateSearchParams({
      query,
      pageNumber: newPageNumber,
      pageSize,
    });
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
            totalResults={searchResults ? searchResults.total : null}
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
          searchResults.total && (
            <Pagination
              pageInfo={searchResults.pageInfo}
              total={searchResults.total}
              pageNumber={pageNumber}
              pageSize={pageSize}
              onPaginate={this.onPaginate}
            />
          )}
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const searchParams = querystring.parse(state.routing.location.search.substring(1));

  return {
    query: (searchParams.query as string) || '',
    pageNumber: Number(searchParams.pageNumber || INITIAL_PAGE_NUMBER),
    pageSize: Number(searchParams.pageSize || INITIAL_PAGE_SIZE),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => {
  const updateSearchParams = (searchParams: IStateProps) => {
    dispatch(push({ search: querystring.stringify(searchParams) }));
  };

  return { updateSearchParams };
};

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IProps, allProps>(patientSearchQuery as any, {
    skip: (props: IProps) => !props.query,
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
