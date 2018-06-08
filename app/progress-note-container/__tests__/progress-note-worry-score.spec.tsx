import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import Text from '../../shared/library/text/text';
import ProgressNoteWorryScore, { WorryScoreChoice } from '../progress-note-worry-score';

describe('Progress Note Worry Score Field', () => {
  const placeholderFn = () => true as any;

  describe('Worry Score Choice', () => {
    const wrapper = shallow(
      <WorryScoreChoice
        worryScore={null}
        onChange={placeholderFn}
        id="neutral"
        value={2}
        icon="sentimentNeutral"
        iconColor="yellow"
      />,
    );

    it('renders radio input', () => {
      expect(wrapper.find('input').props().name).toBe('worryScore');
      expect(wrapper.find('input').props().type).toBe('radio');
      expect(wrapper.find('input').props().id).toBe('neutral');
      expect(wrapper.find('input').props().value).toBe(2);
      expect(wrapper.find('input').props().checked).toBeFalsy();
      expect(wrapper.find('input').props().className).toBe('radio');
    });

    it('renders label', () => {
      expect(wrapper.find('label').props().htmlFor).toBe('neutral');
      expect(wrapper.find('label').props().className).toBe('label');
    });

    it('renders icon', () => {
      expect(wrapper.find(Icon).props().color).toBe('yellow');
      expect(wrapper.find(Icon).props().name).toBe('sentimentNeutral');
      expect(wrapper.find(Icon).props().className).toBe('icon');
    });

    it('selects worry score', () => {
      wrapper.setProps({ worryScore: 2 });

      expect(wrapper.find('input').props().checked).toBeTruthy();
    });

    it('deselects worry score', () => {
      wrapper.setProps({ worryScore: 3 });

      expect(wrapper.find('input').props().checked).toBeFalsy();
      expect(wrapper.find(Icon).props().color).toBe('gray');
    });
  });

  describe('Progress Note Worry Score', () => {
    const worryScore = 2;
    const wrapper = shallow(
      <ProgressNoteWorryScore onChange={placeholderFn} worryScore={worryScore} />,
    );

    it('renders container', () => {
      expect(wrapper.find('.container').length).toBe(1);
    });

    it('renders question for worry score', () => {
      expect(wrapper.find(Text).props().messageId).toBe('progressNote.worryScore');
      expect(wrapper.find(Text).props().font).toBe('basetica');
      expect(wrapper.find(Text).props().isBold).toBeTruthy();
      expect(wrapper.find(Text).props().color).toBe('black');
      expect(wrapper.find(Text).props().size).toBe('largest');
      expect(wrapper.find(Text).props().className).toBe('text');
    });

    it('renders worry score very worried option', () => {
      expect(wrapper.find(WorryScoreChoice).length).toBe(3);

      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(0)
          .props().worryScore,
      ).toBe(worryScore);
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(0)
          .props().id,
      ).toBe('worried');
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(0)
          .props().value,
      ).toBe(3);
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(0)
          .props().icon,
      ).toBe('sentimentDissatisfied');
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(0)
          .props().iconColor,
      ).toBe('red');
    });

    it('renders worry score neutral option', () => {
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(1)
          .props().worryScore,
      ).toBe(worryScore);
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(1)
          .props().id,
      ).toBe('neutral');
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(1)
          .props().value,
      ).toBe(2);
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(1)
          .props().icon,
      ).toBe('sentimentNeutral');
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(1)
          .props().iconColor,
      ).toBe('yellow');
    });

    it('renders worry score not worried option', () => {
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(2)
          .props().worryScore,
      ).toBe(worryScore);
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(2)
          .props().id,
      ).toBe('not-worried');
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(2)
          .props().value,
      ).toBe(1);
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(2)
          .props().icon,
      ).toBe('sentimentSatisfied');
      expect(
        wrapper
          .find(WorryScoreChoice)
          .at(2)
          .props().iconColor,
      ).toBe('green');
    });
  });
});
