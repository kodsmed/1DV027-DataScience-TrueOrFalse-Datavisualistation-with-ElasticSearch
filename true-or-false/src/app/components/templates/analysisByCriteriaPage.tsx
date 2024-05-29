'use client'
import React, { useState } from 'react';
import { BarChartComponent } from '@/app/components/BarChartComponent'
import { CalculationsResult } from '@/app/types/types'
import { ProgressCircleComponent } from '@/app/components/ProgressCircleComponent'

/**
 * Function to render the AnalysisByCriteria component
 * It will render a form to input a criteria to analyze, and then render the results
 *
 * @param {string} keyProp - The key to analyze by 'title' or 'content'
 * @returns {JSX.Element}
 */
export function AnalysisByCriteriaPage({ keyProp }: { keyProp: string }) {
  const [criteria, setCriteria] = useState("");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [data, setData] = useState({} as CalculationsResult);
  const [barChart, setBarChart] = useState({} as React.ReactElement);
  const [progressCircle, setProgressCircle] = useState({} as React.ReactElement);


  /**
   * This function handles the submit event from the form and starts the analysis process,
   * by fetching the data from the server and rendering the results
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFetching(true);
    const response = await fetch(`${process.env.BASE_URL}/api/v1/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [keyProp]: criteria }),
    });
    console.log('response' + response);
    if (!response || !response.ok) {
      setLoading(false);
      setFetching(false);
      return;
    }
    const data = await response.json();
    const calculations = data as CalculationsResult;
    setData(calculations);
    //const queryData = data.data;
    setFetching(false);

    setRendering(true);
    // Render the results
    const plot = BarChartComponent(calculations) as React.ReactElement;
    setBarChart(plot);
    const circle = ProgressCircleComponent(calculations) as React.ReactElement;
    setProgressCircle(circle);

    setRendering(false);

    setResult(true);
    setLoading(false);
  }

  return (
    <div className='w-full h-full mt-8'>
      {!result && !loading && (
        <div className="w-full h-fit flex flex-row items-center justify-center">
          <div className="flex flex-col w-4/5 bg-slate-50 border-2 rounded-xl shadow-lg items-center justify-center">
            <div className="flex flex-col justify-center items-left p-8">
              <h1 className="text-3xl font-bold text-center mb-4">Analysis by {keyProp}</h1>
              <div className="p-4 w-full text-left">
                <p>Enter the {keyProp} you want to analyze.</p>
                <p>A standard search uses the fuzzy match method, or wrap your search in &quot;quotes&quot; for phrase search.</p>
              </div>
              <div className="flex flex-col w-full border-2 rounded-xl shadow-lg pt-8 pb-8 pl-16 pr-16">
                <form onSubmit={handleSubmit}>
                  <div className='flex flex-col'>
                    <label htmlFor={keyProp} className='font-bold mb-2'>
                      {keyProp}:
                    </label>
                    <input
                      className='border-2 rounded-lg p-2 mb-2 w-full'
                      type="text"
                      name={keyProp}
                      value={criteria}
                      onChange={(event) => setCriteria(event.target.value)}
                    />
                    <button type="submit" disabled={loading} className="bg-slate-800 hover:bg-slate-600 dark:bg-slate-100 dark:hover:bg-slate-300 text-white dark:text-slate-800 rounded-lg p-2 mt-4">
                      Analyze
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      )
      }
      {result && (
        <div className="w-full h-4/5 flex flex-row items-center justify-center">
        <div className="flex flex-col w-4/5 bg-slate-50 border-2 rounded-xl shadow-lg items-center justify-center">
          <h1>Results</h1>
          <p>In the dataset there is {data.real + data.fake} news articles in the dataset that have the &quot;{criteria}&quot; in the {keyProp}.</p>
          <p>Of those, {data.real} are real and {data.fake} are fake.</p>
          <div className='w-full p-4'>
            {barChart}
          </div>
          <div className="w-full pl-4 pr-4">
            {progressCircle}
            <p>Based in this, it is {data.odds}% likely that a news article that have the &quot;{criteria}&quot; in the {keyProp} is {data.verdict}</p>
          </div>
          <div>
            <button onClick={() => {
              setResult(false)
              setCriteria("")
            }}
            className="bg-slate-800 hover:bg-slate-600 px-12 mb-8 dark:bg-slate-100 dark:hover:bg-slate-300 text-white dark:text-slate-800 rounded-lg p-2 mt-4">
              Reset
            </button>
          </div>
        </div>
      </div>
      )}
      {loading && fetching ? (
        <p>Please wait: Fetching data</p>
      ) : null}
      {loading && rendering ? (
        <p>Rendering...</p>
      ) : null}
    </div>
  );
}