import Consts from 'globals/consts.js';
import dayjs from 'dayjs';
import { getAudio } from 'apis/audioloader.js';
import cacheDB from 'apis/db.js';

function saveLoveList(l) {
  localStorage.setItem('love_list', JSON.stringify(l));
}

function readLoveList() {
  // 初始化
  let loveList = [];
  if (!localStorage.getItem('love_list'))
    localStorage.setItem('love_list', '[]');
  else {
    loveList = JSON.parse(localStorage.getItem('love_list'));
    if (loveList.length > 0 && loveList[0].substring(0, 1) !== 'A') {
      loveList = [];
      localStorage.setItem('love_list', '[]');
    }
  }
  return loveList;
}

function savePlaylist(currentSongIndex, songList) {
  // 转换歌曲列表 仅保存id
  localStorage.setItem(
    'current_playlist',
    JSON.stringify({
      current_song: currentSongIndex,
      song_id_list: songList.map((s) => s.id).filter((i) => i !== 'empty_song')
    })
  );
}

function readPlaylist() {
  // 初始化
  if (!localStorage.getItem('current_playlist')) {
    localStorage.setItem(
      'current_playlist',
      JSON.stringify({
        current_song: 0,
        song_id_list: []
      })
    );
  }
  const _currentPlaylist = JSON.parse(localStorage.getItem('current_playlist'));
  const _songList = _currentPlaylist.song_id_list
    .map((i) => window.AudioLists.song_list.find((s) => s.id === i))
    .filter((el) => el);
  if (_songList.length === 0) _songList.push(Consts.empty_song);
  return {
    current_song: _currentPlaylist.current_song,
    song_list: _songList
  };
}

function saveMyCollection(l) {
  localStorage.setItem(
    'my_collection',
    JSON.stringify(
      l.map((collection) => ({
        name: collection.name,
        song_id_list: collection.list.map((song) => song.id)
      }))
    )
  );
}

function readMyCollection() {
  // 初始化
  if (!localStorage.getItem('my_collection'))
    localStorage.setItem('my_collection', '[]');
  // 验证一遍歌曲
  let my_collection = JSON.parse(localStorage.getItem('my_collection'));
  let my_collection_verify = [];
  for (let collection of my_collection) {
    let song_list = collection.song_id_list.map((i) =>
      window.AudioLists.song_list.find((s) => s.id === i)
    );
    song_list = song_list.filter((s) => s !== undefined);
    if (song_list.length === 0) continue;
    my_collection_verify.push({
      name: collection.name,
      list: song_list
    });
  }
  return my_collection_verify;
}

const defaultSettings = {
  use_treated: false,
  play_mode: 'loop',
  play_volume: 0.9,
  night_mode: 'light',
  use_ch_resource: true
};
function saveSettings(newSet) {
  localStorage.setItem(
    'settings',
    JSON.stringify(Object.assign(readSettings(), newSet))
  );
}

//从localStorage读取设置
function readSettings() {
  // 初始化设置
  if (!localStorage.getItem('settings'))
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
  let currentSettings = JSON.parse(localStorage.getItem('settings'));
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
        let c = '';
        while (n !== 0 || c.length < 3) {
          c += Consts.cipher.substring(n % l, (n % l) + 1);
          n = Math.floor(n / l);
        }
        return c;
      })
      .filter((i) => i !== 'empty_song')
      .join('')
  );
}

function decodeShare(code) {
  // 将分享代码转化为歌曲列表
  if (code.substring(0, Consts.code_prefix.length) !== Consts.code_prefix)
    return false;
  let _pureCode = code.substring(Consts.code_prefix.length);
  if (_pureCode.length % 3 !== 0 || _pureCode.length === 0) return false;
  const _songIdList = [];
  while (_pureCode.length > 0) {
    let _songCode = _pureCode.substring(0, 3).split('').reverse();
    _pureCode = _pureCode.substring(3);
    let _songId = 0;
    while (_songCode.length > 0) {
      _songId *= Consts.cipher.length;
      _songId += Consts.cipher.search(_songCode[0]);
      if (_songId === -1) return false;
      _songCode = _songCode.slice(1);
    }
    let _songIdText = _songId.toString();
    while (_songIdText.length < 6) _songIdText = '0' + _songIdText;
    _songIdList.push('A' + _songIdText);
  }
  const _songList = [];
  _songIdList.forEach((i) => {
    const _tempEle = window.AudioLists.song_list.find((s) => i === s.id);
    if (_tempEle) _songList.push(_tempEle);
  });
  // window.AudioLists.song_list.filter(
  //   (s) => _songIdList.findIndex((i) => i === s.id) !== -1
  // );
  if (_songList.length !== _songIdList.length) return [];
  return _songList;
}

