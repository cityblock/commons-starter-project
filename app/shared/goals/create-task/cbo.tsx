import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as CBOsForCategoryQuery from '../../../graphql/queries/get-cbos-for-category.graphql';
import { FullCBOFragment } from '../../../graphql/types';
import FormLabel from '../../library/form-label/form-label';
import Option from '../../library/option/option';
import Select from '../../library/select/select';
import CreateTaskCBODetail from './cbo-detail';
import { ChangeEvent, OTHER_CBO } from './create-task';
import * as styles from './css/shared.css';
import CreateTaskOtherCBO from './other-cbo';

interface IGraphqlProps {
  CBOs: FullCBOFragment[];
  loading?: boolean;
  error?: string | null;
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

export default graphql<IGraphqlProps, IProps, allProps>(CBOsForCategoryQuery as any, {
  skip: ({ categoryId }) => !categoryId,
  options: ({ categoryId }) => ({
    variables: { categoryId },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    CBOs: data ? (data as any).CBOsForCategory : null,
  }),
})(CreateTaskCBO);
