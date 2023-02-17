const express  = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const db = require("../config")
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.post("/", (req,res) => {

    let data = {
        nomor_meja : req.body.nomor_meja
    }

    let sql = "INSERT INTO meja SET ?"

    db.query(sql, data, (err, result) => {
        if(err){
            response = {
                message : err.message
            }
        } else {
            response = {
                message : result.affectedRows + " Data meja telah ditambahkan"
            }
        }
        res.json(response)
    })
})

app.get("/", (req, res) => {
    let sql = "SELECT * FROM meja"

    db.query(sql, (err, result) => {
        if(err){
            response = {
                message : err.message
            }
        } else {
            response = {
                count : result.length,
                meja : result
            }
        }
        res.json(response)
    })
})

app.get("/:id_meja", (req,res) => {
    let data = {
        id_meja: req.params.id_meja
    }

    let sql = "SELECT * FROM meja WHERE ?"

    db.query(sql, data, (err, result) => {
        if(err){
            response = {
                message: err.message
            }
        } else {
            response = {
                count : result.length,
                meja : result
            }
        }
        res.json(response)
    })
})

app.put("/:id_meja", (req, res) => {
    let data = [
        {
            nomor_meja: req.body.nomor_meja
        },
        {
            id_meja: req.params.id_meja
        }
    ]

    let sql = "UPDATE meja SET ? WHERE ? "

    db.query(sql, data, (err, result) => {
        if(err) {
            response = {
                message : err.message 
            }
        } else {
            response = {
                message: result.affectedRow + "Data meja telah ditambahkan"
            }
        }
        res.json(response)
    })
})

app.delete("/:id_meja", (req, res) => {
    let data = {
        id_meja : req.params.id_meja
    }

    let sql = "DELETE FROM meja WHERE ?"

    db.query(sql , data, (err, result) => {
        if(err){
            response = {
                message: err.message
            }
        } else {
            response = {
                message: result.affectedRow + "Data meja telah dihapus"
            }
        }
        res.json(response)
    })
})

module.exports = app

