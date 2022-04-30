export interface SongCollection {
  name: string;
  song_list: Array<Song>
}

export interface Song {
  id: string;
  date: string;
  record_source: string;
  record_source_id: string;
  begin_time: string;
  end_time: string;
  file_name: string;
  file_type: string;
  name: string;
  version: string;
  version_remarks: string;
  chinese_name: string;
  original_artist: string;
  singer: string;
  song_state: string;
  language: string;
  remarks: string;
  reference: string;
  has_audio: string;
  clip_source: string;
  has_sec_version: string;
  sec_version_file_type: string;
}