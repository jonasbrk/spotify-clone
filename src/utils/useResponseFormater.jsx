export function useResponseFormater(response) {
  const allowed = {
    id: '',
    uri: '',
    artists: [{}],
    name: '',
    description: '',
    images: [{}],
    type: '',
    track_number: '',
    album: {},
    genres: [],
    owner: [],
    duration_ms: '',
    followers: {},
  };

  let formatedData = {};

  Object.keys(response)
    .filter((key) => Object.keys(allowed).includes(key))
    .map((key) => {
      if (key == 'album') {
        formatedData = {
          ...formatedData,
          [key]: {
            id: response[key].id,
            uri: response[key].uri,
            artists: response[key].artists,
            name: response[key].name,
            images: !response[key].images.length
              ? undefined
              : response[key].images,
          },
        };
      } else if (
        key == 'description' &&
        response.description.search('<a') >= 0
      ) {
        console.log(response.description);
        formatedData = { ...formatedData, [key]: response.name };
      } else if (key == 'images') {
        formatedData = {
          ...formatedData,
          [key]: response.images.length ? response.images : undefined,
        };
      } else {
        formatedData = { ...formatedData, [key]: response[key] };
      }
    });

  return formatedData;
}
