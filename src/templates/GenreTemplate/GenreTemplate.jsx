import React, { useContext, useEffect, useState } from 'react';
import './GenreTemplate.styles.css';
import { DisplayFull, Loading, PageHeader } from '../../components';

import axios from 'axios';
import { TokenContext } from '../../utils/context';
import { useParams } from 'react-router-dom';

export const GenreTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [pageData, setPageData] = useState('');
  const { id } = useParams();

  useEffect(() => {
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
          setData(e.data);
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
  }, [id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page__wrapper">
          <PageHeader bgColor="rgb(18, 18, 18)" disabled={true} />
          <div className="genre__header">
            <h1>{pageData.name}</h1>
          </div>
          <div className="genre__template">
            <DisplayFull type="playlists" data={data.playlists.items} />
          </div>
        </div>
      )}
    </>
  );
};
