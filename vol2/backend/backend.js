const express = require('express')
const mysql = require('mysql')
var cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())

var connection;
function kapcsolat() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'szakdolgozat_vol2' //otthon: szakdolgozat || sulis gépen: szakdolgozat_vol2
    })
    connection.connect()
}
app.get('/hello', (req, res) => {
    res.send('Hello World!')
})
//jelszót vedd ki
app.post('/bejelentkezes', (req, res) => {
    kapcsolat()
    connection.query(`SELECT * from felhasznaloi_adatok WHERE felhasznalo_nev = ? AND felhasznalo_jelszo = ?
  `,[req.body.felhasznalonev, req.body.jelszo], (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
      })
      connection.end()
})
app.post('/sajatAdatokT',(req,res)=>{
    kapcsolat()
    connection.query(`select * from tanulo_adatok where tanulo_felhasznaloID = ?`,[req.body.felhasznaloID],(err,rows,fields)=>{
        if (err) {
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })
    connection.end()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})