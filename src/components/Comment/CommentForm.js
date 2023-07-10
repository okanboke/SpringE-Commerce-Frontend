import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CardContent, InputAdornment, OutlinedInput, Avatar, Button} from "@material-ui/core";
import { PostWithAuth, RefreshToken } from "../../services/HttpService";

const useStyles = makeStyles((theme) => ({
    comment : {
        display: "flex",
        flexWrap: "wrap",
        justifyContent : "flex-start",
        alignItems : "center",
    },
    link: {
        textDecoration : "none",
        boxShadow : "none",
        color : "white"
    },
    avatar: {
        background: 'linear-gradient(45deg, #27496D 40%, #51C4D3 90%)',
    },
}));
//bu class'ı Product içerisinde renderlayacağız.
function CommentForm(props) {
    const {userId, userName, productId, setCommentRefresh} = props;
    const classes = useStyles();
    const [text, setText] = useState("");

    let history = useHistory();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        history.go(0)
      }


    const saveComment = () => {
        PostWithAuth("/comments",{
            productId: productId,
            userId: localStorage.getItem("currentUser"),
            text : text,
        }) //services'de metdouna gidecek

            .then((res) => {
                if(!res.ok) {
                    RefreshToken()
                        .then((res) => { if(!res.ok) {
                            logout();
                        } else {
                            return res.json()
                        }})
                        .then((result) => {
                            console.log(result)

                            if(result != undefined) {
                                localStorage.setItem("tokenKey",result.accessToken);
                                saveComment();
                                setCommentRefresh();
                            }})
                        .catch((err) => {
                            console.log(err)
                        })
                }else 
                res.json()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
    }

    const handleChange = (value) => { //handle change ile textimizi alıyoruz
        setText(value);
    }

    return (
        
        <CardContent className= {classes.comment}>

        <OutlinedInput 
        id="outlined-adorment-amount"
            multiline
            inputProps = {{maxLength : 250}}
            fullWidth
            onChange={(i) => handleChange(i.target.value)}
            startAdornment = { //yorum atan kişini avatarını alıyoruz...
                <InputAdornment position="start">
                    <Link className={classes.link} to={{pathname : '/users/' + userId}}>
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                </InputAdornment>
            }
            endAdornment = {
                <InputAdornment position = "end">
                <Button 
                variant = "contained"
                style={{background: 'linear-gradient(45deg, #62c799 30%, #7772e2 90%)',
                color: 'white'}}
                onClick={handleSubmit}
                >YORUM YAP</Button>
                </InputAdornment>
            }
            value = {text}
            style = {{ color : "black",backgroundColor: 'white'}}
        ></OutlinedInput>
        </CardContent>



    )
}
export default CommentForm;