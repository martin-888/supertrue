/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Collection = {
  __typename?: 'Collection';
  address: Scalars['String'];
  artistId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  instagram: Scalars['String'];
  minted: Scalars['Int'];
  name: Scalars['String'];
  owner?: Maybe<User>;
  pendingFunds?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  /** MATIC WEI */
  price?: Maybe<Scalars['String']>;
  /** USD cents */
  priceCents?: Maybe<Scalars['Int']>;
  /** USD cents */
  startPriceCents?: Maybe<Scalars['Int']>;
  symbol: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};

export type CreateCheckoutLinkInput = {
  artistId: Scalars['Int'];
  clientMutationId?: InputMaybe<Scalars['String']>;
};

export type CreateCheckoutLinkPayload = {
  __typename?: 'CreateCheckoutLinkPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
};

export type CreateCollectionInput = {
  account: Scalars['String'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  instagram: Scalars['String'];
  name: Scalars['String'];
  username: Scalars['String'];
};

export type CreateCollectionPayload = {
  __typename?: 'CreateCollectionPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  tx?: Maybe<Scalars['String']>;
};

export type CreateLogInNonceInput = {
  address: Scalars['String'];
  clientMutationId?: InputMaybe<Scalars['String']>;
};

export type CreateLogInNoncePayload = {
  __typename?: 'CreateLogInNoncePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  nonce?: Maybe<Scalars['String']>;
};

export type CreatePostInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  lastNftID: Scalars['Int'];
};

export type CreatePostPayload = {
  __typename?: 'CreatePostPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
};

export type DeletePostInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeletePostPayload = {
  __typename?: 'DeletePostPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
};

export type FetchInstagramDataInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  instagram: Scalars['String'];
};

export type FetchInstagramDataPayload = {
  __typename?: 'FetchInstagramDataPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  followers?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
};

export type LogInMagicLinkInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  token: Scalars['String'];
};

export type LogInMagicLinkPayload = {
  __typename?: 'LogInMagicLinkPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  token?: Maybe<Scalars['String']>;
};

export type LogInSignatureInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  nonce: Scalars['String'];
  signature: Scalars['String'];
};

export type LogInSignaturePayload = {
  __typename?: 'LogInSignaturePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  token?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateCheckoutLink?: Maybe<CreateCheckoutLinkPayload>;
  CreateCollection?: Maybe<CreateCollectionPayload>;
  CreateLogInNonce?: Maybe<CreateLogInNoncePayload>;
  CreatePost?: Maybe<CreatePostPayload>;
  DeletePost?: Maybe<DeletePostPayload>;
  FetchInstagramData?: Maybe<FetchInstagramDataPayload>;
  LogInMagicLink?: Maybe<LogInMagicLinkPayload>;
  LogInSignature?: Maybe<LogInSignaturePayload>;
  ReserveCollection?: Maybe<ReserveCollectionPayload>;
  UpdateCollection?: Maybe<UpdateCollectionPayload>;
  UpdatePost?: Maybe<UpdatePostPayload>;
  UpdatePricing?: Maybe<UpdatePricingPayload>;
  Withdraw?: Maybe<WithdrawPayload>;
};


export type MutationCreateCheckoutLinkArgs = {
  input: CreateCheckoutLinkInput;
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateLogInNonceArgs = {
  input: CreateLogInNonceInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


export type MutationFetchInstagramDataArgs = {
  input: FetchInstagramDataInput;
};


export type MutationLogInMagicLinkArgs = {
  input: LogInMagicLinkInput;
};


export type MutationLogInSignatureArgs = {
  input: LogInSignatureInput;
};


export type MutationReserveCollectionArgs = {
  input: ReserveCollectionInput;
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdatePricingArgs = {
  input: UpdatePricingInput;
};


export type MutationWithdrawArgs = {
  input: WithdrawInput;
};

export type Nft = {
  __typename?: 'Nft';
  artistId: Scalars['Int'];
  collection: Collection;
  id: Scalars['ID'];
  tokenId: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  lastNftID: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  collection?: Maybe<Collection>;
  collections?: Maybe<Array<Maybe<Collection>>>;
  me?: Maybe<User>;
  posts?: Maybe<Array<Maybe<Post>>>;
  reservation?: Maybe<Reservation>;
  reservations?: Maybe<Array<Maybe<Reservation>>>;
};


export type QueryCollectionArgs = {
  artistId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};


export type QueryCollectionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryPostsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryReservationArgs = {
  instagram: Scalars['String'];
};


export type QueryReservationsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type Reservation = {
  __typename?: 'Reservation';
  collection?: Maybe<Collection>;
  id: Scalars['ID'];
  instagram: Scalars['String'];
  lineLength: Scalars['Int'];
};

export type ReserveCollectionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  instagram: Scalars['String'];
};

export type ReserveCollectionPayload = {
  __typename?: 'ReserveCollectionPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
};

export type UpdateCollectionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  description: Scalars['String'];
};

export type UpdateCollectionPayload = {
  __typename?: 'UpdateCollectionPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  collection: Collection;
};

export type UpdatePostInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  id: Scalars['ID'];
  lastNftID: Scalars['Int'];
};

