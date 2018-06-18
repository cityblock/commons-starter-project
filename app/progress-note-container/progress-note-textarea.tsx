import React from 'react';
import onClickOutside, { OnClickOutProps } from 'react-onclickoutside';
import TextArea from '../shared/library/textarea/textarea';

interface IProps extends OnClickOutProps {
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  forceSave: () => void;
}

export class ProgressNoteTextArea extends React.Component<IProps> {
  // force save if clicking away
  handleClickOutside = (): void => {
    this.props.forceSave();
  };

  render(): JSX.Element {
    const { value, disabled, onChange } = this.props;

    return <TextArea value={value} disabled={disabled} onChange={onChange} />;
  }
}

export default onClickOutside<IProps>(ProgressNoteTextArea as any);
