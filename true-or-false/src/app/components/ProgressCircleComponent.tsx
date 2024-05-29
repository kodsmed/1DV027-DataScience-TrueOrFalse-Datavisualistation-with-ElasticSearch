'use client'
import { Card, ProgressCircle } from '@tremor/react';
/**
 * ProgressCircleComponent Component. Creates a progress circle with a percentage likelihood that the news is real or fake.
 *
 * @param { odds: number, verdict: string } - The data to be displayed in the progress circle
 * @returns {JSX.Element}
 */
export function ProgressCircleComponent({ odds, verdict }: { odds: number, verdict: string }) {
  return (
    <ProgressCircleCard
      progress={odds}
      text={`${odds}% likelihood that the news is ${verdict}`}
    />
  );
}

/**
 * LoadingProgressCircleComponent Component. Creates a progress circle with a percentage of .
 * This component is used when the data is still loading.
 *
 * @param { progress: number, text: string } - The data to be displayed in the progress circle
 * @returns {JSX.Element}
 */
export function LoadingProgressCircleComponent({ progress, text }: { progress: number, text: string }) {
  return (
    <ProgressCircleCard
      progress={progress}
      text={`${progress}% ${text}`}
    />
  );
}

function ProgressCircleCard({ progress, text } : { progress: number, text: string }) {
  if (progress < 1) {
    progress = 1;
  }
  if (progress > 100) {
    progress = 100;
  }
  return (
    <Card className="mx-auto w-full">
      <div className="flex justify-center space-x-5 items-center">
        <ProgressCircle
          value={progress}
          size="lg"
          strokeWidth={10}
          showAnimation={true}
        />
        <div>
          <p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            <span className='font-bolder'>{text}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

