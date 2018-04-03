import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';

export interface IInjectedProps {
  openErrorPopup: (message: string) => void;
}

const withErrorHandler = () => <P extends {}>(
  Component:
    | React.ComponentClass<P & IInjectedProps>
    | React.StatelessComponent<P & IInjectedProps>,
) => {
  type resultProps = P & IInjectedProps;

  const WithErrorHandler: React.StatelessComponent<resultProps> = (props: resultProps) => {
    return <Component {...props} />;
  };

  const mapDispatchToProps = (dispatch: Dispatch<() => void>): IInjectedProps => {
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

  return connect(null, mapDispatchToProps)(WithErrorHandler);
};

export default withErrorHandler;
