const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const db = require("../config")
const app = express()
const multer = require("multer")            
const path = require("path")                
const fs = require("fs") 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(express.static(__dirname));             

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './controllers/image/foto_menu');
    },  
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "Menu - "+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

app.post("/", upload.single("foto"), (req, res) => {
    let data = {
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        foto: req.file.filename,
        harga: req.body.harga
    }

    if(!req.file ){
        res.json({
            message: "Tidak ada foto yang dikrim"
        })
    } else {
        let sql = "INSERT INTO menu set ?"

        db.query(sql, data, (err, result) => {  
            if(err){
                response = {
                    message: err.message
                }
            } else {
                response = {
                    message: result.affectedRows+ " Data menu berhasil ditambahkan"
                }
            }
            res.json(response)
        })
    }
    
})

app.get("/", (req, res) => {
    let sql = "SELECT * FROM menU"

    db.query(sql, (err, result) => {
        if(err){
            response = {
                message: err.message
            }
        } else {
            response = {
                count : result.length,
                menu : result
            }
        }
        res.json(response)
    })
})

app.get("/:id_menu", (req,res) => {

    let data = {
        id_menu : req.params.id_menu
    }

    let sql = "SELECT * FROM menu WHERE ?"

    db.query(sql,data, (err, result) => {
        if(err) {
            response = {
                message: err.message
            }
        } else {
            response = {
                count: result.length,
                menu: result
            }
        }
        res.json(response)
    })
})

app.put("/:id_menu", upload.single("foto"), (req, res) => {
    
    let data = null, sql = null

    let param = {
        id_menu: req.params.id_menu
    }

    if (!req.file) {
        data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            harga: req.body.harga
        }
    } else {
        data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            foto: req.file.filename,
            harga: req.body.harga
        }

        sql = "SELECT * FROM menu WHERE ?"

        db.query(sql, param, (err, result) => {
            if (err) throw err
            let fileName = result[0].foto

            let dir = path.join(__dirname,"image/foto_menu",fileName) 
            fs.unlink(dir, (error) => {})   
        })

    }

    sql = "UPDATE menu SET ? WHERE ?"

        db.query(sql, [data,param], (err, result) => {
            if(err){
                response = {
                    message : err.message
                }
            } else {    
                response = {
                    message : result.affectedRows + " Data menu telah terupdate"
                }
            }
            res.json(response)
        })
})

// app.delete("/:id_menu", (req,res) => {
//     let data = {
//         id_menu : req.params.id_menu
//     }

//     let sql = "DELETE FROM menu wehre ?"

//     db.query(sql, data, (err, result) => {
//         if(err) {
//             respomse = {
//                 message: err.message
//             }
//         } else {
//             response = {
//                 message: result.affectedRows + " Data menu berhasil dihapus"
//             }
//         }
//         res.json(response)
//     })
// })

module.exports = app






