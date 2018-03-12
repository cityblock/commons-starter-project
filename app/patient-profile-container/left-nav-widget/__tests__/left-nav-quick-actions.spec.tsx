import { shallow } from 'enzyme';
import * as React from 'react';
import AddProgressNote, { IProps as IAddProgressNoteProps } from '../add-progress-note';
import AddQuickCall from '../add-quick-call';
import LeftNavQuickAction from '../left-nav-quick-action';
import LeftNavQuickActions from '../left-nav-quick-actions';

describe('Patient Left Navigation Quick Actions', () => {
  const patientId = 'sansaStark';
  const glassBreakId = 'lady';

  const wrapper = shallow(
    <LeftNavQuickActions
      patientId={patientId}
      glassBreakId={glassBreakId}
      onClose={() => true as any}
    />,
  );

  it('renders quick action to add progress note', () => {
    expect(wrapper.find<IAddProgressNoteProps>(AddProgressNote).props().patientId).toBe(patientId);
  });

  it('renders quick action to add quick call', () => {
    expect(wrapper.find(AddQuickCall).props().patientId).toBe(patientId);
  });

  it('renders quick action to administer tool', () => {
    expect(
      wrapper
        .find(LeftNavQuickAction)
        .at(0)
        .props().quickAction,
    ).toBe('administerTool');
  });

  it('renders quick action to view documents', () => {
    expect(wrapper.find(LeftNavQuickAction).length).toBe(3);
    expect(
      wrapper
        .find(LeftNavQuickAction)
        .at(1)
        .props().quickAction,
    ).toBe('viewDocuments');
  });

  it('renders quick action to open form library', () => {
    expect(
      wrapper
        .find(LeftNavQuickAction)
        .at(2)
        .props().quickAction,
    ).toBe('openFormLibrary');
  });
});
