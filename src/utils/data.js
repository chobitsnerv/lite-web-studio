import { parse } from "csv-parse/browser/esm/sync";
import dayjs from "dayjs";
import song_list from "utils/song_list.js";
import utils from "utils/utils.js";
import { getDataSheets } from "apis/datasheet.js";

// function fetch_csv(url) {
//   return fetch(url, {
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "text/csv",
//     },
//   }).then((res) => {
//     if (res.ok) {
//       return res.text();
//     } else return Promise.reject("Wrong.");
//   });
// }

async function getSongData() {
  // 获取数据 包括歌曲数据库、歌单数据库
  const sheetList = ["song_database.csv", "playlist_database.csv"];
  const fetchedList = sheetList.map((l) => getDataSheets(l));
  return Promise.all(fetchedList).then((results) => {
    parseSongCsv(results[0]);
    parsePlaylistCsv(results[1]);
    initialFilterOptions();
    song_list.getAll();
  });
}

function parseSongCsv(csvfile) {
  // 将csv解析为内存对象
  const _csvObject = parse(csvfile, { columns: true });
  // 转换为对象
  window.AudioLists.song_list.splice(0, window.AudioLists.song_list.length);
  for (const _row of _csvObject)
    window.AudioLists.song_list.push(convertSong(_row));
  // 按时间降序
  window.AudioLists.song_list.sort((s2, s1) => {
    const _d1 = dayjs(s1.date, "YYYY-MM-DD");
    const _d2 = dayjs(s2.date, "YYYY-MM-DD");
    // 按日期判断
    if (_d1.isBefore(_d2)) return -1;
    else if (_d2.isBefore(_d1)) return 1;
    else {
      // 按录播bv号判断
      if (s2.record.bv !== s1.record.bv)
        return utils.strToCode(s1.record.bv) - utils.strToCode(s2.record.bv);
      else {
        // 按分p判断
        if (s2.record.p !== s1.record.p) return s1.record.p - s2.record.p;
        // 按时间点判断
        else return s1.record_start_ms - s2.record_start_ms;
      }
    }
  });
}

function initialFilterOptions() {
  // 计算各种筛选条件
  // 状态
  window.FilterOptions.status.push("--");
  window.FilterOptions.status.push(
    ...new Set(window.AudioLists.song_list.map((i) => i.status))
  );
  // 语言
  window.FilterOptions.language.push("--");
  window.FilterOptions.language.push(
    ...new Set(window.AudioLists.song_list.map((i) => i.language))
  );
  // 演唱者
  const _artist = new Set(["--"]);
  for (const _song of window.AudioLists.song_list)
    for (const _a of _song.artist.split(",")) _artist.add(_a);
  window.FilterOptions.artist.push(..._artist);
  // 月份
  window.FilterOptions.month.push("--");
  window.FilterOptions.month.push(
    ...new Set(window.AudioLists.song_list.map((i) => i.date.substring(0, 7)))
  );
}

