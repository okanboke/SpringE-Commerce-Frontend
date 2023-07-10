import React, {useState} from "react";
import {Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import MuiAlert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputAdornment, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { GetWithAuth, PostWithAuth, PostingWithoutAuth } from "../../services/HttpService";
import {saveFile} from "../Firebase/Firebase";
import axios from "axios";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: "10vh",
      width: 600,
      margin: 10,
      textAlign: "left",
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    avatar: {
        background: 'linear-gradient(45deg, #27496D 40%, #51C4D3 90%)',
    },
    link : {
        textDecoration : "none",
        boxShadow : "none",
        color : "white"
    },
    title : {
      marginTop: 15
    },
    formControl: {
      marginTop: 12,
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function ProductForm(props) {
    const {userId, userName, refreshProducts} = props;
    const classes = useStyles();
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    
    const [price, setPrice] = useState();


    const [isSent, setIsSent] = useState(false); //textboxları temizlemek için

    const [categoryName, setAddCategori] = useState(""); //kategori ekleme kart

    let [imageUpload , setImageUpload] = useState("");
    let [image] = useState("");

    const [categories, setCategory] = useState("");
    const handleCategories = (event) => {
      setCategory(event.target.value);
    };

    const saveAddCategory = () => {
      PostWithAuth("/products/categoryAdd" , { //kategori ekleme card
        categoryName:categoryName,
      })
      .then((res) => res.json())
      .catch((err) => console.log(err))
    }


    const saveProducts = () => { //ilanı yayınlamak için back-end tarafına yolluyoruz.
      PostingWithoutAuth("/products", {
        categories:categories,
        title: title,
        userId: userId,
        text: text,
        price: price,
        image: image,
    }
  )//services'de metdouna gidecek
            .then((res) => res.json())
            .catch((err) => console.log(err))
    }
  

    async function handleSubmit() { //buttona basıldığında aldığımız değerleri objeye dönüştürüp göndereceğiz

        const getImagePath = await saveFile(imageUpload);
        image = getImagePath;

        saveProducts(); //save fonksiyonu çağırıyoruz.  
        setIsSent(true);
        setTitle("");
        setText("");
        setPrice();
        setCategory();

        document.getElementById("imageUpload").value = "";
        setImageUpload("");

        refreshProducts();       
    }

    function handleCategoriSubmit() { //kategori ekleme card

      saveAddCategory();
      setAddCategori("");


    }
  

    const handleTitle = (value) => { //girilen değeri alıp state e gönderecek
        setTitle(value);
        setIsSent(false);
    }

    const handleText = (value) => {
        setText(value);
        setIsSent(false);
    }

    const handlePrice = (value) => {
        setPrice(value);
        setIsSent(false);
    }

    const handleAddCategori = (value) => { //kategori ekleme card
      setAddCategori(value);
      setIsSent(false);
    }

    const handleClose = (event, reason) => { //kaydedildi uyarı mesajı
        if (reason === 'clickaway') {
          return;
        }
    
        setIsSent(false);
      };
    
      function handleChange(e) {
         let url = URL.createObjectURL(e.target.files[0]);
         //setFile(url);
         console.log(url); 
      }

    
    return(
        <div> 
        <Snackbar open={isSent} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          İlanınız başarıyla yayınlandı!
        </Alert>
      </Snackbar>
        <Card className={classes.root}>
          <Typography color="textPrimary" component="p" align="center" variant="h4" className={classes.title}>Ürün Ekleyin</Typography>
            <CardHeader
            avatar={
            <Link className={classes.link} to={{pathname : '/users/' + userId}}>
            <Avatar aria-label="recipe" className={classes.avatar}>
                {userName.charAt(0).toUpperCase()}
            </Avatar> 
            </Link>//userName in sadece baş harfi alınıyor ve tıklandığında usera gidiyor

            } //kullanıcıdan başlık girişi alacağımız için OutlinedInput kullanıyoruz...
            title = {<OutlinedInput
            id="outlined-adornment-amount"
            multiline
            placeholder = "Başlık"
            inputProps = {{maxLength : 25}}
            fullWidth
            value = {title}
            onChange = { (i) => handleTitle(i.target.value)}
            >
            </OutlinedInput>} 
            />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            {<OutlinedInput
            id="outlined-adornment-amount"
            multiline
            placeholder="Açıklama"
            inputProps = {{maxLength : 120}}
            fullWidth
            value = {text}
            onChange = { (i) => handleText(i.target.value)}
            >
            </OutlinedInput>}
        </Typography>
        <Typography variant="body2" component="p">
            {<OutlinedInput
            id="outlined-adornment-amount"
            multiline
            placeholder="Fiyat"
            style={{ top : 12}}

            inputProps = {{maxLength : 120}}
            fullWidth
            value={price}
            onChange={ (i) => handlePrice(i.target.value)}
            >
            </OutlinedInput>}
        </Typography>
        <TextField
        id="outlined-full-width"
        label="Fotoğraf Yükle"
        style={{ top : 8}}
        name="upload-photo"
        type="file"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        onChange={(event) => {setImageUpload(event.target.files[0])}}
        />

      <FormControl variant="outlined" className={classes.formControl} fullWidth > 
        <InputLabel id="demo-simple-select-outlined-label">Kategori</InputLabel>
        
        <Select
          labelId="demo-simple-select-outlined-label" //category alanı
          id="demo-simple-select-outlined"
          value={categories}
          onChange={handleCategories}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>Bilgisayar</MenuItem>
          <MenuItem value={2}>Televizyon</MenuItem>
          <MenuItem value={3}>Ayakkabı</MenuItem>
          <MenuItem value={4}>Pantolon</MenuItem>
          <MenuItem value={5}>Güneş Gözlüğü</MenuItem>
          <MenuItem value={6}>Cep Telefonu</MenuItem>



        </Select>
      </FormControl>



        <Button 
                variant = "contained"
                fullWidth
                style={{background: 'linear-gradient(45deg, #27496D 40%, #51C4D3 90%)',
                color: 'white', top: 12}}
                //onChange = { (i) => handlePrice(i.target.value)}
                onClick={handleSubmit}
                >YAYINLA</Button>
            
      </CardContent>
    </Card>


        <Card className={classes.root}>
    <CardContent>
    <Typography variant="body2" color="textSecondary" component="p">
            {<OutlinedInput
            id="outlined-adornment-amount"
            multiline
            placeholder="Kategori"
            inputProps = {{maxLength : 120}}
            fullWidth
            value = {categoryName}
            onChange = { (i) => handleAddCategori(i.target.value)}
            >
            </OutlinedInput>}
        </Typography>

        <Button 
                variant = "contained"
                fullWidth
                style={{background: 'linear-gradient(45deg, #27496D 40%, #51C4D3 90%)',
                color: 'white', top: 12}}
                onClick={handleCategoriSubmit}
                >KATEGORİ EKLE</Button>

    </CardContent>
    </Card>

    </div>
    )

}

export default ProductForm;