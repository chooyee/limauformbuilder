const express = require('express');
const path = require('path');
const context = require('./context/context.service');
const cors = require("cors");
const multer  = require('multer')
const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

     
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}
     
app.use(cors(corsOptions));
app.set('view engine', 'ejs');


// const db = require("./models");
// db.sequelize.sync({'alter':true});

const viewsDir = path.join(__dirname, 'views');
app.use(express.static(viewsDir));
app.use(express.static(path.join(__dirname, './public')));
//app.use(express.static(path.join(__dirname, './src')));

const maxSize = 100 * 1000 * 1000;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {  
        // Uploads is the Upload_folder_name
        cb(null, "public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "-" + Date.now()+".webp")
    }
})

var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize }
}); 

app.get('/', (req, res) => res.render('home'));

app.post('/api/v1/upload', upload.single('image'), async (req, res)=>{
    // const newFile = await File.create({
    //     name: req.file.filename,
    //   });
      res.status(200).json({
        status: "success",
        img: "uploads/" + req.file.filename,
        message: "Image uploaded successfully!!",
      });
   
});

//app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT}!`));
const PORT = context.ExpressPort || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