function checkFirstBrowse() {
  // 初始化
  const _currentDate = dayjs().format('YYYY-MM-DD');
  const _lastVisitDate = localStorage.getItem('browse_flag');
  const _existedVersion = localStorage.getItem('app_version');
  if (!_lastVisitDate) {
    localStorage.setItem('browse_flag', _currentDate);
    localStorage.setItem('app_version', APP_VERSION);
    return true;
  } else if (
    _currentDate === dayjs(_lastVisitDate).add(7, 'day').format('YYYY-MM-DD') ||
    _existedVersion !== APP_VERSION
  ) {
    localStorage.setItem('browse_flag', _currentDate);
    localStorage.setItem('app_version', APP_VERSION);
    return true;
  }
  return false;
}

function strToCode(str) {
  let s = 0;
  for (let idx = 0; idx < str.length; idx++) s += str.charCodeAt(idx);
  return s;
}

function debug(text) {
  window.Variables.debug_list.push(text);
}

async function saveAudioInDB(song, isOrign = true, isChResource = true) {
  const _para = getResourceURL(
    isOrign,
    isChResource,
    true,
    song.date,
    song.name,
    song.ext_name,
    song.artist
  );
  try {
    const _blob = await getAudio(_para);
    await cacheDB.addAudioBlob(song.id, _blob);
  } catch (err) {
    console.log(err);
  }
}

function deleteAudioInDB(aid) {
  cacheDB.deleteAudioBlobByID(aid);
}

function getAudioInDB(aid) {
  return cacheDB.getAudioBlobByID(aid);
}

function readCachedList() {
  return cacheDB.getAudioCachedList();
}

async function clearCache(redirecturl) {
  if (await cacheDB.clearDB()) window.location.href = redirecturl;
}

function getResourceURL(
  isOrign,
  isChResource,
  isCDN,
  resourcedate,
  resourcefilename,
  extname,
  artists
) {
  let __resourceBaseURL = '';
  let __resourceExtPath = '';

  switch (parseInt(`${+isOrign}${+isChResource}${+isCDN}`, 2)) {
    //isOrign = true =>4
    //isChResource = true =>2
    //isCDN = true =>1
    case 0:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_TUNED;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_TUNED;
      break;
    case 1:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_TUNED_DL_CDN;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_TUNED_DL_CDN;
      break;
    case 2:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_TUNED_CH;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_TUNED_CH;
      break;
    case 3:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_TUNED_DL_CDN_CH;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_TUNED_DL_CDN_CH;
      break;
    case 4:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_ORIGN;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_ORIGN;
      break;
    case 5:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_ORIGN_DL_CDN;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_ORIGN_DL_CDN;
      break;
    case 6:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_ORIGN_CH;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_ORIGN_CH;
      break;
    case 7:
      __resourceBaseURL = import.meta.env.VITE_PREFIX_ORIGN_DL_CDN_CH;
      __resourceExtPath = import.meta.env.VITE_SUFFIX_ORIGN_DL_CDN_CH;
      break;
  }

  const _artist = artists
    .split(',')
    .map((x) => (x = Consts.artist_mapping[x.trim()]))
    .sort()
    .join('');

  const _artistTag =
    _artist.length === artists.split(',').length
      ? _artist.length > 3
        ? 'F'
        : _artist
      : 'L';

  const _fileName = `${
    SONG_NAME_SOURCE_MODE
      ? resourcedate + ' ' + _artistTag + ' ' + resourcefilename
      : resourcefilename
  }.${extname}`;

  return (
    __resourceBaseURL +
    _fileName.replace('『', '【').replace('』', '】') +
    __resourceExtPath
  );
}

export default {
  saveMyCollection,
  readMyCollection,
  saveLoveList,
  readLoveList,
  savePlaylist,
  readPlaylist,
  saveSettings,
  readSettings,
  encodeShare,
  decodeShare,
  checkFirstBrowse,
  strToCode,
  saveAudioInDB,
  deleteAudioInDB,
  getAudioInDB,
  readCachedList,
  getResourceURL,
  clearCache,
  debug
};
