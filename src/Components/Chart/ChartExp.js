import * as React from 'react';
import { useTheme } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import {
    ArrowDownward,
    ArrowUpward,
    CalendarToday,
    CalendarTodayTwoTone,
    CalendarViewDay,
} from '@material-ui/icons';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
} from 'recharts';

// Generate Sales Data
function createData(time, amount) {
    return { time, amount };
}

const data = [
    { name: 'M', uv: 23 },
    { name: 'T', uv: 15 },
    { name: 'W', uv: 20 },
    { name: 'T', uv: 30 },
    { name: 'F', uv: 18 },
    { name: 'S', uv: 5 },
];

export default function ChartEXP() {
    const theme = useTheme();

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

            <div
                style={{
                    fontStyle: 'regular',
                    fontFamily: 'Segoe UI',
                    color: '#857D7D',
                    fontSize: 24,
                    padding: 10,
                }}
            >
        Expense Statistics
                <br />
                <div style={{ fontSize: 18, padding: 2 }}>
                    <ArrowUpward style={{ color: 'green' }} />
          14% inrease from past 15 days.
                </div>
                <Divider style={{ color: 'black' }}></Divider>
                <div className="row" style={{ fontSize: 14, padding: 2 }}>
                    <CalendarTodayTwoTone /> Last 15 days
                </div>
            </div>
        </div>
    );
}
