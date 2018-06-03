import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import {
  FullCarePlanSuggestionFragment,
  FullPatientScreeningToolSubmissionFragment,
} from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import TextInfo from '../../shared/library/text-info/text-info';
import { getConcernCount, getGoalCount, getTaskCount } from '../util/care-plan-count';
import * as styles from './css/progress-note-activity.css';

interface IProps {
  screeningToolSubmission: FullPatientScreeningToolSubmissionFragment;
  expanded: boolean;
}

interface IState {
  summaryExpanded: boolean;
}

class ProgressNoteActivityScreeningToolSubmission extends React.Component<IProps, IState> {
  state = { summaryExpanded: false };

  onClick = () => {
    const { summaryExpanded } = this.state;

    this.setState({ summaryExpanded: !summaryExpanded });
  };

  getCarePlanSuggestionsHtml(carePlanSuggestions: FullCarePlanSuggestionFragment[]) {
    const concernCount = getConcernCount(carePlanSuggestions);
    const taskCount = getTaskCount(carePlanSuggestions);
    const goalCount = getGoalCount(carePlanSuggestions);
    return (
      <div className={styles.carePlanSuggestionsList}>
        <div className={styles.carePlanUpdateCountRow}>
          <TextInfo
            messageColor="gray"
            messageId="progressNote.newConcerns"
            text={concernCount.toString()}
            size="medium"
          />
        </div>
        <div className={styles.carePlanUpdateCountRow}>
          <TextInfo
            messageId="progressNote.newGoals"
            text={goalCount.toString()}
            size="medium"
            messageColor="gray"
          />
        </div>
        <div className={styles.carePlanUpdateCountRow}>
          <TextInfo
            messageId="progressNote.newTasks"
            text={taskCount.toString()}
            size="medium"
            messageColor="gray"
          />
        </div>
      </div>
    );
  }

  render() {
    const { screeningToolSubmission, expanded } = this.props;
    const { summaryExpanded } = this.state;

    const subSectionStyles = classNames(styles.activitySection, styles.quickCallSection, {
      [styles.expanded]: expanded,
    });
    const subLevelStyles = classNames(styles.sectionSubLevel, {
      [styles.expanded]: summaryExpanded,
    });
    const carePlanSuggestions = this.getCarePlanSuggestionsHtml(
      screeningToolSubmission.carePlanSuggestions,
    );

    return (
      <div className={subSectionStyles}>
        <div className={subLevelStyles} onClick={this.onClick}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleText}>
              {screeningToolSubmission.screeningTool && screeningToolSubmission.screeningTool.title}
            </div>
          </div>
          <Icon name="expandArrow" className={styles.subSectionArrow} />
        </div>
        <div className={styles.quickCallSummary}>
          <div className={styles.carePlanSuggestionsList}>
            <FormattedMessage id="progressNote.screeningToolResults">
              {(message: string) => (
                <div className={styles.sectionTitle}>
                  {message} {screeningToolSubmission.score}
                </div>
              )}
            </FormattedMessage>
            <FormattedDate value={screeningToolSubmission.createdAt} />
          </div>
          <div className={styles.carePlanSuggestions}>
            <SmallText messageId="progressNote.mapSuggestions" />
            {carePlanSuggestions}
          </div>
        </div>
      </div>
    );
  }
}

export default ProgressNoteActivityScreeningToolSubmission;