function convertSong(row) {
  let _songName = row["歌名"];
  const _songNameChs = row["中文歌名"];
  const _date = row["日期"];
  const _recordStartMs = AUDIO_DURATION_IN_MS
    ? row["起始时间点"]
    : timeToMs(row["起始时间点"]);
  const _songId = row["id"];
  // 添加录播信息
  const _record = {
    bv: row["录播来源"],
    p: parseInt(row["录播片段编号"]),
    timecode: msToTimecode(_recordStartMs),
  };
  // 如果有中文歌名就加上
  if (_songNameChs !== "") _songName = `${_songName}（${_songNameChs}）`;
  // 有没有音频
  let _hasAudio = false;
  if (row["有没有音频"] == "TRUE") _hasAudio = true;
  // 有没有第二版本
  //.mp3之类的文件名扩展名变更为存储在csv文件，增加功能的统一适配性。
  let _secondSrc = "";
  if (row["有没有第二版本"] == "TRUE")
    _secondSrc = `${PREFIX_TUNED}${_songId}${SUFFIX_TUNED}`;
  // 如果没到时间也不可用
  const _daysBeforeAvailable =
    AVAILABLE_DAYS_LIMIT - dayjs().diff(dayjs(_date), "day");
  if (_daysBeforeAvailable > 0 && !window.Variables.backdoor) _hasAudio = false;
  // 计算持续时间 解析不了结束时间戳就不算持续时间了
  let _duration = "--:--";
  if (_hasAudio) {
    let _recordEndMs = row["起始时间点"]
      ? row["结束时间点"]
      : timeToMs(row["结束时间点"]);
    if (_recordEndMs) _duration = msToDuration(_recordEndMs - _recordStartMs);
  }
  // 返回一首歌
  return {
    date: _date,
    record: _record,
    record_start_ms: _recordStartMs,
    name: _songName,
    version: "",
    orginal_artist: row["原曲艺术家"],
    artist: row["演唱者"],
    status: row["演唱状态"],
    language: row["语言"],
    note: row["备注"],
    ref: parseRef(row["参考路灯man"]),
    ref_cut: parseRef(row["谁切的"]),
    duration: _duration,
    id: _songId,
    src: `${PREFIX_ORIGN}${_songId}${SUFFIX_ORIGN}`,
    second_src: _secondSrc,
    has_audio: _hasAudio,
    days_before_available: _daysBeforeAvailable,
  };
}

function parseRef(ref) {
  // 转换用户格式
  const _result = ref.match(/^(.+)\(UID:(\d+)\)$/);
  if (_result) {
    return {
      name: _result[1],
      uid: _result[2],
    };
  } else {
    return false;
  }
}

function timeToMs(d) {
  // 将hh:mm:ss.xxx格式的时间转化为毫秒数
  let _ms = 0;
  let _timeList = d.match(/^(\d{2}):(\d{2}):(\d{2}).(\d{3})$/);
  if (_timeList) {
    _ms += parseInt(_timeList[1]) * 60 * 60 * 1000;
    _ms += parseInt(_timeList[2]) * 60 * 1000;
    _ms += parseInt(_timeList[3]) * 1000;
    _ms += parseInt(_timeList[4]);
    return _ms;
  } else return false;
}

function msToDuration(ms) {
  // 将毫秒数转化为mm:ss格式的时间
  const _totalSecond = Math.round(ms / 1000);
  const _second = _totalSecond % 60;
  let _secondText = _second.toString();
  if (_second < 10) _secondText = "0" + _second.toString();
  return Math.floor(_totalSecond / 60).toString() + ":" + _secondText;
}

function msToTimecode(ms) {
  // 将毫秒数转化为hh:mm:ss格式的时间
  const _totalSecond = Math.round(ms / 1000);
  const _second = _totalSecond % 60;
  let _secondText = _second.toString();
  if (_second < 10) _secondText = "0" + _second.toString();
  const _minute = Math.floor((_totalSecond / 60) % 60).toString();
  let _minuteText = _minute.toString();
  if (_minute < 10) _minuteText = "0" + _minute.toString();
  const _hour = Math.floor(_totalSecond / 3600).toString();
  let _hourText = _hour.toString();
  if (_hour < 10) _hourText = "0" + _hour.toString();
  return _hourText + ":" + _minuteText + ":" + _secondText;
}

function parsePlaylistCsv(csvfile) {
  // 解析预定义歌单
  const _csvObject = parse(csvfile);
  for (let _idx = 0; _idx < _csvObject[0].length; _idx++) {
    const _idList = _csvObject
      .map((id) => id[_idx])
      .slice(1)
      .filter((id) => id !== "");
    window.AudioLists.song_collection.push({
      name: _csvObject[0][_idx],
      list: _idList.map((id) =>
        window.AudioLists.song_list.find((s) => s.id === id)
      ),
    });
  }
}

export default {
  getSongData,
};
