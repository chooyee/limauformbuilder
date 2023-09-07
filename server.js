const express = require('express');
const path = require('path');
const context = require('./context/context.service');
const cors = require("cors");

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

// app.get('/', (req, res) => res.redirect('/face_detection'))
app.get('/', (req, res) => res.render('home'));

//app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT}!`));
const PORT = context.ExpressPort || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
