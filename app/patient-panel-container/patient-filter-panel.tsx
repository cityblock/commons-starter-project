import * as classNames from 'classnames';
import { values } from 'lodash';
import * as React from 'react';
import { CurrentPatientState, Gender, PatientFilterOptions } from '../graphql/types';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import AgeRangeSelect, { formatAgeValue } from './age-range-select';
import CareWorkerSelect from './care-worker-select';
import * as styles from './css/patient-filter-panel.css';

interface IProps extends IInjectedProps {
  onClick: (filters: PatientFilterOptions) => any;
  onChange: (filter: PatientFilterOptions) => any;
  filters: PatientFilterOptions;
  isVisible: boolean | null;
}

interface IState {
  inNetwork: string;
}

export class PatientFilterPanel extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      inNetwork: 'false',
    };
  }

  handleAgeRangeChange = (options: PatientFilterOptions) => {
    this.props.onChange(options);
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.props.onChange({ [event.target.name as any]: event.target.value });
  };

  handleBooleanValueChange = (event: React.MouseEvent<HTMLInputElement>) => {
    let value = true;
    const target = event.target as HTMLInputElement;

    if (target.value === 'false') {
      value = false;
    }

    this.props.onChange({ [target.name as any]: value });
  };

  handleNetworkToggleChange = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    let fieldValue: any = target.value;

    if (this.state.inNetwork === fieldValue) {
      fieldValue = null;
    }

    this.setState({ inNetwork: fieldValue });
  };

  handleApplyClick = () => {
    const {
      gender,
      ageMin,
      ageMax,
      zip,
      careWorkerId,
      patientState,
      showAllPatients,
    } = this.props.filters;
    this.props.onClick({
      gender,
      ageMin,
      ageMax,
      zip,
      careWorkerId,
      patientState,
      showAllPatients,
    });
  };

  handleCancelClick = () => {
    this.props.onClick({});
  };

  render() {
    const { isVisible, filters, featureFlags } = this.props;
    const { gender, zip, careWorkerId, ageMin, ageMax, patientState, showAllPatients } = filters;
    const { inNetwork } = this.state;

    return (
      <div
        className={classNames(styles.container, {
          [styles.visible]: !!isVisible,
          [styles.hidden]: isVisible === false,
        })}
      >
        <div className={styles.header}>
          <FormLabel messageId="patientFilter.title" />
          <div className={styles.buttonContainer}>
            <Button
              messageId="patientFilter.cancel"
              color="white"
              onClick={this.handleCancelClick}
              className={styles.button}
            />
            <Button
              messageId="patientFilter.apply"
              onClick={this.handleApplyClick}
              className={styles.button}
            />
          </div>
        </div>
        <div className={styles.fields}>
          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.age" />
            <AgeRangeSelect
              isLarge={true}
              isUnselectable={true}
              onChange={this.handleAgeRangeChange}
              value={formatAgeValue(ageMin || null, ageMax || null)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.gender" />
            <Select
              name="gender"
              large={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={gender || ''}
              options={values(Gender)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.zip" />
            <TextInput
              name="zip"
              value={zip || ''}
              onChange={this.handleChange}
              placeholderMessageId="patientFiler.zipPlaceholder"
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.careWorkerId" />
            <CareWorkerSelect
              isLarge={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={careWorkerId}
            />
          </div>
          {featureFlags.canShowAllMembersInPatientPanel && (
            <div className={styles.inputGroup}>
              <FormLabel messageId="patientFilter.showAllPatients" />
              <RadioGroup>
                <RadioInput
                  name="showAllPatients"
                  value="true"
                  checked={showAllPatients === true}
                  label="No"
                  onClick={this.handleBooleanValueChange}
                />
                <RadioInput
                  name="showAllPatients"
                  value="false"
                  checked={showAllPatients === false}
                  label="Yes"
                  onClick={this.handleBooleanValueChange}
                />
              </RadioGroup>
            </div>
          )}

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.patientStatus" />
            <Select
              name="patientState"
              large={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={patientState || ''}
              options={values(CurrentPatientState)}
              hasPlaceholder={true}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.insurance" />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.inNetwork" />
            <RadioGroup>
              <RadioInput
                name="inNetwork"
                value="false"
                checked={inNetwork === 'false'}
                label="No"
                onClick={this.handleNetworkToggleChange}
                readOnly={true}
              />
              <RadioInput
                name="inNetwork"
                value="true"
                checked={inNetwork === 'true'}
                label="Yes"
                onClick={this.handleNetworkToggleChange}
              />
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default withCurrentUser()(PatientFilterPanel);
