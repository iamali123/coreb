import * as React from 'react';
import { ShoppingCart, CalendarTodayTwoTone } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';

export default function Deposits() {
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
                    marginTop: -45,
                    width: 120,
                    padding: 10,
                    //height: 80,
                }}
            >
                <ShoppingCart
                    style={{ color: 'white', fontSize: 80, alignSelf: 'center' }}
                ></ShoppingCart>
            </div>
            <div
                style={{
                    fontStyle: 'regular',
                    fontFamily: 'Segoe UI',
                    color: '#857D7D',
                    fontSize: 24,
                    padding: 10,
                    textAlign: 'right',
                }}
            >
                <div style={{ fontSize: 18, padding: 2 }}>Stock Value</div>
        25,000 Units
                <Divider style={{ color: 'black' }}></Divider>
                <div className="row" style={{ fontSize: 14, padding: 2 }}>
                    <CalendarTodayTwoTone /> Last 30 days
                </div>
            </div>
        </div>
    );
}
