import * as classNames from 'classnames';
import * as React from 'react';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import TextInput from '../shared/library/text-input/text-input';
import AgeRangeSelect, { IOptionType } from './age-range-select';
import CareWorkerSelect from './care-worker-select';
import * as styles from './css/patient-filter-panel.css';
import { FilterSelect } from './filter-select';

interface IProps {
  onCancelClick: () => any;
  isVisible: boolean | null;
}

interface IState {
  ageIndex: number | null;
  ageRange: IOptionType | {};
  gender: string | null;
  zipcode: string | null;
  inNetwork: string | null;
  careWorker: string | null;
}

const GENDER_OPTIONS = ['male', 'female', 'transgender', 'nonbinary'];

export default class PatientPanelContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      ageIndex: null,
      ageRange: {},
      gender: null,
      zipcode: null,
      inNetwork: null,
      careWorker: null,
    };
  }

  handleAgeRangeChange = (ageIndex: number | null, ageRange: IOptionType | {}) => {
    this.setState({ ageIndex, ageRange });
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({ [event.target.name as any]: event.target.value });
  };

  handleNetworkToggleChange = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    let fieldValue: any = target.value;

    if (this.state.inNetwork === fieldValue) {
      fieldValue = null;
    }

    this.setState({ inNetwork: fieldValue });
  };

  render() {
    const { onCancelClick, isVisible } = this.props;
    const { ageIndex, gender, zipcode, inNetwork, careWorker } = this.state;

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
              onClick={onCancelClick}
              className={styles.button}
            />
            <Button
              messageId="patientFilter.apply"
              onClick={() => {
                return;
              }}
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
              value={ageIndex}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.gender" />
            <FilterSelect
              name="gender"
              isLarge={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={gender}
              options={GENDER_OPTIONS}
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.location" />
            <TextInput
              name="zipcode"
              value={zipcode || ''}
              onChange={this.handleChange}
              placeholderMessageId="patientFiler.zipPlaceholder"
            />
          </div>

          <div className={styles.inputGroup}>
            <FormLabel messageId="patientFilter.careWorker" />
            <CareWorkerSelect
              isLarge={true}
              isUnselectable={true}
              onChange={this.handleChange}
              value={careWorker}
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
