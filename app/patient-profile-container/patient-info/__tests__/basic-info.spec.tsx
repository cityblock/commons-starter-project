import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../shared/library/form-label/form-label';
import Select from '../../../shared/library/select/select';
import TextInput from '../../../shared/library/text-input/text-input';
import { basicInfo, patient } from '../../../shared/util/test-data';
import AddressInfo from '../address-info/address-info';
import { BasicInfo } from '../basic-info';

describe('Render Basic Information Component', () => {
  const onChange = () => true;
  const wrapper = shallow(
    <BasicInfo
      patientInformation={basicInfo}
      patientId={patient.id}
      patientInfoId={patient.patientInfo.id}
      onChange={onChange}
      className="infoStyles"
      loading={false}
      error={null}
    />,
  );

  it('renders address info', () => {
    const addressInfo = wrapper.find(AddressInfo);
    expect(addressInfo).toHaveLength(1);
  });

  it('renders patient info labels', () => {
    const formLabels = wrapper.find(FormLabel);
    expect(formLabels).toHaveLength(5);

    expect(formLabels.at(0).props().messageId).toBe('patientInfo.preferredName');
    expect(formLabels.at(1).props().messageId).toBe('patientInfo.maritalStatus');
    expect(formLabels.at(2).props().messageId).toBe('patientInfo.language');
    expect(formLabels.at(3).props().messageId).toBe('patientInfo.gender');
    expect(formLabels.at(4).props().messageId).toBe('patientInfo.sexAtBirth');
  });

  it('renders patient info text inputs', () => {
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find(TextInput).props().name).toBe('preferredName');
    expect(wrapper.find(TextInput).props().value).toBe(basicInfo.preferredName);
  });

  it('renders patient info selects', () => {
    expect(wrapper.find(Select)).toHaveLength(4);

    const select1Props = wrapper
      .find(Select)
      .at(0)
      .props();
    expect(select1Props.name).toBe('maritalStatus');
    expect(select1Props.large).toBeTruthy();

    const select2Props = wrapper
      .find(Select)
      .at(1)
      .props();
    expect(select2Props.name).toBe('language');
    expect(select2Props.large).toBeTruthy();
    expect(select2Props.value).toBe(basicInfo.language);
    expect(select2Props.hasPlaceholder).toBeTruthy();

    const select3Props = wrapper
      .find(Select)
      .at(2)
      .props();
    expect(select3Props.name).toBe('gender');
    expect(select3Props.large).toBeTruthy();
    expect(select3Props.value).toBe(basicInfo.gender);
    expect(select3Props.hasPlaceholder).toBeTruthy();

    const select4Props = wrapper
      .find(Select)
      .at(3)
      .props();
    expect(select4Props.name).toBe('sexAtBirth');
    expect(select4Props.large).toBeTruthy();
    expect(select4Props.value).toBe(basicInfo.sexAtBirth);
    expect(select4Props.hasPlaceholder).toBeTruthy();
  });
});
