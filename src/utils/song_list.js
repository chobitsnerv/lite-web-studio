function get_all() {
  window.AudioLists.song_collection.push(
    ...[
      {
        name: "呜米唱最多的歌",
        list: umy_most_10(),
      },
      {
        name: "双人合唱",
        list: chorus(),
      },
    ]
  );
  window.FilterOptions.collection.push("--");
  window.FilterOptions.collection.push(
    ...window.AudioLists.song_collection.map((c) => c.name)
  );
}

function umy_most_10() {
  // 呜米唱的最多的十首歌
  // 按歌名计数
  let counter = {};
  for (let song of window.AudioLists.song_list) {
    if (song.name in counter) {
      counter[song.name].list.push(song);
      counter[song.name].n += 1;
    } else {
      counter[song.name] = {
        list: [song],
        n: 1,
      };
    }
  }
  let most_list = Object.keys(counter).map((k) => counter[k]);
  // 排序
  most_list.sort((t1, t2) => t2.n - t1.n);
  most_list = most_list.slice(0, 10);
  // 展开列表
  let final_list = [];
  for (let t of most_list) {
    final_list.push(...t.list);
  }
  return final_list;
}
function chorus() {
  // 双人合唱的曲子
  return window.AudioLists.song_list.filter(
    (s) => s.artist.split(",").length > 1
  );
}

export default {
  get_all,
};
