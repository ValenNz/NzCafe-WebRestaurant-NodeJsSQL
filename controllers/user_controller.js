const express = require('express')
const bodyParser = require("body-parser")
const cors = require("cors" )
const app = express()
const md5 = require('md5')
const db = require('../config')
const Cryptr = require("cryptr")
const crypt = new Cryptr("140533602676")    

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())


app.post("/register", (req,res) => {
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)    
    }   

    let sql = "insert into user set ?"

    db.query(sql, data, (err, result) => {
        if(err) {
            response = {
                message : err.message
            }
        } else {
            response = {
                message : result.affectedRows + " Data user berhasil ditambahkan"   
            }
        }
        res.json(response)
    })
})

app.post("/login", (req, res) => {
        let param = [
            req.body.username,
            md5(req.body.password) 
        ]
        
        let sql = "select * from user where username = ? and password = ?"

        db.query(sql, param, (error, result) => {
            if (error) throw error  

            if (result.length > 0) {        
                res.json({  
                    message: "Berhasil Login",                  
                    token: crypt.encrypt(result[0].id_user),   
                    data: result                              
                })
            } else { 
                res.json({
                    message: "username dan password tidak valid" 
                })
            }
        })
    })


app.get("/", (req,res) => {
    let sql = "select * from user"

    db.query(sql, (err, result) => {
        if(err){
            response = {
                message: err.message
            }
        } else {
            response = {
                count : result.length,
                user: result
            }
        }
        res.json(response)
    })
})

app.get("/:id_user", (req, res) => {
    let data = {
        id_user: req.params.id_user
    }

    let sql = "select * from user where ?"

    db.query(sql, data, (err, result) => {
        if(err) {
            response = {
                message: err.message
            } 
        } else {
            response = {
                count : result.length,
                user : result
            }
        }
        res.json(response)
    })
})

app.put("/:id_user", (req,res) => {
    let data = [
        {
            nama_user : req.body.nama_user,
            role: req.body.role,
            username: req.body.username,
            password: req.body.password
        },
        {
            id_user: req.params.id_user
        }
    ]

    let sql = "UPDATE user set ? where ?"

    db.query(sql, data, (err, result) => {
        if(err){
            response = {
                message : err.message
            }
        } else {
            response = {
                message: result.affectedRows + " Data user berhasil di update"
            }
        }
        res.json(response)
    })
})

app.delete("/:id_user", (req,res) => {
    let data = {
        id_user: req.params.id_user
    }
    let sql = "delete from user where ?"

    db.query(sql, data, (error, result) => {
        if (error) {
            response = {
                message: error.message 
            }
        } else {
            response = {
                message: result.affectedRows + " data user berhasil dihapus"
            }
        }
        res.json(response) 
    })
})

module.exports = app
