import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Client = {
  __typename?: 'Client';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Like = {
  __typename?: 'Like';
  galleryId: Scalars['String'];
  imageId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  connect: Client;
  likeImage: Like;
};


export type MutationConnectArgs = {
  name: Scalars['String'];
};


export type MutationLikeImageArgs = {
  clientId: Scalars['Int'];
  galleryId: Scalars['String'];
  imageId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  likes: Array<Like>;
};


export type QueryLikesArgs = {
  galleryId: Scalars['String'];
};

export type GetLikesQueryVariables = Exact<{
  galleryId: Scalars['String'];
}>;


export type GetLikesQuery = (
  { __typename?: 'Query' }
  & { likes: Array<(
    { __typename?: 'Like' }
    & Pick<Like, 'imageId' | 'galleryId'>
  )> }
);

export type LikeImageMutationVariables = Exact<{
  imageId: Scalars['String'];
  clientId: Scalars['Int'];
  galleryId: Scalars['String'];
}>;


export type LikeImageMutation = (
  { __typename?: 'Mutation' }
  & { likeImage: (
    { __typename?: 'Like' }
    & Pick<Like, 'imageId'>
  ) }
);

export type ConnectClientMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type ConnectClientMutation = (
  { __typename?: 'Mutation' }
  & { connect: (
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
  ) }
);


export const GetLikesDocument = gql`
    query getLikes($galleryId: String!) {
  likes(galleryId: $galleryId) {
    imageId
    galleryId
  }
}
    `;
export const LikeImageDocument = gql`
    mutation likeImage($imageId: String!, $clientId: Int!, $galleryId: String!) {
  likeImage(imageId: $imageId, clientId: $clientId, galleryId: $galleryId) {
    imageId
  }
}
    `;
export const ConnectClientDocument = gql`
    mutation connectClient($name: String!) {
  connect(name: $name) {
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getLikes(variables: GetLikesQueryVariables): Promise<GetLikesQuery> {
      return withWrapper(() => client.request<GetLikesQuery>(print(GetLikesDocument), variables));
    },
    likeImage(variables: LikeImageMutationVariables): Promise<LikeImageMutation> {
      return withWrapper(() => client.request<LikeImageMutation>(print(LikeImageDocument), variables));
    },
    connectClient(variables: ConnectClientMutationVariables): Promise<ConnectClientMutation> {
      return withWrapper(() => client.request<ConnectClientMutation>(print(ConnectClientDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;