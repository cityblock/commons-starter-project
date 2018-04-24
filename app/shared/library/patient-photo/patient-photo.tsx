import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientPhotoSignedUrlCreate from '../../../graphql/queries/patient-photo-signed-url-create.graphql';
import {
  patientPhotoSignedUrlCreateMutation,
  patientPhotoSignedUrlCreateMutationVariables,
  Gender,
  PatientSignedUrlAction,
} from '../../../graphql/types';
import PatientPhotoImage from './patient-photo-image';

// large is square, circle and circleLarge are 30x30 and 40x40 respectively
export type PhotoType = 'large' | 'circle' | 'circleLarge';

interface IProps {
  patientId: string;
  hasUploadedPhoto: boolean;
  gender: Gender | null;
  className?: string | null;
  type?: PhotoType; // default is large
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
          variables: { patientId, action: 'read' as PatientSignedUrlAction },
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
    const { gender, className, type } = this.props;

    return (
      <PatientPhotoImage
        imgUrl={imgUrl}
        gender={gender}
        className={className || null}
        type={type || 'large'}
      />
    );
  }
}

export default graphql<any>(patientPhotoSignedUrlCreate as any, {
  name: 'getSignedPhotoUrl',
})(PatientPhoto) as React.ComponentClass<IProps>;
