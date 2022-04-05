import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import {
  CardFullSection,
  PageHeader,
  Loading,
  CardLiked,
} from '../../components';

import { TokenContext } from '../../utils/context';
import { useResponseFormater } from '../../utils';

import './styles/Collection.styles.css';

export const CollectionPlaylists = () => {
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState({});
  const [userLiked, setUserLiked] = useState('');

  useEffect(() => {
    if (accessToken)
      Promise.all([
        axios
          .get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then(({ data }) => {
            setUserPlaylists(
              data.items.map((item) => useResponseFormater(item)),
            );
            console.log(data.items.map((item) => useResponseFormater(item)));
          }),

        axios
          .get('https://api.spotify.com/v1/me/tracks', {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then((e) => {
            const { items } = e.data;
            setUserLiked({
              name: 'Liked Songs',
              type: 'playlist',
              tracks: items.map((e) => {
                return e.track;
              }),
            });
          }),
      ]).then(() => {
        setLoading(false);
      });
  }, [accessToken]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page__wrapper">
          <PageHeader bgColor="rgb(18, 18, 18)" disabled={true} />

          <div className="collection">
            <CardFullSection
              title="Playlists"
              data={userPlaylists.map((e) => {
                return { ...e, description: `De ${e.owner.display_name}` };
              })}
            >
              <CardLiked itemInfo={userLiked} />
            </CardFullSection>
          </div>
        </div>
      )}
    </>
  );
};
