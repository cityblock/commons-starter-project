import { shallow } from 'enzyme';
import React from 'react';
import AddProgressNote, { IProps as IAddProgressNoteProps } from '../add-progress-note';
import AddQuickCall from '../add-quick-call';
import AdministerScreeningTool from '../administer-screening-tool';
import LeftNavQuickAction from '../left-nav-quick-action';
import { LeftNavQuickActions } from '../left-nav-quick-actions';

describe('Patient Left Navigation Quick Actions', () => {
  const patientId = 'sansaStark';
  const glassBreakId = 'lady';
  const history = { push: jest.fn } as any;
  const location = {} as any;
  const match = {} as any;

  const wrapper = shallow(
    <LeftNavQuickActions
      patientId={patientId}
      glassBreakId={glassBreakId}
      onClose={jest.fn()}
      history={history}
      location={location}
      match={match}
      staticContext={{} as any}
    />,
  );

  it('renders quick action to add progress note', () => {
    expect(wrapper.find<IAddProgressNoteProps>(AddProgressNote as any).props().patientId).toBe(
      patientId,
    );
  });

  it('renders quick action to add quick call', () => {
    expect(wrapper.find(AddQuickCall).props().patientId).toBe(patientId);
  });

  it('renders quick action to administer tool', () => {
    expect(wrapper.find(AdministerScreeningTool).props().patientId).toBe(patientId);
  });

  it('renders quick action to view documents', () => {
    expect(wrapper.find(LeftNavQuickAction).length).toBe(2);
    expect(
      wrapper
        .find(LeftNavQuickAction)
        .at(0)
        .props().quickAction,
    ).toBe('viewDocuments');
  });

  it('renders quick action to open form library', () => {
    expect(
      wrapper
        .find(LeftNavQuickAction)
        .at(1)
        .props().quickAction,
    ).toBe('openFormLibrary');
  });
});
