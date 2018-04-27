import { shallow } from 'enzyme';
import * as React from 'react';
import { formatAddress } from '../../../shared/helpers/format-helpers';
import SelectDropdownOption from '../../../shared/library/select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../../../shared/library/select-dropdown/select-dropdown';
import TextInput from '../../../shared/library/text-input/text-input';
import { address1, address2, address3 } from '../../../shared/util/test-data';
import { PatientAddressSelect } from '../patient-address-select';

describe('Patient Address Select', () => {
  const placeholderFn = () => true as any;
  const patientId = 'testId';
  const placeholderMessageId = 'patientAppointmentModal.locationPlaceholder';

  const wrapper = shallow(
    <PatientAddressSelect
      patientId={patientId}
      onChange={placeholderFn}
      placeholderMessageId={placeholderMessageId}
      addresses={[address1, address2, address3]}
      isLoading={false}
      error={null}
    />,
  );

  it('renders select component', () => {
    expect(wrapper.find(SelectDropdown)).toHaveLength(1);

    const dropdownProps = wrapper.find(SelectDropdown).props();
    expect(dropdownProps.value).toBe('');
    expect(dropdownProps.loading).toBeFalsy();
    expect(dropdownProps.error).toBeFalsy();
    expect(dropdownProps.placeholderMessageId).toBe(placeholderMessageId);
  });

  it('renders select options', () => {
    expect(wrapper.find(SelectDropdownOption)).toHaveLength(4);

    const option1Props = wrapper
      .find(SelectDropdownOption)
      .at(0)
      .props();
    expect(option1Props.value).toBe('External location');
    expect(option1Props.detail).toBeFalsy();
    expect(option1Props.detailMessageId).toBeFalsy();

    const option2Props = wrapper
      .find(SelectDropdownOption)
      .at(1)
      .props();
    expect(option2Props.value).toBe(address1.description);
    expect(option2Props.detail).toBe(
      formatAddress(
        address1.street1,
        address1.city,
        address1.state,
        address1.zip,
        address1.street2,
      ),
    );
    expect(option2Props.detailMessageId).toBeFalsy();

    const option3Props = wrapper
      .find(SelectDropdownOption)
      .at(2)
      .props();
    expect(option3Props.value).toBe('Patient Address');
    expect(option3Props.detail).toBe(
      formatAddress(
        address2.street1,
        address2.city,
        address2.state,
        address2.zip,
        address2.street2,
      ),
    );
    expect(option3Props.detailMessageId).toBeFalsy();

    const option4Props = wrapper
      .find(SelectDropdownOption)
      .at(3)
      .props();
    expect(option4Props.value).toBe(address3.description);
    expect(option4Props.detail).toBe(
      formatAddress(
        address3.street1,
        address3.city,
        address3.state,
        address3.zip,
        address3.street2,
      ),
    );
    expect(option4Props.detailMessageId).toBeFalsy();
  });

  it("shouldn't show text input for location", () => {
    expect(wrapper.find(TextInput)).toHaveLength(0);
  });

  it('selects an option', () => {
    wrapper.setProps({
      selectedAddress: address1,
      location: formatAddress(
        address1.street1,
        address1.city,
        address1.state,
        address1.zip,
        address1.street2,
      ),
    });
    expect(wrapper.find(SelectDropdown).props().value).toBe(address1.description);
  });

  it('selects the external location option', () => {
    wrapper.setProps({
      selectedAddress: { description: 'External location' },
      location: 'Some place',
    });
    expect(wrapper.find(SelectDropdown).props().value).toBe('External location');

    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find(TextInput).props().value).toBe('Some place');
  });
});
