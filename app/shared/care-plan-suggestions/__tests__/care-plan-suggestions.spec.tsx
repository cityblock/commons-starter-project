import { shallow } from 'enzyme';
import * as React from 'react';
import {
  carePlanSuggestionWithConcern,
  carePlanSuggestionWithGoal,
  patient,
} from '../../util/test-data';
import { CarePlanSuggestions as Component } from '../care-plan-suggestions';

it('renders the correct results', async () => {
  const component = shallow(
    <Component
      carePlanSuggestions={[carePlanSuggestionWithConcern, carePlanSuggestionWithGoal]}
      redirectToCarePlanSuggestions={() => true}
      patientRoute={`/patients/${patient.id}`}
      titleMessageId={'screeningTool.resultsTitle'}
      bodyMessageId={'screeningTool.resultsBody'}
    />,
  );
  const instance = component.instance() as Component;
  expect(instance.getConcernCount()).toEqual(1);
  expect(instance.getGoalCount()).toEqual(1);
  expect(instance.getTaskCount()).toEqual(1);
});
