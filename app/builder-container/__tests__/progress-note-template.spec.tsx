import { shallow } from 'enzyme';
import * as React from 'react';
import { progressNoteTemplate } from '../../shared/util/test-data';
import { ProgressNoteTemplate as Component } from '../progress-note-template';

const oldDate = Date.now;
beforeAll(() => {
  Date.now = jest.fn(() => 1500494779252);
});
afterAll(() => {
  Date.now = oldDate;
});

it('renders progress note template', () => {
  const onDelete = jest.fn();
  const editProgressNoteTemplate: any = () => false;
  const component = shallow(
    <Component
      routeBase="/route/base"
      progressNoteTemplate={progressNoteTemplate}
      refetchProgressNoteTemplate={() => false}
      editProgressNoteTemplate={editProgressNoteTemplate}
      onDelete={onDelete}
    />,
  );
  const instance = component.instance() as Component;
  expect(instance.render()).toMatchSnapshot();
});

it('renders error without progress note template', () => {
  const onDelete = jest.fn();
  const editProgressNoteTemplate: any = () => false;
  const component = shallow(
    <Component
      routeBase="/route/base"
      progressNoteTemplate={null}
      refetchProgressNoteTemplate={() => false}
      progressNoteTemplateError={'error!'}
      editProgressNoteTemplate={editProgressNoteTemplate}
      onDelete={onDelete}
    />,
  );
  const instance = component.instance() as Component;
  expect(instance.render()).toMatchSnapshot();
});

it('renders loading', () => {
  const onDelete = jest.fn();
  const editProgressNoteTemplate: any = () => false;
  const component = shallow(
    <Component
      routeBase="/route/base"
      progressNoteTemplate={null}
      refetchProgressNoteTemplate={() => false}
      progressNoteTemplateLoading={true}
      editProgressNoteTemplate={editProgressNoteTemplate}
      onDelete={onDelete}
    />,
  );
  const instance = component.instance() as Component;
  expect(instance.render()).toMatchSnapshot();
});
