import { BarList } from '@tremor/react';
/**
 * BarListComponent Component. Creates a list of bars used to display the frequency of common words.
 *
 * @param {Object} incomingData - The data to be displayed in the bar list
 * @returns {JSX.Element}
 */
export function BarListComponent ({incomingData}:{incomingData: {name: string, value: number}[]}) {
  const datahero = [
    { name: '/home', value: 456 },
    { name: '/imprint', value: 351 },
    { name: '/cancellation', value: 51 },
  ];

  const data = incomingData || datahero;

  return (
  <>
    <BarList data={data} className="mx-auto max-w-sm" />
  </>
  );
}
