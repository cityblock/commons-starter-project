import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import patientAddressesQuery from '../../graphql/queries/get-patient-addresses.graphql';
import { getPatientAddressesQuery, FullAddressFragment } from '../../graphql/types';
import { formatAddress } from '../../shared/helpers/format-helpers';
import FormLabel from '../../shared/library/form-label/form-label';
import styles from '../../shared/library/form/css/form.css';
import SelectDropdownOption from '../../shared/library/select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../../shared/library/select-dropdown/select-dropdown';
import TextInput from '../../shared/library/text-input/text-input';

export interface IProps {
  patientId?: string;
  onChange: (values: { [key: string]: any }) => void;
  selectedAddress?: FullAddressFragment | { description: string } | null;
  location?: string | null;
  placeholderMessageId: string;
}

interface IGraphqlProps {
  isLoading: boolean;
  error: ApolloError | null | undefined;
  patientAddresses: getPatientAddressesQuery['patientAddresses'];
}

export type allProps = IProps & IGraphqlProps;

export class AddressSelect extends React.Component<allProps> {
  state = {};

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { onChange } = this.props;
    const { name, value } = event.target;
    onChange({ [name as any]: value });
  };

  handleClick = (address?: FullAddressFragment, external?: { description: string }) => {
    const { onChange } = this.props;
    if (address) {
      const { city, state, street1, street2, zip } = address;
      const formattedAddress = formatAddress(street1, city, state, zip, street2);
      onChange({ location: formattedAddress, selectedAddress: address });
    }
    if (external) {
      onChange({ location: '', selectedAddress: external });
    }
  };

  renderAddressOptions(): JSX.Element[] {
    const { patientAddresses } = this.props;
    return (patientAddresses || []).map(address => {
      const { id, city, state, street1, street2, zip, description } = address;
      const formattedAddress = formatAddress(street1, city, state, zip, street2);

      return (
        <SelectDropdownOption
          key={id}
          onClick={() => this.handleClick(address)}
          value={description || 'Patient Address'}
          detail={formattedAddress}
        />
      );
    });
  }

  render(): JSX.Element {
    const { isLoading, placeholderMessageId, error, selectedAddress, location } = this.props;
    const addressName = selectedAddress ? selectedAddress.description || 'Patient Address' : '';
    const externalLocation = { description: 'External location' };
    const isExternalSelected = addressName === externalLocation.description;

    const externalLocationField = isExternalSelected ? (
      <div className={styles.field}>
        <FormLabel messageId="appointmentModal.externalLocation" />
        <TextInput
          name="location"
          value={location || ''}
          onChange={this.handleInputChange}
          placeholderMessageId="appointmentModal.externalLocationPlaceholder"
        />
      </div>
    ) : null;

    return (
      <React.Fragment>
        <SelectDropdown
          value={addressName}
          loading={isLoading}
          error={error ? error.message : undefined}
          placeholderMessageId={placeholderMessageId}
          largeFont={true}
          className={styles.field}
        >
          <SelectDropdownOption
            onClick={() => this.handleClick(undefined, externalLocation)}
            value={externalLocation.description}
          />
          {this.renderAddressOptions()}
        </SelectDropdown>
        {externalLocationField}
      </React.Fragment>
    );
  }
}

export default graphql(patientAddressesQuery, {
  skip: (props: IProps) => !props.patientId,
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    patientAddresses: data ? (data as any).patientAddresses : null,
  }),
})(AddressSelect);
