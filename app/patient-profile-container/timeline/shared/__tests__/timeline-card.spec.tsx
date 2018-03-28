import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../../shared/library/button/button';
import SmallText from '../../../../shared/library/small-text/small-text';
import { progressNote } from '../../../../shared/util/test-data';
import ProgressNoteSupervisorBadge from '../../progress-note-supervisor-badge';
import TimelineCard from '../timeline-card';

describe('Patient Timeline: Timeline Card', () => {
  const source = 'ACPNY';
  const sourceDetail = 'EPIC EHR';
  const title = 'Ultrasound Kidney Stones';
  const date = '2018-03-28T05:23:08.020Z';

  const wrapper = shallow(
    <TimelineCard
      source={source}
      sourceDetail={sourceDetail}
      title={title}
      date={date}
      notes={null}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);

    expect(wrapper.find(ProgressNoteSupervisorBadge).length).toBe(0);
    expect(wrapper.find(Button).length).toBe(0);
  });

  it('renders source data', () => {
    expect(wrapper.find(SmallText).length).toBe(4);

    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().text,
    ).toBe(source);
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().isBold,
    ).toBeTruthy();
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().className,
    ).toBe('rightMargin');
  });

  it('renders source detail', () => {
    expect(wrapper.find('.pill').length).toBe(1);

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(sourceDetail);
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().size,
    ).toBe('small');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe('darkGray');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().isBold,
    ).toBeFalsy();
  });

  it('renders formatted time', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().text,
    ).toMatch(':23 am');
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().isBold,
    ).toBeFalsy();
    expect(
      wrapper
        .find(SmallText)
        .at(2)
        .props().className,
    ).toBe('rightMargin');
  });

  it('renders formatted date', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(3)
        .props().text,
    ).toBe('Mar 28, 2018');
    expect(
      wrapper
        .find(SmallText)
        .at(3)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(SmallText)
        .at(3)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(SmallText)
        .at(3)
        .props().isBold,
    ).toBeFalsy();
  });

  it('renders title', () => {
    expect(wrapper.find('h1').text()).toBe(title);
  });

  it('renders notes if specified', () => {
    const notes = 'Adding notes here';
    wrapper.setProps({ notes });

    expect(wrapper.find(SmallText).length).toBe(5);

    expect(
      wrapper
        .find(SmallText)
        .at(4)
        .props().text,
    ).toBe(notes);
    expect(
      wrapper
        .find(SmallText)
        .at(4)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(SmallText)
        .at(4)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(SmallText)
        .at(4)
        .props().isBold,
    ).toBeFalsy();
    expect(
      wrapper
        .find(SmallText)
        .at(4)
        .props().className,
    ).toBe('topMargin');
  });

  it('renders source detail differently if progress note', () => {
    wrapper.setProps({ progressNote });

    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(sourceDetail);
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().isBold,
    ).toBeFalsy();
  });

  it('renders progress note supervisor badge', () => {
    expect(wrapper.find(ProgressNoteSupervisorBadge).props().progressNote).toEqual(progressNote);
  });

  it('applies dashed border if supervisor review needed', () => {
    const newProgressNote = {
      ...progressNote,
      needsSupervisorReview: true,
    };

    wrapper.setProps({ progressNote: newProgressNote });

    expect(wrapper.find('.container').props().className).toBe('container dashed');
  });

  it('renders button to close tabs', () => {
    wrapper.setProps({ onClose: () => true });

    expect(wrapper.find(Button).props().messageId).toBe('progressNote.close');
    expect(wrapper.find(Button).props().color).toBe('white');
  });
});
