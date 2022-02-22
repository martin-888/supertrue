/**
 * General Helper Functions
 */
export const __ = {
    getArtistNFTImage(artist, fanNumber){ return `https://us-central1-supertrue-5bc93.cloudfunctions.net/api/artist/${artist.id}/image/${fanNumber ? fanNumber : artist.minted+1}`; },
    getArtistImage(artist){ return `https://storage.googleapis.com/supertrue-5bc93.appspot.com/${artist.id}.jpg`; },
};
  
export default __;
  