const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const path = require('path');
const context = require('./context/context.service');
const cors = require("cors");
const multer  = require('multer')
const fs = require('fs');
const { prototype } = require('events');
const app = express();
let server = http.createServer(app)
let io = socketIO(server)

var corsOptions = {
    origin: "http://localhost:3000"
};

     
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(express.json());
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

// make connection with user from server side
io.on('connection', (socket)=>{
    console.log('New user connected');
     //emit message from server to user
    socket.emit('newMessage', {
       from:'jen@server',
       text:'Hello stranger',
       createdAt:Date.now()
    });
   
    // listen for message from user
    socket.on('createMessage', (newMessage)=>{
        console.log('newMessage', newMessage);
    });
   
    // when server disconnects from user
    socket.on('disconnect', ()=>{
        console.log('disconnected from user');
    });
});

app.get('/', (req, res) => res.render('home'));

app.get('/form', (req, res) => res.render('form'));

app.post('/api/v1/saveformjson', (req, res) => {
    console.log(req.body);
    fs.writeFile("./public/json/form.json", JSON.stringify(req.body), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }     
        console.log("JSON file has been saved.");
    });

    let protocol = req.protocol;
    console.log("Environment:" + context.Environment)
    if (context.Environment==='production')
    {
        protocol = "https";
    }

    io.emit('newJson', {
        json: `${protocol}://${req.get('host')}/json/form.json`,
        createdAt:Date.now()
     });
    res.status(200).json({
        status: "success",
        "filename":"/json/form.json",
        message: "Json saved successfully!!",
    });
});

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
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
