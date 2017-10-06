import * as classNames from 'classnames';
import * as React from 'react';
import { FullCarePlanSuggestionFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/patient-care-plan.css';

interface IProps {
  suggestion?: FullCarePlanSuggestionFragment;
  dismissedReason: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
  onDismiss: () => any;
  onSubmit: () => any;
}

const PopupPatientCarePlanSuggestionDismissedModalBody = (props: IProps) => {
  const { dismissedReason, onChange, onDismiss, onSubmit, suggestion } = props;

  const cancelButtonStyles = classNames(
    styles.invertedButton,
    styles.rightSmallGutter,
    styles.smallButton,
  );
  const addButtonStyles = classNames(styles.button, styles.smallButton, styles.redButton);
  const dismissDisplayText = suggestion ? suggestion.suggestionType : '';

  return (
    <div className={styles.acceptModalBody}>
      <div className={classNames(styles.acceptModalTitle, styles.noMargin)}>
        Reason for dismissing this suggestion
      </div>
      <div className={styles.acceptModalSubtitle}>
        Select from one of the available options
      </div>
      <div className={styles.acceptModalDropdown}>
        <select
          name='dismissedReason'
          className={classNames(formStyles.select, styles.roundedInput)}
          onChange={onChange}
          value={dismissedReason}>
          <option value='' disabled hidden>Select a reason</option>
          <option value='not applicable'>Not applicable to this patient</option>
          <option value='too much work'>This suggestion requires too much work</option>
          <option value='dangerous'>
            Tackling this suggestion would be dangerous for the patient
          </option>
        </select>
      </div>
      <div className={styles.acceptModalButtons}>
        <div className={cancelButtonStyles} onClick={onDismiss}>Cancel</div>
        <div className={addButtonStyles} onClick={onSubmit}>
          {`Dismiss ${dismissDisplayText}`}
        </div>
      </div>
    </div>
  );
};

export default PopupPatientCarePlanSuggestionDismissedModalBody;
