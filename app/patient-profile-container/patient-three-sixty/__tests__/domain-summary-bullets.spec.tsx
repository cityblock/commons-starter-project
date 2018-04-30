import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DomainSummaryBulletItems } from '../domain-summary-bullet-items';
import DomainSummaryBullets from '../domain-summary-bullets';

describe('Domain Summary Bullet Components', () => {
  const automated1 = 'lady';
  const automated2 = 'nymeria';
  const manual1 = 'greyWind';
  const manual2 = 'shaggyDog';
  const manual3 = 'summer';
  const manual4 = 'ghost';
  const automatedSummaryText = [automated1, automated2];
  const manualSummaryText = [manual1, manual2, manual3, manual4];
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
  });

  describe('Domain Summary Bullets', () => {
    const wrapper = shallow(
      <DomainSummaryBullets
        manualSummaryText={manualSummaryText}
        automatedSummaryText={[]}
        screeningToolResultSummaries={[]}
      />,
    );

    it('renders no labels and one list if only one list populated', () => {
      expect(wrapper.find(FormattedMessage).length).toBe(0);
      expect(wrapper.find(DomainSummaryBulletItems).length).toBe(1);
      expect(wrapper.find(DomainSummaryBulletItems).props().items).toEqual(manualSummaryText);
      expect(wrapper.find(DomainSummaryBulletItems).props().screeningToolResultSummaries).toEqual(
        [],
      );
    });

    it('renders no labels and one list if both lists empty but screening tools present', () => {
      wrapper.setProps({ screeningToolResultSummaries: [screeningTool], manualSummaryText: [] });

      expect(wrapper.find(FormattedMessage).length).toBe(0);
      expect(wrapper.find(DomainSummaryBulletItems).length).toBe(1);
      expect(wrapper.find(DomainSummaryBulletItems).props().items).toEqual([]);
      expect(wrapper.find(DomainSummaryBulletItems).props().screeningToolResultSummaries).toEqual([
        screeningTool,
      ]);
    });

    it('renders labels if both lists populated', () => {
      wrapper.setProps({ automatedSummaryText, manualSummaryText });
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
          .at(0)
          .props().screeningTools,
      ).toBeFalsy();
      expect(
        wrapper
          .find(DomainSummaryBulletItems)
          .at(1)
          .props().items,
      ).toEqual(manualSummaryText);
      expect(
        wrapper
          .find(DomainSummaryBulletItems)
          .at(1)
          .props().screeningToolResultSummaries,
      ).toEqual([screeningTool]);
    });

    it('renders empty message if no lists populated', () => {
      wrapper.setProps({
        automatedSummaryText: [],
        manualSummaryText: [],
        screeningToolResultSummaries: [],
        isRiskCalculated: false,
      });

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('threeSixty.noAssessments');
    });

    it('renders no assessments if no assessments', () => {
      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe('threeSixty.noAssessments');
    });
  });
});
