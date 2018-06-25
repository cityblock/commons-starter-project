import { shallow } from 'enzyme';
import React from 'react';
import { Gender } from '../../../graphql/types';
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
    expect(formLabels).toHaveLength(7);

    expect(formLabels.at(0).props().messageId).toBe('patientInfo.preferredName');
    expect(formLabels.at(1).props().messageId).toBe('patientInfo.maritalStatus');
    expect(formLabels.at(2).props().messageId).toBe('patientInfo.language');
    expect(formLabels.at(3).props().messageId).toBe('patientInfo.gender');
    expect(formLabels.at(4).props().messageId).toBe('patientInfo.transgender');
    expect(formLabels.at(5).props().messageId).toBe('patientInfo.race');
    expect(formLabels.at(6).props().messageId).toBe('patientInfo.isHispanic');
  });

  it('renders patient info text inputs', () => {
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find(TextInput).props().name).toBe('preferredName');
    expect(wrapper.find(TextInput).props().value).toBe(basicInfo.preferredName);
  });

  it('renders patient info selects', () => {
    expect(wrapper.find(Select)).toHaveLength(5);

    const select1Props = wrapper
      .find(Select)
      .at(0)
      .props();
    expect(select1Props.name).toBe('maritalStatus');
    expect(select1Props.large).toBeTruthy();
    expect(select1Props.value).toBe(basicInfo.maritalStatus);
    expect(select1Props.hasPlaceholder).toBeTruthy();

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
    expect(select4Props.name).toBe('transgender');
    expect(select4Props.large).toBeTruthy();
    expect(select4Props.value).toBe(basicInfo.transgender);
    expect(select4Props.hasPlaceholder).toBeTruthy();

    const select5Props = wrapper
      .find(Select)
      .at(4)
      .props();
    expect(select5Props.name).toBe('isHispanic');
    expect(select5Props.large).toBeTruthy();
    expect(select5Props.value).toBe(basicInfo.isHispanic.toString());
    expect(select5Props.hasPlaceholder).toBeTruthy();
  });

  it('renders patient info text inputs', () => {
    const wrapper2 = shallow(
      <BasicInfo
        patientInformation={{
          ...basicInfo,
          gender: Gender.selfDescribed,
          genderFreeText: 'other',
          isOtherRace: true,
          raceFreeText: 'other race',
        }}
        patientId={patient.id}
        patientInfoId={patient.patientInfo.id}
        onChange={onChange}
        className="infoStyles"
        loading={false}
        error={null}
      />,
    );
    expect(wrapper2.find(TextInput)).toHaveLength(3);
    expect(
      wrapper2
        .find(TextInput)
        .at(1)
        .props().name,
    ).toBe('genderFreeText');
    expect(
      wrapper2
        .find(TextInput)
        .at(1)
        .props().value,
    ).toBe('other');

    expect(
      wrapper2
        .find(TextInput)
        .at(2)
        .props().name,
    ).toBe('raceFreeText');
    expect(
      wrapper2
        .find(TextInput)
        .at(2)
        .props().value,
    ).toBe('other race');
  });
});
