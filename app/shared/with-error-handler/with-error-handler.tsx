import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';

export interface IInjectedErrorProps {
  openErrorPopup: (message: string) => void;
}

const withErrorHandler = () => <P extends {}>(
  Component:
    | React.ComponentClass<P & IInjectedErrorProps>
    | React.StatelessComponent<P & IInjectedErrorProps>,
) => {
  type resultProps = P & IInjectedErrorProps;

  const WithErrorHandler: React.StatelessComponent<resultProps> = (props: resultProps) => {
    return <Component {...props} />;
  };

  const mapDispatchToProps = (dispatch: Dispatch<any>): IInjectedErrorProps => {
    return {
      openErrorPopup: (message: string) =>
        dispatch(
          openPopup({
            name: 'GLOBAL_ERROR',
            options: { message },
          }),
        ),
    };
  };

  return connect(
    null,
    mapDispatchToProps as any,
  )(WithErrorHandler);
};

export default withErrorHandler;
