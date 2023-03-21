// Dependencies
const passport = require('passport');
const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'dre',
    password: 'dragon4765',
    database: 'magicboat',
    PORT: 3306
});
const path = require('path');
// const initializePass = require('./passport-config');
const cookie = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
// Initialization
db.connect((err) => {
    if(!err) {
        console.log('Bobs')
    } else {
        console.log('Burgers');
        console.log(err);
    }
});
app.use(cors({
    "Access-Control-Allow-Origin": "*"
}));
app.use(express.urlencoded({ extended: false }));
app.use(session({ 
    secret: "bbw",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure: false,
        maxAge: 300000,
    }
}));
app.use(cookie());
app.use(passport.initialize());
app.use(passport.session());
app.listen(3000, () => {
    console.log('Successfully twerking on PORT');
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Routes "normally contained in a 'controller' directory"

// Navigation Routes 
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/login', (req, res) => {
    res.render('login')
});
app.get('/register', (req, res) => {
    res.render('register')
});
app.get('/index', (req, res) => {
    res.render('index')
});
app.get('/~/:username', (req, res) => {
    res.render('welcome', { username: req.params.username});
})
// Query Routes
app.get('/spells', (req, res) => {
    let sql = `SELECT * FROM spells;`;
    db.query(sql, (err, data) => {
        res.send(data);
    })
});
app.get('/spells/:id', (req, res) => {
    let sql = `SELECT * FROM spells WHERE id = ${req.params.id};`;
    db.query(sql, (err, data) => {
        res.send(data);
    })
});
app.get('/spells/filter/:element', (req, res) => {
    let sql = `SELECT * FROM spells WHERE element = '${req.params.element}'`;
    db.query(sql, (err, data) => {
        res.send(data);
    })
});
// User Routes 
app.post('/register', (req, res) => {
    let doesExist = `SELECT * FROM customers WHERE username = '${req.body.username}';`;
    db.query(doesExist, (err, exists) => {
        console.log(exists.length)
        if (exists.length === 1) {
        res.render('register', { message: 'Username taken'})
        }  else if (exists.length === 0) { 
        res.render('register', { message: 'Hello fair maiden'}) 
    }
    })
    let register = `INSERT INTO customers (username, password, nickname) VALUES ('${req.body.username}','${req.body.password}','${req.body.nickname}')`;
    db.query(register, () => {
        console.log('New User Registered', req.body.username);
    })
});
app.post('/login/password', (req, res, next) => {
    initialize(
        passport,
        req.body.username,
        req.body.password
    )
    next()
})
app.post('/login/password', passport.authenticate('local', {
    successRedirect: `/~`,
    failureRedirect: '/login'
})
);
app.get('/~', (req, res) => {
    res.send(req.user);
    if (req.isAuthenticated()) {
        console.log('bitch im authentic')
    }
})



// ALTER TABLE customers ADD COLUMN spells_learned_${id} TEXT WHERE id = ${userid};

function initialize(passport, username, password) {
    const authenticate = async (username, password, done) => {
        const P = `SELECT username FROM customers WHERE password = '${password}' AND username = '${username}';`;
        db.query(P, (err, data) => {
            if (data.length > 0) {
                return done(null, username)
            } else {
                console.log('fail');
                return done(null, false)
            
            }
        })
};
    
    passport.use(new LocalStrategy(authenticate));
    
    passport.serializeUser( function(user, done) { return done (null, user)});
    passport.deserializeUser( function(user, done) { return done(null, user)})
}