/**
 * General Helper Functions
 */

const url = "https://storage.googleapis.com/supertrue-5bc93.appspot.com";

export const __ = {
    getNFTImage(artistId, tokenId){ return `${url}/nfts/${artistId}/${tokenId}.png`; },
    getArtistNFTImage(artist, fanNumber){ return `${url}/nfts/${artist.id}/${fanNumber ? fanNumber : artist.minted+1}.png`; },
    getArtistImage(artistId){ return `${url}/profile/${artistId}.jpg`; },
};

export default __;
