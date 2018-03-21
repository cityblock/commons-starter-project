import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientPhotoSignedUrlCreate from '../../../graphql/queries/patient-photo-signed-url-create.graphql';
import {
  patientPhotoSignedUrlCreateMutation,
  patientPhotoSignedUrlCreateMutationVariables,
  Gender,
  PatientPhotoSignedUrlAction,
} from '../../../graphql/types';
import PatientPhotoLarge from './patient-photo-large';

interface IProps {
  patientId: string;
  hasUploadedPhoto: boolean;
  gender: Gender | null;
  className?: string | null;
}

interface IGraphqlProps {
  getSignedPhotoUrl: (
    options: { variables: patientPhotoSignedUrlCreateMutationVariables },
  ) => { data: patientPhotoSignedUrlCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  error: string | null;
  imgUrl: string | null;
}

export class PatientPhoto extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { error: null, imgUrl: null };
  }

  async componentDidMount(): Promise<void> {
    const { getSignedPhotoUrl, patientId, hasUploadedPhoto } = this.props;

    if (hasUploadedPhoto) {
      try {
        const signedUrlData = await getSignedPhotoUrl({
          variables: { patientId, action: 'read' as PatientPhotoSignedUrlAction },
        });
        const imgUrl = signedUrlData.data.patientPhotoSignedUrlCreate.signedUrl;

        this.setState({ imgUrl });
      } catch (err) {
        this.setState({ error: err.message });
      }
    }
  }

  render(): JSX.Element | null {
    const { imgUrl } = this.state;
    const { gender, className } = this.props;

    return <PatientPhotoLarge imgUrl={imgUrl} gender={gender} className={className || null} />;
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(patientPhotoSignedUrlCreate as any, {
  name: 'getSignedPhotoUrl',
})(PatientPhoto);