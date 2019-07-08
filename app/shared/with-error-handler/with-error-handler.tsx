import React from 'react';

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

  return WithErrorHandler;
};

export default withErrorHandler;
