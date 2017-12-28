import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as concernsQuery from '../../graphql/queries/get-concerns.graphql';
import * as patientCarePlanQuery from '../../graphql/queries/get-patient-care-plan.graphql';
import { getConcernsQuery, getPatientCarePlanQuery } from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import Search, { SearchOptions } from '../../shared/library/search/search';
import Spinner from '../../shared/library/spinner/spinner';
import ConcernTypeSelect from './concern-type-select';
import * as styles from './css/concern-select.css';
import createConcernFuseOptions from './fuse-options';

export interface IProps {
  patientId: string;
  concernId: string | null;
  concernType: 'active' | 'inactive' | null;
  hideSearchResults: boolean;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchTermClick: (concernId: string) => void;
  searchTerm: string;
  showAllConcerns: boolean;
  toggleShowAllConcerns: () => void;
}

interface IGraphqlProps {
  loading: boolean;
  error?: string | null;
  concerns?: getConcernsQuery['concerns'];
  patientCarePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  patientCarePlanLoading: boolean;
  patientCarePlanError?: string | null;
}

type allProps = IProps & IGraphqlProps;

export const ConcernSearch: React.StatelessComponent<allProps> = (props: allProps) => {
  const {
    concernId,
    concernType,
    onSelectChange,
    concerns,
    hideSearchResults,
    loading,
    onSearchTermChange,
    onSearchTermClick,
    patientCarePlanLoading,
    patientCarePlan,
    searchTerm,
    showAllConcerns,
    toggleShowAllConcerns,
  } = props;

  if (loading || patientCarePlanLoading) return <Spinner />;

  const existingConcernIds = patientCarePlan
    ? patientCarePlan.concerns.map(concern => concern.concernId)
    : [];

  const concernOptions: SearchOptions = [];
  (concerns || []).forEach(concern => {
    if (!existingConcernIds.includes(concern!.id)) {
      concernOptions.push({ title: concern!.title, id: concern!.id });
    }
  });

  return (
    <div>
      <FormLabel messageId="concernCreate.selectLabel" topPadding={true} />
      <Search
        value={searchTerm}
        onChange={onSearchTermChange}
        searchOptions={concernOptions}
        onOptionClick={onSearchTermClick}
        hideResults={hideSearchResults}
        showAll={showAllConcerns}
        placeholderMessageId="concernCreate.placeholder"
        emptyPlaceholderMessageId="concernCreate.noResults"
        fuseOptions={createConcernFuseOptions}
      />
      <div onClick={toggleShowAllConcerns} className={styles.showAll}>
        <FormattedMessage id={showAllConcerns ? 'concernCreate.hideAll' : 'concernCreate.showAll'}>
          {(message: string) => <p>{message}</p>}
        </FormattedMessage>
      </div>
      {concernId && <ConcernTypeSelect value={concernType} onChange={onSelectChange} />}
    </div>
  );
};

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(concernsQuery as any, {
    options: () => ({ variables: { orderBy: 'titleAsc' } }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      concerns: data ? data.concerns : null,
    }),
  }),
  // For now this will be cached. Can reassess later to see if this is good enough.
  graphql<IGraphqlProps, IProps, allProps>(patientCarePlanQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      patientCarePlanLoading: data ? data.loading : false,
      patientCarePlanError: data ? data.error : null,
      patientCarePlan: data ? (data as any).carePlanForPatient : null,
    }),
  }),
)(ConcernSearch);
