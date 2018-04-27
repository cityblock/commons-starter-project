import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as addressesQuery from '../../graphql/queries/get-patient-addresses.graphql';
import { getPatientAddressesQuery, FullAddressFragment } from '../../graphql/types';
import { formatAddress } from '../../shared/helpers/format-helpers';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from '../../shared/library/form/css/form.css';
import SelectDropdownOption from '../../shared/library/select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../../shared/library/select-dropdown/select-dropdown';
import TextInput from '../../shared/library/text-input/text-input';

export interface IProps {
  patientId: string;
  onChange: (values: { [key: string]: any }) => void;
  selectedAddress?: FullAddressFragment | { description: string } | null;
  location?: string | null;
  placeholderMessageId: string;
}

interface IGraphqlProps {
  isLoading: boolean;
  error: ApolloError | null | undefined;
  addresses: getPatientAddressesQuery['patientAddresses'];
}

export type allProps = IProps & IGraphqlProps;

export class PatientAddressSelect extends React.Component<allProps> {
  constructor(props: allProps) {
    super(props);
    this.state = {};
  }

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
    const { addresses } = this.props;
    return (addresses || []).map(address => {
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
        <FormLabel messageId="patientAppointmentModal.externalLocation" />
        <TextInput
          name="location"
          value={location || ''}
          onChange={this.handleInputChange}
          placeholderMessageId="patientAppointmentModal.externalLocationPlaceholder"
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

export default graphql(addressesQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    addresses: data ? (data as any).patientAddresses : null,
  }),
})(PatientAddressSelect);
