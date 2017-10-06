import * as classNames from 'classnames';
import * as React from 'react';
import { ICarePlan } from 'schema';
import { FullCarePlanSuggestionFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/patient-care-plan.css';
import PatientCarePlanSuggestionOptionGroup from './patient-care-plan-suggestion-option-group';

interface IProps {
  carePlan?: ICarePlan;
  carePlanSuggestions?: FullCarePlanSuggestionFragment[];
  concernId: string;
  concernType: '' | 'inactive' | 'active';
  newConcernTitle: string;
  suggestion?: FullCarePlanSuggestionFragment;
  onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => any;
  onDismiss: () => any;
  onSubmit: () => any;
}

const PopupPatientCarePlanSuggestionAcceptedModalBody = (props: IProps) => {
  const {
    carePlan,
    carePlanSuggestions,
    concernId,
    concernType,
    newConcernTitle,
    onChange,
    onDismiss,
    onSubmit,
    suggestion,
  } = props;

  const isSuggestedConcern = !!suggestion && suggestion.suggestionType === 'concern';
  const isSuggestedGoal = !!suggestion && suggestion.suggestionType === 'goal';

  let suggestedConcernSelected: boolean = false;

  if (concernId && carePlanSuggestions) {
    const suggestedConcern = carePlanSuggestions
      .find(carePlanSuggestion =>
        !!carePlanSuggestion.concernId && carePlanSuggestion.concernId === concernId,
      );

    if (suggestedConcern) {
      suggestedConcernSelected = true;
    }
  }

  const cancelButtonStyles = classNames(
    styles.invertedButton,
    styles.rightSmallGutter,
    styles.smallButton,
  );
  const createConcernInputStyles = classNames(formStyles.input, styles.roundedInput);
  const createConcernInputDivStyles = classNames(styles.acceptModalInput, {
    [styles.hidden]: isSuggestedConcern || concernId !== 'new-concern',
  });
  const selectConcernTypeInputDivStyles = classNames(styles.acceptModalInput, {
    [styles.hidden]: isSuggestedConcern ||
      (concernId !== 'new-concern' && !suggestedConcernSelected),
  });

  const addButtonStyles = classNames(styles.button, styles.smallButton);

  let bodyHtml: JSX.Element | null = null;

  if (isSuggestedConcern) {
    bodyHtml = (
      <div className={styles.acceptModalBody}>
        <div className={styles.acceptModalTitle}>Add as active or inactive concern?</div>
        <div className={styles.acceptModalDropdown}>
          <select
            name='concernType'
            className={classNames(formStyles.select, styles.roundedInput)}
            onChange={onChange}
            value={concernType}>
            <option value='' disabled hidden>Select a concern type</option>
            <option value='active'>Active concern</option>
            <option value='inactive'>Inactive concern</option>
          </select>
        </div>
        <div className={styles.acceptModalButtons}>
          <div className={cancelButtonStyles} onClick={onDismiss}>Cancel</div>
          <div className={addButtonStyles} onClick={onSubmit}>Add to Care Plan</div>
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
          <select
            name='concernId'
            className={classNames(formStyles.select, styles.roundedInput)}
            onChange={onChange}
            value={concernId}>
            <option value='' disabled hidden>Select a concern</option>
            <optgroup label='New concern'>
              <option value='new-concern'>Add a new concern</option>
            </optgroup>
            <PatientCarePlanSuggestionOptionGroup
              optionType={'suggested'}
              carePlan={carePlan}
              carePlanSuggestions={carePlanSuggestions} />
            <PatientCarePlanSuggestionOptionGroup
              optionType={'active'}
              carePlan={carePlan}
              carePlanSuggestions={carePlanSuggestions} />
            <PatientCarePlanSuggestionOptionGroup
              optionType={'inactive'}
              carePlan={carePlan}
              carePlanSuggestions={carePlanSuggestions} />
          </select>
        </div>
        <div className={createConcernInputDivStyles}>
          <input
            name='newConcernTitle'
            className={createConcernInputStyles}
            type='text'
            onChange={onChange}
            placeholder='Enter concern title'
            value={newConcernTitle} />
        </div>
        <div className={selectConcernTypeInputDivStyles}>
          <select
            name='concernType'
            className={classNames(formStyles.select, styles.roundedInput)}
            onChange={onChange}
            value={concernType}>
            <option value='' disabled hidden>Select a concern type</option>
            <option value='active'>Active concern</option>
            <option value='inactive'>Inactive concern</option>
          </select>
        </div>
        <div className={styles.acceptModalButtons}>
          <div className={cancelButtonStyles} onClick={onDismiss}>Cancel</div>
          <div className={addButtonStyles} onClick={onSubmit}>Add to Care Plan</div>
        </div>
      </div>
    );
  }

  return bodyHtml;
};

export default PopupPatientCarePlanSuggestionAcceptedModalBody;
