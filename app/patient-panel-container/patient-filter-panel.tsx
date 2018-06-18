import classNames from 'classnames';
import { values } from 'lodash';
import React from 'react';
import { CurrentPatientState, Gender, PatientFilterOptions } from '../graphql/types';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import AgeRangeSelect, { formatAgeValue } from './age-range-select';
import CareWorkerSelect from './care-worker-select';
import styles from './css/patient-filter-panel.css';

interface IProps extends IInjectedProps {
  onClickApply: (filters: PatientFilterOptions) => any;
  onClickCancel: () => void;
  onChange: (filter: PatientFilterOptions) => any;
  filters: PatientFilterOptions;
  isVisible: boolean | null;
}

export class PatientFilterPanel extends React.Component<IProps> {
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

  handleApplyClick = () => {
    const { gender, ageMin, ageMax, zip, careWorkerId, patientState } = this.props.filters;
    this.props.onClickApply({
      gender,
      ageMin,
      ageMax,
      zip,
      careWorkerId,
      patientState,
    });
  };

  handleClearAllClick = () => {
    this.props.onClickApply({});
  };

  render() {
    const { isVisible, filters, onClickCancel } = this.props;
    const { gender, zip, careWorkerId, ageMin, ageMax, patientState } = filters;

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
              onClick={onClickCancel}
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
            <Button
              fullWidth={true}
              color="white"
              label="Clear Filters"
              onClick={this.handleClearAllClick}
            />
          </div>

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
              hasPlaceholder={true}
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
              value={careWorkerId || null}
            />
          </div>

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
        </div>
      </div>
    );
  }
}

export default withCurrentUser()(PatientFilterPanel);
