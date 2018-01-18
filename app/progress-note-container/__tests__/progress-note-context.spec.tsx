import { shallow } from 'enzyme';
import * as React from 'react';
import PatientQuestion from '../../shared/question/patient-question';
import { clinic, progressNote, progressNoteTemplate, question } from '../../shared/util/test-data';
import { ProgressNoteContext as Component } from '../progress-note-context';

const oldDate = Date.now;
const clinics = {
  edges: [{ node: clinic }],
};

describe('progress note context', () => {
  let component: any;
  const history = { push: jest.fn } as any;

  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
    component = shallow(
      <Component
        history={history}
        progressNote={progressNote}
        progressNoteTemplates={[progressNoteTemplate]}
        onChange={jest.fn()}
        disabled={false}
        clinics={clinics}
        questions={[question]}
      />,
    );
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  describe('renders progress note context with question', () => {
    it('renders progress note with question', async () => {
      const instance = component.instance() as Component;
      const result = instance.render();
      expect(result).not.toBeFalsy();
      expect(
        component
          .find(PatientQuestion)
          .at(0)
          .props().question,
      ).toEqual(question);
    });
  });
});
