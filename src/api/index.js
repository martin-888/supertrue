const endpoint = "https://us-central1-supertrue-5bc93.cloudfunctions.net/api";
// const endpoint = "http://localhost:5003/supertrue-5bc93/us-central1/api";

const getArtist = (id) => {
  return fetch(`${endpoint}/artist/${id}`).then(resp => resp.json());
}

const auth = ({ code, redirectUrl }) => {
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ code, redirectUrl })
  };

  return fetch(`${endpoint}/artist/auth`, options).then(resp => resp.json());
}

const getAuthSignature1 = ({ artistId }) => {
  return fetch(`${endpoint}/artist/${artistId}/signature1`).then(resp => resp.json());
}

const getAuthSignature2 = ({ artistId }) => {
  return fetch(`${endpoint}/artist/${artistId}/signature2`).then(resp => resp.json());
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
  createArtist,
  updateArtist,
  auth,
  getAuthSignature1,
  getAuthSignature2
};
