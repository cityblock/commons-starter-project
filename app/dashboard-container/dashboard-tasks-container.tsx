import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as patientsWithUrgentTasksQuery from '../graphql/queries/get-patients-with-urgent-tasks.graphql';
import { getPatientsWithUrgentTasksQuery } from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import { IState as IAppState } from '../store';
import * as styles from './css/dashboard-tasks-container.css';

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
  patientList: getPatientsWithUrgentTasksQuery['patientsWithUrgentTasks'];
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

export class DashboardTasksContainer extends React.Component<allProps> {
  render(): JSX.Element {
    const { loading, error } = this.props;
    if (loading || error) return <Spinner />;

    return (
      <div className={styles.container}>
        <h1>Patient List yo</h1>
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
        patientList: data ? (data as any).patientsWithUrgentTasks : null,
      }),
    },
  ),
)(DashboardTasksContainer);
