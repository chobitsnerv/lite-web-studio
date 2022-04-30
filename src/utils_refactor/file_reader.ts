import {getDataSheetsLocal, getDataSheetsRemote} from "@/apis/datasheet";
import {Song, SongCollection} from "@/types/HomePage/HomePageTypes";



export async function getSongData() {
  // 获取数据 包括歌曲数据库、歌单数据库
  const sheetList = ["song_database.csv", "playlist_database.csv"];
  const fetchedList =
    import.meta.env.MODE === "development"
      ? sheetList.map((l) => getDataSheetsLocal(l))
      : sheetList.map((l) => getDataSheetsRemote(l));
  return Promise.all(fetchedList).then((results: string[]) => {
    const song_list = parseSongList(results[0])
    const song_collection_raw = results[1].split('\n')

    const song_collection = song_collection_raw[0].trim().split(',').filter(Boolean).map((v, index) => {
      return parseSongCollection(song_list, song_collection_raw[index + 1], v)
    })
    return {
      song_list: song_list,
      song_collection: song_collection
    }
  });
}

function parseSongList(song_list_raw: string): Array<Song> {
  return song_list_raw.split('\n').slice(1).map(v => {

    const song_info = v.trim().replace(/".*?"/g,(str)=>str.replace(/,/g,";")).split(',')
    return {
      id: song_info[0],
      date: song_info[1],
      record_source: song_info[2],
      record_source_id: song_info[3],
      begin_time: song_info[4],
      end_time: song_info[5],
      file_name: song_info[6],
      file_type: song_info[7],
      name: song_info[8],
      version: song_info[9],
      version_remarks: song_info[10],
      chinese_name: song_info[11],
      original_artist: song_info[12],
      singer: song_info[13].replace(/"/g,'').split(";").join(','),
      song_state: song_info[14],
      language: song_info[15],
      remarks: song_info[16],
      reference: song_info[17],
      has_audio: song_info[18],
      clip_source: song_info[19],
      has_sec_version: song_info[20],
      sec_version_file_type: song_info[21]
    }
  })
}

function parseSongCollection(song_list: Array<Song>, song_collection_raw: string, name: string): SongCollection {
  const res:SongCollection={
    name:name,
    song_list:[]
  }
  const songListID=song_collection_raw.split(',').filter(Boolean)
  res.song_list=song_list.filter(v=>songListID.includes(v.id))
  return res
}