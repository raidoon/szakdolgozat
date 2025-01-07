const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
var cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

var connection;
function kapcsolat() {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "szakdolgozat_vol2", //otthon: szakdolgozat || sulis gépen: szakdolgozat_vol2 || szakdoga_gyakorlas
  });
  connection.connect();
}
//------------------------------------------------ autósiskolák lekérdezése
app.get("/autosiskolalista", (req, res) => {
  kapcsolat();
  connection.query(
    `select autosiskola_id, autosiskola_nev from autosiskola_adatok`,
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log(rows);
        res.status(200).send(rows);
      }
    }
  );
  connection.end();
});
//------------------------------------------------ REGISZTRÁCIÓ
app.post("/regisztracio", (req, res) => {
  const {
    autosiskola,
    email,
    jelszo,
    telefonszam,
    tipus,
    nev
  } = req.body;
  if (tipus !== 1 && tipus !== 2) {
    res.status(400).send("Érvénytelen típus!");
    return;
  }
  kapcsolat();
  //---------------------- VAN-E MÁR ILYEN EMAIL REGISZTRÁLVA
  connection.query(
    "SELECT felhasznalo_email FROM felhasznaloi_adatok WHERE felhasznalo_email = ?",
    [email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Hiba történt az email cím ellenőrzése közben!");
        connection.end();
        return;
      }
      if (rows.length !== 0) {
        res.status(400).send("Ez az email cím már regisztrálva van!");
        connection.end();
        return;
      }

      //---------------------- JELSZÓ HASH
      bcrypt.hash(jelszo, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          res.status(500).send("Hiba történt a jelszó titkosítása közben!");
          connection.end();
          return;
        }
        //---------------------- ÚJ FELHASZNÁLÓ FELVÉTELE, HA MÉG NINCS ILYEN FELHASZNÁLÓNÉV VAGY EMAIL
        connection.query(
          "INSERT INTO felhasznaloi_adatok VALUES (null, ?, ?, ?, ?, ?)",
          [ autosiskola, email, hashedPassword, telefonszam, tipus],
          (insertErr, result) => {
            if (insertErr) {
              console.error(insertErr);
              res.status(500).send("Hiba történt a felhasználó mentése során!");
              connection.end();
              return;
            }
            //---------------------- MEGHATÁROZZUK, HOGY A REGISZTRÁLÓ TANULÓ VAGY OKTATÓ LESZ
            else {
              if (tipus === 1) {
                // Oktató
                connection.query(
                  "INSERT INTO oktato_adatok VALUES (null, ?, ?)",
                  [result.insertId, nev],
                  (err2) => {
                    if (err2) {
                      console.error(err2);
                      res.status(500).send("Hiba történt az oktatói adatok mentésekor!");
                    } else {
                      res.status(201).send("Sikeres oktató regisztráció!");
                    }
                    connection.end();
                  }
                );
              } else if (tipus === 2) {
                // Tanuló
                connection.query(
                  //szakdoga_gyakorlo --> oktató id = 4 --> a teszt oktatóhoz adjuk automatikusan
                  //szakdoga_vol2 --> oktató id = 7 --> a teszt oktatóhoz adjuk automatikusan
                  "INSERT INTO tanulo_adatok VALUES (null, ?, 7, ?, 0)", 
                  [result.insertId, nev],
                  (err2) => {
                    if (err2) {
                      console.error(err2);
                      res.status(500).send("Hiba történt a tanulói adatok mentésekor!");
                    } else {
                      res.status(201).send("Sikeres tanuló regisztráció!");
                    }
                    connection.end();
                  }
                );
              }
            }
          }
        );
      });
    }
  );
});
//------------------------------------------------ BEJELENTKEZÉS
app.post("/beleptetes", (req, res) => {
  const { felhasznalo_email, felhasznalo_jelszo } = req.body;
  kapcsolat();
  connection.query(
    "SELECT felhasznalo_id, felhasznalo_email, felhasznalo_jelszo, felhasznalo_tipus FROM felhasznaloi_adatok WHERE felhasznalo_email = ?",
    [felhasznalo_email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send([]);
        return;
      }
      if (rows.length === 0) {
        res.status(404).send("Ez az email cím nem található!");
      } else {
        const hashedPassword = rows[0].felhasznalo_jelszo;
        bcrypt.compare(felhasznalo_jelszo, hashedPassword, (compareErr, isMatch) => {
          if (compareErr) {
            console.error(compareErr);
            res.status(500).send("Hiba a jelszó ellenőrzése során!");
          } else if (isMatch) {
            res.status(200).send(rows[0]);
          } else {
            res.status(401).send("Hibás jelszó!");
          }
        });
      }
    }
  );
  connection.end();
});
//------------------------------------------------ TANULÓ ADATAINAK LEKÉRDEZÉSE
app.post("/sajatAdatokT", (req, res) => {
  kapcsolat();
  connection.query(
    `select felhasznalo_id,felhasznalo_email,felhasznalo_telefonszam,tanulo_neve,tanulo_levizsgazott,oktato_adatok.oktato_neve, autosiskola_adatok.autosiskola_nev 
    from tanulo_adatok 
    inner join felhasznaloi_adatok on tanulo_adatok.tanulo_felhasznaloID=felhasznaloi_adatok.felhasznalo_id 
    inner join oktato_adatok on tanulo_adatok.tanulo_oktatoja=oktato_adatok.oktato_id 
    inner join autosiskola_adatok on felhasznaloi_adatok.felhasznalo_autosiskola=autosiskola_adatok.autosiskola_id
    where tanulo_felhasznaloID = ?`,
    [req.body.felhasznaloID],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log(rows);
        res.status(200).send(rows);
      }
    }
  );
  connection.end();
});
//------------------------------------------------ OKTATÓ ADATAINAK LEKÉRDEZÉSE
app.post("/sajatAdatokO", (req, res) => {
  kapcsolat();
  connection.query(
    `select oktato_id,oktato_felhasznaloID,oktato_neve,felhasznalo_email,felhasznalo_telefonszam,autosiskola_adatok.autosiskola_nev from oktato_adatok
    inner join felhasznaloi_adatok on felhasznaloi_adatok.felhasznalo_id=oktato_adatok.oktato_felhasznaloID
    inner join autosiskola_adatok on felhasznaloi_adatok.felhasznalo_autosiskola=autosiskola_adatok.autosiskola_id
    where oktato_felhasznaloID = ?`,
    [req.body.felhasznaloID],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log(rows);
        res.status(200).send(rows);
      }
    }
  );
  connection.end();
});
//------------------------------------------------ lekérdezések vége

//------------------------adott oktatóhoz tartozó tanulók neveinek megjelenítése post bevitel1
app.post("/egyOktatoDiakjai", (req, res) => {
  console.log("hello")
  kapcsolat();
  connection.query(
    `SELECT *
    FROM tanulo_adatok AS tanulo
    INNER JOIN oktato_adatok AS oktato
    ON tanulo.tanulo_oktatoja = oktato.oktato_id
    WHERE oktato.oktatoid=?`,
    [req.body.oktatoid],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log(rows);
        res.status(200).send(rows);
      }
    }
  );
  connection.end();
});

//----------------------

app.post("/egyTanuloOrai", (req, res) => {
  console.log("hello")
  kapcsolat();
  connection.query(
    `SELECT *
    FROM tanulo_adatok AS tanulo
    INNER JOIN ora_adatok AS ora
    ON tanulo.tanulo_id = ora.tanulo_id
    WHERE tanulo.tanulo_id=?`,
    [req.body.tanuloid],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log(rows);
        res.status(200).send(rows);
      }
    }
  );
  connection.end();
});




//----------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
