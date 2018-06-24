import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import concernsGraphql from '../../graphql/queries/get-concerns.graphql';
import patientCarePlanGraphql from '../../graphql/queries/get-patient-care-plan.graphql';
import { getConcerns, getPatientCarePlan } from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import Search, { SearchOptions } from '../../shared/library/search/search';
import Spinner from '../../shared/library/spinner/spinner';
import ConcernTypeSelect from './concern-type-select';
import styles from './css/concern-select.css';
import createConcernFuseOptions from './fuse-options';

export interface IProps {
  patientId: string;
  concernId: string | null;
  concernType: 'active' | 'inactive' | null;
  hideSearchResults: boolean;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchTermClick: (concernId: string, concernTitle: string) => void;
  searchTerm: string;
  showAllConcerns: boolean;
  toggleShowAllConcerns: () => void;
}

interface IGraphqlProps {
  loading: boolean;
  error?: string | null;
  concerns?: getConcerns['concerns'];
  patientCarePlan?: getPatientCarePlan['carePlanForPatient'];
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
      <div className={styles.header}>
        <FormLabel messageId="concernCreate.selectLabel" />
        <div onClick={toggleShowAllConcerns} className={styles.showAll}>
          <FormattedMessage
            id={showAllConcerns ? 'concernCreate.hideAll' : 'concernCreate.showAll'}
          >
            {(message: string) => <p>{message}</p>}
          </FormattedMessage>
        </div>
      </div>
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
      {concernId ? (
        <ConcernTypeSelect value={concernType} onChange={onSelectChange} />
      ) : (
        <div className={styles.spacer} />
      )}
    </div>
  );
};

export default compose(
  graphql(concernsGraphql, {
    options: () => ({ variables: { orderBy: 'titleAsc' }, fetchPolicy: 'network-only' }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql(patientCarePlanGraphql, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      patientCarePlanLoading: data ? data.loading : false,
      patientCarePlanError: data ? data.error : null,
      patientCarePlan: data ? (data as any).carePlanForPatient : null,
    }),
  }),
)(ConcernSearch) as React.ComponentClass<IProps>;
