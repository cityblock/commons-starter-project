import * as React from 'react';
import CBOCategorySelect from '../../library/cbo-category-select/cbo-category-select';
import FormLabel from '../../library/form-label/form-label';
import Link from '../../library/link/link';
import * as styles from './css/shared.css';

export const MAP_LINK = 'www.cityblock.com';

interface IProps {
  categoryId: string;
  onChange: (e?: any) => void;
}

const CreateTaskCBOCategory: React.StatelessComponent<IProps> = (props: IProps) => {
  const { categoryId, onChange } = props;

  return (
    <div>
      <div className={styles.flex}>
        <FormLabel messageId="taskCreate.CBOCategory" gray={!!categoryId} topPadding={true} />
        <Link to={MAP_LINK} messageId="taskCreate.allCBOs" className={styles.link} />
      </div>
      <CBOCategorySelect categoryId={categoryId} onChange={onChange} />
    </div>
  );
};

export default CreateTaskCBOCategory;
