import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../library/button/button';
import Icon from '../../library/icon/icon';
import GlassBreak from '../glass-break';

describe('Glass Break Component', () => {
  const resource = 'patient';
  const patientName = 'Arya Stark';

  const wrapper = shallow(
    <GlassBreak
      resource={resource}
      patientName={patientName}
      createGlassBreak={() => true as any}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders lock icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('lockOutline');
    expect(wrapper.find(Icon).props().color).toBe('red');
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders private profile message', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(2);
    expect(
      wrapper
        .find(FormattedMessage)
        .at(0)
        .props().id,
    ).toBe('glassBreak.patientprivate');
  });

  it('renders patient name', () => {
    expect(wrapper.find('h1').text()).toBe(patientName);
  });

  it('renders note about breaking glass', () => {
    expect(
      wrapper
        .find(FormattedMessage)
        .at(1)
        .props().id,
    ).toBe('glassBreak.patientnote');
  });

  it('renders button to break the glass', () => {
    expect(wrapper.find(Button).props().messageId).toBe('glassBreak.breakGlass');
    expect(wrapper.find(Button).props().color).toBe('red');
    expect(wrapper.find(Button).props().className).toBe('button');
  });
});
