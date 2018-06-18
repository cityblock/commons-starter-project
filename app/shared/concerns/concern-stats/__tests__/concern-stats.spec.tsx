import { shallow } from 'enzyme';
import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import PatientConcernStats, { StatDate, StatLabel } from '../concern-stats';

describe('Patient Concern Stats Component', () => {
  describe('Stat Label Component', () => {
    it('returns a formatted message with the correct id', () => {
      const messageId = 'leafeon';

      const wrapper = shallow(<StatLabel messageId={messageId} />);

      expect(wrapper.find(FormattedMessage).length).toBe(1);
      expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
    });
  });

  describe('State Date Component', () => {
    it('returns a formatted date with passed in date', () => {
      const date = 'cyndaquil';
      const wrapper = shallow(<StatDate date={date} />);

      expect(wrapper.find('.date').length).toBe(1);
      expect(wrapper.find(FormattedDate).length).toBe(1);
      expect(wrapper.find(FormattedDate).props().value).toBe(date);
      expect(wrapper.find(FormattedDate).props().year).toBe('numeric');
      expect(wrapper.find(FormattedDate).props().month).toBe('short');
      expect(wrapper.find(FormattedDate).props().day).toBe('numeric');
    });
  });

  describe('Patient Concern Stats Component', () => {
    const goalCount = 11;
    const taskCount = 12;
    const createdAt = 'totodile';
    const lastUpdated = 'pichu';

    const wrapper = shallow(
      <PatientConcernStats
        goalCount={goalCount}
        taskCount={taskCount}
        createdAt={createdAt}
        lastUpdated={lastUpdated}
        inactive={false}
      />,
    );

    it('renders translated patient concern stat labels', () => {
      const statLabels = wrapper.find(StatLabel);
      expect(statLabels.length).toBe(4);

      expect(statLabels.at(0).props().messageId).toBe('concernStats.goals');
      expect(statLabels.at(0).props().small).toBeFalsy();
      expect(statLabels.at(1).props().messageId).toBe('concernStats.tasks');
      expect(statLabels.at(1).props().small).toBeFalsy();

      expect(statLabels.at(2).props().messageId).toBe('concernStats.created');
      expect(statLabels.at(2).props().small).toBeTruthy();
      expect(statLabels.at(3).props().messageId).toBe('concernStats.lastUpdated');
      expect(statLabels.at(3).props().small).toBeTruthy();
    });

    it('renders goal and task counts', () => {
      const counts = wrapper.find('h5');

      expect(counts.length).toBe(2);
      expect(counts.at(0).text()).toBe(goalCount.toString());
      expect(counts.at(1).text()).toBe(taskCount.toString());
    });

    it('renders created at and last updated dates', () => {
      const dates = wrapper.find(StatDate);

      expect(dates.length).toBe(2);
      expect(dates.at(0).props().date).toBe(createdAt);
      expect(dates.at(1).props().date).toBe(lastUpdated);
    });

    it('does not apply inactive styles if not needed', () => {
      expect(wrapper.find('.inactive').length).toBe(0);
    });

    it('applies ianctive styles if needed', () => {
      const wrapper2 = shallow(
        <PatientConcernStats
          goalCount={goalCount}
          taskCount={taskCount}
          createdAt={createdAt}
          lastUpdated={lastUpdated}
          inactive={true}
        />,
      );

      expect(wrapper2.find('.inactive').length).toBe(2);
    });
  });
});
