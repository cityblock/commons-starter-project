import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormLabel from '../../library/form-label/form-label';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../library/modal-header/modal-header';
import Search, { SearchOptions } from '../../library/search/search';
import * as styles from './css/create-goal.css';

interface IProps {
  title: string;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplates: SearchOptions;
  onSubmit: () => void;
  closePopup: () => void;
  toggleShowAllGoals: () => void;
  hideSearchResults: boolean;
  showAllGoals: boolean;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGoalSuggestionTemplateClick: (
    goalSuggestionTemplateId: string,
    goalSuggestionTemplateTitle: string,
  ) => void;
}

const DefineGoal: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    hideSearchResults,
    title,
    goalSuggestionTemplates,
    toggleShowAllGoals,
    showAllGoals,
    closePopup,
    onTitleChange,
    onGoalSuggestionTemplateClick,
    onSubmit,
  } = props;

  return (
    <div>
      <ModalHeader
        titleMessageId="goalCreate.addGoal"
        bodyMessageId="goalCreate.detail"
        closePopup={closePopup}
      />
      <div className={styles.fields}>
        <div className={styles.header}>
          <FormLabel messageId="goalCreate.selectLabel" topPadding={true} />
          <div onClick={toggleShowAllGoals} className={styles.showAll}>
            <FormattedMessage id={showAllGoals ? 'goalCreate.hideAll' : 'goalCreate.showAll'}>
              {(message: string) => <p>{message}</p>}
            </FormattedMessage>
          </div>
        </div>
        <Search
          value={title}
          onChange={onTitleChange}
          searchOptions={goalSuggestionTemplates}
          onOptionClick={onGoalSuggestionTemplateClick}
          showAll={showAllGoals}
          hideResults={hideSearchResults}
          placeholderMessageId="goalCreate.search"
          emptyPlaceholderMessageId="goalCreate.noResults"
        />
        <ModalButtons
          cancelMessageId="goalCreate.cancel"
          submitMessageId="goalCreate.submit"
          cancel={closePopup}
          submit={onSubmit}
          className={styles.buttons}
        />
      </div>
    </div>
  );
};

export default DefineGoal;
