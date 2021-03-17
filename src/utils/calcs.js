import { forEach } from 'lodash';
import { customAlphabet } from 'nanoid';

export const recordsTT = (levels, timeObj) => {
  let tt = 0;
  let levs = 0;
  let finished = 0;
  let unfinished = false;
  forEach(levels, l => {
    if (l[timeObj].length > 0) {
      tt += l[timeObj][0].Time;
      finished += 1;
      levs += 1;
    } else {
      levs += 1;
      unfinished = true;
    }
    return true;
  });
  return { tt, finished, levs, unfinished };
};

export const combinedTT = (levels, timeObjs) => {
  let tt = 0;
  let levs = 0;
  let finished = 0;
  let unfinished = false;
  forEach(levels, l => {
    let bestTime;
    timeObjs.forEach(b => {
      if (bestTime === undefined) {
        bestTime = l[b].Time;
      } else {
        bestTime = l[b].Time < bestTime ? l[b].Time : bestTime;
      }
    });
    if (bestTime !== undefined) {
      tt += bestTime;
      finished += 1;
      levs += 1;
    } else {
      levs += 1;
      unfinished = true;
    }
    return true;
  });
  return { tt, finished, levs, unfinished };
};

export const uuid = (length = 10) => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', length);
  return nanoid();
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};
