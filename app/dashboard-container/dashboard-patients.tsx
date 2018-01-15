import { History } from 'history';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router';
import { FullPatientForDashboardFragment } from '../graphql/types';
import EmptyPlaceholder from '../shared/library/empty-placeholder/empty-placeholder';
import Pagination from '../shared/library/pagination/pagination';
import Spinner from '../shared/library/spinner/spinner';
import * as styles from './css/dashboard-patients.css';
import { Selected } from './dashboard-container';
import fetchPatientList, { IInjectedProps, PatientResults } from './fetch-patient-list';
import PatientList from './patient-list/patient-list';
import PatientWithTasksList from './patient-list/patient-with-tasks-list';

interface IPageProps {
  pageSize: number;
  pageNumber: number;
}

export interface IProps extends IPageProps {
  patientResults: PatientResults;
  selected: Selected;
  history: History;
  location: History.LocationState;
  match: {
    path: string;
    url: string;
    isExact: boolean;
    params: null;
  };
}

type allProps = IProps & IInjectedProps;

export class DashboardPatients extends React.Component<allProps> {
  onPaginate = (pageBack: boolean): void => {
    const { pageNumber, pageSize, patientResults, history } = this.props;
    let newPageNumber = pageBack ? pageNumber - 1 : pageNumber + 1;

    if (newPageNumber < 0) newPageNumber = 0;
    if (patientResults && newPageNumber > Math.ceil(patientResults.totalCount / pageSize)) {
      newPageNumber = Math.ceil(patientResults.totalCount / pageSize);
    }

    const pageParams: IPageProps = {
      pageNumber: newPageNumber,
      pageSize,
    };

    history.push({ search: querystring.stringify(pageParams) });
  };

  render(): JSX.Element {
    const { patientResults, selected, pageNumber, pageSize, loading, error } = this.props;
    if (loading || error) return <Spinner />;

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

export default compose(fetchPatientList(), withRouter)(DashboardPatients);
