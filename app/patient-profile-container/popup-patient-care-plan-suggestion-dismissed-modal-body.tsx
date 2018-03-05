import * as classNames from 'classnames';
import * as React from 'react';
import { FullCarePlanSuggestionFragment } from '../graphql/types';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
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

  const dismissDisplayText = suggestion ? suggestion.suggestionType : '';
  return (
    <div className={styles.acceptModalBody}>
      <div className={classNames(styles.acceptModalTitle, styles.noMargin)}>
        Reason for dismissing this suggestion
      </div>
      <div className={styles.acceptModalSubtitle}>Select from one of the available options</div>
      <div className={styles.acceptModalDropdown}>
        <Select name="dismissedReason" onChange={onChange} value={dismissedReason}>
          <Option value="" disabled label="Select a reason" />
          <Option value="not applicable" label="Not applicable to this patient" />
          <Option value="too much work" label="This suggestion requires too much work" />
          <Option
            value="dangerous"
            label="Tackling this suggestion would be dangerous for the patient"
          />
        </Select>
      </div>
      <div className={styles.acceptModalButtons}>
        <Button messageId="builder.cancel" small color="white" onClick={onDismiss} />
        <Button label={`Dismiss ${dismissDisplayText}`} small onClick={onSubmit} />
      </div>
    </div>
  );
};

export default PopupPatientCarePlanSuggestionDismissedModalBody;
