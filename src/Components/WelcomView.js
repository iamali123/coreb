import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import '../Styles/welcomViewStyle.css';
import logo from '../assets/images/logo-red.png';

function WelcomView() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-5 mt-5 ">
                        <div className="row">
                            <div className="col-md-3">
                                <img src={logo} alt="LOGO" width={150} height={150} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 offset-md-5">
                            <h4 className="mt-3 ">ERP SOLUTION</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 offset-md-4 mt-5">
                            <Link to="/Login" className="button-style">
                                <Button variant="contained" color="secondary" fullWidth={true}>
                  Log In
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 offset-md-4 mt-5">
                            <Link to="/Signup" className="button-style">
                                <Button variant="contained" color="primary" fullWidth={true}>
                  Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WelcomView;
