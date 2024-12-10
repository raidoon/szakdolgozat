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
    database: "szakdolgozat_vol2", //otthon: szakdolgozat || sulis gépen: szakdolgozat_vol2
  });
  connection.connect();
}
//jelszót vedd ki
app.post("/bejelentkezes", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT felhasznalo_id,felhasznalo_nev,felhasznalo_tipus from felhasznaloi_adatok WHERE felhasznalo_nev = ? AND felhasznalo_jelszo = ?
  `,
    [req.body.felhasznalonev, req.body.jelszo],
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
app.post("/sajatAdatokT", (req, res) => {
  kapcsolat();
  connection.query(
    `select * from tanulo_adatok where tanulo_felhasznaloID = ?`,
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
app.post("/sajatAdatokO", (req, res) => {
  kapcsolat();
  connection.query(
    `select * from oktato_adatok where oktato_felhasznaloID = ?`,
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

// ------------------- Regisztráció
// ------------------- Regisztráció
app.post("/regisztracio", (req, res) => {
    const { felhasznalonev, nev, telefonszam, email, jelszo, tipus } = req.body;
  
    if (tipus !== 0 && tipus !== 1) {
      res.status(400).send("Érvénytelen típus!"); // Csak 0 vagy 1 lehet
      return;
    }
    kapcsolat(); // Create the connection here
  
    // Ellenőrizzük, hogy az email már létezik-e
    connection.query(
      "SELECT felhasznalo_email FROM felhasznaloi_adatok WHERE felhasznalo_email = ?",
      [email],
      (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).send("Hiba");
          connection.end();
          return;
        }
  
        if (rows.length !== 0) {
          res.status(400).send("Ez az email már regisztrálva van!");
          connection.end(); // Close the connection if the email already exists
          return;
        }
  
        // Ellenőrizzük, hogy a felhasználónév már létezik-e
        connection.query(
          "SELECT felhasznalo_nev FROM felhasznaloi_adatok WHERE felhasznalo_nev = ?",
          [felhasznalonev],
          (err2, rows2) => {
            if (err2) {
              console.error(err2);
              res.status(500).send("Hiba a felhasználónév ellenőrzésekor");
              connection.end();
              return;
            }
  
            if (rows2.length !== 0) {
              res.status(400).send("Ez a felhasználónév már regisztrálva van!");
              connection.end(); // Close the connection if the username already exists
              return;
            }
  
            // Jelszó hash-elése és mentése
            bcrypt.hash(jelszo, 10, (hashErr, hashedPassword) => {
              if (hashErr) {
                console.error(hashErr);
                res.status(500).send("Hiba a jelszó hash-elés során");
                connection.end(); 
                return;
              }
  
              // Új felhasználó hozzáadása
              connection.query(
                "INSERT INTO felhasznaloi_adatok VALUES (null, ?, ?, ?, ?, ?)",
                [felhasznalonev, email, hashedPassword, telefonszam, tipus],
                (insertErr, result) => {
                  if (insertErr) {
                    console.error(insertErr);
                    res.status(500).send("Hiba a mentés során");
                    connection.end(); // Close the connection on error
                    return;
                  } else {
                    // További adatok mentése a típus alapján
                    if (tipus === 1) {
                      // Oktató
                      connection.query(
                        "INSERT INTO oktato_adatok VALUES (null, ?, 1, ?)",
                        [result.insertId, nev],
                        (err2) => {
                          if (err2) {
                            console.error(err2);
                            res.status(500).send("Hiba az oktatói adatok mentésekor");
                          } else {
                            res.status(201).send("Sikeres oktató regisztráció!");
                          }
                          connection.end(); // Safely close the connection here
                        }
                      );
                    } else if (tipus === 0) {
                      // Tanuló
                      connection.query(
                        "INSERT INTO tanulo_adatok VALUES (null, ?, 'még nincs', ?)",
                        [result.insertId, nev],
                        (err2) => {
                          if (err2) {
                            console.error(err2);
                            res.status(500).send("Hiba a tanulói adatok mentésekor");
                          } else {
                            res.status(201).send("Sikeres tanuló regisztráció!");
                          }
                          connection.end(); // Safely close the connection here
                        }
                      );
                    }
                  }
                }
              );
            });
          }
        );
      }
    );
  });  
app.post("/beleptetes", (req, res) => {
  const { felhasznalonev, jelszo } = req.body;

  kapcsolat();
  connection.query(
    "SELECT felhasznalo_id, felhasznalo_nev, felhasznalo_jelszo FROM felhasznaloi_adatok WHERE felhasznalo_nev = ?",
    [felhasznalonev],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send([]);
        return;
      }
      if (rows.length === 0) {
        res.status(404).send("Felhasználó nem található!");
      } else {
        const hashedPassword = rows[0].felhasznalo_jelszo;
        bcrypt.compare(jelszo, hashedPassword, (compareErr, isMatch) => {
          if (compareErr) {
            console.error(compareErr);
            res.status(500).send("Hiba a jelszó ellenőrzése során");
          } else if (isMatch) {
            res.status(200).send(rows[0]);
          } else {
            res.status(401).send("Hibás jelszó");
          }
        });
      }
    }
  );
  connection.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
