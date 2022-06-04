/**
 * General Helper Functions
 */

const url = "https://us-central1-supertrue-5bc93.cloudfunctions.net";

export const __ = {
    getNFTImage(artistId, tokenId){ return `${url}/api/artist/${artistId}/image/${tokenId}`; },
    getArtistNFTImage(artist, fanNumber){ return `${url}/api/artist/${artist.id}/image/${fanNumber ? fanNumber : artist.minted+1}`; },
    getArtistImage(artistId){ return `https://storage.googleapis.com/supertrue-5bc93.appspot.com/profile/${artistId}.jpg`; },
};

export default __;
