import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientQuestion from '../../shared/question/patient-question';
import { patient, progressNote, progressNoteTemplate, question } from '../../shared/util/test-data';
import ProgressNoteContext, { ProgressNoteContext as Component } from '../progress-note-context';
import { query } from './patient-timeline.spec';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

describe('progress note context', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders with router', () => {
    const history = createMemoryHistory();
    const tree = create(
      <MockedProvider
        mocks={[
          {
            request: {
              query,
              variables: {
                patientId: patient.id,
              },
            },
            result: {
              data: {
                progressNoteGetOrCreate: progressNote,
              },
            },
          },
        ]}
        store={mockStore({ locale })}
      >
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <ProgressNoteContext
              patientId={patient.id}
              progressNoteId={progressNote.id}
              progressNoteTemplateId={progressNoteTemplate.id}
              progressNoteTemplates={[progressNoteTemplate]}
              onChange={jest.fn()}
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
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
