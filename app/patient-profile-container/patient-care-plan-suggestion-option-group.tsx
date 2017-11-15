import * as React from 'react';
import {
  getPatientCarePlanQuery,
  getPatientCarePlanSuggestionsQuery,
  FullPatientConcernFragment,
} from '../graphql/types';
import { FullCarePlanSuggestionFragment } from '../graphql/types';

interface IProps {
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  carePlanSuggestions?: getPatientCarePlanSuggestionsQuery['carePlanSuggestionsForPatient'];
  optionType: 'suggested' | 'active' | 'inactive';
}

const PatientCarePlanSuggestionOptionGroup = (props: IProps) => {
  const { carePlan, carePlanSuggestions, optionType } = props;
  let label: string = '';
  let patientConcerns: FullPatientConcernFragment[] = [];
  let concernSuggestions: Array<FullCarePlanSuggestionFragment | null> = [];
  let optionsHtml: Array<JSX.Element | null> = [];

  if (carePlan && ['active', 'inactive'].includes(optionType)) {
    if (optionType === 'active') {
      label = 'Active concerns';
      patientConcerns = carePlan.concerns.filter(concern => !!concern.startedAt);
    } else {
      label = 'Inactive concerns';
      patientConcerns = carePlan.concerns.filter(concern => !concern.startedAt);
    }
  } else if (carePlanSuggestions && optionType === 'suggested') {
    label = 'Suggested concerns';
    concernSuggestions = carePlanSuggestions.filter(
      suggestion => (suggestion ? !!suggestion.concern : false),
    );
  }

  if (patientConcerns.length) {
    optionsHtml = patientConcerns.map(patientConcern => (
      <option key={patientConcern.id} value={patientConcern.id}>
        {patientConcern.concern.title}
      </option>
    ));
  } else if (concernSuggestions.length) {
    optionsHtml = concernSuggestions.map(
      concernSuggestion =>
        concernSuggestion ? (
          <option key={concernSuggestion.concernId!} value={concernSuggestion.concernId!}>
            {concernSuggestion.concern!.title}
          </option>
        ) : null,
    );
  }

  if (optionsHtml.length) {
    return <optgroup label={label}>{optionsHtml}</optgroup>;
  } else {
    return null;
  }
};

export default PatientCarePlanSuggestionOptionGroup;
