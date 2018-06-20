import { ApolloError } from 'apollo-client';
import classNames from 'classnames';
import React from 'react';
import { graphql } from 'react-apollo';
import CBOsForCategory from '../../../graphql/queries/get-cbos-for-category.graphql';
import { FullCBO } from '../../../graphql/types';
import FormLabel from '../../library/form-label/form-label';
import Option from '../../library/option/option';
import Select from '../../library/select/select';
import CreateTaskCBODetail from './cbo-detail';
import { ChangeEvent, OTHER_CBO } from './create-task';
import styles from './css/shared.css';
import CreateTaskOtherCBO from './other-cbo';

interface IGraphqlProps {
  CBOs: FullCBO[];
  loading: boolean;
  error: ApolloError | null | undefined;
}

interface IProps {
  categoryId: string;
  CBOId: string;
  CBOName: string;
  CBOUrl: string;
  onChange: (field: string) => (e: ChangeEvent) => void;
}

type allProps = IGraphqlProps & IProps;

export const CreateTaskCBO: React.StatelessComponent<allProps> = (props: allProps) => {
  const { CBOs, loading, error, onChange, CBOName, CBOUrl, CBOId } = props;
  const isLoaded = !loading && !error;
  const messageId = isLoaded ? 'taskCreate.selectCBO' : 'select.loading';
  const isDefinedCBOSelected = !!CBOId && CBOId !== OTHER_CBO;
  const selectStyles = classNames({
    [styles.removeBottomRadius]: isDefinedCBOSelected,
  });

  const CBOOptions = (CBOs || []).map(CBOItem => (
    <Option key={CBOItem.id} value={CBOItem.id} label={CBOItem.name} />
  ));

  const CBODetail = isDefinedCBOSelected ? (
    <CreateTaskCBODetail CBO={CBOs.find(CBOItem => CBOItem.id === CBOId) || null} />
  ) : (
    <CreateTaskOtherCBO CBOName={CBOName} CBOUrl={CBOUrl} onChange={onChange} />
  );

  return (
    <div>
      <FormLabel messageId="taskCreate.CBO" gray={!!CBOId} topPadding={true} />
      <Select value={CBOId} onChange={onChange('CBOId')} large={true} className={selectStyles}>
        <Option value="" messageId={messageId} disabled={true} />
        {CBOOptions}
        {isLoaded && <Option value={OTHER_CBO} messageId="taskCreate.otherCBO" />}
      </Select>
      {isLoaded && !!CBOId && CBODetail}
    </div>
  );
};

export default graphql(CBOsForCategory, {
  skip: ({ categoryId }) => !categoryId,
  options: ({ categoryId }: IProps) => ({
    variables: { categoryId },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    CBOs: data ? (data as any).CBOsForCategory : null,
  }),
})(CreateTaskCBO);
