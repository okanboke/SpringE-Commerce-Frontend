import {React, useState, useEffect,forwardRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Product from "../Product/Product";
import { GetWithAuth } from '../../services/HttpService';


/*

const columns = [
    {
        id: 'Profil Aktivitesi',
        label: 'Profil Aktivitesi',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toLocaleString('eng-US'),
    }
];

*/

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
        minWidth: 100,
        maxWidth: 800,
        marginTop: 50,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: 2,
        flex: 1,
    },
});

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function PopUp(props) { //ürüne basıldığında full screen dialog penceresi açılacak.
    const classes = useStyles();
    const {isOpen, productId, setIsOpen} = props;
    const [open, setOpen] = useState(isOpen);
    const [product, setProduct] = useState();

    const getProduct = () => { //Ürün Aktiviteleri backendden alıyoruz

        GetWithAuth("/products/"+productId) //services'de metoduna gidecek

            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setProduct(result);
                },
                (error) => {
                    console.log(error)
                }
            )
    }


    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        getProduct();
    }, [productId])


    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Close
            </Typography>
          </Toolbar>
        </AppBar>
        {product? <Product likes = {product.productLikes} productId = {product.id} userId = {product.userId} userName = {product.userName}
                        title={product.title} text={product.text}></Product>: "loading"}
      </Dialog> 
    )
}

function UserActivity(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const {userId} = props;
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState();
    const [selectedProduct, setSelectedProduct] = useState();

    const handleNotification = (productId) => { //spesifik bir producta gideceğiz
        setSelectedProduct(productId);
        setIsOpen(true);
    };


    const getActivity = () => { //Aktiviteleri backendden alıyoruz
        GetWithAuth("/users/activity/"+userId) //services'de metdouna gidecek
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    console.log(result);
                    setRows(result)
                },
                (error) => {
                    console.log(error)
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        getActivity()
    }, [])


    return (
        <div>
        {isOpen? <PopUp isOpen={isOpen} productId={selectedProduct} setIsOpen={setIsOpen}/>: ""}

        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            User activity
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <Button onClick={() => handleNotification(row[1])}>
                                 <TableRow hover role="checkbox" tabIndex={-1} key={row.code} >
                                    <TableCell align="right">
                                    {row[3] + " " + row[0] + " your product"}
                                    </TableCell>
                                </TableRow>
                                </Button>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        </div>
    );
}

export default UserActivity;