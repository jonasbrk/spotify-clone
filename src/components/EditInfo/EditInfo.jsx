import React, { useContext, useEffect, useState } from 'react';
import { Modal, Cover } from '..';
import { AttentionImg } from '../../assets/svg';
import { TokenContext } from '../../utils/context';
import './EditInfo.styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const EditInfo = ({ isOpen, setIsOpen, data, id }) => {
  const { color, title, name, cover, type, owner, total_tracks } = data;
  const { accessToken } = useContext(TokenContext);
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [imgInput, setImgInput] = useState('');
  const [base64, setBase64] = useState('');
  const [alert, setAlert] = useState('');

  const alertLevel = ['#e9a414', '#e91429'];

  const alertmessages = {
    imageSizeErr: ['A imagem não pode ser maior que 256KB', 0],
    imageUndefinedErr: ['Por favor selecione uma imagem valida', 0],
    titleErr: ['O nome da playlist é obrigatório.', 1],
  };

  useEffect(() => {
    if (!isOpen) {
      setTitleInput(data.name);
      setDescriptionInput(data.description);
      setImgInput(data.cover && data.cover[0].url);
      setAlert('');
      console.log(isOpen);
    }
  }, [isOpen, id, data]);

  function handleReaderLoaded(readerEvent) {
    let binaryString = readerEvent.target.result;
    setBase64(btoa(binaryString));
  }

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    if (validateFile(file)) {
      file.preview = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      reader.readAsBinaryString(file);
      setImgInput(file.preview);
      setAlert('');
    }
  };

  const navigate = useNavigate(null);
  const handleSaveChange = () => {
    Promise.all([
      base64 &&
        axios(`https://api.spotify.com/v1/playlists/${id}/images`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'image/jpeg',
          },
          method: 'PUT',
          data: base64,
        }),
      axios(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        method: 'PUT',
        data: {
          name: titleInput,
          description: descriptionInput,
        },
      }),
    ]).then(() => {
      console.log('feito');
      navigate('/');
      setTimeout(() => {
        navigate('/playlist/' + id);
      }, 0);
    });
  };

  useEffect(() => {
    if (!titleInput) setAlert(alertmessages.titleErr);
    else setAlert('');
  }, [titleInput]);

  function validateFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (typeof file !== 'undefined' && validTypes.indexOf(file.type) === -1) {
      console.log('Please upload an image');
      setAlert(alertmessages.imageUndefinedErr);
      return false;
    }

    if (typeof file !== 'undefined' && file.size > 1024 * 256) {
      console.log('Image cant be more than 256KB');
      setAlert(alertmessages.imageSizeErr);
      return false;
    }
    return true;
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="edit__info">
        <p
          style={{ backgroundColor: alertLevel[alert[1]] }}
          className={`edit__alert ${alert && 'edit__alert--open'}`}
        >
          <AttentionImg /> {alert[0]}
        </p>
        <div className="edit__main">
          <div className="edit__input__img">
            <Cover src={imgInput} editable>
              <input
                type="file"
                accept="image/.jpg, image/.jpeg, image/.png"
                onChange={(e) => handleFileChange(e)}
                value=""
              />
            </Cover>
          </div>
          <div className="edit__inputs">
            <div
              className={`input__title ${
                !titleInput && 'input__title--invalid'
              }`}
            >
              <input
                type="text"
                placeholder="Add a name"
                onChange={(e) => setTitleInput(e.target.value)}
                value={titleInput}
              />
              <label>name</label>
            </div>
            <div className="input__description">
              <textarea
                type="text"
                placeholder="Add an optional description"
                onChange={(e) => setDescriptionInput(e.target.value)}
                value={descriptionInput}
              />
              <label>description</label>
            </div>
          </div>
        </div>
        <div className="edit__footer">
          <button
            disabled={alert && true}
            onClick={() => {
              handleSaveChange();
            }}
            className={`edit__save__button ${
              alert && 'edit__save__button--disabled'
            }`}
          >
            Salvar
          </button>
          <p>
            Ao continuar, você autoriza o Spotify a acessar a imagem enviada.
            Certifique-se de que você tem o direito de fazer o upload dessa
            imagem.
          </p>
        </div>
      </div>
    </Modal>
  );
};
