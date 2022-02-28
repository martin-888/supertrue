/**
 * General Helper Functions
 */

const url = "https://us-central1-supertrue-5bc93.cloudfunctions.net";

export const __ = {
    getNFTImage(artistId, tokenId){ return `${url}/api/artist/${artistId}/image${artistId > 7 ? "-new" : ""}/${tokenId}`; },
    getArtistNFTImage(artist, fanNumber){ return `${url}/api/artist/${artist.id}/image${artist.id > 7 ? "-new" : ""}/${fanNumber ? fanNumber : artist.minted+1}`; },
    getArtistImage(artist){ return `https://storage.googleapis.com/supertrue-5bc93.appspot.com/${artist.id}.jpg`; },
};

export default __;
