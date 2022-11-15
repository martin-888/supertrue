/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query collections {\n    collections(first: 20) {\n      id\n      artistId\n      minted\n      name\n      instagram\n      owner {\n        username\n      }\n    }\n    reservations(first: 20) {\n      id\n      instagram\n    }\n  }\n": types.CollectionsDocument,
    "\n  mutation createPost($input: CreatePostInput!) {\n    CreatePost(input: $input) {\n      collection {\n        id\n        address\n        posts {\n          id\n          lastNftID\n          content\n          createdAt\n        }\n      }\n    }\n  }\n": types.CreatePostDocument,
    "\n  query meHeader {\n    me {\n      id\n      address\n      collection {\n        id\n        name\n        artistId\n        username\n      }\n    }\n  }\n": types.MeHeaderDocument,
    "\n  query myNfts {\n    me {\n      id\n      nfts {\n        id\n        tokenId\n        artistId\n        collection {\n          username\n        }\n      }\n    }\n  }\n": types.MyNftsDocument,
    "\n  query newsfeed {\n    me {\n      nfts {\n        id\n        artistId\n        tokenId\n      }\n    }\n    posts(first: 15) {\n      id\n      lastNftID\n      content\n      createdAt\n      author {\n        id\n        artistId\n        collection {\n          instagram\n          name\n          username\n        }\n      }\n    }\n  }\n": types.NewsfeedDocument,
    "\n  mutation updatePost($input: UpdatePostInput!) {\n    UpdatePost(input: $input) {\n      collection {\n        id\n        posts {\n          content\n        }\n      }\n    }\n  }\n": types.UpdatePostDocument,
    "\n  mutation deletePost($input: DeletePostInput!) {\n    DeletePost(input: $input) {\n      collection {\n        id\n        posts {\n          id\n        }\n      }\n    }\n  }\n": types.DeletePostDocument,
    "\n  mutation updatePricing($input: UpdatePricingInput!) {\n    UpdatePricing(input: $input) {\n      tx\n    }\n  }\n": types.UpdatePricingDocument,
    "\n  fragment BalanceUserFragment on User {\n    id\n    address\n    collection {\n      id\n      pendingFunds\n      minted\n    }\n  }\n": types.BalanceUserFragmentFragmentDoc,
    "\n  mutation withdraw($input: WithdrawInput!) {\n    Withdraw(input: $input) {\n      tx\n    }\n  }\n": types.WithdrawDocument,
    "\n  mutation update($input: UpdateCollectionInput!) {\n    UpdateCollection(input: $input) {\n      collection {\n        id\n        description\n      }\n    }\n  }\n": types.UpdateDocument,
    "\n  query getArtistUsername($username: String!) {\n    me {\n      address\n    }\n    collection(username: $username) {\n      username\n      id\n      artistId\n      minted\n      name\n      description\n      symbol\n      instagram\n      address\n      price\n      priceCents\n      posts {\n        id\n        lastNftID\n        content\n        createdAt\n      }\n    }\n  }\n": types.GetArtistUsernameDocument,
    "\n  mutation CreateCheckoutLink($input: CreateCheckoutLinkInput!) {\n    CreateCheckoutLink(input: $input) {\n      link\n    }\n  }\n": types.CreateCheckoutLinkDocument,
    "\n  mutation login($input: LogInMagicLinkInput!) {\n    LogInMagicLink(input: $input) {\n      token\n    }\n  }\n": types.LoginDocument,
    "\n  query meLogin {\n    me {\n      id\n      address\n    }\n  }\n": types.MeLoginDocument,
    "\n  mutation logInSignatureCreate($input: CreateLogInNonceInput!) {\n    CreateLogInNonce(input: $input) {\n      nonce\n    }\n  }\n": types.LogInSignatureCreateDocument,
    "\n  mutation logInSignature($input: LogInSignatureInput!) {\n    LogInSignature(input: $input) {\n      token\n      me {\n        id\n        address\n      }\n    }\n  }\n": types.LogInSignatureDocument,
    "\n  query meNew {\n    me {\n      id\n      address\n      email\n      description\n      collection {\n        id\n        artistId\n        address\n        name\n        instagram\n        startPriceCents\n      }\n    }\n  }\n": types.MeNewDocument,
    "\n  mutation createCollection($input: CreateCollectionInput!) {\n    CreateCollection(input: $input) {\n      tx\n    }\n  }\n": types.CreateCollectionDocument,
    "\n  query mePosts {\n    me {\n      id\n      collection {\n        id\n        address\n        name\n        artistId\n        username\n        instagram\n        symbol\n        posts {\n          id\n          lastNftID\n          content\n          createdAt\n        }\n      }\n    }\n  }\n": types.MePostsDocument,
    "\n  query meSettings {\n    me {\n      id\n      collection {\n        id\n        artistId\n        description\n        startPriceCents\n        pendingFunds\n      }\n      ...BalanceUserFragment\n    }\n  }\n": types.MeSettingsDocument,
    "\n  query meClaim {\n    me {\n      id\n      collection {\n        id\n        name\n        artistId\n        username\n      }\n    }\n  }\n": types.MeClaimDocument,
    "\n  query getReservationHandle($instagram: String!) {\n    reservation(instagram: $instagram) {\n      instagram\n      lineLength\n      collection {\n        name\n      }\n    }\n  }\n": types.GetReservationHandleDocument,
    "\n  mutation reserveArtist($input: ReserveCollectionInput!) {\n    ReserveCollection(input: $input) {\n      position\n    }\n  }\n": types.ReserveArtistDocument,
    "\n  query getReservationReserveHandle($instagram: String!) {\n    me {\n      id\n      email\n      collection {\n        id\n      }\n    }\n    reservation(instagram: $instagram) {\n      instagram\n      lineLength\n    }\n  }\n": types.GetReservationReserveHandleDocument,
    "\n  query getReservationReserve($instagram: String!, $skipReservation: Boolean!) {\n    me {\n      id\n      email\n      collection {\n        id\n      }\n    }\n    reservation(instagram: $instagram) @skip(if: $skipReservation) {\n      instagram\n      lineLength\n    }\n  }\n": types.GetReservationReserveDocument,
    "\n  query getArtistId($id: Int!) {\n    collection(artistId: $id) {\n      id\n      username\n    }\n  }\n": types.GetArtistIdDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query collections {\n    collections(first: 20) {\n      id\n      artistId\n      minted\n      name\n      instagram\n      owner {\n        username\n      }\n    }\n    reservations(first: 20) {\n      id\n      instagram\n    }\n  }\n"): (typeof documents)["\n  query collections {\n    collections(first: 20) {\n      id\n      artistId\n      minted\n      name\n      instagram\n      owner {\n        username\n      }\n    }\n    reservations(first: 20) {\n      id\n      instagram\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createPost($input: CreatePostInput!) {\n    CreatePost(input: $input) {\n      collection {\n        id\n        address\n        posts {\n          id\n          lastNftID\n          content\n          createdAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createPost($input: CreatePostInput!) {\n    CreatePost(input: $input) {\n      collection {\n        id\n        address\n        posts {\n          id\n          lastNftID\n          content\n          createdAt\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query meHeader {\n    me {\n      id\n      address\n      collection {\n        id\n        name\n        artistId\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query meHeader {\n    me {\n      id\n      address\n      collection {\n        id\n        name\n        artistId\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query myNfts {\n    me {\n      id\n      nfts {\n        id\n        tokenId\n        artistId\n        collection {\n          username\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query myNfts {\n    me {\n      id\n      nfts {\n        id\n        tokenId\n        artistId\n        collection {\n          username\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query newsfeed {\n    me {\n      nfts {\n        id\n        artistId\n        tokenId\n      }\n    }\n    posts(first: 15) {\n      id\n      lastNftID\n      content\n      createdAt\n      author {\n        id\n        artistId\n        collection {\n          instagram\n          name\n          username\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query newsfeed {\n    me {\n      nfts {\n        id\n        artistId\n        tokenId\n      }\n    }\n    posts(first: 15) {\n      id\n      lastNftID\n      content\n      createdAt\n      author {\n        id\n        artistId\n        collection {\n          instagram\n          name\n          username\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updatePost($input: UpdatePostInput!) {\n    UpdatePost(input: $input) {\n      collection {\n        id\n        posts {\n          content\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updatePost($input: UpdatePostInput!) {\n    UpdatePost(input: $input) {\n      collection {\n        id\n        posts {\n          content\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deletePost($input: DeletePostInput!) {\n    DeletePost(input: $input) {\n      collection {\n        id\n        posts {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation deletePost($input: DeletePostInput!) {\n    DeletePost(input: $input) {\n      collection {\n        id\n        posts {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updatePricing($input: UpdatePricingInput!) {\n    UpdatePricing(input: $input) {\n      tx\n    }\n  }\n"): (typeof documents)["\n  mutation updatePricing($input: UpdatePricingInput!) {\n    UpdatePricing(input: $input) {\n      tx\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BalanceUserFragment on User {\n    id\n    address\n    collection {\n      id\n      pendingFunds\n      minted\n    }\n  }\n"): (typeof documents)["\n  fragment BalanceUserFragment on User {\n    id\n    address\n    collection {\n      id\n      pendingFunds\n      minted\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation withdraw($input: WithdrawInput!) {\n    Withdraw(input: $input) {\n      tx\n    }\n  }\n"): (typeof documents)["\n  mutation withdraw($input: WithdrawInput!) {\n    Withdraw(input: $input) {\n      tx\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation update($input: UpdateCollectionInput!) {\n    UpdateCollection(input: $input) {\n      collection {\n        id\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation update($input: UpdateCollectionInput!) {\n    UpdateCollection(input: $input) {\n      collection {\n        id\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getArtistUsername($username: String!) {\n    me {\n      address\n    }\n    collection(username: $username) {\n      username\n      id\n      artistId\n      minted\n      name\n      description\n      symbol\n      instagram\n      address\n      price\n      priceCents\n      posts {\n        id\n        lastNftID\n        content\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getArtistUsername($username: String!) {\n    me {\n      address\n    }\n    collection(username: $username) {\n      username\n      id\n      artistId\n      minted\n      name\n      description\n      symbol\n      instagram\n      address\n      price\n      priceCents\n      posts {\n        id\n        lastNftID\n        content\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateCheckoutLink($input: CreateCheckoutLinkInput!) {\n    CreateCheckoutLink(input: $input) {\n      link\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCheckoutLink($input: CreateCheckoutLinkInput!) {\n    CreateCheckoutLink(input: $input) {\n      link\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation login($input: LogInMagicLinkInput!) {\n    LogInMagicLink(input: $input) {\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation login($input: LogInMagicLinkInput!) {\n    LogInMagicLink(input: $input) {\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query meLogin {\n    me {\n      id\n      address\n    }\n  }\n"): (typeof documents)["\n  query meLogin {\n    me {\n      id\n      address\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation logInSignatureCreate($input: CreateLogInNonceInput!) {\n    CreateLogInNonce(input: $input) {\n      nonce\n    }\n  }\n"): (typeof documents)["\n  mutation logInSignatureCreate($input: CreateLogInNonceInput!) {\n    CreateLogInNonce(input: $input) {\n      nonce\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation logInSignature($input: LogInSignatureInput!) {\n    LogInSignature(input: $input) {\n      token\n      me {\n        id\n        address\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation logInSignature($input: LogInSignatureInput!) {\n    LogInSignature(input: $input) {\n      token\n      me {\n        id\n        address\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query meNew {\n    me {\n      id\n      address\n      email\n      description\n      collection {\n        id\n        artistId\n        address\n        name\n        instagram\n        startPriceCents\n      }\n    }\n  }\n"): (typeof documents)["\n  query meNew {\n    me {\n      id\n      address\n      email\n      description\n      collection {\n        id\n        artistId\n        address\n        name\n        instagram\n        startPriceCents\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createCollection($input: CreateCollectionInput!) {\n    CreateCollection(input: $input) {\n      tx\n    }\n  }\n"): (typeof documents)["\n  mutation createCollection($input: CreateCollectionInput!) {\n    CreateCollection(input: $input) {\n      tx\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mePosts {\n    me {\n      id\n      collection {\n        id\n        address\n        name\n        artistId\n        username\n        instagram\n        symbol\n        posts {\n          id\n          lastNftID\n          content\n          createdAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query mePosts {\n    me {\n      id\n      collection {\n        id\n        address\n        name\n        artistId\n        username\n        instagram\n        symbol\n        posts {\n          id\n          lastNftID\n          content\n          createdAt\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query meSettings {\n    me {\n      id\n      collection {\n        id\n        artistId\n        description\n        startPriceCents\n        pendingFunds\n      }\n      ...BalanceUserFragment\n    }\n  }\n"): (typeof documents)["\n  query meSettings {\n    me {\n      id\n      collection {\n        id\n        artistId\n        description\n        startPriceCents\n        pendingFunds\n      }\n      ...BalanceUserFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query meClaim {\n    me {\n      id\n      collection {\n        id\n        name\n        artistId\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query meClaim {\n    me {\n      id\n      collection {\n        id\n        name\n        artistId\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getReservationHandle($instagram: String!) {\n    reservation(instagram: $instagram) {\n      instagram\n      lineLength\n      collection {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query getReservationHandle($instagram: String!) {\n    reservation(instagram: $instagram) {\n      instagram\n      lineLength\n      collection {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation reserveArtist($input: ReserveCollectionInput!) {\n    ReserveCollection(input: $input) {\n      position\n    }\n  }\n"): (typeof documents)["\n  mutation reserveArtist($input: ReserveCollectionInput!) {\n    ReserveCollection(input: $input) {\n      position\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getReservationReserveHandle($instagram: String!) {\n    me {\n      id\n      email\n      collection {\n        id\n      }\n    }\n    reservation(instagram: $instagram) {\n      instagram\n      lineLength\n    }\n  }\n"): (typeof documents)["\n  query getReservationReserveHandle($instagram: String!) {\n    me {\n      id\n      email\n      collection {\n        id\n      }\n    }\n    reservation(instagram: $instagram) {\n      instagram\n      lineLength\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getReservationReserve($instagram: String!, $skipReservation: Boolean!) {\n    me {\n      id\n      email\n      collection {\n        id\n      }\n    }\n    reservation(instagram: $instagram) @skip(if: $skipReservation) {\n      instagram\n      lineLength\n    }\n  }\n"): (typeof documents)["\n  query getReservationReserve($instagram: String!, $skipReservation: Boolean!) {\n    me {\n      id\n      email\n      collection {\n        id\n      }\n    }\n    reservation(instagram: $instagram) @skip(if: $skipReservation) {\n      instagram\n      lineLength\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getArtistId($id: Int!) {\n    collection(artistId: $id) {\n      id\n      username\n    }\n  }\n"): (typeof documents)["\n  query getArtistId($id: Int!) {\n    collection(artistId: $id) {\n      id\n      username\n    }\n  }\n"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;