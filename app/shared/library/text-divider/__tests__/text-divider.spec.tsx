import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TextDivider from '../text-divider';

describe('Text Divider Component', () => {
  describe('Message id for translate given', () => {
    const messageId = 'sansaStark';
    const wrapper = shallow(<TextDivider messageId={messageId} />);

    it('renders formatted message with correct id', () => {
      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);

      expect(wrapper.find('p').length).toBe(0);
    });

    it('renders divider', () => {
      expect(wrapper.find('div').length).toBe(2);
    });
  });

  describe('No message id for translate given', () => {
    const label = 'sansaStark';
    const wrapper = shallow(<TextDivider label={label} />);

    it('renders label', () => {
      expect(wrapper.find('p').length).toBe(1);
      expect(wrapper.find('p').text()).toBe(label);

      expect(wrapper.find(FormattedMessage).length).toBe(0);
    });

    it('renders divider', () => {
      expect(wrapper.find('div').length).toBe(2);
    });
  });
});
