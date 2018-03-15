import { uniq } from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { PatientFilterOptions } from '../graphql/types';
import * as styles from './css/patient-panel-header.css';

interface IProps {
  filters: PatientFilterOptions;
  totalResults: number | null;
}

const FILTER_MESSAGE_IDS = {
  gender: 'patientFilter.gender',
  ageMin: 'patientFilter.age',
  ageMax: 'patientFilter.age',
  zip: 'patientFilter.zip',
  careWorkerId: 'patientFilter.careWorkerId',
  patientState: 'patientFilter.patientStatus',
  showAllPatients: 'patientFilter.showAllPatients',
} as any;

class PatientPanelHeader extends React.Component<IProps> {
  renderFilterNames() {
    const { filters } = this.props;
    const filterNames = uniq(Object.keys(filters).map(filter => FILTER_MESSAGE_IDS[filter]));

    return filterNames.map((name, index) => {
      return (
        <FormattedMessage id={name} key={`filter-${name}`}>
          {(message: string) => {
            const messageString = index ? `, ${message}` : message;
            return <span>{messageString}</span>;
          }}
        </FormattedMessage>
      );
    });
  }

  render(): JSX.Element {
    const { filters, totalResults } = this.props;
    const numberFilters = Object.keys(filters).length;
    const titleId = numberFilters ? 'patientPanel.filteredTitle' : 'patientPanel.title';

    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <FormattedMessage id={titleId}>
            {(message: string) => <h2>{message}</h2>}
          </FormattedMessage>
          <h2 className={styles.lightBlue}>{totalResults || 0}</h2>
        </div>
        {!numberFilters && (
          <FormattedMessage id="patientPanel.description">
            {(message: string) => <div className={styles.description}>{message}</div>}
          </FormattedMessage>
        )}
        {!!numberFilters && (
          <FormattedMessage id="patientPanel.filteredBy">
            {(message: string) => (
              <div className={styles.description}>
                {message}: {this.renderFilterNames()}
              </div>
            )}
          </FormattedMessage>
        )}
      </div>
    );
  }
}

export default PatientPanelHeader;
