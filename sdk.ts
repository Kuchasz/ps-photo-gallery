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
  imageId: Scalars['String'];
  liked: Scalars['Boolean'];
  likes: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  likeImage: Like;
  connect: Client;
};


export type MutationLikeImageArgs = {
  galleryId: Scalars['String'];
  clientId: Scalars['Int'];
  imageId: Scalars['String'];
};


export type MutationConnectArgs = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  likes: Array<Like>;
};


export type QueryLikesArgs = {
  clientId: Scalars['Int'];
  galleryId: Scalars['String'];
};


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
export const GetLikesDocument = gql`
    query getLikes($galleryId: String!, $clientId: Int!) {
  likes(galleryId: $galleryId, clientId: $clientId) {
    imageId
    liked
    likes
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    likeImage(variables: LikeImageMutationVariables): Promise<LikeImageMutation> {
      return withWrapper(() => client.request<LikeImageMutation>(print(LikeImageDocument), variables));
    },
    connectClient(variables: ConnectClientMutationVariables): Promise<ConnectClientMutation> {
      return withWrapper(() => client.request<ConnectClientMutation>(print(ConnectClientDocument), variables));
    },
    getLikes(variables: GetLikesQueryVariables): Promise<GetLikesQuery> {
      return withWrapper(() => client.request<GetLikesQuery>(print(GetLikesDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
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

export type GetLikesQueryVariables = Exact<{
  galleryId: Scalars['String'];
  clientId: Scalars['Int'];
}>;


export type GetLikesQuery = (
  { __typename?: 'Query' }
  & { likes: Array<(
    { __typename?: 'Like' }
    & Pick<Like, 'imageId' | 'liked' | 'likes'>
  )> }
);
