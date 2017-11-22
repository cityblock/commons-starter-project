import { shallow } from 'enzyme';
import * as React from 'react';
import PatientQuestion from '../../shared/question/patient-question';
import {
  patient,
  progressNote,
  progressNoteTemplate,
  question,
  questionWithAnswerWithConcernAndGoal,
} from '../../shared/util/test-data';
import { ProgressNoteContext as Component } from '../progress-note-context';

const oldDate = Date.now;

describe('progress note context', () => {
  let component: any;
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
    component = shallow(
      <Component
        patientId={patient.id}
        progressNoteId={progressNote.id}
        progressNoteTemplateId={progressNoteTemplate.id}
        progressNoteTemplates={[progressNoteTemplate]}
        onChange={jest.fn()}
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
  it('sets up question state', async () => {
    const instance = component.instance() as Component;
    instance.render();
    expect(component.state()).toEqual({ questions: {} });
  });
});

describe('progress note context without questions', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('changes question state when questions are received', async () => {
    const component = shallow(
      <Component
        patientId={patient.id}
        progressNoteId={progressNote.id}
        progressNoteTemplateId={progressNoteTemplate.id}
        progressNoteTemplates={[progressNoteTemplate]}
        onChange={jest.fn()}
        questions={[]}
      />,
    );
    component.setProps({
      questions: [question],
      progressNoteTemplateId: progressNoteTemplate.id,
      patientId: patient.id,
      onChange: jest.fn(),
    });
    const questions: any = {};
    questions[question.id] = {
      answers: [],
      changed: false,
      oldAnswers: [],
    };
    expect(component.state()).toEqual({ questions });
  });

  it('changes question state when a different progress note template changes', async () => {
    const component = shallow(
      <Component
        patientId={patient.id}
        progressNoteId={progressNote.id}
        progressNoteTemplateId={progressNoteTemplate.id}
        progressNoteTemplates={[progressNoteTemplate]}
        onChange={jest.fn()}
        questions={[]}
      />,
    );
    const instance = component.instance() as Component;

    // Setup initial blank state (runs willReceiveProps)
    component.setProps({
      questions: [question],
      progressNoteTemplateId: progressNoteTemplate.id,
      patientId: patient.id,
      onChange: jest.fn(),
    });

    // Update an answer to add it to the state
    await instance.onChange(question.id, question.answers[0].id, 1);
    const initialQuestionsState: any = {};
    initialQuestionsState[question.id] = {
      answers: [
        {
          id: question.answers[0].id,
          value: 1,
        },
      ],
      changed: true,
      oldAnswers: [],
    };
    expect(component.state()).toEqual({
      questions: initialQuestionsState,
    });

    // Change the progress note template
    component.setProps({
      questions: [questionWithAnswerWithConcernAndGoal],
      progressNoteTemplateId: progressNoteTemplate.id + 'different',
      patientId: patient.id,
      onChange: jest.fn(),
    });
    const questions: any = {};
    questions[questionWithAnswerWithConcernAndGoal.id] = {
      answers: [],
      changed: false,
      oldAnswers: [],
    };

    // Ensure answers associated with the previous progress note template are gone
    expect(component.state()).toEqual({ questions });
  });
});
