import React from 'react';
import { FullGoalSuggestionTemplateFragment } from '../../../graphql/types';
import FormLabel from '../../library/form-label/form-label';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../library/modal-header/modal-header';
import styles from './css/create-goal.css';
import SuggestedTask from './suggested-task';

interface IProps {
  onGoBack: () => void;
  onSubmit: () => void;
  closePopup: () => void;
  onTaskTemplateClick: (templateId: string) => void;
  goalSuggestionTemplate: FullGoalSuggestionTemplateFragment | null;
  rejectedTaskTemplateIds: string[];
}

const SuggestedTasks: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    onGoBack,
    onSubmit,
    closePopup,
    goalSuggestionTemplate,
    rejectedTaskTemplateIds,
    onTaskTemplateClick,
  } = props;

  const suggestedTasks =
    goalSuggestionTemplate && goalSuggestionTemplate.taskTemplates
      ? goalSuggestionTemplate.taskTemplates.map((template, idx) => {
          const className =
            idx === goalSuggestionTemplate.taskTemplates.length - 1 ? styles.lessMargin : '';

          return (
            <SuggestedTask
              key={template.id}
              title={template.title}
              onClick={() => onTaskTemplateClick(template.id)}
              isRejected={rejectedTaskTemplateIds.includes(template.id)}
              className={className}
            />
          );
        })
      : null;

  return (
    <div>
      <ModalHeader
        titleMessageId="goalCreate.suggestionsTitle"
        bodyMessageId="goalCreate.suggestionsDetail"
        closePopup={closePopup}
      />
      <div className={styles.fields}>
        <FormLabel messageId="goalCreate.goalAdded" gray={true} topPadding={true} />
        {goalSuggestionTemplate && <p className={styles.text}>{goalSuggestionTemplate.title}</p>}
        <FormLabel messageId="goalCreate.suggestedTasks" gray={true} topPadding={true} />
        {suggestedTasks}
        <ModalButtons
          cancelMessageId="goalCreate.back"
          submitMessageId="goalCreate.submitWithTasks"
          cancel={onGoBack}
          submit={onSubmit}
        />
      </div>
    </div>
  );
};

export default SuggestedTasks;
