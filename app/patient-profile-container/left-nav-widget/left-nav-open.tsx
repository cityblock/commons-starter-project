import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/left-nav-open.css';
import LeftNavHeader from './left-nav-header';
import LeftNavQuickActions from './left-nav-quick-actions';
import LeftNavScratchPad from './left-nav-scratchpad';
import { Selected } from './left-nav-widget';

interface IProps {
  patientId: string;
  isOpen: boolean;
  selected: Selected | null;
  onClose: () => void;
  glassBreakId: string | null;
}

const LeftNavOpen: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, selected, isOpen, onClose, glassBreakId } = props;

  const containerStyles = classNames(styles.container, {
    [styles.expanded]: isOpen,
    [styles.collapsed]: !isOpen,
  });

  return (
    <div className={containerStyles}>
      {selected && <LeftNavHeader selected={selected} onClose={onClose} />}
      <div className={styles.content}>
        {selected === 'scratchPad' && (
          <LeftNavScratchPad patientId={patientId} glassBreakId={glassBreakId} />
        )}
        {selected === 'quickActions' && (
          <LeftNavQuickActions
            patientId={patientId}
            glassBreakId={glassBreakId}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default LeftNavOpen;
