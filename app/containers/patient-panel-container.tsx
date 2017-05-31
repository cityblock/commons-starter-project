import * as React from 'react';
import { graphql } from 'react-apollo';
import { LoadingErrorHeading } from '../components/loading-error-heading';
import { getQuery } from '../graphql/helpers';
import { ShortPatientFragment } from '../graphql/types';

export interface IProps {
  loading: boolean;
  error?: string;
  patientPanel?: ShortPatientFragment[];
}

export interface IState {
  pageSize?: number;
  pageNumber?: number;
}

class PatientPanelContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { error, loading } = this.props;
    return (
      <div>
        <LoadingErrorHeading
          error={error}
          isLoading={loading}
        />
      </div>
    );
  }
}

const patientPanelQuery = getQuery('app/graphql/queries/get-patient-panel.graphql');

export default graphql(patientPanelQuery, {
  options: (props: IProps, state: IState) => ({
    variables: {
      // pageNumber: state.pageNumber || 0,
      // pageSize: state.pageSize || 10,
      pageNumber: 0,
      pageSize: 10,
    },
  }),
  props: ({ data: { loading, error, userPatientPanel } }) => ({
    loading, error, patientPanel: userPatientPanel,
  }),
})(PatientPanelContainer);
