import * as React from 'react';
import { Link } from 'react-router-dom';
import { ShortPatientScreeningToolSubmission360Fragment } from '../../graphql/types';

interface IProps {
  submission: ShortPatientScreeningToolSubmission360Fragment;
  routeBase: string;
}

const ScreeningToolHistory: React.StatelessComponent<IProps> = (props: IProps) => {
  const { submission, routeBase } = props;

  return (
    <Link to={`${routeBase}/tools/${submission.screeningTool.id}`}>
      <h1>{submission.screeningTool.title}</h1>
    </Link>
  );
};

export default ScreeningToolHistory;
