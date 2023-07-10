import React, {useState, useEffect} from "react";
import Product from "../Product/Product";

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ProductForm from "../Product/ProductForm";
import SearchIcon from '@material-ui/icons/Search';
import { FormControl, InputLabel, MenuItem, Select, colors } from "@material-ui/core";
import { findSourceMap } from "module";
const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: "15%",
        marginRight: "15%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: '#EEEEEE',
        height: '100%',
        
    },
    search: {
        marginLeft: "15%",
        marginRight: "15%",

    },
    searchBar: {
        display: "flex",
        flexWrap: "wrap",
        paddingLeft: "8%",
        backgroundColor: '#EEEEEE',
        paddingTop: "1.5%",
        paddingBottom: "0.5%"


    },
    
    mainSearchBar: {
        paddingLeft: "1%",
        justifyContent: "end",
        fontWeight: "bold",
        flexDirection: "row",


    },
    category: {
        justifyContent: "start",
        fontWeight: "bold",
        flexDirection: "row",

    },
    searchInput: {
        width: "55vh",
        height: "56px",
        fontWeight: "bold",
        fontSize: "18px",
        textAlign: "center",
    },
    formControl: {
        minWidth: 120,

    },
}));

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);    //datanın gelme gelmeme durumu kontrolü
    const [productList, setProductList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);

    const [categories, setCategory] = useState(""); //category
    const [typing, setTyping] = useState(""); //ürün aramak için
    const classes = useStyles();

    //ürün arama
    function typingStart(e) {
        const typingTimeout = setTimeout(() => {
            setTyping(e.target.value);
        },1000);

        return() => {
            clearTimeout(typingTimeout);
        }
    }

    const refreshProducts = () => {
        fetch("/products")                              //ProductController classından backend den oluşturduğumuz isteği fetch ediyoruz...
        .then(res => res.json())                        //gelen isteği parse ediyoruz
        .then(
            (result) => {                               //result gelme durumunda ne yapmamız gerektiği
                setIsLoaded(true);              //data geldiğinde isLoaded i true yapmamız gerekiyor
                if(categories)
                setProductList(result.filter(item2 => item2.categories.find((x) => x.categoryName === categories))) //iç içe liste filtreleme
                else
                setProductList(result.filter(item => item.title.toLowerCase().includes(typing.toLocaleLowerCase())))   //gelen datayı productList'e result ediyoruz searcbar ile arıyoruzz

            },
     
            (error) => {                                //error oluşması durumunda ne yapmamız gerekdiği
                console.log(error)
                setIsLoaded(true);                      //sayfa döner durumda kalmasın diye true yapıyoruz 
                setError(error);                        //erroru kullanıcıya göstereceğiz
            }
        )
    }


    //category

    const handleCategories = (event) => {
        setCategory(event.target.value);
    }

    useEffect(() => { //API yazıyoruz listenin içini dolduracağız
        refreshProducts()
    }, [typing,categories]) //herhangi bir değişiklik olduğunda sayfayı yeniler

    if(error) { //eğer bir error varsa...
        return <div> error !!! </div>;
    } else if(!isLoaded) { //henüz data gelmediyse
        return <div> Loading... </div>;
    }else { //ikisi de yoksa kullanıcıya data listesini gösterebiliriz...
        return( //verilerimizi çekiyoruz


        
        <div>
        <div className={classes.search}>
            <div className={classes.searchBar}>
        <div className={classes.category}>
        <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-autowidth-label" style={{fontSize: "20px", marginLeft: "22vh",}}> Kategori </InputLabel>
        <Select
          fullWidth
          labelId="demo-simple-select-autowidth-label" //category alanı
          id="demo-simple-select-autowidth"
          value={categories}
          onChange={handleCategories}
          label="Kategori"       
          style={{width: "55vh",  background:"white"}}

        >    
           <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"Bilgisayar"}>Bilgisayar</MenuItem>
          <MenuItem value={"Televizyon"}>Televizyon</MenuItem>
          <MenuItem value={"Ayakkabı"}>Ayakkabı</MenuItem>
          <MenuItem value={"Pantolon"}>Pantolon</MenuItem>
          <MenuItem value={"Güneş Gözlüğü"}>Güneş Gözlüğü</MenuItem>
          <MenuItem value={"Cep Telefonu"}>Cep Telefonu</MenuItem>
        </Select>
        </FormControl>
        </div>
                <div className={classes.mainSearchBar}>
                <SearchIcon fontSize="large"  color = "default" style={{backgroundColor: "linear-gradient(45deg, #27496D 40%, #51C4D3 90%)"}} />:&nbsp;
                    <input className={classes.searchInput} onChange={typingStart} type="text" placeholder="Arama..."/>
                </div>               
            </div>
        </div>
            <div className= {classes.container}>

                {productList.map(product => (
                    <Product likes = {product.productLikes} productId = {product.id} userId = {product.userId} userName = {product.userName} 
                 price = {product.price} title={product.title} text={product.text} image={product.image} categoryName = {product.categories}></Product>
                ))}
                
            </div>

            </div>
        );
    }
}
export default Home;