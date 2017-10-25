import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as formStyles from '../css/forms.css';
import PopupConsent from '../popup-consent';
import { FormField, IUpdatedField } from '../util/updated-fields';

interface IProps {
  fields: { [field: string]: FormField };
  onFieldUpdate: (updatedField: IUpdatedField) => any;
}

export interface IState {
  email: FormField;
  homePhone: FormField;
  mobilePhone: FormField;
  consentToText: FormField;
  consentToCall: FormField;
  displayConsentToPhoneTextPopup: boolean;
}

export default class PatientContactForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.showPhoneConsent = this.showPhoneConsent.bind(this);
    this.hidePhoneConsent = this.hidePhoneConsent.bind(this);

    const { fields } = props;

    this.state = {
      email: fields.email,
      homePhone: fields.homePhone,
      mobilePhone: fields.mobilePhone,
      consentToText: fields.consentToText,
      consentToCall: fields.consentToCall,
      displayConsentToPhoneTextPopup: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { fields } = nextProps;

    this.setState(() => ({
      email: fields.email,
      homePhone: fields.homePhone,
      mobilePhone: fields.mobilePhone,
      consentToCall: fields.consentToCall,
      consentToText: fields.consentToText,
    }));
  }

  showPhoneConsent() {
    this.setState({ displayConsentToPhoneTextPopup: true });
  }

  hidePhoneConsent() {
    this.setState({ displayConsentToPhoneTextPopup: false });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { onFieldUpdate } = this.props;

    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState(() => ({ [fieldName]: fieldValue }));

    onFieldUpdate({ fieldName, fieldValue });
  }

  render() {
    const {
      email,
      homePhone,
      mobilePhone,
      displayConsentToPhoneTextPopup,
      consentToCall,
      consentToText,
    } = this.state;

    return (
      <div>
        <PopupConsent onClose={this.hidePhoneConsent} visible={displayConsentToPhoneTextPopup} />
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>
              <FormattedMessage id="contactForm.email">
                {(message: string) => <span>{message}</span>}
              </FormattedMessage>
              <FormattedMessage id="forms.optional">
                {(message: string) => <span className={formStyles.optionalLabel}>{message}</span>}
              </FormattedMessage>
            </div>
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id="contactForm.homePhone">
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <input
              name="homePhone"
              type="text"
              pattern="[0-9]{10}"
              value={homePhone}
              className={formStyles.input}
              onChange={this.onChange}
            />
          </div>
          <div className={formStyles.inputGroup}>
            <FormattedMessage id="contactForm.mobilePhone">
              {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
            </FormattedMessage>
            <input
              name="mobilePhone"
              type="text"
              pattern="[0-9]{10}"
              value={mobilePhone}
              onChange={this.onChange}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.radioInputFormRow}>
          <div className={formStyles.radioGroup}>
            <div className={formStyles.radioGroupLabel}>
              <FormattedMessage id="contactForm.consentToText">
                {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
              </FormattedMessage>
              <div className={formStyles.smallText}>
                <FormattedMessage id="contactForm.readConsentStatement">
                  {(message: string) => <span>{message} </span>}
                </FormattedMessage>
                <FormattedMessage id="forms.clickHere">
                  {(message: string) => <a onClick={this.showPhoneConsent}>{message}</a>}
                </FormattedMessage>
              </div>
            </div>
            <div className={formStyles.radioGroupOptions}>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type="radio"
                    name="consentToText"
                    onChange={this.onChange}
                    checked={consentToText === 'true'}
                    value="true"
                  />
                  <label />
                </div>
                <FormattedMessage id="forms.yes">
                  {(message: string) => <span className={formStyles.radioLabel}>{message}</span>}
                </FormattedMessage>
              </div>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type="radio"
                    name="consentToText"
                    onChange={this.onChange}
                    checked={consentToText === 'false'}
                    value="false"
                  />
                  <label />
                </div>
                <FormattedMessage id="forms.no">
                  {(message: string) => <span className={formStyles.radioLabel}>{message}</span>}
                </FormattedMessage>
              </div>
            </div>
          </div>
        </div>
        <div className={formStyles.radioInputFormRow}>
          <div className={formStyles.radioGroup}>
            <div className={formStyles.radioGroupLabel}>
              <FormattedMessage id="contactForm.consentToPhone">
                {(message: string) => <div className={formStyles.inputLabel}>{message}</div>}
              </FormattedMessage>
              <div className={formStyles.smallText}>
                <FormattedMessage id="contactForm.readConsentStatement">
                  {(message: string) => <span>{message} </span>}
                </FormattedMessage>
                <FormattedMessage id="forms.clickHere">
                  {(message: string) => <a onClick={this.showPhoneConsent}>{message}</a>}
                </FormattedMessage>
              </div>
            </div>
            <div className={formStyles.radioGroupOptions}>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type="radio"
                    name="consentToCall"
                    onChange={this.onChange}
                    checked={consentToCall === 'true'}
                    value="true"
                  />
                  <label />
                </div>
                <FormattedMessage id="forms.yes">
                  {(message: string) => <span className={formStyles.radioLabel}>{message}</span>}
                </FormattedMessage>
              </div>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type="radio"
                    name="consentToCall"
                    onChange={this.onChange}
                    checked={consentToCall === 'false'}
                    value="false"
                  />
                  <label />
                </div>
                <FormattedMessage id="forms.no">
                  {(message: string) => <span className={formStyles.radioLabel}>{message}</span>}
                </FormattedMessage>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
