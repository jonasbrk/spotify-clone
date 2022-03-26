import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { NoAlbumImg } from '../../assets/svg';
import {
  DisplayFull,
  TrackList,
  Display,
  PageHeader,
  Loading,
  SearchBar,
  DisplayRow,
} from '../../components';
import { TokenContext } from '../../utils/context';
import './SearchPage.styles.css';

export const SearchPage = () => {
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [categoriesData, setCategoriesData] = useState('');
  const [trackList, setTrackList] = useState({ type: 'search', tracks: [] });

  const handleSearch = (value) => {
    setInputValue(value);
  };
  useEffect(() => {
    if (accessToken && inputValue) {
      axios
        .get(
          'https://api.spotify.com/v1/search?type=album,artist,playlist,track&q=' +
            inputValue,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        )
        .then((e) => {
          const { albums, artists, playlists, tracks } = e.data;
          setSearchData(e.data);

          setTrackList({
            type: 'search',
            tracks: tracks.items,
          });
        });
    } else setSearchData([]);
  }, [accessToken, inputValue]);

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

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
          <PageHeader bgColor="rgb(18, 18, 18)" disabled={true}>
            <div className="searchBar">
              <SearchBar onChange={handleSearch} />
            </div>
          </PageHeader>
          <div className="collection__playlists">
            {searchData.length != 0 ? (
              <>
                <div className="search__first__section">
                  <h2>Songs</h2>
                  <TrackList data={trackList} />
                </div>
                <DisplayRow
                  title="Artists"
                  type="artists"
                  data={searchData.artists.items.filter(
                    (e) => e.images.length != 0,
                  )}
                />
                <DisplayRow
                  title="Albums"
                  type="albums"
                  data={searchData.albums.items}
                />
                <DisplayRow
                  title="Playlists"
                  type="playlists"
                  data={searchData.playlists.items}
                />
              </>
            ) : (
              <DisplayFull
                title="Navegar por todas as seções"
                type="category"
                data={categoriesData.categories.items}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
