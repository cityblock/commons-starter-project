import { shallow } from 'enzyme';
import React from 'react';
import { concern, goal, screeningTool } from '../../shared/util/test-data';
import { BuilderContainer as Component } from '../builder-container';

it('renders builder container', () => {
  process.env.IS_BUILDER_ENABLED = 'true';
  const match = { params: { tab: 'tools', objectId: screeningTool.id, subTab: null } } as any;
  const component = shallow(
    <Component
      match={match}
      screeningToolId={screeningTool.id}
      assessmentsLoading={false}
      assessmentsError={null}
      screeningToolsLoading={false}
      screeningToolsError={null}
      concernsLoading={false}
      concernsError={null}
      goalsLoading={false}
      goalsError={null}
      refetchGoals={jest.fn()}
      assessments={[]}
      concerns={[concern]}
      goals={[goal]}
      screeningTools={[screeningTool]}
      progressNoteTemplates={[]}
      tab={'tools' as any}
      objectId={screeningTool.id}
      subTab={null}
    />,
  );
  expect(component.find('.container')).toHaveLength(1);
});

it('does not render builder container if disabled', () => {
  process.env.IS_BUILDER_ENABLED = 'false';
  const match = { params: { tab: 'tools', objectId: screeningTool.id, subTab: null } } as any;
  const component = shallow(
    <Component
      match={match}
      screeningToolId={screeningTool.id}
      assessmentsLoading={false}
      assessmentsError={null}
      screeningToolsLoading={false}
      screeningToolsError={null}
      concernsLoading={false}
      concernsError={null}
      goalsLoading={false}
      goalsError={null}
      refetchGoals={() => null as any}
      assessments={[]}
      concerns={[concern]}
      goals={[goal]}
      screeningTools={[screeningTool]}
      progressNoteTemplates={[]}
      tab={'tools' as any}
      objectId={screeningTool.id}
      subTab={null}
    />,
  );
  expect(component.find('.container')).toHaveLength(0);
});
