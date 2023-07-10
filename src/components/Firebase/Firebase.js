
import { initializeApp } from "firebase/app";
import { getStorage, ref , uploadBytes , getDownloadURL , deleteObject } from "firebase/storage";

const firebaseConfig = {
   // your config object
   // you get from firebase
   apiKey: "AIzaSyAAeopDBBdFH7Y_EbmY2kepsEI9Nvbzwhs",
   authDomain: "finish-50a61.firebaseapp.com",
   projectId: "finish-50a61",
   storageBucket: "finish-50a61.appspot.com",
   messagingSenderId: "68327866678",
   appId: "1:68327866678:web:92f510d7babaa7ae9b3397",
   measurementId: "G-R73T4XQ19M"
};


    async function saveFile(imagetoUpload){

        if(imagetoUpload == null) return ;

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        
        let imageRef = ref(storage, `images/${imagetoUpload.name}`);

         let snapshot = await uploadBytes(imageRef, imagetoUpload) ;
        
         imageRef = ref(storage, snapshot.metadata.fullPath);
         let url = await getDownloadURL(imageRef);
         return  url ;
    };


  async function getFile(){

     const app = initializeApp(firebaseConfig);
     const storage = getStorage(app);
     const imageRef = ref(storage, `images/img1.jpg`);

     let url = await getDownloadURL(imageRef);
     return url;
  };


async function deleteFile(imagePath){

 const app = initializeApp(firebaseConfig);
 const storage = getStorage(app);
 const imageRef = ref(storage, imagePath);

   deleteObject(imageRef).then(() => {
      // File deleted successfully
   }).catch((error) => {
   // Uh-oh, an error occurred!
   });
  };

export {saveFile , getFile , deleteFile};