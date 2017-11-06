import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullProgressNoteTemplateFragment } from '../graphql/types';
import * as styles from './css/progress-note-popup.css';

interface IProps {
  patientId: string;
  progressNoteTemplates?: FullProgressNoteTemplateFragment[];
  onChange: (progressNoteTemplateId: string) => void;
}

class ProgressNoteContext extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onChange(event.currentTarget.value);
  }

  render() {
    const { progressNoteTemplates } = this.props;
    const options = (progressNoteTemplates || []).map(template => (
      <option key={template.id} value={template.id}>
        {template.title}
      </option>
    ));

    return (
      <div>
        <div className={styles.encounterTypeContainer}>
          <FormattedMessage id="patient.selectProgressNoteType">
            {(message: string) => <div className={styles.encounterTypeLabel}>{message}</div>}
          </FormattedMessage>
          <select onChange={this.onChange} className={styles.encounterTypeSelect}>
            <option value="" disabled hidden>
              Select an encounter type template
            </option>
            {options}
          </select>
        </div>
      </div>
    );
  }
}

export default ProgressNoteContext;
