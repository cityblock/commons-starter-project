import React from 'react';
import CheckboxGroup from '../../shared/library/checkbox-group/checkbox-group';
import CheckboxInput from '../../shared/library/checkbox-input/checkbox-input';
import FormLabel from '../../shared/library/form-label/form-label';
import styles from '../../shared/library/form/css/form.css';
import Select from '../../shared/library/select/select';
import { ConsentLevel, IConsentSettings } from './helpers/consent-helpers';

interface IProps {
  consentSettings: IConsentSettings;
  consentSelectState: ConsentLevel | null;
  onCheckChange: (e?: any) => void;
  onSelectChange: (e?: any) => void;
  hasFieldError: { [key: string]: boolean };
}

export const ConsentForm: React.StatelessComponent<IProps> = props => {
  const {
    onCheckChange,
    onSelectChange,
    consentSelectState,
    consentSettings,
    hasFieldError,
  } = props;

  const partialConsentField =
    consentSelectState === 'partialConsent' ? (
      <CheckboxGroup
        name="consentSettings"
        hasError={(hasFieldError || {}).consentSettings}
        errorMessageId="sharingConsent.fieldEmptyError"
      >
        {Object.keys(consentSettings).map(settingName => (
          <CheckboxInput
            key={`consentCheckbox-${settingName}`}
            value={settingName}
            checked={!!(consentSettings as any)[settingName]}
            onChange={onCheckChange}
            labelMessageId={`sharingConsent.${settingName}`}
          />
        ))}
      </CheckboxGroup>
    ) : null;

  return (
    <React.Fragment>
      <div className={styles.field}>
        <FormLabel messageId="sharingConsent.consentSelectLabel" />
        <Select
          name="consentSelectState"
          value={consentSelectState || 'noConsent'}
          onChange={onSelectChange}
          large={true}
          options={['fullConsent', 'partialConsent', 'noConsent']}
        />
      </div>
      {partialConsentField}
    </React.Fragment>
  );
};

export default ConsentForm;
