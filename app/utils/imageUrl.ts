const url = ENV.FIREBASE_STORAGE_URL;

export function getNFTImage(artistId: Number, tokenId: Number) {
  return `${url}/nfts/${artistId}/${tokenId}.png`;
}

export function getArtistImage(artistId: Number) {
  return `${url}/profile/${artistId}.jpg`;
}

export function getShareImage(artistId: Number) {
  return `${url}/share/${artistId}.png`;
}
