/**
 * General Helper Functions
 */

const url = process.env.REACT_APP_FIREBASE_STORAGE_URL;

export const __ = {
  getNFTImage(artistId, tokenId) {
    return `${url}/nfts/${artistId}/${tokenId}.png`;
  },
  getArtistImage(artistId) {
    return `${url}/profile/${artistId}.jpg`;
  },
  getShareImage(artistId) {
    return `${url}/share/${artistId}.png`;
  },
};

export default __;
