import * as React from 'react';
import { graphql } from 'react-apollo';
import * as CBOCategoriesQuery from '../../../graphql/queries/get-cbo-categories.graphql';
import { FullCBOCategoryFragment } from '../../../graphql/types';
import Option from '../option/option';
import Select from '../select/select';

interface IProps {
  categoryId: string;
  onChange: (e?: any) => void;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  CBOCategories: FullCBOCategoryFragment[];
}

type allProps = IProps & IGraphqlProps;

export const CBOCategorySelect: React.StatelessComponent<allProps> = (props: allProps) => {
  const { categoryId, onChange, CBOCategories, loading, error } = props;
  const messageId = loading || error ? 'select.loading' : 'CBOs.category';

  const CBOCategoryOptions = (CBOCategories || []).map(category => (
    <Option key={category.id} value={category.id} label={category.title} />
  ));

  return (
    <Select value={categoryId} onChange={onChange} large={true}>
      <Option value="" messageId={messageId} disabled={true} />
      {CBOCategoryOptions}
    </Select>
  );
};

export default graphql<IGraphqlProps, IProps, allProps>(CBOCategoriesQuery as any, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    CBOCategories: data ? (data as any).CBOCategories : null,
  }),
})(CBOCategorySelect);
