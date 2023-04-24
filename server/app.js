
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
const cookie = require('cookie-parser');
const { error } = require('console');
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
        minAge: 200000
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

// Navigation Routes 
app.get('*', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.render('login')
    }
    next();
})
app.get('/', (req, res) => {
    res.render('login');
});
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/register', (req, res) => {
    res.render('register')
});
app.get('/index', (req, res) => {
    res.render('index');
});
app.get('/cart', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.render('login');
    }
    res.redirect(`/cart/${req.user.nickname}`);
})
app.get('/cart/:nickname', (req, res, next) => {
    res.render('cart', {
        name: req.user.nickname , gold: req.user.gold , gems: req.user.gems
    });
//    next();
});
app.get('/cart/:nickname', (req, res) => {
    let sql = `SELECT * FROM carts WHERE user_id = ${req.params.nickname}`;
    db.query(sql, (err, data) => {
        res.send(data);
    })
});
app.get('/welcome', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.render('login');
    }
    if (!req.user.gold) {
        res.locals.gold = 0;
    }
    if (!req.user.gems) {
        res.locals.gems = 0;
    }
    let sql = `SELECT * FROM spells WHERE admin_choice is NULL AND cost >= 75`;
    db.query(sql, (err, spelldata) => {
    let random = Math.floor((Math.random() * spelldata.length));
        let sql2 = `SELECT * FROM spells WHERE admin_choice = 'true'`;
        db.query(sql2, (err, data) => {
    let adminoption = data[0];
    let salecost = Math.ceil((adminoption.cost/10)*7);
            let sql3 = `SELECT * FROM spells WHERE admin_choice is NULL AND id != ${spelldata[random].id}`;
            db.query(sql3, (err, spelldata2) => {
    let random2 = Math.floor(Math.random() * spelldata2.length);
            let sql4 = `SELECT * FROM spells WHERE admin_choice is NULL AND id != ${spelldata[random].id} AND id != ${spelldata2[random2].id}`;
            db.query(sql4, (err, spelldata3) => {
    let random3 = Math.floor(Math.random() * spelldata3.length);
    res.render('welcome', 
        { username: req.user.nickname , gold: req.user.gold , gems: req.user.gems , 
            data: spelldata[random].name, element: spelldata[random].element , rank: spelldata[random].spell_rank , cost: spelldata[random].cost , image: spelldata[random].image , gemcost: spelldata[random].gem_cost ,
            salecost: salecost , admindata: adminoption.name , adminelement: adminoption.element , admincost: adminoption.cost, adminimage: adminoption.image, gemadmin: adminoption.gem_cost ,
            data2: spelldata2[random2].name, element2: spelldata2[random2].element , rank2: spelldata2[random2].spell_rank , cost2: spelldata2[random2].cost , image2: spelldata2[random2].image , gemcost2: spelldata2[random2].gem_cost ,
            data3: spelldata3[random3].name, element3: spelldata3[random3].element , rank3: spelldata3[random3].spell_rank , cost3: spelldata3[random3].cost , image3: spelldata3[random3].image , gemcost3: spelldata3[random3].gem_cost ,
        });
            })
            })
    });
        })
});
app.get('/minigame', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('login');
    }
    res.sendFile('minigame.html',  { root: __dirname });
});

// Query Routes

