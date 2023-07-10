import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import UserActivity from "../UserActivity/UserActivity";
import { makeStyles } from '@material-ui/core/styles';
import { GetWithAuth } from "../../services/HttpService";
import axios from "axios";
import ProductForm from "../Product/ProductForm";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({    
    container: {
        height: "100%",
        marginLeft: "15%",
        marginRight: "15%",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: '#EEEEEE',
        

    },
    root: {
        display: "flex",
        
    },
    form: {
        display: "flex",
        justifyContent: "center",

    },

});

function User() {
    const {userId} = useParams();
    const classes = useStyles();
    const [user, setUser] = useState();

    //avatar için get isteği backendden avatar değiştirme isteği için
    const getUser = () => {

        GetWithAuth("/users/"+userId) //services'de metdouna gidecek

        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                setUser(result);
            },
            (error) => {
                console.log(error)
            }
        )
    }
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false); 
    const [productList, setProductList] = useState([]);

    const refreshProducts = () => {
        fetch("/products") //ProductController classından backend den oluşturduğumuz isteği fetch ediyoruz...
        .then(res => res.json()) //gelen isteği parse ediyoruz
        .then(
            (result) => { //result gelme durumunda ne yapmamız gerektiği
                setIsLoaded(true); //data geldiğinde isLoaded i true yapmamız gerekiyor
                setProductList(result) //gelen datayı productList'e result ediyoruz
            },
            (error) => { //error oluşması durumunda ne yapmamız gerekdiği
                console.log(error)
                setIsLoaded(true); //sayfa döner durumda kalmasın diye true yapıyoruz 
                setError(error); //erroru kullanıcıya göstereceğiz
            }
        )
    }


    useEffect(() => {
        getUser()
    }, [])


    useEffect(() => { //API yazıyoruz listenin içini dolduracağız
        refreshProducts()
    }, []) //herhangi bir değişiklik olduğunda sayfayı yeniler



/*
useEffect(() => {
    axios.get('http://localhost:8080/users/'+userId)
    .then(response => setUser(response.data));
},[])
/*
const loadUsers = async () => {
    const result = await axios.get("http://localhost:8080/users/"+userId);
    setUser(result);
};
*/
    return(
        <div className= {classes.container}>

        <div className={classes.root}>
   
            {user? <Avatar avatarId={user.avatarId} userId={userId} userName={user.userName}/> : ""}
            {localStorage.getItem("currentUser") == userId ?<UserActivity userId={userId}/> : ""}
            </div>

            <div className={classes.form}>
                
            {localStorage.getItem("currentUser") == null? "":
                <ProductForm userId = {localStorage.getItem("currentUser")} userName = {localStorage.getItem("userName")} refreshProducts = {refreshProducts}/>}
            </div>
            <div>
                <p>&nbsp;
                &nbsp;
                </p>
            </div>
        </div>
    )
}

export default User;