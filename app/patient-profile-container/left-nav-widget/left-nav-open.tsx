import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/left-nav-open.css';
import LeftNavCareTeam from './left-nav-care-team';
import LeftNavHeader from './left-nav-header';
import LeftNavMessages from './left-nav-messages';
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
        {selected === 'careTeam' && <LeftNavCareTeam patientId={patientId} />}
        {selected === 'scratchPad' && (
          <LeftNavScratchPad patientId={patientId} glassBreakId={glassBreakId} />
        )}
        {selected === 'message' && <LeftNavMessages patientId={patientId} />}
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
