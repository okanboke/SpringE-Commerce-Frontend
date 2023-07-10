import React, {useState} from "react";
import { FormControl, InputLabel, Input, Button, FormHelperText } from "@material-ui/core";
import { useHistory } from "react-router";
import { PostWithoutAuth } from "../../services/HttpService";
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import giris from "../../Photo/giris.jpg";
import './Auth.css';
/*
const useStyles = makeStyles((theme) => ({
    foto: {
      height: '100vh',
    },
    image: {
    
      backgroundImage: 'url()',
      backgroundRepeat: 'no-repeat',
     
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
}));
*/

function Auth() {
    //onChange metoduyla bu bilgileri inputlardan alacağız
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    let history = useHistory();
    //const classes = useStyles();
    //gelen bilgileri alıp yukarıdaki alanlara set edecekler.
    const handleUsername = (value) => {
        setUsername(value)
    }

    const handlePassword = (value) => {
        setPassword(value)
    }
/************************************** */
    //kayıt ol ve giriş yap
    const sendRequest = (path) => {
        PostWithoutAuth(("/auth/"+path), {
            userName : username, 
            password : password,
        })    //services'de metoduna gidecek
       
        .then((res) => res.json())
        .then((result) => {localStorage.setItem("tokenKey",result.accessToken);
                            localStorage.setItem("refreshKey",result.refreshToken); //refresh olmuş tokenla işlem yapacak
                            localStorage.setItem("currentUser",result.userId);
                            localStorage.setItem("userName",username)})
        .catch((err) => console.log(err))
    }   

    const handleButton = (path) => {
        sendRequest(path) //register backend e istek atacak
        setUsername("")
        setPassword("")
        history.go("/auth") //register olduktan sonra tekrar aynı sayfaya gitmesini sağlayacağız
    }
/******************************************* */
    return (
        <div className="ortalama">
        <Grid container component="main" className="foto" >
      <CssBaseline />
      <Grid item xs={false} sm={4} md={6} className="image" />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square style={{boxShadow:"none"}} >



      
        <FormControl style={{marginTop: "20%"}} >
            <InputLabel>Kullanıcı Adı</InputLabel>
            <Input onChange={(i) => handleUsername(i.target.value)}/>
            <InputLabel  style={{top: 80}}>Şifre</InputLabel>
            <Input  style={{top: 40}}
            onChange = {(i) => handlePassword(i.target.value)}/>
            <Button variant="contained"
                style={{marginTop : 60, width: 400,
                background : 'linear-gradient(45deg, #27496D 40%, #51C4D3 90%)',
                color : 'white'}}   
                onClick={(() => handleButton("register"))}
                >Kayıt Ol</Button>
            <FormHelperText style={{margin:20}}>Daha Önce Kayıt Olduysanız</FormHelperText>
            <Button variant="contained"
                style = {{
                background : 'linear-gradient(45deg, #27496D 40%, #51C4D3 90%)',
                color : 'white'}}
                onClick={(() => handleButton("login"))}>Giriş</Button>
        </FormControl>
        </Grid>
    </Grid>
    </div>
    )
}

export default Auth;