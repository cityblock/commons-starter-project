import * as React from 'react';
import { getGoalSuggestionTemplatesQuery } from '../../../graphql/types';
import FormLabel from '../../library/form-label/form-label';
import OptGroup from '../../library/optgroup/optgroup';
import Option from '../../library/option/option';
import Select from '../../library/select/select';
import * as styles from './css/goal-select.css';

export const CUSTOM_GOAL_ID = 'customGoal';

interface IProps {
  loading: boolean;
  goalSuggestionTemplateId?: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  goalSuggestionTemplates: getGoalSuggestionTemplatesQuery['goalSuggestionTemplates'];
}

export const GoalSelect: React.StatelessComponent<IProps> = (props: IProps) => {
  const { goalSuggestionTemplateId, onSelectChange, goalSuggestionTemplates, loading } = props;
  const isCustomGoalSelected =
    goalSuggestionTemplateId && goalSuggestionTemplateId === CUSTOM_GOAL_ID;

  const goalOptions = loading ? (
    <Option value="" messageId="goalCreate.loading" />
  ) : (
    (goalSuggestionTemplates || []).map(template => (
      <Option key={template!.id} value={template!.id} label={template!.title} />
    ))
  );

  return (
    <div>
      <FormLabel messageId="goalCreate.selectLabel" />
      <Select
        value={goalSuggestionTemplateId || ''}
        onChange={onSelectChange}
        className={styles.select}
      >
        <Option value="" messageId="goalCreate.selectGoal" disabled={true} />
        <Option
          value={CUSTOM_GOAL_ID}
          messageId="goalCreate.custom"
          indent={!isCustomGoalSelected}
        />
        <OptGroup messageId="goalCreate.templates">{goalOptions}</OptGroup>
      </Select>
    </div>
  );
};

export default GoalSelect;
