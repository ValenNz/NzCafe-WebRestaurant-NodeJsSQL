const mysql = require("mysql")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nz_cafe"
})

db.connect(err => {
    if(err) {
        console.log(err.message)
    } else {
        console.log("Project telah tersambung ke database Nz cafe")
    }
})

module.exports = db