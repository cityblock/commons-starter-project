import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as createRiskAreaGroupMutationGraphql from '../../graphql/queries/risk-area-group-create-mutation.graphql';
import {
  riskAreaGroupCreateMutation,
  riskAreaGroupCreateMutationVariables,
} from '../../graphql/types';
import Button from '../../shared/library/button/button';
import TextInput from '../../shared/library/text-input/text-input';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../shared/with-error-handler/with-error-handler';
import * as styles from './css/risk-area-group-shared.css';

interface IProps {
  cancelCreateRiskAreaGroup: () => void;
}

interface IGraphqlProps {
  createRiskAreaGroup: (
    options: { variables: riskAreaGroupCreateMutationVariables },
  ) => { data: riskAreaGroupCreateMutation };
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

interface IState {
  title: string;
  shortTitle: string;
  order: string;
  mediumRiskThreshold: string;
  highRiskThreshold: string;
  loading: boolean;
}

type Field = 'title' | 'shortTitle' | 'order' | 'mediumRiskThreshold' | 'highRiskThreshold';

export class RiskAreaGroupCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      title: '',
      shortTitle: '',
      order: '',
      mediumRiskThreshold: '',
      highRiskThreshold: '',
      loading: false,
    };
  }

  onChange = (field: Field): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({ [field as any]: e.currentTarget.value });
    };
  };

  onSubmit = async () => {
    const { createRiskAreaGroup, cancelCreateRiskAreaGroup, openErrorPopup } = this.props;
    const {
      title,
      shortTitle,
      order,
      mediumRiskThreshold,
      highRiskThreshold,
      loading,
    } = this.state;
    // prevent submitting with no risk threshold
    if (!loading && order && mediumRiskThreshold && highRiskThreshold) {
      try {
        this.setState({ loading: true });

        await createRiskAreaGroup({
          variables: {
            title,
            shortTitle,
            order: Number(order),
            mediumRiskThreshold: Number(mediumRiskThreshold),
            highRiskThreshold: Number(highRiskThreshold),
          },
        });
        cancelCreateRiskAreaGroup();
      } catch (err) {
        openErrorPopup(err.message);
      }
    }
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { cancelCreateRiskAreaGroup } = this.props;
    const { title, shortTitle, order, mediumRiskThreshold, highRiskThreshold } = this.state;

    return (
      <div>
        <div className={styles.buttons}>
          <Button
            messageId="riskAreaGroup.close"
            icon="close"
            color="white"
            className={styles.button}
            onClick={cancelCreateRiskAreaGroup}
          />
        </div>
        <div className={styles.fields}>
          <TextInput
            value={title}
            onChange={this.onChange('title')}
            placeholderMessageId="riskAreaGroup.title"
          />
          <TextInput
            value={shortTitle}
            onChange={this.onChange('shortTitle')}
            placeholderMessageId="riskAreaGroup.shortTitle"
          />
          <TextInput
            value={order}
            onChange={this.onChange('order')}
            placeholderMessageId="riskAreaGroup.order"
          />
          <TextInput
            value={mediumRiskThreshold}
            onChange={this.onChange('mediumRiskThreshold')}
            placeholderMessageId="riskAreaGroup.mediumRiskThreshold"
          />
          <TextInput
            value={highRiskThreshold}
            onChange={this.onChange('highRiskThreshold')}
            placeholderMessageId="riskAreaGroup.highRiskThreshold"
          />
        </div>
        <div className={styles.buttons}>
          <Button
            messageId="modalButtons.cancel"
            onClick={cancelCreateRiskAreaGroup}
            color="white"
            small={true}
          />
          <Button messageId="riskAreaGroup.create" onClick={this.onSubmit} small={true} />
        </div>
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql(createRiskAreaGroupMutationGraphql as any, {
    name: 'createRiskAreaGroup',
    options: {
      refetchQueries: ['getRiskAreaGroups'],
    },
  }),
)(RiskAreaGroupCreate) as React.ComponentClass<IProps>;
