import { shallow } from 'enzyme';
import * as React from 'react';
import {
  carePlanSuggestionWithConcern,
  carePlanSuggestionWithGoal,
  patient,
} from '../../util/test-data';
import { CarePlanSuggestions as Component } from '../care-plan-suggestions';

it('renders the correct results', async () => {
  const history = { push: jest.fn } as any;
  const match = {
    foo: 'bar',
  };
  const location = {} as any;
  const component = shallow(
    <Component
      carePlanSuggestions={[carePlanSuggestionWithConcern, carePlanSuggestionWithGoal]}
      patientRoute={`/patients/${patient.id}`}
      titleMessageId={'screeningTool.resultsTitle'}
      bodyMessageId={'screeningTool.resultsBody'}
      history={history}
      match={match}
      location={location}
    />,
  );
  const instance = component.instance() as Component;
  expect(instance.getConcernCount()).toEqual(1);
  expect(instance.getGoalCount()).toEqual(1);
  expect(instance.getTaskCount()).toEqual(1);
});