// User Routes 
app.post('/register', (req, res) => {
    let string = req.body.username.toString();
    let lowercase = string.toLowerCase();
    let nospace = lowercase.replace(" ","");
    let doesExist = `SELECT * FROM customers WHERE username = '${nospace}';`;
    db.query(doesExist, (err, exists) => {
        console.log(exists.length);
        if (exists.length === 1) {
        res.render('register', { message: 'This username is not available, please try again', nickname: req.body.nickname });
        } else if (exists.length === 0) { 
        res.render('register', { message: 'Hello fair maiden. Registration successful!'})
        let register = `INSERT INTO customers (username, password, nickname) VALUES ('${req.body.username}','${req.body.password}','${req.body.nickname}')`;
    db.query(register, () => {
        console.log('New User Registered', req.body.username);
    })
    }
    })
});
app.post('/login/password', (req, res, next) => {
    let sql = `SELECT * FROM customers WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
    db.query(sql, (err, data) => {
        if (data.length === 1) {
            next();
        } else { 
            res.render('login', { message: 'Your username or password may be incorrect'});
        }
    })
});
app.post('/login/password', (req, res, next) => {
    initialize(
        passport,
        req.body.username,
        req.body.password
    )
    next();
});
app.post('/login/password', passport.authenticate('local', {
    successRedirect: `/welcome`,
    failureRedirect: '/login'
})
);
app.get('/logout', (req, res) => {
    res.render('login');
    req.session.destroy();
    req.logOut( () => {
        console.log('bye felicia')
    });
});

// Purchase Routes
app.post('/claimgold', (req, res, next) => {
    if (req.isAuthenticated()) {
        let gem_count = Math.abs(req.body.gemcount);
        if (gem_count > 0) {
            let claim = (gem_count + Math.abs(req.user.gems));
            let sql2 = `UPDATE customers SET gems = ${claim} WHERE username = '${req.user.username}'`;
            db.query(sql2, (err, data) => {
                if (err) { 
                    console.log(err)
                }
            })
        }
    next();
} else {
    res.render('register');
} 
});
app.post('/claimgold', (req, res) => {
    if (req.isAuthenticated()) {
    let claim = (Math.abs(req.body.hidden) + Math.abs(req.user.gold));
    let sql2 = `UPDATE customers SET gold = ${claim} WHERE username = '${req.user.username}'`;
    db.query(sql2, (err, data) => {
        if (err) { 
            console.log(err)
        }
    })
    res.render('login');
} else {
    res.render('register');
} 
});
app.get('/addCart/:itemID', (req, res) => {
    if (req.isAuthenticated()){ 
    console.log(req.user);
    let sql = `INSERT INTO carts (user_id, user_name, item_name, gold_cost, gem_Cost) VALUES (${req.user.id}, '${req.user.username}', '${req.body.itemName}', ${req.body.gold}, ${req.body.gems})`;
    db.query(sql, (err) => {
        if (err) {
            return (err)
        } else {
            console.log('Item Selected')
        }
    })} else {
        res.render('register');
    }
});
app.get('/dropCart/:itemID', (req, res) => {
    if (req.isAuthenticated()) {
        let sql = `DELETE FROM carts WHERE item_name = ${req.body.itemName} LIMIT 1`;
        db.query(sql, () => {
            console.log('Item Removed');
        })
    } else {
        res.render('register');
    }
});
app.post('/checkout/:ID', (req, res) => {
    if (req.isAuthenticated()) {
        let sql = `SELECT * FROM carts WHERE user_id = ${req.user.id}`;
        let sql2 = `DELETE FROM carts WHERE user_id = ${req.user.id}`;
        let learned = [];
//      let sql7 = `ALTER TABLE customers ADD COLUMN spells_learned_${id} TEXT WHERE id = ${userid};`;
        db.query(sql, (err, data) => {
            for (let i = 0; i < data.length; i++) {
                learned.push(data[i].item_name);
            }
            console.log(learned);
        })
        db.query(sql2, (err) => {
            console.log('Purchase completed')
        })
    } else {
        res.render('register');
    }
})

function initialize(passport, username, password) {
    const authenticate = async (username, password, done) => {
        const P = `SELECT * FROM customers WHERE password = '${password}' AND username = '${username}';`;
        db.query(P, (err, userData) => {
            if (userData.length > 0) {
                const user = userData[0];
            //    console.log(user);
                console.log(`${username} / ${user.nickname} Logged In Successfully`);
                return done(null, user)
            } else {
                console.log(`Failed to Authenticate | ${username} | attempt: ${password}`);
                return done(null, false)
            
            }
        })
};
    
    passport.use(new LocalStrategy(authenticate));
    
    passport.serializeUser( function(user, done) { return done (null, user)});
    passport.deserializeUser( function(user, done) { return done(null, user)});
}
app.get('*', (req, res) => {
    res.status(404).send('The page you requested does not exist on this server.');
  });