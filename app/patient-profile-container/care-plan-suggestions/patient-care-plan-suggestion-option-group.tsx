import { includes, uniqBy } from 'lodash';
import React from 'react';
import {
  getConcernsQuery,
  getPatientCarePlanQuery,
  FullCarePlanSuggestionForPatientFragment,
  FullCarePlanSuggestionFragment,
  FullPatientConcernFragment,
} from '../../graphql/types';

interface IProps {
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  carePlanSuggestions?: FullCarePlanSuggestionForPatientFragment[];
  concerns?: getConcernsQuery['concerns'];
  optionType: 'suggested' | 'active' | 'inactive' | 'other';
}

const PatientCarePlanSuggestionOptionGroup = (props: IProps) => {
  const { carePlan, carePlanSuggestions, concerns, optionType } = props;
  let label: string = '';
  let patientConcerns: FullPatientConcernFragment[] = [];
  let concernSuggestions: FullCarePlanSuggestionFragment[] = [];
  let otherConcernOptions: getConcernsQuery['concerns'] = [];
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
      suggestion => (suggestion ? !!suggestion.concernId : false),
    );
    concernSuggestions = uniqBy(concernSuggestions, 'concernId');
  } else if (concerns && carePlan && carePlanSuggestions && optionType === 'other') {
    const duplicateConcernIds: string[] = carePlan.concerns.map(
      patientConcern => patientConcern.concernId,
    );
    carePlanSuggestions.forEach(suggestion => {
      if (suggestion.concernId) {
        duplicateConcernIds.push(suggestion.concernId);
      }
    });
    label = 'All other concerns';
    otherConcernOptions = concerns.filter(
      concern => !!concern && !includes(duplicateConcernIds, concern.id),
    );
  }

  if (otherConcernOptions.length) {
    optionsHtml = otherConcernOptions.filter(concern => !!concern).map(concern => (
      <option key={concern!.id} value={concern!.id}>
        {concern!.title}
      </option>
    ));
  } else if (patientConcerns.length) {
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
