import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { CardFullSection, Loading, PageHeader } from '../components';

import { TokenContext } from '../utils/context';
import { useResponseFormater } from '../utils';

import './styles/Template.styles.css';

export const GenreTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [pageData, setPageData] = useState('');
  const { id } = useParams();

  useEffect(() => {
    setData('');
    setLoading(true);
    if (accessToken)
      Promise.all([
        axios
          .get(
            `https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=50`,
            {
              headers: {
                Authorization: 'Bearer ' + accessToken,
              },
            },
          )
          .then((e) => {
            setData(
              e.data.playlists.items.map((item) => useResponseFormater(item)),
            );
          }),
        axios
          .get(`https://api.spotify.com/v1/browse/categories/${id}`, {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          })
          .then((e) => {
            setPageData(e.data);
          }),
      ]).then(() => {
        setLoading(false);
      });
  }, [id, accessToken]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page__wrapper">
          <PageHeader bgColor="rgb(18, 18, 18)" />
          <div className="genre__header">
            <h1>{pageData.name}</h1>
          </div>
          <div className="genre__template">
            <CardFullSection data={data} />
          </div>
        </div>
      )}
    </>
  );
};
