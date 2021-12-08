import * as React from 'react';
import { CalendarTodayTwoTone, AccountBalance } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';

export default function CardPayables() {
    return (
        <div
            style={{
                borderStyle: 'solid',
                border: 1,
                borderColor: '#777',
                padding: 15,
                borderRadius: '20%',
                // marginTop: 50,
            }}
        >
            <div
                style={{
                    backgroundImage:
            'radial-gradient(circle, rgba(25,118,208,1) 25%, rgba(25,118,210,0.752305145691089) 76%, rgba(25,118,210,0.6206524846266632) 100%)',
                    borderRadius: '8%',
                    marginTop: -35,
                    width: 105,
                    padding: 10,
                    //height: 80,
                }}
            >
                <AccountBalance
                    style={{ color: 'white', fontSize: 80, alignSelf: 'center' }}
                ></AccountBalance>
            </div>
            <div
                style={{
                    fontStyle: 'regular',
                    fontFamily: 'Segoe UI',
                    color: '#857D7D',
                    fontSize: 24,
                    padding: 10,
                    //textAlign: "right",
                }}
            >
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, padding: 2 }}>Payables</div>
          PKR 25,000
                </div>
                <Divider style={{ color: 'black' }}></Divider>
                <div className="row" style={{ fontSize: 14, padding: 2 }}>
                    <CalendarTodayTwoTone /> Last 30 days
                </div>
            </div>
        </div>
    );
}