export type UpdatePostPayload = {
  __typename?: 'UpdatePostPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
};

export type UpdatePricingInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  startPrice: Scalars['Int'];
};

export type UpdatePricingPayload = {
  __typename?: 'UpdatePricingPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  tx?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['String'];
  artistId?: Maybe<Scalars['Int']>;
  collection?: Maybe<Collection>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  nfts?: Maybe<Array<Maybe<Nft>>>;
  reservations?: Maybe<Array<Maybe<Reservation>>>;
  username?: Maybe<Scalars['String']>;
};

export type WithdrawInput = {
  account: Scalars['String'];
  clientMutationId?: InputMaybe<Scalars['String']>;
};

export type WithdrawPayload = {
  __typename?: 'WithdrawPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  tx?: Maybe<Scalars['String']>;
};

export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, address: string, collection?: { __typename?: 'Collection', id: string, name: string, artistId: number, username?: string | null } | null } | null };

export type PostFragmentFragment = { __typename?: 'Post', id: string, content?: string | null, createdAt: string, lastNftID: number } & { ' $fragmentName'?: 'PostFragmentFragment' };

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', UpdatePost?: { __typename?: 'UpdatePostPayload', collection?: { __typename?: 'Collection', id: string, posts?: Array<{ __typename?: 'Post', id: string, content?: string | null } | null> | null } | null } | null };

export type DeletePostMutationVariables = Exact<{
  input: DeletePostInput;
}>;


export type DeletePostMutation = { __typename?: 'Mutation', DeletePost?: { __typename?: 'DeletePostPayload', collection?: { __typename?: 'Collection', id: string, posts?: Array<{ __typename?: 'Post', id: string } | null> | null } | null } | null };

export type GetArtistUsernameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetArtistUsernameQuery = { __typename?: 'Query', me?: { __typename?: 'User', address: string } | null, collection?: { __typename?: 'Collection', username?: string | null, id: string, artistId: number, minted: number, name: string, description?: string | null, symbol: string, instagram: string, address: string, price?: string | null, priceCents?: number | null, posts?: Array<(
      { __typename?: 'Post', id: string, lastNftID: number, content?: string | null, createdAt: string }
      & { ' $fragmentRefs'?: { 'PostFragmentFragment': PostFragmentFragment } }
    ) | null> | null } | null };

export type GetArtistIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetArtistIdQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: string, username?: string | null } | null };

export type MeLoginQueryVariables = Exact<{ [key: string]: never; }>;


export type MeLoginQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, address: string } | null };

export type LogInSignatureCreateMutationVariables = Exact<{
  input: CreateLogInNonceInput;
}>;


export type LogInSignatureCreateMutation = { __typename?: 'Mutation', CreateLogInNonce?: { __typename?: 'CreateLogInNoncePayload', nonce?: string | null } | null };

export type LogInSignatureMutationVariables = Exact<{
  input: LogInSignatureInput;
}>;


export type LogInSignatureMutation = { __typename?: 'Mutation', LogInSignature?: { __typename?: 'LogInSignaturePayload', token?: string | null, me?: { __typename?: 'User', id: string, address: string } | null } | null };

export type LoginMutationVariables = Exact<{
  input: LogInMagicLinkInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', LogInMagicLink?: { __typename?: 'LogInMagicLinkPayload', token?: string | null } | null };

export type MyNftsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyNftsQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, nfts?: Array<{ __typename?: 'Nft', id: string, tokenId: number, artistId: number, collection: { __typename?: 'Collection', username?: string | null } } | null> | null } | null };

export type MeNewQueryVariables = Exact<{ [key: string]: never; }>;


export type MeNewQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, address: string, email?: string | null, description?: string | null, collection?: { __typename?: 'Collection', id: string, artistId: number, address: string, name: string, instagram: string, startPriceCents?: number | null } | null } | null };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', CreateCollection?: { __typename?: 'CreateCollectionPayload', tx?: string | null } | null };

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', CreatePost?: { __typename?: 'CreatePostPayload', collection?: { __typename?: 'Collection', id: string, address: string, posts?: Array<{ __typename?: 'Post', id: string, lastNftID: number, content?: string | null, createdAt: string } | null> | null } | null } | null };

