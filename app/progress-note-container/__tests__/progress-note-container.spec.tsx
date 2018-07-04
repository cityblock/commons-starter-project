import { shallow } from 'enzyme';
import React from 'react';
import { currentUser, progressNote } from '../../shared/util/test-data';
import { ProgressNoteContainer as Component } from '../progress-note-container';

const oldDate = Date.now;

describe('progress note container', () => {
  let component: any;

  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
    component = shallow(
      <Component
        progressNotesLoading={false}
        progressNotesError={null}
        currentUser={currentUser}
        progressNotes={[progressNote]}
        progressNotesForSupervisorReview={[]}
        progressNotesForSupervisorReviewError={null}
        progressNotesForSupervisorReviewLoading={false}
        drawerIsOpen={false}
        progressNoteId={null}
        openProgressNote={jest.fn()}
        closeProgressNotesDrawer={jest.fn()}
        openProgressNotesDrawer={jest.fn()}
        location={{
          pathname: '/builder',
        }}
        subscribeToMore={jest.fn()}
      />,
    );
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  describe('renders progress container', () => {
    it('renders nothing for builder route', async () => {
      const instance = component.instance() as Component;
      const result = instance.render();
      expect(result).toBeFalsy();
    });
    it('renders progress note', () => {
      component.setProps({
        location: {
          pathname: '/foo',
        },
      });
      const instance = component.instance() as Component;
      const result = instance.render();
      expect(result).not.toBeFalsy();
    });
  });
});
