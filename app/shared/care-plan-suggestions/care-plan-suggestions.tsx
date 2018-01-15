import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { FullCarePlanSuggestionFragment } from '../../graphql/types';
import Button from '../library/button/button';
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
  getConcernCount = () => {
    const { carePlanSuggestions } = this.props;

    if (!carePlanSuggestions.length) {
      return 0;
    }

    const concernSuggestions = carePlanSuggestions.filter(
      suggestion => suggestion!.suggestionType === 'concern',
    );

    return concernSuggestions.length;
  };

  getGoalSuggestions = () => {
    const { carePlanSuggestions } = this.props;
    if (!carePlanSuggestions.length) {
      return [];
    }

    return carePlanSuggestions.filter(suggestion => suggestion!.suggestionType === 'goal');
  };

  getGoalCount = () => this.getGoalSuggestions().length;

  getTaskCount = () => {
    if (this.getGoalCount() === 0) {
      return 0;
    }

    const goalSuggestions = this.getGoalSuggestions();

    const taskSuggestions = goalSuggestions
      .map(goalSuggestion => goalSuggestion!.goalSuggestionTemplate!.taskTemplates)
      .reduce((taskSuggestions1, taskSuggestions2) => taskSuggestions1!.concat(taskSuggestions2));

    return (taskSuggestions || []).length;
  };

  onClick = () => {
    const { history, patientRoute } = this.props;
    history.push(`${patientRoute}/map/suggestions`);
  };

  render() {
    const { titleMessageId, bodyMessageId } = this.props;
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
              <div className={styles.resultCount}>{this.getConcernCount()}</div>
            </div>
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>New Goals</div>
              <div className={styles.resultCount}>{this.getGoalCount()}</div>
            </div>
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>New Tasks</div>
              <div className={styles.resultCount}>{this.getTaskCount()}</div>
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