export type MePostsQueryVariables = Exact<{ [key: string]: never; }>;


export type MePostsQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, collection?: { __typename?: 'Collection', id: string, address: string, name: string, artistId: number, username?: string | null, instagram: string, symbol: string, posts?: Array<(
        { __typename?: 'Post', id: string, lastNftID: number, content?: string | null, createdAt: string }
        & { ' $fragmentRefs'?: { 'PostFragmentFragment': PostFragmentFragment } }
      ) | null> | null } | null } | null };

export type MeSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MeSettingsQuery = { __typename?: 'Query', me?: (
    { __typename?: 'User', id: string, collection?: { __typename?: 'Collection', id: string, artistId: number, description?: string | null, startPriceCents?: number | null, pendingFunds?: string | null } | null }
    & { ' $fragmentRefs'?: { 'BalanceUserFragmentFragment': BalanceUserFragmentFragment } }
  ) | null };

export type BalanceUserFragmentFragment = { __typename?: 'User', id: string, address: string, collection?: { __typename?: 'Collection', id: string, pendingFunds?: string | null, minted: number } | null } & { ' $fragmentName'?: 'BalanceUserFragmentFragment' };

export type WithdrawMutationVariables = Exact<{
  input: WithdrawInput;
}>;


export type WithdrawMutation = { __typename?: 'Mutation', Withdraw?: { __typename?: 'WithdrawPayload', tx?: string | null } | null };

export type UpdateCollectionMutationVariables = Exact<{
  input: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', UpdateCollection?: { __typename?: 'UpdateCollectionPayload', collection: { __typename?: 'Collection', id: string, description?: string | null } } | null };

export type UpdatePricingMutationVariables = Exact<{
  input: UpdatePricingInput;
}>;


export type UpdatePricingMutation = { __typename?: 'Mutation', UpdatePricing?: { __typename?: 'UpdatePricingPayload', tx?: string | null } | null };

export type MeClaimQueryVariables = Exact<{ [key: string]: never; }>;


export type MeClaimQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, collection?: { __typename?: 'Collection', id: string, name: string, artistId: number, username?: string | null } | null } | null };

export type GetReservationHandleQueryVariables = Exact<{
  instagram: Scalars['String'];
}>;


export type GetReservationHandleQuery = { __typename?: 'Query', reservation?: { __typename?: 'Reservation', instagram: string, lineLength: number, collection?: { __typename?: 'Collection', name: string } | null } | null };

export type CollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CollectionsQuery = { __typename?: 'Query', collections?: Array<{ __typename?: 'Collection', id: string, artistId: number, minted: number, name: string, instagram: string, owner?: { __typename?: 'User', username?: string | null } | null } | null> | null, reservations?: Array<{ __typename?: 'Reservation', id: string, instagram: string } | null> | null };

export type NewsfeedQueryVariables = Exact<{ [key: string]: never; }>;


export type NewsfeedQuery = { __typename?: 'Query', me?: { __typename?: 'User', nfts?: Array<{ __typename?: 'Nft', id: string, artistId: number, tokenId: number } | null> | null } | null, posts?: Array<(
    { __typename?: 'Post', id: string, lastNftID: number, content?: string | null, createdAt: string, author: { __typename?: 'User', id: string, artistId?: number | null, collection?: { __typename?: 'Collection', instagram: string, name: string, username?: string | null } | null } }
    & { ' $fragmentRefs'?: { 'PostFragmentFragment': PostFragmentFragment } }
  ) | null> | null };

export type ReserveArtistMutationVariables = Exact<{
  input: ReserveCollectionInput;
}>;


export type ReserveArtistMutation = { __typename?: 'Mutation', ReserveCollection?: { __typename?: 'ReserveCollectionPayload', position: number } | null };

export type GetReservationReserveQueryVariables = Exact<{
  instagram: Scalars['String'];
  skipReservation: Scalars['Boolean'];
}>;


export type GetReservationReserveQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email?: string | null, collection?: { __typename?: 'Collection', id: string } | null } | null, reservation?: { __typename?: 'Reservation', instagram: string, lineLength: number } | null };

export type GetReservationReserveHandleQueryVariables = Exact<{
  instagram: Scalars['String'];
}>;


export type GetReservationReserveHandleQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email?: string | null, collection?: { __typename?: 'Collection', id: string } | null } | null, reservation?: { __typename?: 'Reservation', instagram: string, lineLength: number } | null };

