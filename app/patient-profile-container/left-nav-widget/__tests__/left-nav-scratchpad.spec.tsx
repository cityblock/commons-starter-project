import { shallow } from 'enzyme';
import * as React from 'react';
import TextArea from '../../../shared/library/textarea/textarea';
import { patientScratchPad } from '../../../shared/util/test-data';
import { LeftNavScratchPad } from '../left-nav-scratchpad';
import LeftNavScratchPadStatus from '../left-nav-scratchpad-status';

describe('Patient Left Navigation Scratch Pad', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <LeftNavScratchPad
      glassBreakId="ghost"
      patientId={patientScratchPad.patientId}
      scratchPad={patientScratchPad}
      loading={false}
      error={null}
      saveScratchPad={placeholderFn}
      refetchScratchPad={placeholderFn}
    />,
  );

  wrapper.setProps({ scratchPad: patientScratchPad });

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text area', () => {
    expect(wrapper.find(TextArea).props().value).toBe(patientScratchPad.body);
    expect(wrapper.find(TextArea).props().className).toBe('textarea');
    expect(wrapper.find(TextArea).props().placeholderMessageId).toBe('scratchPad.empty');
    expect(wrapper.find(TextArea).props().disabled).toBeFalsy();
  });

  it('renders scratch pad status', () => {
    expect(wrapper.find(LeftNavScratchPadStatus).props().saveSuccess).toBeFalsy();
    expect(wrapper.find(LeftNavScratchPadStatus).props().saveError).toBeFalsy();
    expect(wrapper.find(LeftNavScratchPadStatus).props().charCount).toBe(
      patientScratchPad.body.length,
    );
  });

  it('passes save success to scratch pad status', () => {
    wrapper.setState({ saveSuccess: true });

    expect(wrapper.find(LeftNavScratchPadStatus).props().saveSuccess).toBeTruthy();
  });

  it('disables scratch pad if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(TextArea).props().disabled).toBeTruthy();
    expect(wrapper.find(TextArea).props().placeholderMessageId).toBe('scratchPad.loading');
  });
});
