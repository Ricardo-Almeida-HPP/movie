/*const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.login = async (req, res) => {
    const {username, password, l} = req.body;

    try {
        console.log("username: ", username)
        console.log("password: ", password)
        console.log("L: ", l)
        
    } catch (error) {
        console.log(error);
    }
    db.query('SELECT * FROM users WHERE name = ?', [username], async (error, results) =>{
        console.log(results);
        if(!results || !(await bcrypt.compare(password, results[0].password))){
            res.status(401).render('login',{
                message: 'Username or password is incorrect'
            })
        }
    })
}


exports.register = (req, res) => {
    console.log(req.body);

    const { registerUsername, registerEmail, registerPassword, registerPassword2 } = req.body;
    console.log("username: ", registerUsername)
    console.log("Email: ", registerEmail)
    console.log("Password: ", registerPassword)
    console.log("Password2: ", registerPassword2)



    db.query('SELECT email FROM users WHERE email = ?', [registerEmail], async (error, results) => {
        if(error){
            console.log(error);
        }

        if (results.length > 0){
            console.log("nao funciona")
            return res.send("ola");
        }else if (registerPassword !== registerPassword2){
            return res.send("ola");
        }
        let hashedPassword = await bcrypt.hash(registerPassword, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: registerUsername, email: registerEmail, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            }else{
                console.log(results);
                res.status(200).send("funcionou");
            }

        })

    });


}*/