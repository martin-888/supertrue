/**
 * General Helper Functions
 */
export const __ = {
    getArtistNFTImage(artist){ return `https://us-central1-supertrue-5bc93.cloudfunctions.net/api/artist/${artist.id}/image/${artist.minted}`; }
};
  
export default __;
  