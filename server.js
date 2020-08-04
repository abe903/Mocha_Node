const path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
var session = require('express-session');

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mchin615@',
    database: 'church'
});

connection.connect(function(error){
    console.log('Database Connected!');
}); 

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});

app.get("/", (req, res) => {
    let sql = 'SELECT * FROM events';

    connection.query(sql, (err, results) => {
        if (err){
            console.log(err)
        }
        res.render("home", {
            results: results
        });
    }); 
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/events", (req, res) => {
    let name = req.session.name;
    res.render("event", {
        name: name
    });
})

app.post("/register", (req, res) => {
    let data = {name: req.body.name, email: req.body.email, password: req.body.password};
    let sql = "INSERT INTO users SET ?";
    connection.query(sql, data,(err) => {
        if(err) throw err;
        res.redirect('/login');
    }); 
})

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(sql,[email, password],(err, results) => {
      if(err) throw err;
      req.session.idnumber = results[0].id
      req.session.name = results[0].name
      console.log(req.session.name)
      res.redirect('/events');
    }); 
})

app.post("/create", (req, res) => {
    let id = req.session.idnumber;
    let event = {name: req.body.name, information: req.body.information, date: req.body.date, time: req.body.time, location: req.body.location, userID: id}
    let sql = "INSERT INTO events SET ?";
    connection.query(sql, event,(err) => {
        res.redirect('/');
    }); 
})

app.post("/search", (req, res) => {
    console.log(req.body);
    res.redirect("/");
})
