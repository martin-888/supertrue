const endpoint = "https://us-central1-supertrue-5bc93.cloudfunctions.net/api";
// const endpoint = "http://localhost:5003/supertrue-5bc93/us-central1/api";

const getArtists = () => { // TODO replace with thegraph
  return fetch(`${endpoint}/artist`).then(resp => resp.json());
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

export {
  getArtists,
  createArtist
};
