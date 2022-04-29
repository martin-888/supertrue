// const endpoint = "https://us-central1-supertrue-5bc93.cloudfunctions.net/api";
const endpoint = "http://localhost:5005/supertrue-5bc93/us-central1/api";

const getArtist = (id) => {
  return fetch(`${endpoint}/artist/${id}`).then(resp => resp.json());
}

const getInstagramData = (instagram) => {
  return fetch(`${endpoint}/artist/instagram/${instagram}`).then(resp => resp.json());
}

const getCreateSignature1 = ({ instagram }) => {
  return fetch(`${endpoint}/sign/1/create/${instagram}`).then(resp => resp.json());
}

const getCreateSignature2 = ({ instagram }) => {
  return fetch(`${endpoint}/sign/2/create/${instagram}`).then(resp => resp.json());
}

const getClaimSignature1 = ({ artistId }) => {
  return fetch(`${endpoint}/sign/1/claim/${artistId}`).then(resp => resp.json());
}

const getClaimSignature2 = ({ artistId }) => {
  return fetch(`${endpoint}/sign/2/claim/${artistId}`).then(resp => resp.json());
}

const createArtist = ({ tx }) => {
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ tx })
  };

  return fetch(`${endpoint}/artist`, options).then(resp => resp.json());
}

const updateArtist = ({ signature, description, name, artistId }) => {
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PUT",
    body: JSON.stringify({ signature, description, name })
  };

  return fetch(`${endpoint}/artist/${artistId}`, options).then(resp => resp.json());
}

export {
  getArtist,
  getInstagramData,
  createArtist,
  updateArtist,
  getCreateSignature1,
  getCreateSignature2,
  getClaimSignature1,
  getClaimSignature2
};
