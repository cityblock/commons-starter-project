import React from 'react';
import Modal from '../library/modal/modal';

interface IProps {
  isVisible: boolean;
  refreshType: 'create' | 'edit';
  onRequestRefresh: () => any;
  onClose: () => any;
}

const RequestRefreshModal: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isVisible, refreshType, onClose, onRequestRefresh } = props;
  const titleMessageId =
    refreshType === 'create' ? 'refreshModal.createTitle' : 'refreshModal.editTitle';
  const subTitleMessageId =
    refreshType === 'create' ? 'refreshModal.createSubTitle' : 'refreshModal.editSubTitle';
  const headerIconName = refreshType === 'create' ? 'today' : 'create';
  const headerIconColor = refreshType === 'create' ? 'green' : 'yellow';

  return (
    <Modal
      isVisible={isVisible}
      isLoading={false}
      titleMessageId={titleMessageId}
      subTitleMessageId={subTitleMessageId}
      headerIconName={headerIconName}
      headerIconColor={headerIconColor}
      headerIconSize="extraLarge"
      onClose={onClose}
      onSubmit={onRequestRefresh}
      cancelMessageId="refreshModal.close"
      submitMessageId="refreshModal.refresh"
    />
  );
};

export default RequestRefreshModal;
