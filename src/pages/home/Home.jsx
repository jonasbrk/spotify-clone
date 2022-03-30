import React, { useState, useEffect, useContext, useRef } from 'react';
import { DisplayRow, Loading, PageHeader } from '../../components/index';
import { TokenContext } from '../../utils/context';
import axios from 'axios';
import qs from 'qs';
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
    console.log(homeData);
    console.log(homeRef);
  }, [homeData, homeRef]);

  useEffect(() => {
    if (accessToken) {
      Promise.all([
        axios
          .get('https://api.spotify.com/v1/me/player/recently-played', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then((response) =>
            response.data.items.map((element) => ({
              id: element.track.id,
              uri: element.track.uri,
              artist: element.track.artists,
              name: element.track.name,
              description: '',
              images: element.track.album.images,
              type: element.track.type,
              index: element.track.track_number,
              context: element.context,
              album: {
                id: element.track.album.id,
                uri: element.track.album.uri,
                artist: element.track.album.artists,
                name: element.track.album.name,
              },
            })),
          ),
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
          .then((response) =>
            response.data.items.map((element) => ({
              id: element.id,
              uri: element.uri,
              artist: element.artists,
              name: element.name,
              description: '',
              images: element.album.images,
              type: element.type,
              index: element.track_number,
              context: null,
              album: {
                id: element.album.id,
                uri: element.album.uri,
                artist: element.album.artists,
                name: element.album.name,
              },
            })),
          ),

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
          .then((response) =>
            response.data.items.map((element) => ({
              id: element.id,
              uri: element.uri,
              name: element.name,
              description: 'Artist',
              images: element.images,
              type: element.type,
              genres: element.genres,
            })),
          ),

        axios
          .get('https://api.spotify.com/v1/browse/new-releases?country=BR', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then((response) =>
            response.data.albums.items.map((element) => ({
              id: element.id,
              uri: element.uri,
              artist: element.artists,
              name: element.name,
              description: '',
              images: element.images,
              type: element.type,
            })),
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

          const recomendationDataRequest = qs.stringify({
            seed_artists: recent_played[0].artist[0].id,
            seed_genres: top_user_genres[0],
            seed_tracks: top_user_tracks[0].id,
          });

          Promise.all([
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
              .then((response) =>
                response.data.tracks.map((element) => ({
                  id: element.id,
                  uri: element.uri,
                  artist: element.artists,
                  name: element.name,
                  description: '',
                  images: element.album.images,
                  type: element.type,
                  index: element.track_number,
                  album: {
                    id: element.album.id,
                    uri: element.album.uri,
                    artist: element.album.artists,
                    name: element.album.name,
                  },
                })),
              ),
            axios
              .get(
                `https://api.spotify.com/v1/browse/categories/${top_user_genres[0]}/playlists`,
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                },
              )
              .then((response) =>
                response.data.playlists.items.map((element) => ({
                  id: element.id,
                  uri: element.uri,
                  artist: element.artists,
                  name: element.name,
                  description: element.description,
                  images: element.images,
                  type: element.type,
                  index: 0,
                  owner: element.owner,
                })),
              ),
            axios
              .get(
                'https://api.spotify.com/v1/browse/categories/toplists/playlists',
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                },
              )
              .then((response) =>
                response.data.playlists.items.map((element) => ({
                  id: element.id,
                  uri: element.uri,
                  artist: element.artists,
                  name: element.name,
                  description: element.description,
                  images: element.images,
                  type: element.type,
                  index: 0,
                  owner: element.owner,
                })),
              ),
            axios
              .get(
                'https://api.spotify.com/v1/browse/categories/mood/playlists',
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                },
              )
              .then((response) =>
                response.data.playlists.items.map((element) => ({
                  id: element.id,
                  uri: element.uri,
                  artist: element.artists,
                  name: element.name,
                  description: element.description.search('<a')
                    ? element.name
                    : element.description,
                  images: element.images,
                  type: element.type,
                  index: 0,
                  owner: element.owner,
                })),
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
              console.log({
                recent_played: recent_played,
                top_user_tracks: top_user_tracks,
                top_user_artists: top_user_artists,
                new_releases: new_releases,
                top_genre_playlists: top_genre_playlists,
                top_list_category: top_list_category,
                mood_category: mood_category,
                recommendation: recommendation,
              });
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
              <DisplayRow
                title="Tocado recentemente"
                data={recent_played.filter(
                  (value, index, self) =>
                    index ===
                    self.findIndex((t) => t.album.id === value.album.id),
                )}
              />
              <DisplayRow title="Recomendados de hoje" data={recommendation} />
              <DisplayRow
                title="As mais ouvidas por você"
                data={top_user_tracks}
              />
              <DisplayRow
                title="Artistas mais ouvidos por você"
                data={top_user_artists}
              />
              <DisplayRow title="Pop" data={top_genre_playlists} />
              <DisplayRow title="Seu astral" data={mood_category} />
              <DisplayRow title="Tops do momento" data={top_list_category} />
              <DisplayRow title="Lançamentos" data={new_releases} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Home;
