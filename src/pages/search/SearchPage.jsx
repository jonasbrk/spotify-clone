import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DisplayFull,
  TrackList,
  PageHeader,
  Loading,
  SearchBar,
  DisplayRow,
} from '../../components';
import { TokenContext } from '../../utils/context';
import { generateRandomColor, useResponseFormater } from '../../utils';
import './SearchPage.styles.css';

export const SearchPage = () => {
  const { accessToken } = useContext(TokenContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [categoriesData, setCategoriesData] = useState('');

  useEffect(() => {
    if (accessToken && searchParams.get('q')) {
      axios
        .get(
          'https://api.spotify.com/v1/search?type=album,artist,playlist,track&q=' +
            searchParams.get('q'),
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        )
        .then((e) => {
          setSearchData({
            tracks: e.data.tracks.items.map((item) =>
              useResponseFormater(item),
            ),
            albums: e.data.albums.items.map((item) =>
              useResponseFormater(item),
            ),
            artists: e.data.artists.items.map((item) =>
              useResponseFormater(item),
            ),
            playlists: e.data.playlists.items.map((item) =>
              useResponseFormater(item),
            ),
          });
        });
    } else setSearchData([]);
  }, [accessToken, searchParams]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get(
          'https://api.spotify.com/v1/browse/categories?country=BR&limit=50',
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        )
        .then((e) => {
          setCategoriesData(e.data);
          setLoading(false);
        });
    }
  }, [accessToken]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page__wrapper">
          <PageHeader bgColor="rgb(18, 18, 18)" disabled={true} />
          <div className="collection__playlists">
            {searchData.length != 0 ? (
              <>
                <div className="search__first__section">
                  <h2>Songs</h2>
                  <TrackList
                    data={{
                      type: 'search',
                      tracks: searchData.tracks,
                    }}
                  />
                </div>
                <DisplayRow
                  title="Artists"
                  data={searchData.artists.filter((e) => e.images.length != 0)}
                />
                <DisplayRow title="Albums" data={searchData.albums} />
                <DisplayRow title="Playlists" data={searchData.playlists} />
              </>
            ) : (
              <DisplayFull title="Navegar por todas as seções">
                {categoriesData.categories.items.map((e, index) => (
                  <Link
                    style={{ backgroundColor: generateRandomColor() }}
                    className="card__type--category"
                    key={index}
                    to={'/genre/' + e.id}
                  >
                    <img className="card__img" src={e.icons[0].url} alt="" />

                    <div className="card__title">
                      <span>{e.name}</span>
                    </div>
                  </Link>
                ))}
              </DisplayFull>
            )}
          </div>
        </div>
      )}
    </>
  );
};
