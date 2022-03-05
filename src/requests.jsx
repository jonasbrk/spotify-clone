import axios from 'axios';
import qs from 'qs';
import { client_id, client_secret, uri } from './credentials';

export const onLoadRequestsData = (
  setLoading,
  setAccessToken,
  setRefreshToken,
  setLoadData,
) => {
  let accessToken = '';
  let refresh_token = '';
  let recentPlayedData = '';
  let recommendationsData = '';
  let topUserItemsTracks = '';
  let topUserItemsArtists = '';
  let currentlyPlaying = '';
  let availableGenre = '';
  let topUserArtistData = [];

  const querryString = window.location.search;
  if (querryString.length > 0) {
    const urlParams = new URLSearchParams(querryString);
    const token = urlParams.get('code');
    window.history.pushState('', '', uri);
    const data = qs.stringify({
      grant_type: 'authorization_code',
      code: urlParams.get('code'),
      redirect_uri: uri,
      client_id: client_id,
      client_secret: client_secret,
    });
    axios
      .post('https://accounts.spotify.com/api/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
        },
      })
      .then((request) => {
        accessToken = request.data.access_token;
        refresh_token = request.data.refresh_token;
        setAccessToken(accessToken);
        setRefreshToken(refresh_token);
        getdata();
      })
      .catch((e) => {
        console.log(e.response);
      });
  }

  const getdata = () => {
    let recomendationDataRequest;
    Promise.all([
      axios
        .get('https://api.spotify.com/v1/me/player/recently-played', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((e) => {
          recentPlayedData = e.data;
        })
        .catch((e) => {
          console.log(e.response);
        }),

      axios
        .get('https://api.spotify.com/v1/me/top/tracks', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
          data: {
            items: [{}],
            limit: 50,
            next: null,
            offset: 0,
            previous: null,
            total: 50,
          },
        })
        .then((e) => {
          topUserItemsTracks = e.data;
        })
        .catch((e) => {
          console.log(e.response);
        }),

      axios
        .get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
          data: {
            items: [{}],
            limit: 50,
            next: null,
            offset: 0,
            previous: null,
            total: 50,
          },
        })
        .then((e) => {
          topUserItemsArtists = e.data;
        })
        .catch((e) => {
          console.log(e.response);
        }),

      axios
        .get(
          'https://api.spotify.com/v1/recommendations/available-genre-seeds',
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        )
        .then((e) => {
          availableGenre = e.data;
        })
        .catch((e) => {
          console.log(e.response);
        }),

      axios
        .get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((e) => {
          currentlyPlaying = e.data;
        })
        .catch((e) => {
          console.log(e.response);
        }),
    ]).then((e) => {
      axios
        .get(
          'https://api.spotify.com/v1/artists/' +
            recentPlayedData.items[0].track.artists[0].id,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        )
        .then((e) => {
          topUserArtistData = e.data;
          recomendationDataRequest = qs.stringify({
            seed_artists: recentPlayedData.items
              .filter((e, index) => {
                return index == 0;
              })
              .map((e) => {
                return e.track.artists[0].id;
              })
              .join(),
          });
          axios
            .get(
              'https://api.spotify.com/v1/recommendations?' +
                recomendationDataRequest,
              {
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                },
              },
            )
            .then((e) => {
              recommendationsData = e.data;
              setData();
            })
            .catch((e) => {
              console.log(e.response);
            });
        })
        .catch((e) => {
          console.log(e.response);
        });
    });
  };

  const setData = () => {
    setLoadData({
      recentPlayedData: recentPlayedData,
      recommendationsData: recommendationsData,
      topUserItemsTracks: topUserItemsTracks,
      topUserItemsArtists: topUserItemsArtists,
      currentlyPlaying: currentlyPlaying,
      availableGenre: availableGenre,
      topUserArtistData: topUserArtistData,
    });
    setLoading(false);
  };
};
export const onClickRequest = (accessToken, data, setLoadData) => {
  axios
    .post(
      'https://api.spotify.com/v1/me/player/play',
      {
        context_uri: 'spotify:track:30929halSXzxtYut5Jm152',
        offset: {
          position: 0,
        },
        position_ms: 0,
      },
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    )
    .then((e) => {
      console.log(e.data);
    })
    .catch((e) => {
      console.log(e.response);
    });
};

// RECOMENDATION
// let Data = {
//   seed_artists: data.recentPlayedData.items
//     .map((e) => {
//       return e.track.artists[0].id;
//     })
//     .join(),
//   seed_genres: data.availableGenre.genres.join(),
//   seed_tracks: data.topUserItemsTracks.items
//     .map((e) => {
//       return e.id;
//     })
//     .join(),
// };

// axios
//   .get('https://api.spotify.com/v1/recommendations?' + qs.stringify(Data), {
//     headers: {
//       Authorization: 'Bearer ' + accessToken,
//     },
//   })
//   .then((e) => {
//     console(e.data);
//   })
//   .catch((e) => {
//     console.log(e.response);
//   });
