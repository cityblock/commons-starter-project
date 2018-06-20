import { ApolloError } from 'apollo-client';
import React from 'react';
import { FullPatientTableRow } from '../../graphql/types';
import Spinner from '../library/spinner/spinner';
import { PatientTableNoResults, PatientTablePlaceholder } from './helper-components';
import PatientTableHeader from './patient-table-header';
import PatientTableRow from './patient-table-row';
import { TableLoadingError } from './table-loading-error';

export interface IFormattedPatient extends FullPatientTableRow {
  isSelected?: boolean;
}

interface IProps {
  patients: IFormattedPatient[];
  isLoading: boolean;
  isQueried: boolean;
  messageIdPrefix: string;
  onRetryClick: () => any;
  onSelectToggle?: ((selectState: object) => any) | null;
  onSelectAll?: (isSelected: boolean) => any;
  isGloballySelected?: boolean;
  error: ApolloError | undefined | null;
  query?: string;
}

const PatientTable: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    query,
    isQueried,
    patients,
    isLoading,
    messageIdPrefix,
    error,
    onRetryClick,
    onSelectToggle,
    onSelectAll,
    isGloballySelected,
  } = props;
  const hasNoResults = isQueried && !patients.length;
  const hasPlaceholder = !isQueried && !patients.length;

  if (isLoading) return <Spinner />;
  if (error) return <TableLoadingError onRetryClick={onRetryClick} />;

  const resultsBody = hasPlaceholder ? (
    <PatientTablePlaceholder messageIdPrefix={messageIdPrefix} />
  ) : hasNoResults ? (
    <PatientTableNoResults messageIdPrefix={messageIdPrefix} />
  ) : (
    patients.map((result, i) => (
      <PatientTableRow key={i} patient={result} query={query} onSelectToggle={onSelectToggle} />
    ))
  );

  return (
    <div>
      {!onSelectToggle && <PatientTableHeader />}
      {!!onSelectToggle && (
        <PatientTableHeader onSelectToggle={onSelectAll} isSelected={isGloballySelected} />
      )}
      {resultsBody}
    </div>
  );
};

export default PatientTable;
