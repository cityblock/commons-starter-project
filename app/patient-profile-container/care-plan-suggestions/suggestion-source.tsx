import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullCarePlanSuggestionForPatientFragment } from '../../graphql/types';
import * as styles from './css/suggestion-source.css';

interface IProps {
  suggestion: FullCarePlanSuggestionForPatientFragment;
}

const SuggestionSource: React.StatelessComponent<IProps> = ({ suggestion }) => {
  let title = '';
  let messageId = '';

  if (suggestion.screeningTool) {
    title = suggestion.screeningTool.title;
    messageId = 'carePlanSuggestion.tool';
  } else if (suggestion.computedField) {
    title = suggestion.computedField.riskArea.title;
    messageId = 'carePlanSuggestion.computedField';
  } else if (suggestion.riskArea) {
    title = suggestion.riskArea.title;
    messageId = 'carePlanSuggestion.domainAssessment';
  }

  const containerStyles = classNames(styles.container, {
    [styles.blackBorder]: !!suggestion.computedField,
    [styles.lightBlueBorder]: !!suggestion.screeningTool,
  });

  return (
    <div className={containerStyles}>
      <FormattedMessage id={messageId}>
        {(message: string) => <p>{`${title} ${message}`}</p>}
      </FormattedMessage>
    </div>
  );
};

export default SuggestionSource;
