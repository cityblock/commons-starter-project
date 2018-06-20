import classNames from 'classnames';
import { includes } from 'lodash';
import React from 'react';
import {
  getConcerns,
  getPatientCarePlan,
  FullCarePlanSuggestionForPatient,
} from '../../graphql/types';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import styles from '../css/patient-care-plan.css';
import PatientCarePlanSuggestionOptionGroup from './patient-care-plan-suggestion-option-group';

interface IProps {
  carePlan?: getPatientCarePlan['carePlanForPatient'];
  carePlanSuggestions?: FullCarePlanSuggestionForPatient[];
  concerns?: getConcerns['concerns'];
  concernId: string;
  concernType: '' | 'inactive' | 'active';
  suggestion: FullCarePlanSuggestionForPatient | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => any;
}

const PopupPatientCarePlanSuggestionAcceptedModalBody = (props: IProps) => {
  const {
    carePlan,
    carePlanSuggestions,
    concerns,
    concernId,
    concernType,
    onChange,
    suggestion,
  } = props;

  const isSuggestedConcern = !!suggestion && suggestion.suggestionType === 'concern';
  const isSuggestedGoal = !!suggestion && suggestion.suggestionType === 'goal';

  let suggestedConcernSelected: boolean = false;
  let newConcernSelected: boolean = false;

  // Is this a suggested concern
  if (concernId && carePlanSuggestions) {
    const suggestedConcern = carePlanSuggestions.find(
      carePlanSuggestion =>
        carePlanSuggestion
          ? !!carePlanSuggestion.concernId && carePlanSuggestion.concernId === concernId
          : false,
    );

    if (suggestedConcern) {
      suggestedConcernSelected = true;
    }
  }

  // Is this a new concern
  if (concernId && carePlan) {
    const existingConcernIds = carePlan.concerns.map(concern => concern.id);
    newConcernSelected = !includes(existingConcernIds, concernId);
  }

  const selectConcernTypeInputDivStyles = classNames(styles.acceptModalInput, {
    [styles.hidden]: isSuggestedConcern || (!newConcernSelected && !suggestedConcernSelected),
  });

  let bodyHtml: JSX.Element | null = null;

  if (isSuggestedConcern) {
    bodyHtml = (
      <Select name="concernType" onChange={onChange} value={concernType} large>
        <Option value="" disabled messageId="carePlanSuggestion.concernType" />
        <Option value="active" messageId="carePlanSuggestion.concernActive" />
        <Option value="inactive" messageId="carePlanSuggestion.concernInactive" />
      </Select>
    );
  } else if (isSuggestedGoal) {
    bodyHtml = (
      <div>
        <Select name="concernId" onChange={onChange} value={concernId} large>
          <Option value="" disabled messageId="carePlanSuggestion.concernSelect" />
          <PatientCarePlanSuggestionOptionGroup
            optionType={'suggested'}
            carePlan={carePlan}
            carePlanSuggestions={carePlanSuggestions}
          />
          <PatientCarePlanSuggestionOptionGroup optionType={'active'} carePlan={carePlan} />
          <PatientCarePlanSuggestionOptionGroup optionType={'inactive'} carePlan={carePlan} />
          <PatientCarePlanSuggestionOptionGroup
            optionType={'other'}
            carePlan={carePlan}
            carePlanSuggestions={carePlanSuggestions}
            concerns={concerns}
          />
        </Select>
        <div className={selectConcernTypeInputDivStyles}>
          <Select name="concernType" onChange={onChange} value={concernType} large>
            <Option value="" disabled messageId="carePlanSuggestion.concernType" />
            <Option value="active" messageId="carePlanSuggestion.concernActive" />
            <Option value="inactive" messageId="carePlanSuggestion.concernInactive" />
          </Select>
        </div>
      </div>
    );
  }

  return bodyHtml;
};

export default PopupPatientCarePlanSuggestionAcceptedModalBody;
