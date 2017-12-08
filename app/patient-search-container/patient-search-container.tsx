import * as querystring from 'querystring';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-search-container.css';
import PatientSearchHeader from './header';
import PatientSearchInput from './input';

const INITIAL_PAGE_NUMBER = 0;
const INITIAL_PAGE_SIZE = 10;

interface IStateProps {
  query: string | null;
  pageNumber: number;
  pageSize: number;
}

interface IDispatchProps {
  updateSearchParams: (searchParams: IStateProps) => void;
}

type allProps = IStateProps & IDispatchProps;

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

  onSearchClick = (): void => {
    const { updateSearchParams, pageSize } = this.props;
    const { searchTerm } = this.state;

    updateSearchParams({
      query: searchTerm,
      pageNumber: INITIAL_PAGE_NUMBER,
      pageSize,
    });
  }

  render(): JSX.Element {
    const { searchTerm } = this.state;
    const { query } = this.props;

    return (
      <div className={styles.container}>
        <PatientSearchHeader query={query} totalResults={null} />
        <PatientSearchInput
          searchTerm={searchTerm}
          onChange={this.onSearchTermChange}
          onSearch={this.onSearchClick} />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const searchParams = querystring.parse(state.routing.location.search.substring(1));

  return {
    query: (searchParams.query as string) || null,
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

export default connect<IStateProps, {}, {}>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps,
)(PatientSearchContainer);
