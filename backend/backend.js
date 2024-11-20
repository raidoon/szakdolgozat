const express = require('express')
const mysql = require('mysql')
var cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json());
app.use(express.static('kepek'))
var connection
function kapcsolat(){
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'szakdolgozat'
      })
      connection.connect()
}
app.get('/', (req, res) => {
  res.send('kapcsolat OK')
})
app.get('/osszesFelhasznalo', (req, res) => {
    kapcsolat()
    connection.query('SELECT * from felhasznaloi_adatok', (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Nu-uh")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
      })
      connection.end()
})
app.get('/tanuloLista', (req, res) => {
  kapcsolat()
  connection.query('SELECT * from tanulo_adatok', (err, rows, fields) => {
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