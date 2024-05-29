import React from 'react';
/**
 * Updates the states of the start post, end post and the estimated time depending on the input value from the start post slider
 *
 * @param {number} value - The value of the start post slider
 * @param {number} endPost - The value of the end post slider
 * @param {number} posts - The total number of posts
 * @param {React.Dispatch<number>} setStartPost - The function to set the start post state
 * @param {React.Dispatch<number>} setEndPost - The function to set the end post state
 * @param {React.Dispatch<string[]>} setEstimatedTime - The function to set the estimated time state
 */
export function updateStartPost(
  {value, endPost, posts, setStartPost, setEndPost, setEstimatedTime}:
  {value: number, endPost: number, posts: number, setStartPost: React.Dispatch<number>, setEndPost: React.Dispatch<number>, setEstimatedTime: React.Dispatch<string[]>}) {
  // round to nearest 1000
  value = Math.floor(value / 1000) * 1000;
  setStartPost(value);
  if (value >= (endPost - 1000)) {
    updateEndPost({value: value +1000, startPost: value, posts:posts, setEndPost:setEndPost, setEstimatedTime} );
  }
  updateEstimatedTime({start:value, end:endPost, setEstimatedTime});
}

/**
 * Updates the states of the end post and the estimated time depending on the input value from the end post slider
 *
 * @param {number} value - The value of the end post slider
 * @param {number} startPost - The value of the start post slider
 * @param {number} posts - The total number of posts
 * @param {React.Dispatch<number>} setEndPost - The function to set the end post state
 * @param {React.Dispatch<string[]>} setEstimatedTime - The function to set the estimated time state
 */
export function updateEndPost(
  {value, startPost, posts, setEndPost, setEstimatedTime}:
  {value: number, startPost: number, posts: number, setEndPost: Function, setEstimatedTime: React.Dispatch<string[]>} ) {
  // round to nearest 1000
  value = Math.ceil(value / 1000) * 1000;
  if (value <= startPost) {
    return;
  }
  if (value > posts) {
    value = posts;
  }

  if (posts - value < 1000) {
    value = posts;
  }
  setEndPost(value);
  updateEstimatedTime({start:startPost, end:value, setEstimatedTime});
}

/**
 * Updates the estimated time state depending on the start and end post values
 *
 * @param {number} start - The value of the start post
 * @param {number} end - The value of the end post
 * @param {React.Dispatch<string[]>} setEstimatedTime - The function to set the estimated time state
 */
export function updateEstimatedTime({start, end, setEstimatedTime}:{start: number, end: number , setEstimatedTime: React.Dispatch<string[]>}) {
  const range = end - start;
  const time = Math.round((1.1 * range) / 1000) * 5;
  if (time > 60) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    let timeString = [`${minutes} minutes and ${seconds} seconds`];
    if (minutes > 2 && minutes < 5) {
      timeString.push("(Why not go make a cup of coffee?)")
    }
    if (minutes >= 5) {
      timeString.push("(Check my Youtube channel while you wait?)", "https://www.youtube.com/channel/UCQGn8IXLWvNugc5Gb-pS4zQ")
    }
    setEstimatedTime(timeString);
    return;
  }
  setEstimatedTime([`${time} seconds`]);
}