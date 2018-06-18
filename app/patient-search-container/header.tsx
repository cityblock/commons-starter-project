import React from 'react';
import { PatientSearchDescription, PatientSearchTitle } from './helper-components';

interface IProps {
  query: string;
  totalResults: number | null;
}

const PatientSearchHeader: React.StatelessComponent<IProps> = (props: IProps) => {
  const { query, totalResults } = props;

  return (
    <div>
      <PatientSearchTitle query={query} />
      <PatientSearchDescription totalResults={totalResults} />
    </div>
  );
};

export default PatientSearchHeader;
