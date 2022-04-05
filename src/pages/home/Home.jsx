import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';

import { CardRowSection, Loading, PageHeader } from '../../components/index';

import { useResponseFormater } from '../../utils';
import { TokenContext } from '../../utils/context';

import './Home.styles.css';

const Home = () => {
  const homeRef = useRef(null);
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    recent_played: [],
    top_user_tracks: [],
    top_user_artists: [],
    new_releases: [],
    top_genre_playlists: [],
    top_list_category: [],
    mood_category: [],
    recommendation: [],
  });

  const {
    recent_played,
    top_user_tracks,
    top_user_artists,
    new_releases,
    top_genre_playlists,
    top_list_category,
    mood_category,
    recommendation,
  } = homeData;

  useEffect(() => {
    if (accessToken) {
      Promise.all([
        axios
          .get('https://api.spotify.com/v1/me/player/recently-played', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then(({ data }) =>
            data.items.map((element) => useResponseFormater(element.track)),
          )
          .catch((e) => console.log(e)),
        axios
          .get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then(({ data }) =>
            data.items.map((element) => useResponseFormater(element)),
          ),

        axios
          .get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then(({ data }) =>
            data.items.map((element) => useResponseFormater(element)),
          ),

        axios
          .get('https://api.spotify.com/v1/browse/new-releases?country=BR', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then(({ data }) =>
            data.albums.items.map((element) => useResponseFormater(element)),
          ),
      ])
        .then((data) => {
          const [
            recent_played,
            top_user_tracks,
            top_user_artists,
            new_releases,
          ] = data;

          const user_genres = top_user_artists
            .map((e) => e.genres.join(' '))
            .join(' ')
            .split(' ');

          const top_user_genres = user_genres
            .sort((a, b) => {
              if (
                user_genres.filter((e) => {
                  return e == a;
                }).length >
                user_genres.filter((e) => {
                  return e == b;
                }).length
              ) {
                return -1;
              }
            })
            .filter((value, index, self) => {
              return index === self.findIndex((t) => t === value);
            });

          const recomendationQuerry = qs.stringify({
            seed_artists: recent_played[0].artists[0].id,
            seed_genres: top_user_genres[0],
            seed_tracks: top_user_tracks[0].id,
          });

          Promise.all([
            axios
              .get(
                'https://api.spotify.com/v1/recommendations?' +
                  recomendationQuerry,
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                },
              )
              .then(({ data }) =>
                data.tracks.map((element) => useResponseFormater(element)),
              ),
            axios
              .get(
                `https://api.spotify.com/v1/browse/categories/${top_user_genres[0]}/playlists?country=BR`,
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                },
              )
              .then(({ data }) =>
                data.playlists.items.map((element) =>
                  useResponseFormater(element),
                ),
              ),
            axios
              .get(
                'https://api.spotify.com/v1/browse/categories/toplists/playlists?country=BR',
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                },
              )
              .then(({ data }) =>
                data.playlists.items.map((element) =>
                  useResponseFormater(element),
                ),
              ),
            axios
              .get(
                'https://api.spotify.com/v1/browse/categories/mood/playlists?country=BR',
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                },
              )
              .then(({ data }) =>
                data.playlists.items.map((element) =>
                  useResponseFormater(element),
                ),
              ),
          ])

            .then((data) => {
              const [
                recommendation,
                top_genre_playlists,
                top_list_category,
                mood_category,
              ] = data;

              setHomeData({
                recent_played: recent_played,
                top_user_tracks: top_user_tracks,
                top_user_artists: top_user_artists,
                new_releases: new_releases,
                top_genre_playlists: top_genre_playlists,
                top_list_category: top_list_category,
                mood_category: mood_category,
                recommendation: recommendation,
              });
              setLoading(false);
            })
            .catch((e) => console.log(e.response));
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
        <>
          <div className="page__wrapper">
            <PageHeader bgColor="rgb(32, 120, 160)" />
            <div className="home" ref={homeRef}>
              <CardRowSection
                title="Tocado recentemente"
                data={recent_played.filter(
                  (value, index, self) =>
                    index ===
                    self.findIndex((t) => t.album.id === value.album.id),
                )}
              />
              <CardRowSection
                title="Recomendados de hoje"
                data={recommendation}
              />
              <CardRowSection
                title="As mais ouvidas por você"
                data={top_user_tracks}
              />
              <CardRowSection
                title="Artistas mais ouvidos por você"
                data={top_user_artists}
              />
              <CardRowSection title="Pop" data={top_genre_playlists} />
              <CardRowSection title="Seu astral" data={mood_category} />
              <CardRowSection
                title="Tops do momento"
                data={top_list_category}
              />
              <CardRowSection title="Lançamentos" data={new_releases} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Home;
