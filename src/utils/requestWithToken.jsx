import axios from 'axios';

export const requestWithToken = (TYPE, URL, ACCESS_TOKEN, DATA) => {
  const request = async () => {
    let result;
    let options = {
      url: URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + ACCESS_TOKEN,
      },
      method: TYPE,
      data: DATA,
    };

    try {
      result = await axios(options);
    } catch (error) {
      return error;
    }
    return result;
  };

  return request();
};
