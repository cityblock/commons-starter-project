import * as React from 'react';
import { FullPatientTableRowFragment } from '../../graphql/types';
import Spinner from '../library/spinner/spinner';
import { PatientTableNoResults, PatientTablePlaceholder } from './helper-components';
import PatientTableHeader from './patient-table-header';
import PatientTableRow from './patient-table-row';
import { TableLoadingError } from './table-loading-error';

interface IProps {
  patients: FullPatientTableRowFragment[];
  isLoading: boolean;
  isQueried: boolean;
  messageIdPrefix: string;
  onRetryClick: () => any;
  error?: string;
  query?: string;
}

const PatientTable: React.StatelessComponent<IProps> = (props: IProps) => {
  const { query, isQueried, patients, isLoading, messageIdPrefix, error, onRetryClick } = props;
  const hasNoResults = isQueried && !patients.length;
  const hasPlaceholder = !isQueried && !patients.length;

  if (isLoading) return <Spinner />;
  if (error) return <TableLoadingError onRetryClick={onRetryClick} />;

  const resultsBody = hasPlaceholder ? (
    <PatientTablePlaceholder messageIdPrefix={messageIdPrefix} />
  ) : hasNoResults ? (
    <PatientTableNoResults messageIdPrefix={messageIdPrefix} />
  ) : (
    patients.map((result, i) => <PatientTableRow key={i} patient={result} query={query} />)
  );

  return (
    <div>
      <PatientTableHeader />
      {resultsBody}
    </div>
  );
};

export default PatientTable;
