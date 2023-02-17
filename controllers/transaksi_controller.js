const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const moment = require("moment") 
const db = require("../config")

app.use(cors())                        
app.use(bodyParser.json())                          
app.use(bodyParser.urlencoded({extended: true}))   

app.post("/", (req,res) => {
    let data = {
        tgl_transaksi: moment().format('YYYY-MM-DD HH:mm:ss'),
        id_user: req.body.id_user,
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status: req.body.status
    }

    let menu = JSON.parse(req.body.menu)
 
    let sql = "insert into transaksi set ?" 

    db.query(sql, data, (err, result) => {
        if(err){
            res.json({message: err.message})
        } else {
            let lastID = result.insertId

            let data = []

            for (let i = 0; i < menu.length; i++){
                data.push([
                    lastID, menu[i].id_menu
                ])
            }

            let sql = "insert into detail_transaksi (id_transaksi, id_menu) values ?"
            db.query(sql, [data], (err, result) => {
                if(err) {
                    res.json({message: err.message})
                } else {
                    res.json({
                        message: " Data transaksi berhasil ditambahkan",
                        menu : result
                })
                }
            }) 
        }
    })
})

app.get("/", (req,res) => {
    let sql = "select t.id_transaksi, t.tgl_transaksi,  dt.id_menu, m.id_menu, m.nama_menu, t.id_user, user.username " + 
    "from detail_transaksi dt join transaksi t on t.id_transaksi = dt.id_transaksi join menu m on m.id_menu = dt.id_menu join user on user.id_user = t.id_user"

    db.query(sql, (err, result) => {
        if (err) {                                
            res.json({ message: err.message})   
        }else{                                    
            res.json({
                count: result.length,
                transaksi: result
            })
        }
    })
})

app.get("/:id_transaksi", (req,res) => {
    let param = { id_transaksi: req.params.id_transaksi}

    let sql = "select * from detail_transaksi dt join menu m on m.id_menu = dt.id_menu where ?"

    db.query(sql, param, (err, result) => {
        if (err) {                           
            res.json({ message: err.message})   
        }else{                                  
            res.json({
                count: result.length,
                detail_transaksi: result
            })
        }
    })
})

app.delete("/:id_transaksi", (req,res) => {
    let param = { id_transaksi: req.params.id_transaksi}

    let sql = "delete from detail_transaksi where ?"

    db.query(sql, param, (err, result) => {
        if (err) {                                
            res.json({ message: err.message})
        } else {
            let param = { id_transaksi: req.params.id_transaksi}
            let sql = "delete from transaksi where ?"

            db.query(sql, param, (err, result) => {
                if (err) {     
                    res.json({ message: err.message})
                } else {    
                    res.json({message: "Data telah dihapus"})
                }
            })
        }
    })
})

module.exports = app







