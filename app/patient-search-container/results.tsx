import * as React from 'react';
import { FullPatientSearchResultFragment } from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import { PatientSearchNoResults, PatientSearchResultsPlaceholder } from './helpers';
import PatientSearchResult from './result';
import PatientSearchResultsHeader from './results-header';

interface IProps {
  query: string;
  searchResults: FullPatientSearchResultFragment[];
  loading: boolean;
}

const PatientSearchResults: React.StatelessComponent<IProps> = (props: IProps) => {
  const { query, searchResults, loading } = props;
  if (loading) return <Spinner />;

  const resultsBody = !!query ? (
    searchResults.length ? (
      searchResults.map((result, i) => (
        <PatientSearchResult key={i} searchResult={result} query={query} />
      ))
    ) : (
      <PatientSearchNoResults />
    )
  ) : (
    <PatientSearchResultsPlaceholder />
  );

  return (
    <div>
      <PatientSearchResultsHeader />
      {resultsBody}
    </div>
  );
};

export default PatientSearchResults;
