export interface SearchItem {
  category?: string;
  resultType: string;
  subscribers?: string;
  artists?: Artist[];
  thumbnails: Thumbnail[];
  title?: string;
  album?: Album;
  inLibrary?: boolean;
  feedbackTokens?: FeedbackTokens;
  videoId?: string;
  videoType?: string;
  duration?: string;
  year?: string;
  duration_seconds?: number;
  isExplicit?: boolean;
  type?: string;
  playlistId?: string;
  browseId?: string;
  views?: string;
  itemCount: any;
  author?: string;
  artist?: Artist[] | string;
  shuffleId?: string;
  radioId?: string;
}

export interface Artist {
  name: string;
  id?: string;
}

export interface FeedbackTokens {
  add: any;
  remove: any;
}

export interface MainArtist {
  description: string;
  views: string;
  name: string;
  channelId: string;
  shuffleId: string;
  radioId: string;
  subscribers: string;
  subscribed: boolean;
  thumbnails: Thumbnail[];
  songs: Songs;
  albums: Albums;
  videos: Videos;
  related: Related;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Songs {
  browseId: string;
  results: SongResult[];
}

export interface SongResult {
  videoId: string;
  title: string;
  artists: Artist[];
  album: Album;
  likeStatus: string;
  inLibrary: any;
  thumbnails: Thumbnail[];
  isAvailable: boolean;
  isExplicit: boolean;
  videoType: string;
  views: any;
}

export interface Album {
  name: string;
  id: string;
}

export interface Albums {
  browseId: any;
  results: Result2[];
}

export interface MiniAlbum {
  title: string;
  type: string;
  artists: Artist[];
  browseId: string;
  audioPlaylistId: string;
  thumbnails: Thumbnail[];
  isExplicit: boolean;
}

export interface Videos {
  browseId: string;
  results: Result3[];
  params: string;
}

export interface MiniVideo {
  title: string;
  videoId: string;
  artists: Artist2[];
  playlistId: string;
  thumbnails: Thumbnail[];
  views: string;
}

export interface Related {
  browseId: any;
  results: Result4[];
}

export interface Result4 {
  title: string;
  browseId: string;
  subscribers: string;
  thumbnails: Thumbnail[];
}

//

export interface AlbumData {
  title: string;
  type: string;
  thumbnails: Thumbnail[];
  isExplicit: boolean;
  description: any;
  artists: Artist[];
  year: string;
  trackCount: number;
  duration: string;
  audioPlaylistId: string;
  likeStatus: string;
  tracks: Track[];
  duration_seconds: number;
}

export interface Track {
  videoId: string;
  title: string;
  artists: Artist[];
  album: string;
  likeStatus: string;
  inLibrary: any;
  thumbnails: any;
  isAvailable: boolean;
  isExplicit: boolean;
  videoType: string;
  views: string;
  trackNumber: number;
  duration: string;
  duration_seconds: number;
}
