import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as patientListsQuery from '../../graphql/queries/get-patient-lists.graphql';
import { FullPatientListFragment } from '../../graphql/types';
import * as styles from '../../shared/css/two-panel.css';
import Button from '../../shared/library/button/button';
import Spinner from '../../shared/library/spinner/spinner';
import { IState as IAppState } from '../../store';
import PatientListDetail from './patient-list-detail';
import PatientLists from './patient-lists';

export const ROUTE_BASE = '/builder/patient-lists';

interface IProps {
  match: {
    params: {
      patientListId?: string;
    };
  };
  history: History;
}

interface IStateProps {
  patientListId: string | null;
}

interface IGraphqlProps {
  patientLists: FullPatientListFragment[];
  loading: boolean;
  error: string | null;
}

type allProps = IStateProps & IGraphqlProps & IProps;

interface IState {
  createMode: boolean;
}

export class AdminPatientLists extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { createMode: false };
  }

  redirectToPatientLists = () => this.props.history.push(ROUTE_BASE);

  render(): JSX.Element {
    const { patientListId, patientLists, loading, error } = this.props;
    const { createMode } = this.state;

    if (loading || error) return <Spinner />;

    const containerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!patientListId || createMode,
    });
    const listStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!patientListId || createMode,
    });

    const selectedPatientList = patientListId
      ? patientLists.find(list => list.id === patientListId) || null
      : null;

    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <Button
            messageId="patientLists.create"
            onClick={() => this.setState({ createMode: true })}
          />
        </div>
        <div className={styles.bottomContainer}>
          <div className={listStyles}>
            <PatientLists patientListId={patientListId} patientLists={patientLists} />
          </div>
          <div className={containerStyles}>
            <PatientListDetail
              patientList={selectedPatientList}
              close={this.redirectToPatientLists}
              createMode={createMode}
              cancelCreatePatientList={() => this.setState({ createMode: false })}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  return {
    patientListId: ownProps.match.params.patientListId || null,
  };
};

export default compose(
  withRouter,
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IProps, allProps>(patientListsQuery as any, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientLists: data ? (data as any).patientLists : null,
    }),
  }),
)(AdminPatientLists);
