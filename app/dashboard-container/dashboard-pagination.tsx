import * as querystring from 'querystring';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { FullPatientForDashboardFragment } from '../graphql/types';
import EmptyPlaceholder from '../shared/library/empty-placeholder/empty-placeholder';
import Pagination from '../shared/library/pagination/pagination';
import * as styles from './css/dashboard-pagination.css';
import { Selected } from './dashboard-container';
import { PatientResults } from './dashboard-patients-container';
import PatientList from './patient-list/patient-list';
import PatientWithTasksList from './patient-list/patient-with-tasks-list';

interface IDispatchProps {
  updatePageParams: (pageParams: IPageProps) => void;
}

interface IPageProps {
  pageSize: number;
  pageNumber: number;
}

interface IProps extends IPageProps {
  patientResults: PatientResults;
  selected: Selected;
}

type allProps = IDispatchProps & IProps;

export class DashboardPagination extends React.Component<allProps> {
  onPaginate = (pageBack: boolean): void => {
    const { pageNumber, pageSize, patientResults, updatePageParams } = this.props;
    let newPageNumber = pageBack ? pageNumber - 1 : pageNumber + 1;

    if (newPageNumber < 0) newPageNumber = 0;
    if (patientResults && newPageNumber > Math.ceil(patientResults.totalCount / pageSize)) {
      newPageNumber = Math.ceil(patientResults.totalCount / pageSize);
    }

    updatePageParams({
      pageNumber: newPageNumber,
      pageSize,
    });
  };

  render(): JSX.Element {
    const { patientResults, selected, pageNumber, pageSize } = this.props;

    if (!patientResults.totalCount) {
      return (
        <div className={styles.empty}>
          <EmptyPlaceholder headerMessageId={`dashboard.empty${selected}`} />
        </div>
      );
    }

    const patients =
      patientResults && patientResults.edges ? patientResults.edges.map(result => result.node) : [];

    const patientList =
      selected === 'tasks' ? (
        <PatientWithTasksList
          patients={patients as FullPatientForDashboardFragment[]}
          pageNumber={pageNumber}
          pageSize={pageSize}
        />
      ) : (
        <PatientList patients={patients as FullPatientForDashboardFragment[]} />
      );

    return (
      <div>
        {patientList}
        {!!patientResults &&
          patientResults.totalCount && (
            <Pagination
              pageInfo={patientResults.pageInfo}
              totalCount={patientResults.totalCount}
              pageNumber={pageNumber}
              pageSize={pageSize}
              onPaginate={this.onPaginate}
              className={styles.pages}
            />
          )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => {
  const updatePageParams = (pageParams: IPageProps) => {
    dispatch(push({ search: querystring.stringify(pageParams) }));
  };

  return { updatePageParams };
};

export default connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps)(DashboardPagination);
