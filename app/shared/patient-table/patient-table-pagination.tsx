import { History } from 'history';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Pagination from '../library/pagination/pagination';

interface IPageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface IProps {
  location: Location;
  history: History;
  pageInfo: IPageInfo;
  totalCount: number; // total number of results
  pageNumber: number; // do NOT add 1
  pageSize: number;
  get: (pageNumber: number, pageSize: number) => string;
  className?: string; // optional styles
}

interface IState {
  searchTerm: string;
}

type allProps = IProps & RouteComponentProps<IProps>;

export class PatientTablePagination extends React.Component<allProps, IState> {
  onPaginate = (pageBack: boolean): void => {
    const { history, pageNumber, pageSize, totalCount, get } = this.props;
    let newPageNumber = pageBack ? pageNumber - 1 : pageNumber + 1;
    // extra security, though UI should not allow this
    if (newPageNumber < 0) newPageNumber = 0;
    if (newPageNumber > Math.ceil(totalCount / pageSize)) {
      newPageNumber = Math.ceil(totalCount / pageSize);
    }

    const newParams = get(newPageNumber, pageSize);
    history.push({ search: newParams });
  };

  render() {
    const { pageNumber, pageSize, pageInfo, totalCount } = this.props;

    if (!totalCount) {
      return null;
    }

    return (
      <Pagination
        pageInfo={pageInfo}
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPaginate={this.onPaginate}
      />
    );
  }
}

export default withRouter(PatientTablePagination);
