import * as React from 'react';
import { getGoalSuggestionTemplatesQuery } from '../../../graphql/types';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../library/modal-header/modal-header';
import * as styles from './css/create-goal.css';
import GoalSelect, { CUSTOM_GOAL_ID } from './goal-select';
import CreateGoalTitle from './title';

interface IProps {
  title: string;
  goalSuggestionTemplateId?: string;
  goalSuggestionTemplates: getGoalSuggestionTemplatesQuery['goalSuggestionTemplates'];
  loading: boolean;
  onSubmit: () => void;
  closePopup: () => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DefineGoal: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    loading,
    title,
    goalSuggestionTemplateId,
    goalSuggestionTemplates,
    closePopup,
    onSelectChange,
    onTitleChange,
    onSubmit,
  } = props;

  const customGoal = goalSuggestionTemplateId === CUSTOM_GOAL_ID;

  return (
    <div>
      <ModalHeader
        titleMessageId="goalCreate.addGoal"
        bodyMessageId="goalCreate.detail"
        closePopup={closePopup}
      />
      <div className={styles.fields}>
        <GoalSelect
          loading={loading}
          goalSuggestionTemplates={goalSuggestionTemplates}
          goalSuggestionTemplateId={goalSuggestionTemplateId}
          onSelectChange={onSelectChange}
        />
        {customGoal && <CreateGoalTitle value={title} onChange={onTitleChange} />}
        <ModalButtons
          cancelMessageId="goalCreate.cancel"
          submitMessageId="goalCreate.submit"
          cancel={closePopup}
          submit={onSubmit}
        />
      </div>
    </div>
  );
};

export default DefineGoal;
