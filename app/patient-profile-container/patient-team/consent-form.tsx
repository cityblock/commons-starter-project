import React from 'react';
import { FormattedMessage } from 'react-intl';
import CheckboxGroup from '../../shared/library/checkbox-group/checkbox-group';
import CheckboxInput from '../../shared/library/checkbox-input/checkbox-input';
import FormLabel from '../../shared/library/form-label/form-label';
import formStyles from '../../shared/library/form/css/form.css';
import Select from '../../shared/library/select/select';
import styles from './css/consent-form.css';
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
      <React.Fragment>
        <p className={styles.description}>
          <FormattedMessage id="sharingConsent.partialExclusionDescriptionPt1">
            {(message: string) => message}
          </FormattedMessage>
          <FormattedMessage id="sharingConsent.partialExclusionDescriptionHighlighted">
            {(highlightedMessage: string) => (
              <span className={styles.highlightedText}>{highlightedMessage}</span>
            )}
          </FormattedMessage>
          <FormattedMessage id="sharingConsent.partialExclusionDescriptionPt2">
            {(message2: string) => message2}
          </FormattedMessage>
        </p>
        <CheckboxGroup
          name="consentSettings"
          hasError={(hasFieldError || {}).consentSettings}
          errorMessageId="sharingConsent.fieldEmptyError"
        >
          {Object.keys(consentSettings).map(settingName => (
            <CheckboxInput
              inputId={`consentCheckbox-${settingName}`}
              key={`consentCheckbox-${settingName}`}
              value={settingName}
              checked={!(consentSettings as any)[settingName]}
              onChange={onCheckChange}
              labelMessageId={`sharingConsent.${settingName}`}
              color="red"
            />
          ))}
        </CheckboxGroup>
      </React.Fragment>
    ) : null;

  return (
    <React.Fragment>
      <div className={formStyles.field}>
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
