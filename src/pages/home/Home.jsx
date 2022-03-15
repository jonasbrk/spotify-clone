import React, { useState, useEffect, useContext } from 'react';
import './Home.styles.css';
import { DisplayRow, Loading } from '../../components/index';
import axios from 'axios';
import { TokenContext, TrackContext } from '../../utils/context';
import qs from 'qs';
const Home = () => {
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

        axios.get(
          'https://api.spotify.com/v1/recommendations/available-genre-seeds',
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        ),

        axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }),
        axios.get(
          'https://api.spotify.com/v1/browse/featured-playlists?country=BR',
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        ),
        axios.get('https://api.spotify.com/v1/browse/new-releases?country=BR', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }),
        axios.get('https://api.spotify.com/v1/browse/categories?country=BR', {
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
            featured_playlists,
            new_releases,
            playlist_categories,
          ] = data;

          const user_genres = top_user_artists.data.items
            .map((e) => {
              return e.genres;
            })
            .reduce((previous, current) => {
              return previous.concat(current);
            });

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
          console.log(recent_played.data.items[0].track.id);
          const recomendationDataRequest = qs.stringify({
            seed_artists: recent_played.data.items[0].track.artists[0].id,
            seed_genres: top_user_genres[0],
            seed_tracks: top_user_tracks.data.items[0].id,
          });
          console.log(recomendationDataRequest);
          Promise.all([
            axios.get(
              'https://api.spotify.com/v1/recommendations?' +
                recomendationDataRequest,
              {
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                },
              },
            ),
            axios.get(
              `https://api.spotify.com/v1/browse/categories/${top_user_genres[0]}/playlists`,
              {
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                },
              },
            ),
            axios.get(
              'https://api.spotify.com/v1/browse/categories/toplists/playlists',
              {
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                },
              },
            ),
            axios.get(
              'https://api.spotify.com/v1/browse/categories/mood/playlists',
              {
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                },
              },
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
                recent_played: recent_played.data,
                top_user_tracks: top_user_tracks.data,
                top_user_artists: top_user_artists.data,
                available_genre_seeds: available_genre_seeds.data,
                currently_playing: currently_playing.data,
                featured_playlists: featured_playlists.data,
                new_releases: new_releases.data,
                playlist_categories: playlist_categories.data,
                top_genre_playlists: top_genre_playlists.data.playlists,
                top_list_category: top_list_category.data.playlists,
                mood_category: mood_category.data.playlists,
                recommendation: recommendation.data,
              });

              setCurrentTrack({
                ...recent_played.data.items[0].track,
                init_load: true,
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
        <div className="home">
          <DisplayRow
            title="Tocado recentemente"
            type="card"
            data={homeData.recent_played.items
              .map((e) => {
                return e.track;
              })
              .filter((value, index, self) => {
                return (
                  index === self.findIndex((t) => t.album.id === value.album.id)
                );
              })}
          />
          <DisplayRow
            title="Recomendados de hoje"
            type="card"
            data={homeData.recommendation.tracks}
          />
          <DisplayRow
            title="As mais ouvidas por você"
            type="card"
            data={homeData.top_user_tracks.items}
          />
          <DisplayRow
            title="Pop"
            type="playlist"
            data={homeData.top_genre_playlists.items}
          />
          <DisplayRow
            title="Seu astral"
            type="playlist"
            data={homeData.mood_category.items}
          />
          <DisplayRow
            title="Tops do momento"
            type="playlist"
            data={homeData.top_list_category.items}
          />
          <DisplayRow
            title="Lançamentos"
            type="playlist"
            data={homeData.new_releases.albums.items}
          />
        </div>
      )}
    </>
  );
};
export default Home;
