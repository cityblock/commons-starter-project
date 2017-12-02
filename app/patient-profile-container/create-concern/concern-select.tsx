import { sortBy } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as concernsQuery from '../../graphql/queries/get-concerns.graphql';
import * as patientCarePlanQuery from '../../graphql/queries/get-patient-care-plan.graphql';
/* tslint:enaable:max-line-length */
import { getConcernsQuery, getPatientCarePlanQuery } from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import ConcernTypeSelect from './concern-type-select';
import * as styles from './css/concern-select.css';

export interface IProps {
  patientId: string;
  concernId?: string;
  concernType?: 'active' | 'inactive';
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface IGraphqlProps {
  loading: boolean;
  error?: string;
  concerns?: getConcernsQuery['concerns'];
  patientCarePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  patientCarePlanLoading: boolean;
  patientCarePlanError?: string;
}

type allProps = IProps & IGraphqlProps;

export const ConcernSelect: React.StatelessComponent<allProps> = (props: allProps) => {
  const {
    concernId,
    concernType,
    onSelectChange,
    concerns,
    loading,
    patientCarePlanLoading,
    patientCarePlan,
  } = props;

  const existingConcernIds = patientCarePlan
    ? patientCarePlan.concerns.map(concern => concern.concernId)
    : [];
  const concernOptions = sortBy(concerns || [], 'title').filter(
    concern => !existingConcernIds.includes(concern!.id),
  );
  const concernOptionsList =
    loading || patientCarePlanLoading ? (
      <Option value="" messageId="concernCreate.loading" />
    ) : (
      concernOptions.map(concern => (
        <Option key={concern!.id} value={concern!.id} label={concern!.title} />
      ))
    );

  return (
    <div>
      <FormLabel messageId="concernCreate.selectLabel" />
      <Select
        name="concernId"
        value={concernId || ''}
        onChange={onSelectChange}
        className={styles.select}
      >
        <Option value="" messageId="concernCreate.selectConcern" disabled={true} />
        {concernOptionsList}
      </Select>
      {concernId && <ConcernTypeSelect value={concernType} onChange={onSelectChange} />}
    </div>
  );
};

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(concernsQuery as any, {
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
)(ConcernSelect);
