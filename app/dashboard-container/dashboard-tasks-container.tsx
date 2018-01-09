import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as patientsWithUrgentTasksQuery from '../graphql/queries/get-patients-with-urgent-tasks.graphql';
import { getPatientsWithUrgentTasksQuery, FullPatientForDashboardFragment } from '../graphql/types';
import Pagination from '../shared/library/pagination/pagination';
import Spinner from '../shared/library/spinner/spinner';
import { IState as IAppState } from '../store';
import * as styles from './css/list-container.css';
import PatientWithTasksList from './patient-list/patient-with-tasks-list';

const INITIAL_PAGE_NUMBER = 0;
const INITAL_PAGE_SIZE = 10;

interface IStateProps {
  pageNumber: number;
  pageSize: number;
}

interface IDispatchProps {
  updatePageParams: (pageParams: IStateProps) => void;
}

interface IGraphqlProps {
  loading: boolean;
  error?: string | null;
  patientResults: getPatientsWithUrgentTasksQuery['patientsWithUrgentTasks'];
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

export class DashboardTasksContainer extends React.Component<allProps> {
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
    const { loading, error, patientResults, pageNumber, pageSize } = this.props;
    if (loading || error) return <Spinner />;

    const patients =
      patientResults && patientResults.edges ? patientResults.edges.map(result => result.node) : [];

    return (
      <div className={styles.container}>
        <PatientWithTasksList patients={patients as FullPatientForDashboardFragment[]} />
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

const mapStateToProps = (state: IAppState): IStateProps => {
  const pageParams = querystring.parse(state.routing.location.search.substring(1));

  return {
    pageNumber: Number(pageParams.pageNumber || INITIAL_PAGE_NUMBER),
    pageSize: Number(pageParams.pageSize || INITAL_PAGE_SIZE),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => {
  const updatePageParams = (pageParams: IStateProps) => {
    dispatch(push({ search: querystring.stringify(pageParams) }));
  };

  return { updatePageParams };
};

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IStateProps & IDispatchProps, allProps>(
    patientsWithUrgentTasksQuery as any,
    {
      options: ({ pageNumber, pageSize }) => ({
        variables: { pageNumber, pageSize },
      }),
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        patientResults: data ? (data as any).patientsWithUrgentTasks : null,
      }),
    },
  ),
)(DashboardTasksContainer);
