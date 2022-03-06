import Dexie from "dexie";

const db = new Dexie("studioDB");
db.version(1).stores({
  audioblobs: "&id, lastaccess",
});

async function addAudioBlob(aid, blobdata) {
  try {
    // 增加缓存歌曲
    await db.audioblobs.put({
      id: aid,
      blobcached: blobdata,
      lastaccess: Date.now(),
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteAudioBlobByID(aid) {
  try {
    // 删除缓存的歌曲
    await db.audioblobs.delete(aid);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteAudioBlobByLRU() {
  try {
    // 删除两周以上没听的歌曲（默认空间不足时调用，不会自动执行）
    const _twoWeekAgo = new Date(Date.now() - 60 * 60 * 1000 * 24 * 7);

    await db.audioblobs.where("timestamp").below(_twoWeekAgo).delete();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getAudioBlobByID(aid) {
  try {
    return await db.audioblobs.get(aid);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getAudioCachedList() {
  try {
    return await db.audioblobs.orderBy("id").keys();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default {
  addAudioBlob,
  deleteAudioBlobByID,
  deleteAudioBlobByLRU,
  getAudioBlobByID,
  getAudioCachedList,
};
