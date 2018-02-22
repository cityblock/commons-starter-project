import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../shared/library/form-label/form-label';
import Select from '../../../shared/library/select/select';
import TextInput from '../../../shared/library/text-input/text-input';
import { basicInfo } from '../../../shared/util/test-data';
import AddressInfo from '../address-info/address-info';
import BasicInformation from '../basic-information';

describe('Render Basic Information Component', () => {
  const onChange = () => true;
  const wrapper = shallow(
    <BasicInformation patientInformation={basicInfo} onChange={onChange} className="infoStyles" />,
  );

  it('renders address info', () => {
    expect(wrapper.find(AddressInfo).length).toBe(1);
    expect(wrapper.find(AddressInfo).props().patientId).toBe(basicInfo.patientId);
    expect(wrapper.find(AddressInfo).props().primaryAddress).toBe(basicInfo.primaryAddress);
    expect(wrapper.find(AddressInfo).props().addresses).toBe(basicInfo.addresses);
    expect(wrapper.find(AddressInfo).props().onChange).toBe(onChange);
  });

  it('renders patient info labels', () => {
    expect(wrapper.find(FormLabel).length).toBe(4);
    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('patientInfo.preferredName');
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('patientInfo.gender');
    expect(
      wrapper
        .find(FormLabel)
        .at(2)
        .props().messageId,
    ).toBe('patientInfo.maritalStatus');
    expect(
      wrapper
        .find(FormLabel)
        .at(3)
        .props().messageId,
    ).toBe('patientInfo.language');
  });

  it('renders patient info text inputs', () => {
    expect(wrapper.find(TextInput).length).toBe(1);
    expect(wrapper.find(TextInput).props().name).toBe('preferredName');
  });

  it('renders patient info selects', () => {
    expect(wrapper.find(Select).length).toBe(3);

    const select1Props = wrapper
      .find(Select)
      .at(0)
      .props();
    expect(select1Props.name).toBe('gender');
    expect(select1Props.large).toBeTruthy();
    expect(select1Props.value).toBe(basicInfo.gender);
    expect(select1Props.hasPlaceholder).toBeTruthy();

    const select2Props = wrapper
      .find(Select)
      .at(1)
      .props();
    expect(select2Props.name).toBe('maritalStatus');
    expect(select2Props.large).toBeTruthy();

    const select3Props = wrapper
      .find(Select)
      .at(2)
      .props();
    expect(select3Props.name).toBe('language');
    expect(select3Props.large).toBeTruthy();
    expect(select3Props.value).toBe(basicInfo.language);
    expect(select3Props.hasPlaceholder).toBeTruthy();
  });
});
