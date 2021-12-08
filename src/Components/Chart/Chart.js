import * as React from 'react';
import { useTheme } from '@material-ui/styles';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

const data = [
    { name: 'M', uv: 4000 },
    { name: 'T', uv: 3000 },
    { name: 'W', uv: 2000 },
    { name: 'T', uv: 6000 },
    { name: 'F', uv: 1890 },
    { name: 'S', uv: 2390 },
];

export default function Chart() {
    return (
        <div
            style={{
                borderStyle: 'solid',
                border: 1,
                borderColor: '#777',
                padding: 20,
                borderRadius: '20%',
                marginTop: 50,
            }}
        >
            <div
                style={{
                    backgroundImage:
            'radial-gradient(circle, rgba(25,118,208,1) 25%, rgba(25,118,210,0.752305145691089) 76%, rgba(25,118,210,0.6206524846266632) 100%)',
                    borderRadius: '8%',
                    marginTop: -45,
                }}
            >
                <LineChart
                    width={350}
                    height={250}
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="white" />
                    <YAxis stroke="white" />
                    <Tooltip />
                    <Line type="monotone" dataKey="uv" stroke="white" fill="white" />
                </LineChart>
            </div>
        </div>
    );
}
