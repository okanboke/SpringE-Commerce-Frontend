import React from "react";
import {Link, useHistory} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { FourKRounded, Home, LockOpen } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(4),
    },
    title: {
      flexGrow: 2,
      paddingRight: "3%",
      textAlign: "right",
    },
    link : {
        textDecoration : "none",
        color : "white;",
        fontWeight:'bold',
        background: '#142850',
    },
    yeni: {
      paddingRight: "5%",

    },
  
  }));




  /*********************** */

function Navbar() {

    const classes = useStyles();
    let history = useHistory();
    

  

    const onClick = () => {
      localStorage.removeItem("tokenKey")
      localStorage.removeItem("currentUser")
      localStorage.removeItem("refreshKey")
      localStorage.removeItem("userName")
      history.go(0)
    }
    return(
        <div>

    <AppBar position="static" style={{ background: '#142850' }}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.yeni}>

          <Button href="/" size="large" color="default"  className={classes.link}>
          Ürünler
          </Button>

          </Typography>
          <Typography variant="h6" className={classes.yeni}>

          <Button href="/about" size="large" color="primary" className={classes.link}>
          Hakkımızda
          </Button>

          </Typography>
          <Typography variant="h6" className={classes.yeni}>

          <Button href="/contact" size="large" color="primary" className={classes.link}>
          İletişim
          </Button>

          </Typography>
          
          <Typography variant="h6" className={classes.title}>
          {localStorage.getItem("currentUser") == null ? <Link  className={classes.link} to="/auth">Giriş/Kayıt</Link>:
            <div><IconButton className={classes.link} onClick = {onClick}><LockOpen></LockOpen></IconButton>
          <Link className={classes.link} to={{pathname : '/users/' + localStorage.getItem("currentUser")}}>Profil</Link>
           </div>}
          </Typography>
        </Toolbar>
    </AppBar> 
        </div>
    )
}
export default Navbar;