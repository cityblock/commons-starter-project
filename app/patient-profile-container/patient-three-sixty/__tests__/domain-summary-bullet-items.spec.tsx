import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  DomainSummaryBulletItems,
  DomainSummaryScreeningToolResultSummary,
} from '../domain-summary-bullet-items';

describe('Domain Summary Bullet Item Components', () => {
  const automated1 = 'lady';
  const automated2 = 'nymeria';
  const automatedSummaryText = [automated1, automated2];
  const title = 'NIGHT-KING-11';
  const score = 11;
  const description = 'Wall came down';

  const screeningTool = {
    title,
    score,
    description,
  };

  describe('Domain Summary Bullet Items', () => {
    const wrapper = shallow(<DomainSummaryBulletItems items={automatedSummaryText} />);

    it('renders an unordered list', () => {
      expect(wrapper.find('ul').length).toBe(1);
    });

    it('renders list items for each item', () => {
      expect(wrapper.find('li').length).toBe(2);
      expect(wrapper.find('span').length).toBe(2);
      expect(
        wrapper
          .find('span')
          .at(0)
          .text(),
      ).toBe(automated1);
      expect(
        wrapper
          .find('span')
          .at(1)
          .text(),
      ).toBe(automated2);
    });

    it('adds screening tool results if available', () => {
      wrapper.setProps({ screeningToolResultSummaries: [screeningTool] });

      expect(wrapper.find(DomainSummaryScreeningToolResultSummary).props().screeningToolResultSummary).toEqual(
        screeningTool,
      );
      expect(wrapper.find('li').length).toBe(2);
      expect(wrapper.find('span').length).toBe(2);
    });
  });

  describe('Domain Summary Screening Tool Result', () => {
    const wrapper = shallow(<DomainSummaryScreeningToolResultSummary screeningToolResultSummary={screeningTool} />);

    it('renders formatted message with title and result', () => {
      expect(wrapper.find(FormattedMessage).props().id).toBe('screeningTool.results');
    });

    it('renders description and score', () => {
      expect(wrapper.find('span').text()).toMatch(`${description} - ${score}`);
    });
  });
});
