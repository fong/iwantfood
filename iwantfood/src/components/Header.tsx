import {AppBar, Toolbar} from '@material-ui/core/';
import Button from '@material-ui/core/Button';
// import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { Link } from 'react-router-dom';
// import { Nav, Navbar, NavItem } from 'react-bootstrap';
// import { IndexLinkContainer } from "react-router-bootstrap";

/* export const Header: React.StatelessComponent<{}> = () => {
    return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton  aria-label="Menu" color="inherit">
                        <MenuIcon aria-haspopup="true"/>
                    </IconButton>
                    <Typography variant="display2" color="inherit">
                        <Link style={{color: "white"}} to="/">dankNotDank</Link>
                        <Link to="/HomeComponent"> Home </Link>
                        <Link to="/AboutComponent"> About </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
    );
} */

export const Header: React.StatelessComponent<{}> = () => {
    return (
        <AppBar position="static" color="default">
            <Toolbar style={{backgroundColor: "#E07A5F"}}>
                <Link to="/">
                    <Button color="inherit">
                        {/* <Link style={{color: "white"}} to="/">I want food</Link> */}
                        I really want food
                    </Button>
                </Link>
                <Link to="/About">
                    <Button color="inherit">
                        About 
                    </Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}