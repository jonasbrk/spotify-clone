import axios from 'axios';

export const SpotifyApi = (Type, access_token, URL, Body) => {
  let response = '';

  axios(URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data: Body,
    method: Type,
  })
    .then((e) => {
      response = e;
    })
    .catch((e) => {
      console.log(e.response);
    });
  return response;
};
