import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import DefaultText from '../../../shared/library/default-text/default-text';
import FormLabel from '../../../shared/library/form-label/form-label';
import RadioInput from '../../../shared/library/radio-input/radio-input';
import { advancedDirectives, healthcareProxy } from '../../../shared/util/test-data';
import { AdvancedDirectives } from '../advanced-directives';
import DisplayCard from '../display-card';
import CreatePatientProxyModal from '../patient-proxy/create-patient-proxy-modal';
import EditPatientProxyModal from '../patient-proxy/edit-patient-proxy-modal';

describe('Renders Advanced Directives Component', () => {
  const onChange = () => true;
  const wrapper = shallow(
    <AdvancedDirectives
      advancedDirectives={advancedDirectives}
      healthcareProxies={[]}
      onChange={onChange}
      routeBase={'/foo/bar'}
    />,
  );

  it('renders section without any healthcare proxies', () => {
    expect(wrapper.find(DisplayCard)).toHaveLength(0);
    expect(wrapper.find(Button)).toHaveLength(0);

    expect(wrapper.find(FormLabel)).toHaveLength(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('advancedDirectives.hasProxy');

    const radioInputs = wrapper.find(RadioInput);
    expect(radioInputs).toHaveLength(2);

    expect(radioInputs.at(0).props().name).toBe('hasProxiesChecked');
    expect(radioInputs.at(0).props().value).toBe('false');
    expect(radioInputs.at(0).props().checked).toBeTruthy();
    expect(radioInputs.at(0).props().label).toBe('No');

    expect(radioInputs.at(1).props().name).toBe('hasProxiesChecked');
    expect(radioInputs.at(1).props().value).toBe('true');
    expect(radioInputs.at(1).props().checked).toBeFalsy();
    expect(radioInputs.at(1).props().label).toBe('Yes');
  });

  it('renders section with one healthcare proxy', () => {
    wrapper.setProps({
      healthcareProxies: [healthcareProxy],
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

  it('creates the two modals', () => {
    expect(wrapper.find(CreatePatientProxyModal)).toHaveLength(1);
    expect(wrapper.find(EditPatientProxyModal)).toHaveLength(1);
  });
});
