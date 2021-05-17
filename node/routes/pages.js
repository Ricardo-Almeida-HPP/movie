const express = require("express");
const mysql = require("mysql");

const router = express.Router();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})


router.get("/", (req, res) => {
    db.query('SELECT * FROM movies', function (err, movies, fields) {
        if (err) throw err;
        console.log(movies);
        db.query('SELECT * FROM actors', function (err, actors, fields) {
            if (err) throw err;
            console.log(actors);
            db.query('SELECT * FROM directors', function (err, directors, fields) {
                if (err) throw err;
                console.log(directors);
                db.query('SELECT * FROM studios', function (err, studios, fields) {
                    if (err) throw err;
                    console.log(studios);
                    db.query('SELECT users.name_user, movies.name_movie, movies.image, movies.Tipo, movies.op from users inner join favoritem on users.id = favoritem.id_user inner join movies on favoritem.id_mov = movies.id', function (err, favoritem, fields) {
                        if (err) throw err;
                        console.log(favoritem);
                        db.query('SELECT users.name_user, directors.name_dir, directors.image, directors.op from users inner join favorited on users.id = favorited.id_user inner join directors on favorited.id_dir = directors.id', function (err, favorited, fields) {
                            if (err) throw err;
                            console.log(favorited);
                            res.render("index", {movies: movies, actors: actors, directors: directors, studios: studios, favoritem: favoritem, favorited: favorited})
                        }) 
                    }) 
                }) 
            })    
        })
    });
})

router.get("/login", (req, res) =>{
    res.render("index")
})

module.exports = router;




