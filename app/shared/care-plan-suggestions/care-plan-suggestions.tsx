import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { FullCarePlanSuggestionFragment } from '../../graphql/types';
import Button from '../library/button/button';
import { getConcernCount, getGoalCount, getTaskCount } from '../util/care-plan-count';
import * as styles from './care-plan-suggestions.css';

interface IProps {
  patientRoute: string;
  carePlanSuggestions: FullCarePlanSuggestionFragment[];
  titleMessageId: string;
  bodyMessageId: string;
  history: History;
  match: any;
  location: History.LocationState;
}

type allProps = IProps;

export class CarePlanSuggestions extends React.Component<allProps, {}> {
  onClick = () => {
    const { history, patientRoute } = this.props;
    history.push(`${patientRoute}/map/suggestions`);
  };

  render() {
    const { titleMessageId, bodyMessageId, carePlanSuggestions } = this.props;
    return (
      <div className={styles.content}>
        <div className={styles.body}>
          <FormattedMessage id={titleMessageId}>
            {(message: string) => <div className={styles.title}>{message}</div>}
          </FormattedMessage>
          <FormattedMessage id={bodyMessageId}>
            {(message: string) => (
              <div className={classNames(styles.subtitle, styles.noMargin)}>{message}</div>
            )}
          </FormattedMessage>
          <div className={styles.results}>
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>New Concerns</div>
              <div className={styles.resultCount}>{getConcernCount(carePlanSuggestions)}</div>
            </div>
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>New Goals</div>
              <div className={styles.resultCount}>{getGoalCount(carePlanSuggestions)}</div>
            </div>
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>New Tasks</div>
              <div className={styles.resultCount}>{getTaskCount(carePlanSuggestions)}</div>
            </div>
          </div>
          <div className={styles.buttons}>
            <Button messageId="carePlanSuggestions.seeSuggestions" onClick={this.onClick} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter<IProps>(CarePlanSuggestions);
