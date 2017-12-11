import * as React from 'react';
import Button from '../shared/library/button/button';
import Icon from '../shared/library/icon/icon';
import TextInput from '../shared/library/text-input/text-input';
import * as styles from './css/input.css';

interface IProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

class PatientSearchInput extends React.Component<IProps, {}> {
  onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      this.props.onSearch();
    }
  };

  render(): JSX.Element {
    const { searchTerm, onChange, onSearch } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.input}>
          <TextInput
            value={searchTerm}
            onChange={onChange}
            onKeyDown={this.onEnterPress}
            className={styles.textInput}
            placeholderMessageId="patientSearch.placeholder"
          />
          <div className={styles.iconContainer}>
            <Icon name="search" className={styles.icon} />
          </div>
        </div>
        <Button onClick={onSearch} className={styles.button} messageId="patientSearch.search" />
      </div>
    );
  }
}

export default PatientSearchInput;
