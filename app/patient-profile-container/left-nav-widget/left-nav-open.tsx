import classNames from 'classnames';
import React from 'react';
import { IState as Selected } from '../../reducers/patient-left-nav-reducer';
import styles from './css/left-nav-open.css';
import LeftNavCareTeam from './left-nav-care-team';
import LeftNavHeader from './left-nav-header';
import LeftNavMessages from './left-nav-messages';
import LeftNavQuickActions from './left-nav-quick-actions';
import LeftNavScratchPad from './left-nav-scratchpad';

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
  const contentStyles = classNames(styles.content, {
    [styles.scroll]: selected && selected !== 'message',
  });

  return (
    <div className={containerStyles}>
      {selected && <LeftNavHeader selected={selected} onClose={onClose} />}
      <div className={contentStyles}>
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
