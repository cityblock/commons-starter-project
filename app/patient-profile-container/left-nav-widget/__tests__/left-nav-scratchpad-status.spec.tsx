import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../../shared/library/icon/icon';
import Text from '../../../shared/library/text/text';
import { MAX_SCRATCHPAD_LENGTH } from '../left-nav-scratchpad';
import LeftNavScratchPadStatus from '../left-nav-scratchpad-status';

describe('Patient Left Navigation ScratchPad Status', () => {
  const charCount = 11;

  const wrapper = shallow(
    <LeftNavScratchPadStatus
      charCount={charCount}
      saveSuccess={false}
      saveError={false}
      resaveScratchPad={jest.fn()}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders no save note and character count', () => {
    expect(wrapper.find(Text).props().text).toBe(`${charCount}/${MAX_SCRATCHPAD_LENGTH}`);
    expect(wrapper.find(Text).props().color).toBe('gray');
  });

  it('renders error content if max character count reached', () => {
    wrapper.setProps({ charCount: MAX_SCRATCHPAD_LENGTH });

    expect(wrapper.find(Icon).props().name).toBe('error');
    expect(wrapper.find(Icon).props().color).toBe('red');

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('scratchPad.maxChars');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe('red');

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().text,
    ).toBe(`${MAX_SCRATCHPAD_LENGTH}/${MAX_SCRATCHPAD_LENGTH}`);
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('red');
  });

  it('renders save success messaging', () => {
    wrapper.setProps({ charCount, saveSuccess: true });

    expect(wrapper.find(Icon).props().name).toBe('checkCircle');
    expect(wrapper.find(Icon).props().color).toBe('blue');

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('scratchPad.saveSuccess');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe('gray');

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().text,
    ).toBe(`${charCount}/${MAX_SCRATCHPAD_LENGTH}`);
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('gray');
  });

  it('renders save error messaging', () => {
    wrapper.setProps({ saveSuccess: false, saveError: true });

    expect(wrapper.find(Icon).props().name).toBe('error');
    expect(wrapper.find(Icon).props().color).toBe('red');

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('scratchPad.saveError');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe('red');

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().text,
    ).toBe(`${charCount}/${MAX_SCRATCHPAD_LENGTH}`);
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('gray');
  });
});
