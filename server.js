const express = require("express")
const app = express()
const Cryptr = require("cryptr")            
const crypt = new Cryptr("140533602676") 
const db = require("./config")

validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token  = req.get("Token")
            
            // decrypt token menjadi id_user
            let decryptToken = crypt.decrypt(token)

            // sql cek id_user
            let sql = "select * from user where ?"

            // set parameter
            let param = { id_user: decryptToken}

            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                 // cek keberadaan id_user
                if (result.length > 0) {
                    // id_user tersedia
                    next()
                } else {
                    // jika user tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }

    }
}

const user = require("./controllers/user_controller")
app.use("/user", user)

const meja = require("./controllers/meja_controller")
app.use("/meja",validateToken(), meja)

const menu = require("./controllers/menu_controller")
app.use("/menu",validateToken(), menu)

const transaksi = require("./controllers/transaksi_controller")
app.use("/transaksi",validateToken(), transaksi)


app.listen(8000, () => {
    console.log("server run on port 8000")
})