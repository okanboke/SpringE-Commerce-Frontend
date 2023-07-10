import React, {useState ,useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { DeleteWithAuth, PostWithAuth } from "../../services/HttpService";
import { InputAdornment, OutlinedInput } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});



const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
//********************************************* */


const useStyles = makeStyles((theme) => ({
    root: {
      width: 400,
      margin: 15,
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
    link: {
        textDecoration : "none",
        boxShadow : "none",
        color : "white"
    },
    closeButton: { //dialog penceresi styles
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },

  }));

function Product(props) {
    const {title, text, userId, userName, price, productId, likes, image, categoryName} = props;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false); //yorum açma kapama buttonu için kullanılıyor
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [commentList, setCommentList] = useState([]); //commentleri diziye tanımlıyoruz
    const [isLiked, setIsLiked] = useState(false);
    const isInitialMount = useRef(true); //Comment'e tıklandı mı kontrolü için tanımlıyoruz sayfayı refresh edeceğiz.
    const [likeCount, setLikeCount] = useState(likes.length); //likeları propstan bu değişkene atayacağız
    const [likeId, setLikeId] = useState(null); //like id mizi almamız için
    const [refresh, setRefresh] = useState(false);
    const [open, setOpen] = useState(false); //dialog penceresi
    const [cates, setCates] = useState(categoryName.map(c => c.categoryName)); // category name listesini kategori ismine ulaşmak için tekrar mapliyoruz

    let disabled = localStorage.getItem("currentUser") == null ? true:false;

    const setCommentRefresh = () => {
      setRefresh(true);
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments(); //Commentlere tıklandımı fonksiyonumuzu çağırıyoruz.
        console.log(commentList);
      };

    const handleLike = () => {
         setIsLiked(!isLiked);
         if(!isLiked){
          saveLike(); //like ı basıldığında database'e kaydediyoruz.
          setLikeCount(likeCount + 1)
         }
          else {
            deleteLike(); // geri alındığında database'den siliyoruz...
            setLikeCount(likeCount -1)
          }
    }

    const refreshComments = () => {
      fetch("/comments?productId="+productId) //CommentController classından backend den oluşturduğumuz isteği fetch ediyoruz...
      .then(res => res.json()) //gelen isteği parse ediyoruz
      .then(
          (result) => { //result gelme durumunda ne yapmamız gerektiği
              setIsLoaded(true); //data geldiğinde isLoaded i true yapmamız gerekiyor
              setCommentList(result) //gelen datayı productList'e result ediyoruz

          },
          (error) => { //error oluşması durumunda ne yapmamız gerekdiği
              console.log(error)
              setIsLoaded(true); //sayfa döner durumda kalmasın diye true yapıyoruz 
              setError(error); //erroru kullanıcıya göstereceğiz
          }
      )
      setRefresh(false)
  }

  const saveLike = () => { //like'ı database'e kaydetmek için
    PostWithAuth("/likes",{
      productId: productId,
      userId : localStorage.getItem("currentUser"),
    }) //services'de istek metoduna gidecek
      .then((res) => res.json())
      .catch((err) => console.log(err))
  } 

    const deleteLike = () => { //like'ı database'den geri almak için
      DeleteWithAuth("/likes/"+likeId) //services'de metoduna gidecek
      .catch((err) => console.log(err))
    }

  const checkLikes = () => {
    var likeControl = likes.find((like => ""+like.userId === localStorage.getItem("currentUser")));
    if(likeControl != null) {
      setLikeId(likeControl.id);
      setIsLiked(true);
    }
  }

    const handleClickOpen = () => {
      setOpen(true);
      refreshComments();
      console.log(commentList);

    };
    const handleClose = () => {
      setOpen(false);
    };




  useEffect(() => { 
    if(isInitialMount.current)
      isInitialMount.current = false;
    else
      refreshComments();
  },[refresh])

  useEffect(() => {checkLikes()},[]) //like gelirse refresh yapar


  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Link className={classes.link} to={{ pathname: '/users/' + userId }}>
            <Avatar aria-label="recipe" className={classes.avatar}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </Link>                                                                   //userName in sadece baş harfi alınıyor ve tıklandığında usera gidiyor
        }
        title={title}
      />
      <CardMedia
        component='img'
        height="250vh"
        image={image}
        alt="test image"></CardMedia>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: 5 }} >
          {text}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginTop: 10 }}>
          <h3>{price} TL</h3>
        </Typography>

        <Typography variant="body2" component="p" style={{ marginTop: 5 }}>
          <h5>Kategori: {cates}</h5>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {disabled ?
          <IconButton
            disabled
            onClick={handleLike} //basıldığında kırmızı yapacak fonksiyon
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton> :
          <IconButton
            onClick={handleLike} //basıldığında kırmızı yapacak fonksiyon
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton>
        }
        {likeCount}

        <Button variant="outlined" color="default" onClick={handleClickOpen} style={{ marginLeft: "auto", marginRight:"3%"}}>
            Yorumlar
            </Button>
        <div>
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Yorumlar
            </DialogTitle>
            <DialogContent dividers>
              <div className={classes.container}>

                {error ? "error" :
                  isLoaded ? commentList.map(comments => ( //Commentlerimizi mapliyoruz...
                    <Comment userId={comments.userId} userName={comments.userName} text={comments.text}></Comment>
                  )) : "Loading"}

                {disabled ? "" : //login olmamış birine comment paylaş kısmını göstermeyeceğiz
                  <CommentForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} productId={productId} setCommentRefresh={setCommentRefresh}></CommentForm>}
              </div>
              <Typography gutterBottom>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                Çıkış
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </CardActions>
    </Card>
  )

}

export default Product;