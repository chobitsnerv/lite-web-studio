import Consts from "globals/consts.js";
import dayjs from "dayjs";

function saveLoveList(l) {
  localStorage.setItem("love_list", JSON.stringify(l));
}

function readLoveList() {
  // 初始化
  let loveList = [];
  if (!localStorage.getItem("love_list"))
    localStorage.setItem("love_list", "[]");
  else {
    loveList = JSON.parse(localStorage.getItem("love_list"));
    if (loveList.length > 0 && loveList[0].substring(0, 1) !== "U") {
      loveList = [];
      localStorage.setItem("love_list", "[]");
    }
  }
  return loveList;
}

function savePlaylist(currentSongIndex, songList) {
  // 转换歌曲列表 仅保存id
  localStorage.setItem(
    "current_playlist",
    JSON.stringify({
      currentSongIndex,
      song_id_list: songList.map((s) => s.id).filter((i) => i !== "empty_song"),
    })
  );
}

function readPlaylist() {
  // 初始化
  if (!localStorage.getItem("current_playlist")) {
    localStorage.setItem(
      "current_playlist",
      JSON.stringify({
        current_song: 0,
        song_id_list: [],
      })
    );
  }
  const _currentPlaylist = JSON.parse(localStorage.getItem("current_playlist"));
  const _songList = _currentPlaylist.song_id_list.map((i) =>
    window.AudioLists.song_list.find((s) => s.id === i)
  );
  if (_songList.length === 0) _songList.push(Consts.empty_song);
  return {
    current_song: _currentPlaylist.current_song,
    song_list: _songList,
  };
}

let defaultSettings = {
  use_treated: false,
  play_mode: "loop",
};
function saveSettings(newSet) {
  localStorage.setItem(
    "settings",
    JSON.stringify(Object.assign(readSettings(), newSet))
  );
}

//从localStorage读取设置
function readSettings() {
  // 初始化设置
  if (!localStorage.getItem("settings"))
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
  let currentSettings = JSON.parse(localStorage.getItem("settings"));
  Object.assign(defaultSettings, currentSettings);
  return defaultSettings;
}

function encodeShare() {
  // 将当前播放列表转化为分享代码
  return (
    Consts.code_prefix +
    window.AudioLists.playlist
      .map((s) => {
        let n = parseInt(s.id.substring(1));
        const l = Consts.cipher.length;
        let c = "";
        while (n !== 0 || c.length < 3) {
          c += Consts.cipher.substring(n % l, (n % l) + 1);
          n = Math.floor(n / l);
        }
        return c;
      })
      .filter((i) => i !== "empty_song")
      .join("")
  );
}

function decode_share(code) {
  // 将分享代码转化为歌曲列表
  if (code.substring(0, 9) !== Consts.code_prefix) return false;
  let pure_code = code.substring(9);
  if (pure_code.length % 3 !== 0 || pure_code.length === 0) return false;
  let song_id_list = [];
  while (pure_code.length > 0) {
    let song_code = pure_code.substring(0, 3).split("").reverse();
    pure_code = pure_code.substring(3);
    let song_id = 0;
    while (song_code.length > 0) {
      song_id *= Consts.cipher.length;
      song_id += Consts.cipher.search(song_code[0]);
      if (song_id === -1) return false;
      song_code = song_code.slice(1);
    }
    let song_id_text = song_id.toString();
    while (song_id_text.length < 5) song_id_text = "0" + song_id_text;
    song_id_list.push("U" + song_id_text);
  }
  let song_list = window.meumy.song_list.filter(
    (s) => song_id_list.findIndex((i) => i === s.id) !== -1
  );
  if (song_list.length !== song_id_list.length) return false;
  return song_list;
}

function checkFirstBrowse() {
  // 初始化
  const _currentDate = dayjs().format("YYYY-MM-DD");
  const _lastVisitDate = localStorage.getItem("browse_flag");
  const _existedVersion = localStorage.getItem("app_version");
  if (!_lastVisitDate) {
    localStorage.setItem("browse_flag", _currentDate);
    localStorage.setItem("app_version", APP_VERSION);
    return true;
  } else if (
    _currentDate === dayjs(_lastVisitDate).add(7, "day").format("YYYY-MM-DD") ||
    _existedVersion !== APP_VERSION
  ) {
    localStorage.setItem("browse_flag", _currentDate);
    localStorage.setItem("app_version", APP_VERSION);
    return true;
  }
  return false;
}

function str_to_code(str) {
  let s = 0;
  for (let idx = 0; idx < str.length; idx++) s += str.charCodeAt(idx);
  return s;
}

function debug(text) {
  window.Variables.debug_list.push(text);
}

export default {
  saveLoveList,
  readLoveList,
  savePlaylist,
  readPlaylist,
  saveSettings,
  readSettings,
  encodeShare,
  decode_share,
  checkFirstBrowse,
  str_to_code,
  debug,
};
