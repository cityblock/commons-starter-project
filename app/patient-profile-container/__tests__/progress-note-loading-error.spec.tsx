import { shallow } from 'enzyme';
import * as React from 'react';
import { ProgressNoteLoadingError } from '../progress-note-loading-error';

it('renders progress note error', () => {
  const component = shallow(<ProgressNoteLoadingError error={'error'} loading={false} />);
  expect(component.find('.errorLabel').length).toBe(1);
  expect(
    component
      .find('.errorLabel')
      .at(0)
      .text(),
  ).toBe('Unable to load');
});

it('renders progress note loading', () => {
  const component = shallow(<ProgressNoteLoadingError loading={true} />);
  expect(component.find('.loading').length).toBe(1);
  expect(
    component
      .find('.loading')
      .at(0)
      .text(),
  ).toBe('Loading...');
});
