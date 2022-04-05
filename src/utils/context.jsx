import { createContext } from 'react';

export const UserContext = createContext({});

export const LoginContext = createContext(false);

export const DeviceContext = createContext(null);

export const StatusContext = createContext(() => {});

export const TokenContext = createContext(null);

export const PlaylistContext = createContext([]);

export const MessageContext = createContext(() => {});

export const TrackContext = createContext({
  currentTrack: {},
  setCurrentTrack: () => {},
});

export const PlayerContext = createContext({});

export const PlaybackContext = createContext({});

export const PlayContext = createContext(() => {});

export const AlbumContext = createContext({});

export const isCoverOpen = createContext(false);

export const Menssage = createContext({});
