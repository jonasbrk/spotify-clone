import React, { useState, useRef, useEffect, useContext } from 'react';
import './Home.styles.css';
import { DisplayRow, Loading, Player } from '../../components/index';
import axios from 'axios';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import qs from 'qs';
const Home = (props) => {
  const HomeRef = useRef(null);
  const { accessToken } = useContext(TokenContext);
  const { setCurrentTrack } = useContext(TrackContext);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({});

  useEffect(() => {
    console.log(homeData);
  }, [homeData]);

  useEffect(() => {
    if (accessToken) {
      Promise.all([
        axios.get('https://api.spotify.com/v1/me/player/recently-played', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }),

        axios.get('https://api.spotify.com/v1/me/top/tracks', {
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
        }),

        axios.get('https://api.spotify.com/v1/me/top/artists', {
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
            return e;
          }),

        axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }),
      ])
        .then((data) => {
          const [
            recent_played,
            top_user_tracks,
            top_user_artists,
            available_genre_seeds,
            currently_playing,
          ] = data;

          axios
            .get(
              'https://api.spotify.com/v1/artists/' +
                recent_played.data.items[0].track.artists[0].id,
              {
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                },
              },
            )
            .then((e) => {
              const recomendationDataRequest = qs.stringify({
                seed_artists: recent_played.data.items[0].track.artists[0].id,
                seed_genres: e.data.genres
                  .filter((e, index) => {
                    return index < 1;
                  })
                  .join(),
                seed_tracks: top_user_tracks.data.items[0].id,
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
                  setHomeData({
                    recent_played: recent_played.data,
                    top_user_tracks: top_user_tracks.data,
                    top_user_artists: top_user_artists.data,
                    available_genre_seeds: available_genre_seeds.data,
                    currently_playing: currently_playing.data,
                    recommendation: e.data,
                  });

                  setCurrentTrack({
                    ...recent_played.data.items[0].track,
                    init_load: true,
                  });

                  setLoading(false);
                })
                .catch((e) => console.log(e.response));
            });
        })
        .catch((e) => {
          console.log(e.response);
        });
    }
  }, [accessToken]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="home">
          <DisplayRow
            title="Tocado recentemente"
            data={homeData.recent_played.items.map((e) => {
              return e.track;
            })}
          />
          <DisplayRow
            title="Feito para você"
            data={homeData.recommendation.tracks}
          />
          <DisplayRow
            title="As mais ouvidas por você"
            data={homeData.top_user_tracks.items}
          />
        </div>
      )}
    </>
  );
};
export default Home;
