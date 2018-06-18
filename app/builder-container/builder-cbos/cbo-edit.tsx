import React from 'react';
import { graphql } from 'react-apollo';
import CBOEditMutationGraphql from '../../graphql/queries/cbo-edit-mutation.graphql';
import { CBOEditMutation, CBOEditMutationVariables, FullCBOFragment } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import CBOCategorySelect from '../../shared/library/cbo-category-select/cbo-category-select';
import EditableMultilineText from '../../shared/library/editable-multiline-text/editable-multiline-text';
import StateSelect from '../../shared/library/state-select/state-select';
import styles from './css/cbo-shared.css';

interface IProps {
  CBO: FullCBOFragment;
  close: () => void;
  deleteCBO: () => void;
}

interface IGraphqlProps {
  editCBO: (options: { variables: CBOEditMutationVariables }) => { data: CBOEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class CBOEdit extends React.Component<allProps, {}> {
  onSubmit(field: string) {
    const { CBO, editCBO } = this.props;

    return async (newText: string) => {
      await editCBO({
        variables: {
          CBOId: CBO.id,
          [field]: newText || null,
        },
      });
    };
  }

  onSelectChange(field: string) {
    const { CBO, editCBO } = this.props;

    return async (e: React.ChangeEvent<HTMLSelectElement>) => {
      await editCBO({
        variables: {
          CBOId: CBO.id,
          [field]: e.currentTarget.value,
        },
      });
    };
  }

  render(): JSX.Element {
    const { CBO, close, deleteCBO } = this.props;

    return (
      <div>
        <div className={styles.buttons}>
          <Button
            messageId="CBOs.close"
            icon="close"
            color="white"
            className={styles.button}
            onClick={close}
          />
          <Button
            messageId="CBOs.delete"
            icon="delete"
            color="white"
            className={styles.button}
            onClick={deleteCBO}
          />
        </div>
        <div className={styles.fields}>
          <h4>Name:</h4>
          <EditableMultilineText text={CBO.name} onSubmit={this.onSubmit('name')} />
          <CBOCategorySelect
            categoryId={CBO.categoryId}
            onChange={this.onSelectChange('categoryId')}
          />
          <h4>Address:</h4>
          <EditableMultilineText text={CBO.address} onSubmit={this.onSubmit('address')} />
          <h4>City:</h4>
          <EditableMultilineText text={CBO.city} onSubmit={this.onSubmit('city')} />
          <StateSelect value={CBO.state} onChange={this.onSelectChange('state')} />
          <h4>Zip code:</h4>
          <EditableMultilineText text={CBO.zip} onSubmit={this.onSubmit('zip')} />
          <h4>Phone number:</h4>
          <EditableMultilineText text={CBO.phone} onSubmit={this.onSubmit('phone')} />
          <h4>Fax number:</h4>
          <EditableMultilineText text={CBO.fax || ''} onSubmit={this.onSubmit('fax')} />
          <h4>URL:</h4>
          <EditableMultilineText text={CBO.url || ''} onSubmit={this.onSubmit('url')} />
        </div>
      </div>
    );
  }
}

export default graphql<any>(CBOEditMutationGraphql, {
  name: 'editCBO',
})(CBOEdit) as React.ComponentClass<IProps>;
