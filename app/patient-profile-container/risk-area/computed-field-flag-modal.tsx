import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup as closePopupAction } from '../../actions/popup-action';
/* tslint:disable:max-line-length */
import * as computedFieldFlagCreateMutationGraphql from '../../graphql/queries/computed-field-flag-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  computedFieldFlagCreateMutation,
  computedFieldFlagCreateMutationVariables,
} from '../../graphql/types';
import { IComputedFieldFlagPopupOptions } from '../../reducers/popup-reducer';
import { Popup } from '../../shared/popup/popup';
import { IState as IAppState } from '../../store';

interface IStateProps {
  visible: boolean;
  patientAnswerIds: string[];
}

interface IDispatchProps {
  closePopup: () => void;
}

interface IGraphqlProps {
  flagComputedField: (
    options: { variables: computedFieldFlagCreateMutationVariables },
  ) => { data: computedFieldFlagCreateMutation };
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class ComputedFieldFlagModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { loading: false, error: null };
  }

  render(): JSX.Element {
    const { visible, closePopup } = this.props;

    return (
      <Popup visible={visible} closePopup={closePopup}>
        <h1>Compueted field flag yo</h1>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const visible = state.popup.name === 'COMPUTED_FIELD_FLAG';
  const options = state.popup.options as IComputedFieldFlagPopupOptions;
  const patientAnswerIds = visible ? options.patientAnswerIds : [];

  return { visible, patientAnswerIds };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => {
  const closePopup = () => dispatch(closePopupAction());
  return { closePopup };
};

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, {}, allProps>(computedFieldFlagCreateMutationGraphql as any, {
    name: 'flagComputedField',
  }),
)(ComputedFieldFlagModal);
