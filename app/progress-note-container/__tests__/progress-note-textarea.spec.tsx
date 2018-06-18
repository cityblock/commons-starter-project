import { shallow } from 'enzyme';
import React from 'react';
import TextArea from '../../shared/library/textarea/textarea';
import { ProgressNoteTextArea } from '../progress-note-textarea';

describe('Progress Note Text Area', () => {
  const placeholderFn = jest.fn();
  const value = 'Winter is Coming';

  const wrapper = shallow(
    <ProgressNoteTextArea
      value={value}
      disabled={false}
      onChange={placeholderFn}
      forceSave={placeholderFn}
    />,
  );

  it('renders text area', () => {
    expect(wrapper.find(TextArea).props().value).toBe(value);
    expect(wrapper.find(TextArea).props().disabled).toBeFalsy();
  });
});
