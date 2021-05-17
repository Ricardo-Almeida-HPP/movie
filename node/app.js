const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env"});


const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

//parse URL encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false}));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());


app.set("view engine", "hbs");

db.connect( (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL connected...")
    }
})

//Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.post("/regist", (req,res) =>{
    console.log(req.body);
    const { registerUsername, registerEmail, registerPassword, registerPassword2 } = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [registerEmail], async (error, results) => {
        if(error){
            console.log(error);
        }
        if (results.length > 0){
            res.status(200).send("1");
            return res.render("index", {
            })
        }else if (registerPassword !== registerPassword2){
            res.status(200).send("2");
            return res.render("index", {
            })

        }
        let hashedPassword = await bcrypt.hash(registerPassword, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name_user: registerUsername, email: registerEmail, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
                
            }else{
                console.log(results);
                res.status(200).send("3");
                return res.render("index", {
                })

            }

        })

    });

});

app.post("/login", (req, res) =>{
    try {
        const {username, password} = req.body;
        if(!username || !password){
            res.status(200).send("4");
            return res.render("index", {

            })
          }
          db.query('SELECT * FROM users WHERE name_user = ?', [username], async (error, results) =>{
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(200).send("5");
                res.render('index',{

                })
            }else{
                const id = results[0].id;
                
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("this token is: ", token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).send("6");
            }
        });
    
    } catch (error) {
        console.log(error);
    }

});

app.post("/am", (req, res) => {
    const {moviename, movietype, movieimage, movieop, movieresume} = req.body;
    db.query("INSERT INTO movies SET ?", {name_movie: moviename, image: movieimage, Tipo: movietype, Resume: movieresume, op: movieop}, (error, results) => {
        console.log("results: ", results);
        res.status(200).send("13");
    })
});

app.post("/aa", (req, res) => {
    const {actorname, actorbio, actorimage, actorop} = req.body;
    db.query("INSERT INTO actors SET ?", {name_actor: actorname, bio: actorbio, image: actorimage, op: actorop}, (error, results) => {
        console.log("results: ", results);
        res.status(200).send("14");
    })
});

app.post("/ad", (req, res) => {
    const {directorname, directorbio, directorimage, directorop} = req.body;
    db.query("INSERT INTO directors SET ?", {name_dir: directorname, bio: directorbio, op: directorimage, image: directorop}, (error, results) => {
        console.log("results: ", results);
        res.status(200).send("16");
    })
});

app.post("/as", (req, res) => {
    const {studioname, studiobio, studioimage, studioop} = req.body;
    db.query("INSERT INTO studios SET ?", {name_studio: studioname, image: studioimage, bio: studiobio, op: studioop}, (error, results) => {
        console.log("results: ", results);
        res.status(200).send("21");
    })
});

app.post("/rm", (req, res) => {
    const {removem} = req.body;
    db.query('DELETE FROM movies WHERE id = ? ', [removem], async (error, results) =>{
        console.log(results);
        res.status(200).send("8");
        res.render('index',{

        })
    })
});

app.post("/ra", (req, res) => {
    const {removea} = req.body;
    db.query('DELETE FROM actors WHERE id = ? ', [removea], async (error, results) =>{
        console.log(results);
        res.status(200).send("15");
        res.render('index',{

        })
    })
});

app.post("/rd", (req, res) => {
    const {removed} = req.body;
    db.query('DELETE FROM directors WHERE id = ? ', [removed], async (error, results) =>{
        console.log(results);
        res.status(200).send("18");
        res.render('index',{

        })
    })
});

app.post("/rs", (req, res) => {
    const {removes} = req.body;
    db.query('DELETE FROM studios WHERE id = ? ', [removes], async (error, results) =>{
        console.log(results);
        res.status(200).send("33");
    })
});


//adicionar a lista favorios filmes
app.post("/addf", (req,res) =>{
    const {addm, username} = req.body;
    console.log("id movie: ", addm);
    console.log("username: ", username);
    db.query("SELECT id FROM users WHERE name_user = ?" , [username], async (error, id_user) =>{
        id_user = JSON.stringify(id_user);
        const string = id_user.replace("[{\"id\":", "").replace("}]", "");
        console.log("id user: ", parseInt(string));
        db.query("INSERT INTO favoritem (id_user, id_mov) VALUES ("+parseInt(string)+","+addm+")", function (error, results){
            console.log("results: ", results);
            res.status(200).send("9");
        })
    })

})

//adicionar a lista favorios directors
app.post("/addd", (req,res) =>{
    const {addd, username} = req.body;
    console.log("id director: ", addd);
    console.log("username: ", username);
    db.query("SELECT id FROM users WHERE name_user = ?" , [username], async (error, id_user) =>{
        id_user = JSON.stringify(id_user);
        const string = id_user.replace("[{\"id\":", "").replace("}]", "");
        console.log("id user: ", parseInt(string));
        db.query("INSERT INTO favorited (id_user, id_dir) VALUES ("+parseInt(string)+","+addd+")", function (error, results){
            console.log("results: ", results);
            res.status(200).send("10");
        })
    })

})

//remover da lista dos favoritos directors
app.post("/rfd", (req, res) => {
    const {removefd} = req.body;
    db.query('DELETE FROM favorited WHERE id = ? ', [removefd], async (error, results) =>{
        console.log(results);
        res.status(200).send("11");
    })
});

app.listen(5000, () => {
    console.log("server started on Port 5000")
});