export type CreateCheckoutLinkMutationVariables = Exact<{
  input: CreateCheckoutLinkInput;
}>;


export type CreateCheckoutLinkMutation = { __typename?: 'Mutation', CreateCheckoutLink?: { __typename?: 'CreateCheckoutLinkPayload', link?: string | null } | null };

export const PostFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastNftID"}}]}}]} as unknown as DocumentNode<PostFragmentFragment, unknown>;
export const BalanceUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BalanceUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pendingFunds"}},{"kind":"Field","name":{"kind":"Name","value":"minted"}}]}}]}}]} as unknown as DocumentNode<BalanceUserFragmentFragment, unknown>;
export const MeHeaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"meHeader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<MeHeaderQuery, MeHeaderQueryVariables>;
export const UpdatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdatePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePostMutation, UpdatePostMutationVariables>;
export const DeletePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeletePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeletePostMutation, DeletePostMutationVariables>;
export const GetArtistUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getArtistUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"minted"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceCents"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastNftID"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostFragment"}}]}}]}}]}},...PostFragmentFragmentDoc.definitions]} as unknown as DocumentNode<GetArtistUsernameQuery, GetArtistUsernameQueryVariables>;
export const GetArtistIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getArtistId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"artistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetArtistIdQuery, GetArtistIdQueryVariables>;
export const MeLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"meLogin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<MeLoginQuery, MeLoginQueryVariables>;
export const LogInSignatureCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logInSignatureCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLogInNonceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateLogInNonce"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nonce"}}]}}]}}]} as unknown as DocumentNode<LogInSignatureCreateMutation, LogInSignatureCreateMutationVariables>;
export const LogInSignatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logInSignature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogInSignatureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LogInSignature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]}}]} as unknown as DocumentNode<LogInSignatureMutation, LogInSignatureMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogInMagicLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LogInMagicLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const MyNftsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myNfts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nfts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyNftsQuery, MyNftsQueryVariables>;
export const MeNewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"meNew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"startPriceCents"}}]}}]}}]}}]} as unknown as DocumentNode<MeNewQuery, MeNewQueryVariables>;
export const CreateCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tx"}}]}}]}}]} as unknown as DocumentNode<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreatePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastNftID"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const MePostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mePosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastNftID"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostFragment"}}]}}]}}]}}]}},...PostFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MePostsQuery, MePostsQueryVariables>;
export const MeSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"meSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startPriceCents"}},{"kind":"Field","name":{"kind":"Name","value":"pendingFunds"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BalanceUserFragment"}}]}}]}},...BalanceUserFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MeSettingsQuery, MeSettingsQueryVariables>;
export const WithdrawDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"withdraw"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WithdrawInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Withdraw"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tx"}}]}}]}}]} as unknown as DocumentNode<WithdrawMutation, WithdrawMutationVariables>;
export const UpdateCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdateCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const UpdatePricingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePricing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePricingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdatePricing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tx"}}]}}]}}]} as unknown as DocumentNode<UpdatePricingMutation, UpdatePricingMutationVariables>;
export const MeClaimDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"meClaim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<MeClaimQuery, MeClaimQueryVariables>;
export const GetReservationHandleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReservationHandle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instagram"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reservation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"instagram"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instagram"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"lineLength"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetReservationHandleQuery, GetReservationHandleQueryVariables>;
export const CollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"minted"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reservations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}}]}}]}}]} as unknown as DocumentNode<CollectionsQuery, CollectionsQueryVariables>;
export const NewsfeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"newsfeed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"15"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastNftID"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"artistId"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostFragment"}}]}}]}},...PostFragmentFragmentDoc.definitions]} as unknown as DocumentNode<NewsfeedQuery, NewsfeedQueryVariables>;
export const ReserveArtistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reserveArtist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReserveCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ReserveCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<ReserveArtistMutation, ReserveArtistMutationVariables>;
export const GetReservationReserveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReservationReserve"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instagram"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skipReservation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reservation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"instagram"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instagram"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skipReservation"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"lineLength"}}]}}]}}]} as unknown as DocumentNode<GetReservationReserveQuery, GetReservationReserveQueryVariables>;
export const GetReservationReserveHandleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReservationReserveHandle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instagram"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reservation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"instagram"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instagram"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"lineLength"}}]}}]}}]} as unknown as DocumentNode<GetReservationReserveHandleQuery, GetReservationReserveHandleQueryVariables>;
export const CreateCheckoutLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCheckoutLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCheckoutLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateCheckoutLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]} as unknown as DocumentNode<CreateCheckoutLinkMutation, CreateCheckoutLinkMutationVariables>;