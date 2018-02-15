import * as React from 'react';
import { connect } from 'react-redux';
import { PermissionsMapping } from '../../../shared/permissions/permissions-mapping';
import { FullUserFragment } from '../../graphql/types';
import { IState as IAppState } from '../../store';

export interface IInjectedProps {
  currentUser: FullUserFragment;
  featureFlags: PermissionsMapping;
}

const withCurrentUser = () => <P extends {}>(
  Component:
    | React.ComponentClass<P & IInjectedProps>
    | React.StatelessComponent<P & IInjectedProps>,
) => {
  type resultProps = P & IInjectedProps;

  const WithCurrentUser: React.StatelessComponent<resultProps> = (props: resultProps) => {
    return <Component {...props} />;
  };

  const mapStateToProps = (state: IAppState): IInjectedProps => {
    return {
      currentUser: state.currentUser.currentUser!,
      featureFlags: state.currentUser.featureFlags!,
    };
  };

  return connect(mapStateToProps)(WithCurrentUser);
};

export default withCurrentUser;
