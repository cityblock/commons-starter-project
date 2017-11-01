import { shallow } from 'enzyme';
import * as React from 'react';
import { progressNoteTemplate } from '../../shared/util/test-data';
import { ProgressNoteTemplateCreate } from '../progress-note-template-create';

const oldDate = Date.now;
beforeAll(() => {
  Date.now = jest.fn(() => 1500494779252);
});
afterAll(() => {
  Date.now = oldDate;
});

it('renders progress note template create', () => {
  const onClose = jest.fn();
  const redirectToProgressNoteTemplate = jest.fn();
  const component = shallow(
    <ProgressNoteTemplateCreate
      routeBase="/route/base"
      progressNoteTemplateId={progressNoteTemplate.id}
      onClose={onClose}
      redirectToProgressNoteTemplate={redirectToProgressNoteTemplate}
    />,
  );
  const instance = component.instance();
  expect(instance.render()).toMatchSnapshot();
});
