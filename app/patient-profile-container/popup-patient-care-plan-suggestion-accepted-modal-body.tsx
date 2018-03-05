import * as classNames from 'classnames';
import { includes } from 'lodash-es';
import * as React from 'react';
import {
  getConcernsQuery,
  getPatientCarePlanQuery,
  getPatientCarePlanSuggestionsQuery,
  FullCarePlanSuggestionFragment,
} from '../graphql/types';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import * as styles from './css/patient-care-plan.css';
import PatientCarePlanSuggestionOptionGroup from './patient-care-plan-suggestion-option-group';

interface IProps {
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  carePlanSuggestions?: getPatientCarePlanSuggestionsQuery['carePlanSuggestionsForPatient'];
  concerns?: getConcernsQuery['concerns'];
  concernId: string;
  concernType: '' | 'inactive' | 'active';
  suggestion?: FullCarePlanSuggestionFragment;
  onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => any;
  onDismiss: () => any;
  onSubmit: () => any;
}

const PopupPatientCarePlanSuggestionAcceptedModalBody = (props: IProps) => {
  const {
    carePlan,
    carePlanSuggestions,
    concerns,
    concernId,
    concernType,
    onChange,
    onDismiss,
    onSubmit,
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
      <div className={styles.acceptModalBody}>
        <div className={styles.acceptModalTitle}>Add as active or inactive concern?</div>
        <div className={styles.acceptModalDropdown}>
          <Select name="concernType" onChange={onChange} value={concernType}>
            <Option value="" disabled>
              Select a concern type
            </Option>
            <Option value="active">Active concern</Option>
            <Option value="inactive">Inactive concern</Option>
          </Select>
        </div>
        <div className={styles.acceptModalButtons}>
          <Button messageId="builder.cancel" small onClick={onDismiss} />
          <Button color="blue" small onClick={onSubmit} />>
        </div>
      </div>
    );
  } else if (isSuggestedGoal) {
    bodyHtml = (
      <div className={styles.acceptModalBody}>
        <div className={classNames(styles.acceptModalTitle, styles.noMargin)}>
          Add this goal to a concern
        </div>
        <div className={styles.acceptModalSubtitle}>
          Select an existing patient concern, a suggested concern, or create a new one
        </div>
        <div className={styles.acceptModalDropdown}>
          <Select name="concernId" onChange={onChange} value={concernId}>
            <Option value="" disabled>
              Select a concern
            </Option>
            <PatientCarePlanSuggestionOptionGroup
              optionType={'suggested'}
              carePlan={carePlan}
              carePlanSuggestions={carePlanSuggestions}
            />
            <PatientCarePlanSuggestionOptionGroup
              optionType={'active'}
              carePlan={carePlan}
              carePlanSuggestions={carePlanSuggestions}
            />
            <PatientCarePlanSuggestionOptionGroup
              optionType={'inactive'}
              carePlan={carePlan}
              carePlanSuggestions={carePlanSuggestions}
            />
            <PatientCarePlanSuggestionOptionGroup
              optionType={'other'}
              carePlan={carePlan}
              carePlanSuggestions={carePlanSuggestions}
              concerns={concerns}
            />
          </Select>
        </div>
        <div className={selectConcernTypeInputDivStyles}>
          <Select name="concernType" onChange={onChange} value={concernType}>
            <Option value="" disabled>
              Select a concern type
            </Option>
            <Option value="active">Active concern</Option>
            <Option value="inactive">Inactive concern</Option>
          </Select>
        </div>
        <div className={styles.acceptModalButtons}>
          <Button onClick={onDismiss} color="white" messageId="builder.cancel" />
          <Button onClick={onSubmit} messageId="patient.addToCarePlan" />
        </div>
      </div>
    );
  }

  return bodyHtml;
};

export default PopupPatientCarePlanSuggestionAcceptedModalBody;
