'use client'
import React, { useState, useEffect } from 'react';
import { ResultComponent } from '@/app/components/templates/ResultComponent'
import type { Results, CompleteAnalysisResponse, PartialResults } from '@/app/types/types'
import { combineResults, createEndResult } from '@/app/service/resultsService';
import { InfoPage } from '../components/templates/infopage';
import { loadNumberOfPosts, combineAllPartialResults } from '@/app/service/fulltextanalyzeServices';
import { updateStartPost, updateEndPost } from '@/app/util/postStateUpdateFunctions';
import { FullTextAnalysisForm } from '@/app/components/templates/fullAnalysisFormPage';

/**
 *  AnalysisPage
 *  Page for full text analysis
 *
 * Path: '/analysis'
 *
 * @param {void}
 * @returns {JSX.Element}
 */
export default function AnalysisPage() {
  useEffect(() => {
    loadNumberOfPosts().then((posts) => {
      setPosts(posts);
      setEndPost(1000);
    });
  }, []);

  /**
   * This function updates the start post state
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Event from input field
   */
  function handleStartPostChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateStartPost({value: parseInt(event.target.value), endPost:endPost, posts: posts, setStartPost: setStartPost, setEndPost:setEndPost, setEstimatedTime: setEstimatedTime});
  }

  /**
   * This function updates the end post state
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Event from input field
   */
  function handleEndPostChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateEndPost({value: parseInt(event.target.value), startPost, posts, setEndPost, setEstimatedTime});
  }

  /**
   * This function handles the submit event from the form and starts the analysis process
   * It fetches data from in chunks and compiles the results
   *
   * Note: This sets several states and elements to show the progress or result
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Event from form
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStarted(true);
    setProgress(1) // The progress 'bar' can't handle 0, so we set it to 1
    setFetching(true);
    let atPost = 0
    let totalPosts = posts
    let data
    let complete = false
    let partialResults = {} as PartialResults
    const partialResultsArray = [] as PartialResults[]

    while (!complete) {
      const result = await fetch(`${process.env.BASE_URL}/api/v1/analysis/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startPost, endPost, atPost, totalPosts }),
      });

      if (!result || !result.ok) {
        return;
      }

      data = await result.json() as CompleteAnalysisResponse;

      if (data.message) {
        setCompleted(true);
        console.log(data.message);
        return;
      }
      console.log("data: ", data)
      setProgress(data.progress);
      atPost = data.atPost;
      totalPosts = data.totalPosts;
      complete = data.completed;
      partialResults = data.partialResults as PartialResults;
      partialResultsArray.push(partialResults);
    }

    if (partialResultsArray.length != 0) {
      complete = true;
    } else {
      setResultElement(<div>Something went wrong</div>);
      return
    }

    setFetching(false);
    setProgress(1); // The progress 'bar' can't handle 0, so we set it to 1
    setCompiling(true);

    let combineResultsData = {} as PartialResults
    if (partialResultsArray.length > 1) {
      combineResultsData = await combineAllPartialResults(partialResultsArray, setProgress);
    } else {
      combineResultsData = partialResultsArray[0];
    }

    setProgress(100);
    setCompiling(false);
    setCompleted(true);
    console.log("combineResultsData: ", combineResultsData)
    const range = endPost - startPost;
    const dataResults = createEndResult(combineResultsData, range);
    console.log("dataResults: ", dataResults)
    let element = <ResultComponent results={dataResults as Results} />
    setResultElement(element);
    return

  }
  const [posts, setPosts] = useState(-1);
  const [startPost, setStartPost] = useState(0);
  const [endPost, setEndPost] = useState(0);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [resultElement, setResultElement] = useState(<div></div>);
  const [estimatedTime, setEstimatedTime] = useState(["5 seconds"]);

  return (
    <div className='w-full h-full p-8 loading:cursor-wait'>
      {posts === -1 && (
        <InfoPage headerText="Fetching data" textRowOne='Please wait...' />)}
      {!started && posts != -1 && (
        <FullTextAnalysisForm posts={posts} startPost={startPost} endPost={endPost} handleStartPostChange={handleStartPostChange} handleEndPostChange={handleEndPostChange} handleSubmit={handleSubmit} estimatedTimeStrings={estimatedTime} />
      )}
      {completed && (
        <div className="w-full h-full">
          <h1>Analysis complete!</h1>
          {resultElement}
        </div>
      )}
      {fetching && (
        <InfoPage headerText="Fetching data" textRowOne='Please wait...' progress={progress} textRowThree='loaded' />
      )}
      {compiling && (
        <InfoPage headerText="Compiling results" textRowOne='Please wait...' progress={progress + 1} textRowThree='compiled' />
      )}
    </div>
  );
}