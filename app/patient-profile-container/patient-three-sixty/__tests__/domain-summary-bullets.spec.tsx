import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import DomainSummaryBullets, { DomainSummaryBulletItems } from '../domain-summary-bullets';

describe('Domain Summary Bullet Components', () => {
  const automated1 = 'lady';
  const automated2 = 'nymeria';
  const manual1 = 'greyWind';
  const manual2 = 'shaggyDog';
  const manual3 = 'summer';
  const manual4 = 'ghost';
  const automatedSummaryText = [automated1, automated2];
  const manualSummaryText = [manual1, manual2, manual3, manual4];

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
  });

  describe('Domain Summary Bullets', () => {
    const wrapper = shallow(
      <DomainSummaryBullets
        manualSummaryText={manualSummaryText}
        automatedSummaryText={[]}
        isRiskCalculated={true}
      />,
    );

    it('renders no labels and one list if only one list populated', () => {
      expect(wrapper.find(FormattedMessage).length).toBe(0);
      expect(wrapper.find(DomainSummaryBulletItems).length).toBe(1);
      expect(wrapper.find(DomainSummaryBulletItems).props().items).toEqual(manualSummaryText);
    });

    it('renders labels if both lists populated', () => {
      wrapper.setProps({ automatedSummaryText });
      expect(wrapper.find(FormattedMessage).length).toBe(2);
      expect(
        wrapper
          .find(FormattedMessage)
          .at(0)
          .props().id,
      ).toBe('threeSixty.automated');
      expect(
        wrapper
          .find(FormattedMessage)
          .at(1)
          .props().id,
      ).toBe('threeSixty.manual');
    });

    it('renders two sets of bullets if both lists populated', () => {
      expect(wrapper.find(DomainSummaryBulletItems).length).toBe(2);
      expect(
        wrapper
          .find(DomainSummaryBulletItems)
          .at(0)
          .props().items,
      ).toEqual(automatedSummaryText);
      expect(
        wrapper
          .find(DomainSummaryBulletItems)
          .at(1)
          .props().items,
      ).toEqual(manualSummaryText);
    });

    it('renders empty message if no lists populated', () => {
      wrapper.setProps({
        automatedSummaryText: [],
        manualSummaryText: [],
        isRiskCalculated: false,
      });

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('threeSixty.noAssessments');
    });

    it('renders no summary message if no bullets but risk calculated', () => {
      wrapper.setProps({ isRiskCalculated: true });

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('threeSixty.noSummary');
    });
  });
});
