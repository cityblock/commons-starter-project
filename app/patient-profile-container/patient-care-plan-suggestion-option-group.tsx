import * as React from 'react';
import { ICarePlan, IPatientConcern } from 'schema';
import { FullCarePlanSuggestionFragment } from '../graphql/types';

interface IProps {
  carePlan?: ICarePlan;
  carePlanSuggestions?: FullCarePlanSuggestionFragment[];
  optionType: 'suggested' | 'active' | 'inactive';
}

const PatientCarePlanSuggestionOptionGroup = (props: IProps) => {
  const { carePlan, carePlanSuggestions, optionType } = props;
  let label: string = '';
  let patientConcerns: IPatientConcern[] = [];
  let concernSuggestions: FullCarePlanSuggestionFragment[] = [];
  let optionsHtml: JSX.Element[] = [];

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
    concernSuggestions = carePlanSuggestions.filter(suggestion => !!suggestion.concern);
  }

  if (patientConcerns.length) {
    optionsHtml = patientConcerns.map(patientConcern =>
      <option
        key={patientConcern.id}
        value={patientConcern.id}>
        {patientConcern.concern.title}
      </option>,
    );
  } else if (concernSuggestions.length) {
    optionsHtml = concernSuggestions.map(concernSuggestion =>
      <option
        key={concernSuggestion.concernId!}
        value={concernSuggestion.concernId!}>
        {concernSuggestion.concern!.title}
      </option>,
    );
  }

  if (optionsHtml.length) {
    return <optgroup label={label}>{optionsHtml}</optgroup>;
  } else {
    return null;
  }
};

export default PatientCarePlanSuggestionOptionGroup;
