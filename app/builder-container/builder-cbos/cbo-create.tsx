import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as createCBOMutationGraphql from '../../graphql/queries/cbo-create-mutation.graphql';
import { CBOCreateMutation, CBOCreateMutationVariables } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import CBOCategorySelect from '../../shared/library/cbo-category-select/cbo-category-select';
import StateSelect from '../../shared/library/state-select/state-select';
import TextInput from '../../shared/library/text-input/text-input';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../shared/with-error-handler/with-error-handler';
import * as styles from './css/cbo-shared.css';

interface IProps {
  cancelCreateCBO: () => void;
}

interface IGraphqlProps {
  createCBO: (options: { variables: CBOCreateMutationVariables }) => { data: CBOCreateMutation };
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

interface IState {
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string;
  phone: string;
  url: string;
  loading: boolean;
}

type Field = 'name' | 'categoryId' | 'address' | 'city' | 'state' | 'zip' | 'fax' | 'phone' | 'url';

export class CBOCreate extends React.Component<allProps, IState> {
  state = {
    name: '',
    categoryId: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    fax: '',
    phone: '',
    url: '',
    loading: false,
  };

  onChange = (
    field: Field,
  ): ((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      this.setState({ [field as any]: e.currentTarget.value } as any);
    };
  };

  onSubmit = async () => {
    const { createCBO, cancelCreateCBO, openErrorPopup } = this.props;
    const { name, categoryId, address, city, state, zip, fax, phone, url, loading } = this.state;

    if (!loading) {
      try {
        this.setState({ loading: true });
        const variables: CBOCreateMutationVariables = {
          name,
          categoryId,
          address,
          city,
          state,
          zip,
          phone,
          url,
        };
        if (fax) variables.fax = fax;

        await createCBO({ variables });
        cancelCreateCBO();
      } catch (err) {
        openErrorPopup(err.message);
      }
    }
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { cancelCreateCBO } = this.props;
    const { name, categoryId, address, city, state, zip, fax, phone, url } = this.state;

    return (
      <div>
        <div className={styles.buttons}>
          <Button
            messageId="CBOs.close"
            icon="close"
            color="white"
            className={styles.button}
            onClick={cancelCreateCBO}
          />
        </div>
        <div className={styles.fields}>
          <TextInput
            value={name}
            onChange={this.onChange('name')}
            placeholderMessageId="CBOs.name"
          />
          <CBOCategorySelect categoryId={categoryId} onChange={this.onChange('categoryId')} />
          <TextInput
            value={address}
            onChange={this.onChange('address')}
            placeholderMessageId="CBOs.address"
          />
          <TextInput
            value={city}
            onChange={this.onChange('city')}
            placeholderMessageId="CBOs.city"
          />
          <StateSelect value={state} onChange={this.onChange('state')} />
          <TextInput value={zip} onChange={this.onChange('zip')} placeholderMessageId="CBOs.zip" />
          <TextInput
            value={phone}
            onChange={this.onChange('phone')}
            placeholderMessageId="CBOs.phone"
          />
          <TextInput value={fax} onChange={this.onChange('fax')} placeholderMessageId="CBOs.fax" />
          <TextInput value={url} onChange={this.onChange('url')} placeholderMessageId="CBOs.url" />
        </div>
        <div className={styles.buttons}>
          <Button
            messageId="modalButtons.cancel"
            onClick={cancelCreateCBO}
            color="white"
            small={true}
          />
          <Button messageId="CBOs.create" onClick={this.onSubmit} small={true} />
        </div>
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql(createCBOMutationGraphql as any, {
    name: 'createCBO',
    options: {
      refetchQueries: ['getCBOs'],
    },
  }),
)(CBOCreate) as React.ComponentClass<IProps>;
