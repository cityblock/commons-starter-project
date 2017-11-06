import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { patient, progressNote, progressNoteTemplate } from '../../shared/util/test-data';
import ProgressNotePopup, { ProgressNotePopup as Component } from '../progress-note-popup';
import { query } from './patient-timeline.spec';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;
const editProgressNote = jest.fn();
const completeProgressNote = jest.fn();
const getOrCreateProgressNote = jest.fn();
const progressNoteTemplates = [progressNoteTemplate];

describe('builder concerns', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders progress note popup', () => {
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
            <ProgressNotePopup close={jest.fn()} patientId={patient.id} visible={true} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders progress note popup with templates', () => {
    it('renders progress note popup with templates', async () => {
      const component = shallow(
        <Component
          close={jest.fn()}
          patientId={patient.id}
          visible={true}
          patient={patient}
          editProgressNote={editProgressNote}
          completeProgressNote={completeProgressNote}
          getOrCreateProgressNote={getOrCreateProgressNote}
          progressNoteTemplates={progressNoteTemplates}
        />,
      );
      const instance = component.instance() as Component;
      const result = instance.render();
      expect(result).toMatchSnapshot();
    });
    it('renders progress note', async () => {
      const component = shallow(
        <Component
          close={jest.fn()}
          patientId={patient.id}
          visible={true}
          patient={patient}
          editProgressNote={editProgressNote}
          completeProgressNote={completeProgressNote}
          getOrCreateProgressNote={getOrCreateProgressNote}
          progressNoteTemplates={progressNoteTemplates}
        />,
      );
      const instance = component.instance() as Component;
      instance.setState({ progressNote });
      const result = instance.render();
      expect(result).toMatchSnapshot();
    });
  });
});
