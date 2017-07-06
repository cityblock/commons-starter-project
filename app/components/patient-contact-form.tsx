import * as React from 'react';
import PopupConsent from '../components/popup-consent';
import * as formStyles from '../css/shared/forms.css';

export type FormField = string | undefined;

export interface IUpdatedField {
  fieldName: string;
  fieldValue: FormField;
}

export interface IProps {
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

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
        <PopupConsent
          onClose={this.hidePhoneConsent}
          visible={displayConsentToPhoneTextPopup}
        />
        <div className={formStyles.multiInputFormRow}>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>
              Email Address
              <span className={formStyles.optionalLabel}>optional</span>
            </div>
            <input
              name='email'
              value={email}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Home Phone Number</div>
            <input
              name='homePhone'
              type='text'
              pattern='[0-9]{10}'
              value={homePhone}
              className={formStyles.input}
              onChange={this.onChange} />
          </div>
          <div className={formStyles.inputGroup}>
            <div className={formStyles.inputLabel}>Mobile Phone Number</div>
            <input
              name='mobilePhone'
              type='text'
              pattern='[0-9]{10}'
              value={mobilePhone}
              onChange={this.onChange}
              className={formStyles.input} />
          </div>
        </div>
        <div className={formStyles.radioInputFormRow}>
          <div className={formStyles.radioGroup}>
            <div className={formStyles.radioGroupLabel}>
              <div className={formStyles.inputLabel}>
                Does the patient consent to being contacted via text?
              </div>
              <div className={formStyles.smallText}>
                <span>Read consent statement to patient: </span>
                <a onClick={this.showPhoneConsent}>click here</a>
              </div>
            </div>
            <div className={formStyles.radioGroupOptions}>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type='radio'
                    name='consentToText'
                    onChange={this.onChange}
                    checked={consentToText === 'true'}
                    value='true' />
                  <label />
                </div>
                <span className={formStyles.radioLabel}>Yes</span>
              </div>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type='radio'
                    name='consentToText'
                    onChange={this.onChange}
                    checked={consentToText === 'false'}
                    value='false' />
                  <label />
                </div>
                <span className={formStyles.radioLabel}>No</span>
              </div>
            </div>
          </div>
        </div>
        <div className={formStyles.radioInputFormRow}>
          <div className={formStyles.radioGroup}>
            <div className={formStyles.radioGroupLabel}>
              <div className={formStyles.inputLabel}>
                Does the patient consent to being contacted via phone?
              </div>
              <div className={formStyles.smallText}>
                <span>Read consent statement to patient: </span>
                <a onClick={this.showPhoneConsent}>click here</a>
              </div>
            </div>
            <div className={formStyles.radioGroupOptions}>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type='radio'
                    name='consentToCall'
                    onChange={this.onChange}
                    checked={consentToCall === 'true'}
                    value='true' />
                  <label />
                </div>
                <span className={formStyles.radioLabel}>Yes</span>
              </div>
              <div className={formStyles.radioGroupItem}>
                <div className={formStyles.radioGroupContainer}>
                  <input
                    className={formStyles.radio}
                    type='radio'
                    name='consentToCall'
                    onChange={this.onChange}
                    checked={consentToCall === 'false'}
                    value='false' />
                  <label />
                </div>
                <span className={formStyles.radioLabel}>No</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
