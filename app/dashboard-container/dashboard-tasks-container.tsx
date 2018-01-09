import * as querystring from 'querystring';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { IState as IAppState } from '../store';

const INITIAL_PAGE_NUMBER = 0;
const INITAL_PAGE_SIZE = 10;

interface IStateProps {
  pageNumber: number;
  pageSize: number;
}

interface IDispatchProps {
  updatePageParams: (pageParams: IStateProps) => void;
}

type allProps = IStateProps & IDispatchProps;

export const DashboardTasksContainer: React.StatelessComponent<allProps> = (props: allProps) => {
  return (
    <div>
      <h1>Patient List yo</h1>
    </div>
  );
};

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

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps,
)(DashboardTasksContainer);
