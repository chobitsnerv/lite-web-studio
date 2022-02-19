function getAll() {
  window.AudioLists.song_collection.push(
    ...[
      {
        name: "演唱最多的歌",
        list: mostNAudio(MOST_N),
      },
      {
        name: "合唱歌单",
        list: chorus(),
      },
    ]
  );
  window.FilterOptions.collection.push("--");
  window.FilterOptions.collection.push(
    ...window.AudioLists.song_collection.map((c) => c.name)
  );
}

//TODO每个artist的最多演唱n首曲目
function mostNAudio(n) {
  // 按歌名计数
  const counter = [];
  for (const song of window.AudioLists.song_list) {
    let _songname = song.name;
    let _version = null;
    if (SONGNAME_CONTAIN_VERSION) {
      _songname = song.name.match(/^(.+)\s([1-9]\d*.\d*|0.\d*[1-9]\d*)$/);
      _version = _songname ? _songname[2] : null;
      _songname = _songname ? _songname[1] : song.name;
    }
    if (_version !== null) song.version = _version;
    if (_songname in counter) {
      counter[_songname].list.push(song);
      counter[_songname].num += 1;
    } else {
      counter[_songname] = {
        list: [song],
        num: 1,
      };
    }
  }
  let most_list = Object.keys(counter).map((k) => counter[k]);
  // 排序
  most_list.sort((t1, t2) => t2.num - t1.num);
  most_list = most_list.slice(0, n);
  // 展开列表
  let final_list = [];
  for (let t of most_list) {
    final_list.push(...t.list);
  }
  return final_list;
}

function chorus() {
  //合唱的曲子
  return window.AudioLists.song_list.filter(
    (s) => s.artist.split(",").length > 1
  );
}

export default {
  getAll,
};
