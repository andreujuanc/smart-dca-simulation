import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    color: '#CCC',

    //stacked: false,
    plugins: {
       
    },

    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
                display: true,
                text: 'Price'
            },
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            title: {
                display: true,
                text: 'Value USD'
            }
        },
        y2: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            grid: {
                drawOnChartArea: false,
            },
            title: {
                display: true,
                text: 'Token Amount'
            }
        },
        y3: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            grid: {
                drawOnChartArea: false,
            },
            title: {
                display: true,
                text: 'Slope'
            },
            min: 0,
            max: 2,
        },
    },

};




export function Chart({ tokenPrice, classicDCAValue, smartDCAValue, smartUSDAtHand, usdSavingsAccountValue, classicDCAHolding, smartDCAHolding, slope, averagePrice }:
    {
        tokenPrice: { date: string, price: number }[],
        classicDCAValue: number[],
        smartDCAValue: number[],
        smartUSDAtHand: number[],
        usdSavingsAccountValue: number[],
        classicDCAHolding: number[],
        smartDCAHolding: number[],
        slope: number[],
        averagePrice: number[]
    }) {
    const labels = tokenPrice.map(x => x.date)

    const data: ChartData<'line', number[], string> = {
        labels,
        datasets: [
            {
                label: 'Token Price',
                data: tokenPrice.map(x => x.price),
                pointRadius: 0,
                borderColor: 'rgb(10, 210, 30)',
                backgroundColor: 'rgba(10, 150, 30, 0.5)',
                yAxisID: 'y',
                pointBorderColor: 'rgb(0,0,0)',
                hidden: true
            },
            // {
            //     label: 'Slope',
            //     data: slope,
            //     pointRadius: 0,
            //     borderColor: 'rgb(210, 210, 30, 0.8)',
            //     backgroundColor: 'rgba(150, 150, 30, 0.15)',
            //     yAxisID: 'y3',
            //     pointBorderColor: 'rgb(0,0,0)',
            // },
            {
                label: 'Average',
                data: averagePrice,
                pointRadius: 0,
                borderColor: 'rgb(210, 120, 30)',
                backgroundColor: 'rgba(210, 120, 30, 0.5)',
                yAxisID: 'y',
                pointBorderColor: 'rgb(0,0,0)',
            },
            {
                label: 'Classic DCA Portfolio Value',
                data: classicDCAValue,
                pointRadius: 0,
                borderColor: 'rgb(210, 10, 30)',
                backgroundColor: 'rgba(210, 10, 30, 0.5)',
                yAxisID: 'y1',
                pointBorderColor: 'rgb(0,0,0)',
            },
            {
                label: 'Smart DCA Token Value',
                data: smartDCAValue,
                pointRadius: 0,
                borderColor: 'rgb(10, 90, 210)',
                backgroundColor: 'rgba(10, 90, 210, 0.5)',
                yAxisID: 'y1',
                pointBorderColor: 'rgb(0,0,0)',
            },
            {
                label: 'Smart DCA USD Value',
                data: smartUSDAtHand,
                pointRadius: 0,
                borderColor: 'rgb(10, 30, 210)',
                backgroundColor: 'rgba(10, 30, 210, 0.5)',
                yAxisID: 'y1',
                pointBorderColor: 'rgb(0,0,0)',
            },
            {
                label: 'USD Savings Account',
                data: usdSavingsAccountValue,
                pointRadius: 0,
                borderColor: 'rgb(210, 30, 210)',
                backgroundColor: 'rgba(210, 30, 210, 0.5)',
                yAxisID: 'y1',
                pointBorderColor: 'rgb(0,0,0)',
            },
            {
                label: 'Classic DCA Holding',
                data: classicDCAHolding,
                 pointRadius: 0,
                borderColor: 'rgb(140, 10, 30)',
                backgroundColor: 'rgba(140, 10, 30, 0.5)',
                yAxisID: 'y2',
                pointBorderColor: 'rgb(0,0,0, 0)',
                hidden: true

            },
            {
                label: 'Smart DCA Holding',
                data: smartDCAHolding,
                pointRadius: 0,
                borderColor: 'rgb(10, 30, 140)',
                backgroundColor: 'rgba(10, 30, 140, 0.5)',
                yAxisID: 'y2',
                pointBorderColor: 'rgb(0,0,0, 0)',
                hidden: true
            },
        ],
    };

    return <Line options={options} data={data} style={{
        // boxSizing: 'content-box',
    }}  />;
}
