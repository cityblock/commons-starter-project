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
  const history = { push: jest.fn() } as any;
  const errorFn = (message: string) => true as any;
  const component = shallow(
    <ProgressNoteTemplateCreate
      history={history}
      routeBase="/route/base"
      progressNoteTemplateId={progressNoteTemplate.id}
      onClose={onClose}
      openErrorPopup={errorFn}
    />,
  );
  const instance = component.instance();
  expect(instance.render()).toMatchSnapshot();
});
