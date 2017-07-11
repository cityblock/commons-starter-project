import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import Tasks from '../components/tasks';
import * as patientTasksQuery from '../graphql/queries/get-patient-tasks.graphql';
import { ShortTaskFragment } from '../graphql/types';

export interface IProps {
  patientId: string;
  tasksLoading: boolean;
  tasksError?: string;
  tasks: ShortTaskFragment[];
  refetchTasks: () => any;
  updatePageParams: (pageNumber: number) => any;
}

class PatientTasks extends React.Component<IProps, {}> {

  render() {
    const { refetchTasks, updatePageParams, tasksLoading, tasksError, tasks } = this.props;
    return (
      <Tasks
        refetchTasks={refetchTasks}
        loading={tasksLoading}
        error={tasksError}
        updatePageParams={updatePageParams}
        tasks={tasks} />
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    updatePageParams: (pageNumber: number) => {
      const pageParams = getPageParams(ownProps);
      pageParams.variables.pageNumber = pageNumber;
      dispatch(push({ search: querystring.stringify(pageParams) }));
    },
  };
}

const getPageParams = (props: IProps) => {
  const pageParams = querystring.parse(window.location.search.substring(1));
  return {
    variables: {
      pageNumber: pageParams.pageNumber || 0,
      pageSize: pageParams.pageSize || 10,
      patientId: props.patientId,
    },
  };
};

export default compose(
  injectIntl,
  connect(undefined, mapDispatchToProps),
  graphql(patientTasksQuery as any, {
    options: getPageParams,
    props: ({ data }) => ({
      refetchTasks: (data ? data.refetch : null),
      tasksLoading: (data ? data.loading : false),
      tasksError: (data ? data.error : null),
      tasks: (data ? (data as any).tasksForPatient : null),
    }),
  }),
)(PatientTasks);
