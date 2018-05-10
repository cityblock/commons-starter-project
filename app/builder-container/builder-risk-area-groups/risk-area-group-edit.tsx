import * as React from 'react';
import { graphql } from 'react-apollo';
import * as riskAreaGroupEditMutationGraphql from '../../graphql/queries/risk-area-group-edit-mutation.graphql';
import {
  riskAreaGroupEditMutation,
  riskAreaGroupEditMutationVariables,
  FullRiskAreaGroupFragment,
} from '../../graphql/types';
import Button from '../../shared/library/button/button';
import EditableMultilineText from '../../shared/library/editable-multiline-text/editable-multiline-text';
import * as styles from './css/risk-area-group-shared.css';

interface IProps {
  riskAreaGroup: FullRiskAreaGroupFragment;
  close: () => void;
  deleteRiskAreaGroup: () => void;
}

interface IGraphqlProps {
  editRiskAreaGroup: (
    options: { variables: riskAreaGroupEditMutationVariables },
  ) => { data: riskAreaGroupEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class RiskAreaGroupEdit extends React.Component<allProps, {}> {
  onSubmit(field: string) {
    const { riskAreaGroup, editRiskAreaGroup } = this.props;

    return async (newText: string) => {
      await editRiskAreaGroup({
        variables: {
          riskAreaGroupId: riskAreaGroup.id,
          [field]: newText,
        },
      });
    };
  }

  render(): JSX.Element {
    const { riskAreaGroup, close, deleteRiskAreaGroup } = this.props;

    return (
      <div>
        <div className={styles.buttons}>
          <Button
            messageId="riskAreaGroup.close"
            icon="close"
            color="white"
            className={styles.button}
            onClick={close}
          />
          <Button
            messageId="riskAreaGroup.delete"
            icon="delete"
            color="white"
            className={styles.button}
            onClick={deleteRiskAreaGroup}
          />
        </div>
        <div className={styles.fields}>
          <h4>Title:</h4>
          <EditableMultilineText text={riskAreaGroup.title} onSubmit={this.onSubmit('title')} />
          <h4>Short Title:</h4>
          <EditableMultilineText
            text={riskAreaGroup.shortTitle}
            onSubmit={this.onSubmit('shortTitle')}
          />
          <h4>Order:</h4>
          <EditableMultilineText
            text={`${riskAreaGroup.order}`}
            onSubmit={this.onSubmit('order')}
          />
          <h4>Medium Risk Threshold:</h4>
          <EditableMultilineText
            text={`${riskAreaGroup.mediumRiskThreshold}`}
            onSubmit={this.onSubmit('mediumRiskThreshold')}
          />
          <h4>High Risk Threshold:</h4>
          <EditableMultilineText
            text={`${riskAreaGroup.highRiskThreshold}`}
            onSubmit={this.onSubmit('highRiskThreshold')}
          />
        </div>
      </div>
    );
  }
}

export default graphql<any>(riskAreaGroupEditMutationGraphql as any, {
  name: 'editRiskAreaGroup',
})(RiskAreaGroupEdit) as React.ComponentClass<IProps>;
