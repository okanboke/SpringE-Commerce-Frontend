import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, CardContent, InputAdornment, OutlinedInput, Typography } from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    comment: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    avatar: {
        background: 'linear-gradient(45deg, #27496D 40%, #51C4D3 90%)',
    },
    link: {
        textDecoration: "none",
        boxShadow: "none",
        color: "white"
    }
}));
/***
 * 
 * 
 * 
 *   
 */

//antd 

//bu class'ı Product içerisinde renderlayacağız.
function Comment(props) {
    const { text, userId, userName } = props;

    const classes = useStyles();

    return (
        <div>
            <CardContent className={classes.comment}>
                <OutlinedInput
                    disabled //yorumlarımızı göstermek için Outlinedinput kullanıyoruz.
                    id="outlined-adornment-amount"
                    multiline
                    inputProps={{ maxLength: 25 }}
                    fullWidth
                    value={text}
                    startAdornment={ //yorum atan kişini avatarını alıyoruz...
                        <InputAdornment position="start">
                            <Link className={classes.link} to={{ pathname: '/users/' + userId }}>
                                <Avatar aria-label="recipe" className={classes.avatar}>
                                    {userName.charAt(0).toUpperCase()}
                                </Avatar>
                            </Link>
                        </InputAdornment>
                    }

                    style={{ color: "black", backgroundColor: 'white' }}
                ></OutlinedInput>
            </CardContent>

        </div>

    )
}
export default Comment;