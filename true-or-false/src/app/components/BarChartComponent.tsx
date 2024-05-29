import React, { useState } from "react"
import { BarChart, Card, Divider, Switch } from '@tremor/react';
import { CalculationsResult } from "@/app/types/types"

/**
 * BarChart Component. Creates a bar chart with two bars, one for real news and one for fake news.
 *
 * @param {CalculationsResult} incomingData - The data to be displayed in the bar chart
 * @returns {JSX.Element}
 */
export function BarChartComponent(incomingData: CalculationsResult) {
  if (!incomingData) {
    return (<div>No data</div>);
  }

  const chartData = [
    {
      name: "Real",
      'Number of news articles': incomingData.real
    },
    {
      name: "Fake",
      'Number of news articles': incomingData.fake
    },
  ];

  const dataFormatter = (number: number) => {
    return Intl.NumberFormat('us').format(number).toString();
  }

  return (
    <>
      <Card className="sm:mx-auto w-full">
      <BarChart
        className="mt-6"
        data={chartData}
        index="name"
        categories={['Number of news articles']}
        colors={['slate-500']}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />

      </Card>
    </>
  );

}
