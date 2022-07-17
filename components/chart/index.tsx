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
        // y3: {
        //     type: 'linear' as const,
        //     display: true,
        //     position: 'left' as const,
        //     grid: {
        //         drawOnChartArea: false,
        //     },
        //     title: {
        //         display: true,
        //         text: 'Slope'
        //     },
        //     min: 0,
        //     max: 2,
        // },
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
                borderColor: 'rgba(50, 220, 50)',
                backgroundColor: 'rgba(50, 220, 50)',
                yAxisID: 'y',
                hidden: true
            },
            // {
            //     label: 'Slope',
            //     data: slope,
            //     pointRadius: 0,
            //     borderColor: 'rgba(150, 150, 30, 0.15)',
            //     yAxisID: 'y3',
            //     borderColor: 'rgb(0,0,0)',
            // },
            {
                label: 'Price AVG',
                data: averagePrice,
                pointRadius: 0,
                borderColor: 'rgba(225, 165, 0, 1)',
                backgroundColor: 'rgba(225, 165, 0, 1)',
                yAxisID: 'y',
                hidden: true
            },
            {
                label: 'Classic DCA Portfolio Value',
                data: classicDCAValue,
                pointRadius: 0,
                borderColor: 'rgba(220, 90, 80)',
                backgroundColor: 'rgba(220, 90, 80)',
                yAxisID: 'y1',
                hidden: true
            },
            {
                label: 'Smart DCA Portfolio Value',
                data: smartDCAValue,
                pointRadius: 0,
                borderColor: 'rgb(60, 100, 240)',
                backgroundColor: 'rgb(60, 100, 240)',
                yAxisID: 'y1',
                hidden: true
            },
            {
                label: 'Smart DCA USD Value',
                data: smartUSDAtHand,
                pointRadius: 0,
                borderColor: 'rgb(10, 30, 250)',
                backgroundColor: 'rgb(10, 30, 250)',
                yAxisID: 'y1',
                hidden: true
            },
            {
                label: 'USD Savings Account',
                data: usdSavingsAccountValue,
                pointRadius: 0,
                borderColor: 'rgb(190, 30, 250)',
                backgroundColor: 'rgb(190, 30, 250)',
                yAxisID: 'y1',
                hidden: true
            },
            {
                label: 'Classic DCA Holding',
                data: classicDCAHolding,
                pointRadius: 0,
                borderColor: 'rgba(250, 120, 100)',
                backgroundColor: 'rgba(250, 120, 100)',
                yAxisID: 'y2',
                hidden: false

            },
            {
                label: 'Smart DCA Holding',
                data: smartDCAHolding,
                pointRadius: 0,
                borderColor: 'rgba(100, 120, 255)',
                backgroundColor: 'rgba(100, 120, 255)',
                yAxisID: 'y2',
                hidden: false
            },
        ],
    };

    return <Line options={options} data={data} style={{
        // boxSizing: 'content-box',
    }} />;
}
