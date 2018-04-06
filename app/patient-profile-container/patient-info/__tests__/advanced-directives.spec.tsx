import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import DefaultText from '../../../shared/library/default-text/default-text';
import FormLabel from '../../../shared/library/form-label/form-label';
import RadioInput from '../../../shared/library/radio-input/radio-input';
import { advancedDirectives, healthcareProxy, patient } from '../../../shared/util/test-data';
import { AdvancedDirectives } from '../advanced-directives';
import DisplayCard from '../display-card';

describe('Renders Advanced Directives Component', () => {
  const onChange = () => true;
  const patientContactDelete = jest.fn();
  const errorFn = (message: string) => true as any;

  const wrapper = shallow(
    <AdvancedDirectives
      advancedDirectives={advancedDirectives}
      patientId={patient.id}
      patientInfoId={patient.patientInfo.id}
      healthcareProxies={[]}
      onChange={onChange}
      routeBase={'/foo/bar'}
      patientContactDelete={patientContactDelete}
      openErrorPopup={errorFn}
    />,
  );

  it('renders section without any healthcare proxies or molst', () => {
    expect(wrapper.find(DisplayCard)).toHaveLength(0);
    expect(wrapper.find(Button)).toHaveLength(0);

    expect(wrapper.find(FormLabel)).toHaveLength(2);
    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('advancedDirectives.hasProxy');
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('advancedDirectives.hasMolst');

    const radioInputs = wrapper.find(RadioInput);
    expect(radioInputs).toHaveLength(4);

    expect(radioInputs.at(0).props().name).toBe('hasHealthcareProxy');
    expect(radioInputs.at(0).props().value).toBe('false');
    expect(radioInputs.at(0).props().checked).toBeFalsy();
    expect(radioInputs.at(0).props().label).toBe('No');

    expect(radioInputs.at(1).props().name).toBe('hasHealthcareProxy');
    expect(radioInputs.at(1).props().value).toBe('true');
    expect(radioInputs.at(1).props().checked).toBeFalsy();
    expect(radioInputs.at(1).props().label).toBe('Yes');

    expect(radioInputs.at(2).props().name).toBe('hasMolst');
    expect(radioInputs.at(2).props().value).toBe('false');
    expect(radioInputs.at(2).props().checked).toBeFalsy();
    expect(radioInputs.at(2).props().label).toBe('No');

    expect(radioInputs.at(3).props().name).toBe('hasMolst');
    expect(radioInputs.at(3).props().value).toBe('true');
    expect(radioInputs.at(3).props().checked).toBeFalsy();
    expect(radioInputs.at(3).props().label).toBe('Yes');
  });

  it('renders section with one healthcare proxy', () => {
    wrapper.setProps({
      healthcareProxies: [healthcareProxy],
      advancedDirectives: {
        ...advancedDirectives,
        hasHealthcareProxy: true,
      },
    });

    expect(wrapper.find(DisplayCard)).toHaveLength(1);

    expect(wrapper.find(Button)).toHaveLength(1);
    expect(wrapper.find(Button).props().messageId).toBe('advancedDirectives.addProxy');

    expect(wrapper.find(DefaultText)).toHaveLength(2);
    expect(
      wrapper
        .find(DefaultText)
        .at(0)
        .props().messageId,
    ).toBe('advancedDirectives.proxyForms');
    expect(
      wrapper
        .find(DefaultText)
        .at(1)
        .props().messageId,
    ).toBe('advancedDirectives.documents');
  });
});
