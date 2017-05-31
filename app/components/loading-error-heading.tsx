import * as React from 'react';
import { ErrorMessage } from './error-message';
import { LoadingMessage } from './loading-message';

interface IProps {
  error?: string;
  isLoading: boolean;
}

export const LoadingErrorHeading: React.StatelessComponent<IProps> = props => {
  const { error, isLoading } = props;
  if (error) {
    return <ErrorMessage text={error} />;
  } else if (isLoading) {
    return <LoadingMessage />;
  }
  return <div />;
};
