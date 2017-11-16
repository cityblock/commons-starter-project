import { shallow } from 'enzyme';
import * as React from 'react';
import PatientQuestion from '../../shared/question/patient-question';
import { patient, progressNote, progressNoteTemplate, question } from '../../shared/util/test-data';
import { ProgressNoteContext as Component } from '../progress-note-context';

const oldDate = Date.now;

describe('progress note context', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  describe('renders progress note context with question', () => {
    it('renders progress note with question', async () => {
      const component = shallow(
        <Component
          patientId={patient.id}
          progressNoteId={progressNote.id}
          progressNoteTemplateId={progressNoteTemplate.id}
          progressNoteTemplates={[progressNoteTemplate]}
          onChange={jest.fn()}
          questions={[question]}
        />,
      );
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
