const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
var cors = require("cors");
const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const SECRET_KEY = 'your_secret_key';
var connection;
function kapcsolat() {
  connection = mysql.createConnection({
    connectionLimit: 20,
    host: "localhost",
    user: "root",
    password: "",
    database: "szakdolgozat_vol2",
  });
  connection.connect();
}//------------------------------------------------ OKTATOK/OKTATOID
app.get("/oktato/:oktatoId", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT *
    FROM oktato_adatok AS oktato
    WHERE oktato.oktato_id = ?`,
    [req.params.oktatoId],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Hiba"); 
      } else {
        if (rows.length > 0) {
          res.status(200).json(rows[0]);
        } else {
          res.status(404).send("Oktató nem található!");
        }
      }
    }
  );
  connection.end();
});
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
  const { autosiskola, email, jelszo, telefonszam, tipus, nev } = req.body;
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
          "INSERT INTO felhasznaloi_adatok VALUES (null, ?, ?, ?, ?, ?,0)",
          [autosiskola, email, hashedPassword, telefonszam, tipus],
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
                      res
                        .status(500)
                        .send("Hiba történt az oktatói adatok mentésekor!");
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
                      res
                        .status(500)
                        .send("Hiba történt a tanulói adatok mentésekor!");
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
//------------------------------------------------ BEJELENTKEZÉS OKTATÓNAK ÉS TANULÓNAK
app.post("/beleptetes", (req, res) => {
  const { felhasznalo_email, felhasznalo_jelszo } = req.body;
  kapcsolat();
  connection.query(
    "SELECT felhasznalo_id, felhasznalo_email, felhasznalo_jelszo, felhasznalo_tipus FROM felhasznaloi_adatok WHERE felhasznalo_email = ? AND felhasznaloi_adatok.felhasznalo_tipus!=3 ",
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
        bcrypt.compare(
          felhasznalo_jelszo,
          hashedPassword,
          (compareErr, isMatch) => {
            if (compareErr) {
              console.error(compareErr);
              res.status(500).send("Szerverhiba!");
            } else if (isMatch) {
              res.status(200).send(rows[0]);
            } else {
              res.status(401).send("Hibás jelszó!");
            }
          }
        );
      }
    }
  );
  connection.end();
});
//------------------------------------------------ BEJELENTKEZÉS ADMINNAK 
app.post('/web/login', (req, res) => {
  const { email, password } = req.body;
  kapcsolat(); 
  const query = `
    SELECT felhasznalo_autosiskola, felhasznalo_email, felhasznalo_telefonszam, felhasznalo_tipus, felhasznalo_jelszo 
    FROM felhasznaloi_adatok 
    WHERE felhasznalo_email = ? AND felhasznalo_tipus = 3
  `;
  connection.query(query, [email], (err, rows) => {
    if (err) {
      console.error('Adatbázis hiba:', err);
      res.status(500).json({ message: 'Szerverhiba' });
    } else if (rows.length === 0) {
      res.status(404).json({ message: 'Ez az email cím nem található' });
    } else {
      const hashedPassword = rows[0].felhasznalo_jelszo;
      // Jelszó ellenőrzése bcrypt-tel
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error('Hiba a jelszó ellenőrzésekor:', err);
          res.status(500).json({ message: 'Szerverhiba' });
        } else if (isMatch) {
          if (rows[0].felhasznalo_tipus === 3) {
            const token = jwt.sign({ felhasznalo_email: rows[0].felhasznalo_email }, SECRET_KEY, {
              expiresIn: '1h',
            });
            // felhasználói adatok is kellenek!
            const felhasznaloAdatok = {
              felhasznalo_autosiskola: rows[0].felhasznalo_autosiskola,
              felhasznalo_email: rows[0].felhasznalo_email,
              felhasznalo_telefonszam: rows[0].felhasznalo_telefonszam,
              felhasznalo_tipus: rows[0].felhasznalo_tipus,
            };

            res.json({ token, felhasznalo: felhasznaloAdatok }); // elküldjük a bejelentkezett token-t, ÉS az adatokat!
          } else {
            res.status(403).json({ message: 'Nincs jogosultságod a belépéshez!' });
          }
        } else {
          res.status(401).json({ message: 'Hibás jelszó' });
        }
      });
    }
  });
  connection.end();
});

//--------------------------------------
app.post("/regisztralas", (req, res) => {
  const {autosiskola, email, jelszo, telefonszam, tipus, nev } = req.body;
  

  if (!autosiskola) {
    return res.status(400).json({ message: "Hiba: Az autósiskola adata hiányzik!" });
  }

  if (!email || !jelszo || !telefonszam || !tipus || !nev) {
    return res.status(400).json({ message: "Minden mezőt ki kell tölteni!" });
  }

  if (tipus !== 1 && tipus !== 2) {
    return res.status(400).json({ message: "Érvénytelen típus!" });
  }

  kapcsolat(); 
  connection.query(
    "SELECT felhasznalo_email FROM felhasznaloi_adatok WHERE felhasznalo_email = ?",
    [email],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Hiba történt az email cím ellenőrzése közben!" });
      }

      if (rows.length !== 0) {
        return res.status(400).json({ message: "Ez az email cím már regisztrálva van!" });
      }

      bcrypt.hash(jelszo, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          return res.status(500).json({ message: "Hiba történt a jelszó titkosítása közben!" });
        }

        connection.query(
          "INSERT INTO felhasznaloi_adatok VALUES (null, ?, ?, ?, ?, ?)",
          [autosiskola, email, hashedPassword, telefonszam, tipus],
          (insertErr, result) => {
            if (insertErr) {
              console.error(insertErr);
              return res.status(500).json({ message: "Hiba történt a felhasználó mentése során!" });
            }

            const table = tipus === 1 ? "oktato_adatok" : "tanulo_adatok";
            const query =
              tipus === 1
                ? "INSERT INTO oktato_adatok VALUES (null, ?, ?)"
                : "INSERT INTO tanulo_adatok VALUES (null, ?, 7, ?, 0)";
            const values = tipus === 1 ? [result.insertId, nev] : [result.insertId, nev];

            connection.query(query, values, (err2) => {
              if (err2) {
                console.error(err2);
                return res.status(500).json({ message: `Hiba történt a ${table} mentésekor!` });
              }

              return res.status(201).json({
                message: `Sikeres ${tipus === 1 ? "oktató" : "tanuló"} regisztráció!`,
              });
            });
          }
        );
      });
    }
  );
});

//------------------------------------------------ ADMIN EMAIL ELLENŐRZÉS
app.post('/adminEmailEllenorzes', (req, res) => {
  const { email } = req.body;
  kapcsolat();
  const query = 'SELECT felhasznalo_email, felhasznalo_tipus FROM felhasznaloi_adatok WHERE felhasznalo_email = ?';
  connection.query(query, [email], (err, rows) => {
    if (err) {
      console.error('Adatbázis hiba:', err);
      res.status(500).json({ message: 'Szerverhiba' });
      return;
    }
    // Ha nincs ilyen email cím
    if (rows.length === 0) {
      res.status(404).json({ message: 'Ez az email cím nem található' });
      return;
    }
    // Ha az email cím létezik, de a felhasznalo_tipus nem 3
    if (rows[0].felhasznalo_tipus !== 3) {
      res.status(403).json({ message: 'Nincs jogosultságod a belépéshez!' });
      return;
    }
    // Ha minden rendben, az email cím és a jogosultság is megfelelő
    res.status(200).json({
      message: 'Sikeres admin email ellenőrzés!',
      user: rows[0], 
    });
  });
  connection.end();
});
//------------------------------------------------ ADMIN OKTATOK LEKERDEZESE
app.post("/AutosiskolaOktatoi", (req, res) => {
  kapcsolat();
  connection.query(
    `select oktato_id,oktato_felhasznaloID,oktato_neve,felhasznalo_email,felhasznalo_telefonszam,autosiskola_adatok.autosiskola_nev from oktato_adatok
    inner join felhasznaloi_adatok on felhasznaloi_adatok.felhasznalo_id=oktato_adatok.oktato_felhasznaloID
    inner join autosiskola_adatok on felhasznaloi_adatok.felhasznalo_autosiskola=autosiskola_adatok.autosiskola_id
    where felhasznalo_autosiskola = ?`,
    [req.body.felhasznalo_autosiskola],
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
//------------------------------------------------ TANULÓ ADATAINAK LEKÉRDEZÉSE
app.post("/sajatAdatokT", (req, res) => {
  kapcsolat();
  connection.query(
    `select felhasznalo_id, felhasznalo_autosiskola, felhasznalo_email, felhasznalo_jelszo, felhasznalo_telefonszam,felhasznalo_tipus, tanulo_adatok.tanulo_id, tanulo_adatok.tanulo_oktatoja, tanulo_adatok.tanulo_neve, tanulo_adatok.tanulo_levizsgazott from felhasznaloi_adatok INNER JOIN tanulo_adatok ON felhasznaloi_adatok.felhasznalo_id=tanulo_adatok.tanulo_felhasznaloID  where felhasznalo_id = ?`,
    [req.body.felhasznalo_id],
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
//------------------------------------------------ TANULÓ BEFIZETÉSINEK TELJES ÖSSZEGE
app.post("/tanuloSUMbefizetes", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT SUM(befizetesek.befizetesek_osszeg) as 'osszesBefizetes' FROM befizetesek INNER JOIN tanulo_adatok ON befizetesek.befizetesek_tanuloID=tanulo_adatok.tanulo_id INNER JOIN felhasznaloi_adatok ON tanulo_adatok.tanulo_felhasznaloID=felhasznaloi_adatok.felhasznalo_id WHERE felhasznalo_id = ? AND befizetesek.befizetesek_jovahagyva = 1`,
    [req.body.felhasznalo_id],
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
//------------------------------------------------ TANULÓ TARTOZÁSAINAK TELJES ÖSSZEGE
app.post("/tanuloSUMtartozas", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT SUM(befizetesek.befizetesek_osszeg) as 'osszesTartozas' FROM befizetesek INNER JOIN tanulo_adatok ON befizetesek.befizetesek_tanuloID=tanulo_adatok.tanulo_id INNER JOIN felhasznaloi_adatok ON tanulo_adatok.tanulo_felhasznaloID=felhasznaloi_adatok.felhasznalo_id WHERE felhasznalo_id = ? AND befizetesek.befizetesek_jovahagyva != 1 AND befizetesek.befizetesek_jovahagyva !=2`,
    [req.body.felhasznalo_id],
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
//------------------------------------------------ TANULÓ LEGUTÓBBI BEFIZETÉSÉNEK IDŐPONTJA -- de csak azok közül amik nem lettek elutasitva!!!
app.post("/tanuloLegutobbiBefizetese", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT COALESCE(MAX(befizetesek.befizetesek_ideje), 'Még nem történt befizetés') AS utolso_befizetes
        FROM befizetesek 
        WHERE befizetesek.befizetesek_tanuloID = ? AND befizetesek.befizetesek_jovahagyva !=2`,
    [req.body.befizetesek_tanuloID],
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
//------------------------------------------------ TANULÓ ÖSSZES BEFIZETÉSE EGY LISTÁBAN
app.post("/befizetesListaT", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT befizetesek.befizetesek_id, befizetesek.befizetesek_osszeg, befizetesek.befizetesek_ideje, befizetesek_tipusID, befizetesek_jovahagyva,befizetesek.befizetesek_kinek FROM befizetesek INNER JOIN tanulo_adatok ON befizetesek.befizetesek_tanuloID=tanulo_adatok.tanulo_id INNER JOIN felhasznaloi_adatok ON tanulo_adatok.tanulo_felhasznaloID=felhasznaloi_adatok.felhasznalo_id WHERE felhasznalo_id = ?`,
    [req.body.felhasznalo_id],
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
//------------------------------------------------ TANULÓ BEFIZETÉS FELVÉTELE
app.post("/tanuloBefizetesFelvitel", (req, res) => {
  console.log("Request received on /tanuloBefizetesFelvitel");
  const {
    befizetesek_tanuloID,
    befizetesek_oktatoID,
    befizetesek_tipusID,
    befizetesek_osszeg,
    befizetesek_ideje,
    befizetesek_kinek,
  } = req.body;
  // Ensure you log the request body to check if it's properly received
  console.log("Request Body:", req.body);

  kapcsolat();
  connection.query(
    `INSERT INTO befizetesek (befizetesek_id, befizetesek_tanuloID, befizetesek_oktatoID, befizetesek_tipusID, befizetesek_osszeg, befizetesek_ideje, befizetesek_jovahagyva, befizetesek_kinek) 
     VALUES (NULL,?, ?, ?, ?, ?, 0, ?)`,
    [
      befizetesek_tanuloID,
      befizetesek_oktatoID,
      befizetesek_tipusID,
      befizetesek_osszeg,
      befizetesek_ideje,
      befizetesek_kinek,
    ],
    (err, rows) => {
      if (err) {
        console.log("Database error:", err);
        res.status(500).send("Hiba történt a befizetés felvitele során!");
      } else {
        console.log("Database query successful:", rows);
        res.status(200).send("A befizetés felvitele sikerült!");
      }
    }
  );
  connection.end();
});
//------------------------------------------------ TANULÓ CSAK A KÖVETKEZŐ ÓRÁJÁNAK LEKÉRDEZÉSE
app.post("/tanuloKovetkezoOraja", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT * FROM ora_adatok WHERE ora_adatok.ora_diakja = ? 
      AND ora_datuma > NOW() 
        AND ora_teljesitve = 0 
    ORDER BY ora_datuma 
    ASC 
    LIMIT 1`,
    [req.body.ora_diakja],
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
//------------------------------------------------ TANULÓ ÖSSZES ÓRÁJÁNAK LEKÉRDEZÉSE
app.post("/tanuloOsszesOraja", (req, res) => {
  kapcsolat();
  connection.query(
    `select * from ora_adatok INNER join tanulo_adatok on ora_adatok.ora_diakja=tanulo_adatok.tanulo_id inner join felhasznaloi_adatok on tanulo_adatok.tanulo_felhasznaloID=felhasznaloi_adatok.felhasznalo_id WHERE felhasznaloi_adatok.felhasznalo_id = ?;`,
    [req.body.felhasznalo_id],
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
//------------------------------------------------ TANULÓI LEKÉRDEZÉSEK VÉGE
//------------------------------------------------ OKTATÓI LEKÉRDEZÉSEK
app.post("/egyOktatoAdatai", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM oktato_adatok
    WHERE oktato.oktato_id=?`,
    [req.body.oktato_id],
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
//--------------------------
app.post("/oraFelvitel", (req, res) => {
  kapcsolat(); 

  const { bevitel1, bevitel2, bevitel3, bevitel4, bevitel5 } = req.body;

  
  const [datePart, timePart] = bevitel4.split(" "); 
  const [hour] = timePart.split(":"); 
  const dateHour = `${datePart} ${hour}:00`; // Format as "YYYY-MM-DD HH:00"

  // First, check if a lesson already exists in the same hour
  const checkQuery = `
    SELECT COUNT(*) as count 
    FROM ora_adatok 
    WHERE DATE(ora_datuma) = ? 
      AND HOUR(ora_datuma) = ?
  `;
  connection.query(checkQuery, [datePart, hour], (err, results) => {
    if (err) {
      console.error("Hiba az órák ellenőrzésekor:", err);
      res.status(500).send("Hiba az órák ellenőrzésekor");
      connection.end();
      return;
    }

    const lessonExists = results[0].count > 0;

    if (lessonExists) {
      console.log("Ezen az időponton már van rögzített óra!");
      res.status(400).send("Ezen az időponton már van rögzített óra!");
      connection.end();
      return;
    }

    // If no lesson exists, proceed with the insertion
    const insertQuery = `INSERT INTO ora_adatok VALUES (NULL, ?, ?, ?, ?, ?, 0)`;
    connection.query(
      insertQuery,
      [bevitel1, bevitel2, bevitel3, bevitel4, bevitel5],
      (err, rows, fields) => {
        if (err) {
          console.error("Hiba az óra rögzítésekor:", err);
          res.status(500).send("Hiba az óra rögzítésekor");
        } else {
          console.log("Sikeres felvitel!");
          res.status(200).send("Sikeres felvitel!");
        }
        connection.end();
      }
    );
  });
});
//--------------------------------
app.get("/valasztTipus", (req, res) => {
  kapcsolat();
  connection.query(`select *  from ora_tipusa`, (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Hiba");
    } else {
      console.log(rows);
      res.status(200).send(rows);
    }
  });
  connection.end();
});
//--------------------------
app.post("/tanuloReszletei", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT *
FROM felhasznaloi_adatok 
INNER JOIN tanulo_adatok AS tanulo ON felhasznaloi_adatok.felhasznalo_id = tanulo.tanulo_felhasznaloID  
LEFT JOIN oktato_adatok AS oktato ON tanulo.tanulo_oktatoja = oktato.oktato_id
LEFT JOIN ora_adatok AS ora ON tanulo.tanulo_id = ora.ora_diakja
LEFT JOIN befizetesek ON tanulo.tanulo_id = befizetesek.befizetesek_tanuloID
WHERE tanulo_felhasznaloID = ?`,
    [req.body.tanulo_felhasznaloID],
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
//-------------------------------
app.post("/tanuloOsszesFizu", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT SUM(befizetesek.befizetesek_osszeg) AS 'osszesBefizetett'
     FROM befizetesek 
     INNER JOIN tanulo_adatok ON befizetesek.befizetesek_tanuloID=tanulo_adatok.tanulo_id 
     INNER JOIN felhasznaloi_adatok ON tanulo_adatok.tanulo_felhasznaloID=felhasznaloi_adatok.felhasznalo_id 
     WHERE tanulo_felhasznaloID = ? AND befizetesek.befizetesek_jovahagyva = 1;`,
    [req.body.tanulo_felhasznaloID],
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
app.post("/tanuloOsszesOra", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT COUNT(ora_adatok.ora_id) AS 'osszesOra'
     FROM ora_adatok
     INNER JOIN tanulo_adatok ON ora_adatok.ora_diakja=tanulo_adatok.tanulo_id 
     INNER JOIN felhasznaloi_adatok ON tanulo_adatok.tanulo_felhasznaloID=felhasznaloi_adatok.felhasznalo_id 
     WHERE tanulo_felhasznaloID = ? AND ora_adatok.ora_teljesitve = 1;`,
    [req.body.tanulo_felhasznaloID],
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
app.post("/aktualisDiakok", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM tanulo_adatok AS tanulo
    INNER JOIN oktato_adatok AS oktato
    ON tanulo.tanulo_oktatoja = oktato.oktato_id
    WHERE tanulo.tanulo_levizsgazott=0 AND oktato.oktato_id=?`,
    [req.body.oktato_id],
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
//------------------
app.post("/levizsgazottDiakok", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM tanulo_adatok AS tanulo
    INNER JOIN oktato_adatok AS oktato
    ON tanulo.tanulo_oktatoja = oktato.oktato_id
    WHERE tanulo.tanulo_levizsgazott=1 AND oktato.oktato_id=?`,
    [req.body.oktato_id],
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
//----------------
app.post("/diakokOrai", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM felhasznaloi_adatok AS felhasznalo
    INNER JOIN tanulo_adatok AS tanulo
    ON felhasznalo.felhasznalo_id=tanulo.tanulo_felhasznaloID
    INNER JOIN ora_adatok AS ora
    ON tanulo.tanulo_id= ora.ora_diakja 
    LEFT JOIN ora_tipusa ON ora_tipusa.oratipus_id = ora.ora_tipusID
    WHERE tanulo_felhasznaloID = ?`,
    [req.body.tanulo_felhasznaloID],
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
//---------------
app.post("/diakokTeljesitettOrai", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM felhasznaloi_adatok AS felhasznalo
    INNER JOIN tanulo_adatok AS tanulo
    ON felhasznalo.felhasznalo_id=tanulo.tanulo_felhasznaloID
    INNER JOIN ora_adatok AS ora
    ON tanulo.tanulo_id= ora.ora_diakja 
    LEFT JOIN ora_tipusa ON ora_tipusa.oratipus_id = ora.ora_tipusID
    WHERE ora_teljesitve=1 AND tanulo_felhasznaloID = ?`,
    [req.body.tanulo_felhasznaloID],
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
//-----------
app.post("/diakokVisszaOrai", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM felhasznaloi_adatok AS felhasznalo
    INNER JOIN tanulo_adatok AS tanulo
    ON felhasznalo.felhasznalo_id=tanulo.tanulo_felhasznaloID
    INNER JOIN ora_adatok AS ora
    ON tanulo.tanulo_id= ora.ora_diakja 
    WHERE ora.ora_teljesitve=0 OR ora.ora_teljesitve=2 AND tanulo_felhasznaloID = ?`,
    [req.body.tanulo_felhasznaloID],
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
//-------------------
app.post("/koviOra", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT * 
    FROM oktato_adatok AS oktato
    INNER JOIN ora_adatok AS ora
    ON oktato.oktato_id=ora.ora_oktatoja 
    INNER JOIN tanulo_adatok AS tanulo
    ON ora.ora_diakja=tanulo.tanulo_id
    WHERE oktato_id = ? 
      AND ora.ora_datuma > NOW() 
    ORDER BY ora.ora_datuma 
    LIMIT 1;`,
    [req.body.oktato_id],
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
//---------------------------
app.delete('/oraTorles', (req, res) => {
  kapcsolat(); // Establish the database connection

  const { ora_id } = req.body;

  const deleteQuery = `
    DELETE FROM ora_adatok 
    WHERE ora_adatok.ora_id = ?
  `;
  connection.query(deleteQuery, [ora_id], (err, result) => {
    if (err) {
      console.log("Hiba az óra törlése során:", err);
      res.status(500).json({ message: "Hiba történt az óra törlése során" });
    } else {
      console.log("Sikeres törlés! Affected rows:", result.affectedRows);
      res.status(200).json({ message: "Sikeres törlés!" });
    }
    connection.end();
  });
});
//---------------------------
app.post("/diakokBefizetesei", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM felhasznaloi_adatok AS felhasznalo
    INNER JOIN tanulo_adatok AS tanulo
    ON felhasznalo.felhasznalo_id=tanulo.tanulo_felhasznaloID
    INNER JOIN befizetesek
    ON tanulo.tanulo_id= befizetesek_tanuloID
    WHERE tanulo_felhasznaloID = ?`,
    [req.body.tanulo_felhasznaloID],
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
//----------------------------------------
app.post("/nemkeszBefizetesek", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM tanulo_adatok AS tanulo
    INNER JOIN oktato_adatok AS oktato
    ON tanulo.tanulo_oktatoja = oktato.oktato_id
    INNER JOIN befizetesek
    ON tanulo.tanulo_id = befizetesek.befizetesek_tanuloID
    WHERE befizetesek.befizetesek_jovahagyva=0 AND befizetesek.befizetesek_kinek=1 AND oktato.oktato_id=?
    GROUP BY tanulo.tanulo_neve;`,
    [req.body.oktato_id],
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
//-------------------------------
app.post("/egyDiakNemKeszBefizetesei", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM felhasznaloi_adatok AS felhasznalo
    INNER JOIN tanulo_adatok AS tanulo
    ON felhasznalo.felhasznalo_id=tanulo.tanulo_felhasznaloID
    INNER JOIN befizetesek
    ON tanulo.tanulo_id= befizetesek.befizetesek_tanuloID
    WHERE befizetesek.befizetesek_jovahagyva=0 AND befizetesek.befizetesek_kinek=1 AND tanulo_felhasznaloID = ?`,
    [req.body.tanulo_felhasznaloID],
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
//--------------------------
app.post("/befizetesFelvitel", (req, res) => {
  kapcsolat();
  connection.query(
    `INSERT INTO befizetesek VALUES (NULL, ?, ?, ?, ?, ?, 1, 1)`,
    [
      req.body.bevitel1,
      req.body.bevitel2,
      req.body.bevitel3,
      req.body.bevitel4,
      req.body.bevitel5,
    ],
    (err, rows, fields) => {
      if (err) {
        console.log("Hiba");
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log("Sikeres felvitel!");
        res.status(200).send("Sikeres felvitel!");
      }
    }
  );
  connection.end();
});
//---------------------------
app.post("/fizetesMegerosit", (req, res) => {
  kapcsolat();
  connection.query(
    `
    UPDATE befizetesek SET befizetesek_jovahagyva=1 WHERE befizetesek_id = ?; 
  `,
    [req.body.befizetesek_id],
    (err, rows) => {
      if (err) {
        console.error("Hiba:", err);
        return res.status(500).json({ message: "Hiba történt!" });
      }
      res.json({ message: "Fizetés megerősítve!" });
    }
  );
  connection.end();
});
//---------------------------------------------
app.post("/fizetesElutasit", (req, res) => {
  kapcsolat();
  connection.query(
    `
    UPDATE befizetesek SET befizetesek_jovahagyva=2 WHERE befizetesek_id = ?; 
  `,
    [req.body.befizetesek_id],
    (err, rows) => {
      if (err) {
        console.error("Hiba:", err);
        return res.status(500).json({ message: "Hiba történt!" });
      }
      res.json({ message: "Fizetés elutasítva!" });
    }
  );
  connection.end();
});
//-------------------------------------
app.post("/egyNapOraja", (req, res) => {
  console.log("Lekérdezés egy adott napra...");
  const { oktato_id, datum } = req.body; // Az oktató ID és a dátum az API kérésből

  kapcsolat();

  const query = `
    SELECT *
    FROM oktato_adatok AS oktato
    INNER JOIN ora_adatok AS ora
      ON oktato.oktato_id = ora.ora_oktatoja
    INNER JOIN tanulo_adatok AS tanulo
      ON ora.ora_diakja = tanulo.tanulo_id
    WHERE oktato.oktato_id = ? 
      AND DATE(ora.ora_datuma) = DATE(?)
  `;

  connection.query(query, [oktato_id, datum], (err, rows) => {
    if (err) {
      console.log("Hiba az adatbázis lekérdezésében:", err);
      res.status(500).send("Hiba történt");
    } else {
      console.log("Lekérdezett órák:", rows);
      res.status(200).json(rows);
    }
  });

  connection.end();
});
//----------------------------------------------
app.put('/oraFrissul', (req, res) => {
  kapcsolat(); // Establish the database connection

  const updateQuery = `
    UPDATE ora_adatok 
    SET ora_teljesitve = 2 
    WHERE ora_datuma < NOW() 
    AND ora_teljesitve = 0
  `;
  console.log("Running query:", updateQuery); // Log the query
  connection.query(updateQuery, (err, result) => {
    if (err) {
      console.error("Hiba az óra frissítésében:", err);
      res.status(500).json({ message: "Hiba az óra frissítésében" });
    } else {
      console.log("Órák módosíthatóságának frissítése kész. Affected rows:", result.affectedRows);
      res.status(200).json({ message: "Órák frissítése sikeres!" });
    }
    
  });
});
//---------------------
app.put('/oraTeljesul', (req, res) => {
  kapcsolat(); // Establish the database connection

  const updateQuery = `
    UPDATE ora_adatok 
    SET ora_teljesitve = 1 
    WHERE ora_datuma < DATE_SUB(NOW(), INTERVAL 3 DAY) 
    AND ora_teljesitve = 2
  `;
  console.log("Running query:", updateQuery); // Log the query
  connection.query(updateQuery, (err, result) => {
    if (err) {
      console.error("Hiba az óra frissítésében:", err);
      res.status(500).json({ message: "Hiba az óra frissítésében" });
    } else {
      console.log("Órák teljesítetté jelölése kész. Affected rows:", result.affectedRows);
      res.status(200).json({ message: "Órák frissítése sikeres!" });
    }
   
  });
});
//--------------------------
app.put('/oraFrissit', (req, res) => {
  kapcsolat(); // Establish the database connection

  const { ora_id } = req.body;

  const updateQuery = `
    UPDATE ora_adatok 
    SET ora_teljesitve = 2 
    WHERE ora_id = ?
  `;
  console.log("Running query:", updateQuery, "with ora_id:", ora_id); // Log the query and ora_id
  connection.query(updateQuery, [ora_id], (err, result) => {
    if (err) {
      console.error("Hiba az óra frissítésében:", err);
      res.status(500).json({ message: "Hiba az óra frissítésében" });
    } else {
      console.log("Órák módosíthatóságának frissítése kész. Affected rows:", result.affectedRows);
      res.status(200).json({ message: "Az óra elutasításra került!" });
    }
    connection.end();
  });
});
//---------------
app.put('/oraTeljesit', (req, res) => {
  kapcsolat(); // Establish the database connection

  const { ora_id } = req.body;

  const updateQuery = `
    UPDATE ora_adatok 
    SET ora_teljesitve = 1 
    WHERE ora_id = ?
  `;
  console.log("Running query:", updateQuery, "with ora_id:", ora_id); // Log the query and ora_id
  connection.query(updateQuery, [ora_id], (err, result) => {
    if (err) {
      console.error("Hiba az óra frissítésében:", err);
      res.status(500).json({ message: "Hiba az óra frissítésében" });
    } else {
      console.log("Órák teljesítetté jelölése kész. Affected rows:", result.affectedRows);
      res.status(200).json({ message: "Óra teljesítve" });
    }
    connection.end();
  });
});
//---------------------------------------------
app.post("/elkoviOrak", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT *
FROM ora_adatok AS ora
INNER JOIN oktato_adatok AS oktato
ON ora.ora_oktatoja = oktato.oktato_id
LEFT JOIN tanulo_adatok AS tanulo
ON ora.ora_diakja = tanulo.tanulo_id
LEFT JOIN ora_tipusa ON ora_tipusa.oratipus_id = ora.ora_tipusID
WHERE ora.ora_teljesitve = 0 AND oktato.oktato_id = ?`,
    [req.body.oktato_id],
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
//----------------------------------
app.post("/oraSzerkesztes", (req, res) => {
  kapcsolat();
  connection.query(
    `UPDATE ora_adatok SET ora_diakja = ?, ora_datuma = ?, ora_kezdeshelye = ? WHERE ora_adatok.ora_id = ? `,
    [
      req.body.bevitel1,
      req.body.bevitel2,
      req.body.bevitel3,
      req.body.bevitel4
     
      
    ],
    (err, rows, fields) => {
      if (err) {
        console.log("Hiba");
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log("Sikeres szerkesztés!");
        res.status(200).send("Sikeres szerkesztés!");
      }
    }
  );
  connection.end();
});
//--------------------------------
app.post("/suliTanuloi", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT * from tanulo_adatok
    INNER JOIN felhasznaloi_adatok ON felhasznaloi_adatok.felhasznalo_id=tanulo_adatok.tanulo_felhasznaloID
    INNER JOIN autosiskola_adatok ON felhasznaloi_adatok.felhasznalo_autosiskola=autosiskola_adatok.autosiskola_id
	inner join oktato_adatok on tanulo_adatok.tanulo_oktatoja=oktato_adatok.oktato_id
    WHERE felhasznalo_autosiskola = ?`,
    [req.body.felhasznalo_autosiskola],
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

//------------
app.put('/oktatovaltas', (req, res) => {
  kapcsolat(); // Establish the database connection

  const { tanulo_id, oktato_id } = req.body;

  if (!tanulo_id || !oktato_id) {
    return res.status(400).json({ uzenet: "Hiányzó adatok!" });
  }

  const updateQuery = `UPDATE tanulo_adatok SET tanulo_oktatoja = ? WHERE tanulo_id = ?`;
  
  console.log("Running query:", updateQuery, "with tanulo_id, oktato_id:", tanulo_id, oktato_id); 

  connection.query(updateQuery, [oktato_id, tanulo_id], (err, result) => {
    if (err) {
      console.error("Hiba az oktató cserélésében:", err);
      res.status(500).json({ message: "Hiba az oktató cserélésében" });
    } else {
      console.log("Oktató cseréje megtörtént. Affected rows:", result.affectedRows);
      res.status(200).json({ message: "Oktató leváltva" });
    }
    connection.end();
  });
});
//-------------------
app.get("/kezdolapadatok", (req, res) => {
  kapcsolat(); // Kapcsolat megnyitása

  const query = `
    SELECT 
      (SELECT COUNT(*) FROM tanulo_adatok) AS osszes_tanulo,
      (SELECT COUNT(*) FROM tanulo_adatok WHERE tanulo_levizsgazott = 0) AS aktiv_diakok,
      (SELECT COUNT(*) 
       FROM ora_adatok 
       WHERE ora_tipusID = 2 
       AND YEARWEEK(ora_datuma, 1) = YEARWEEK(NOW(), 1)
      ) AS heti_vizsgak
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(" Hiba a statisztikai adatok lekérdezésében:", err);
      return res.status(500).json({ message: "Hiba történt a lekérdezés során" });
    }

    console.log(" Sikeres lekérdezés:", results);
    res.status(200).json(results[0]); // Visszaküldjük az első sort
  });
});

//-------------------------------
app.post("/suliBefizetesFelvitel", (req, res) => {
  kapcsolat();
  connection.query(
    `INSERT INTO befizetesek VALUES (NULL, ?, ?, ?, ?, ?, 1, 2)`,
    [
      req.body.bevitel1,
      req.body.bevitel2,
      req.body.bevitel3,
      req.body.bevitel4,
      req.body.bevitel5,
    ],
    (err, rows, fields) => {
      if (err) {
        console.log("Hiba");
        console.log(err);
        res.status(500).send("Hiba");
      } else {
        console.log("Sikeres felvitel!");
        res.status(200).send("Sikeres felvitel!");
      }
    }
  );
  connection.end();
});
//--------------------------------
app.post("/vizsgaFelvitel", (req, res) => {
  kapcsolat();
  console.log(req.body); 

  connection.query(
    `INSERT INTO ora_adatok VALUES (NULL, ?, ?, ?, ?, ?, 0)`,
    [
      req.body.bevitel1, 
      req.body.bevitel2, 
      req.body.bevitel3, 
      req.body.bevitel4, 
      req.body.bevitel5, 
    ],
    (err) => {
      if (err) {
        console.error(" SQL Hiba:", err); 
        res.status(500).send("Hiba");
      } else {
        res.status(200).send("Sikeres felvitel!");
      }
    }
  );
  connection.end();
});

//--------------------------------
app.get('/vizsgak', (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT * FROM ora_adatok
    INNER JOIN tanulo_adatok ON ora_adatok.ora_diakja=tanulo_adatok.tanulo_id
    INNER JOIN oktato_adatok ON ora_adatok.ora_oktatoja=oktato_adatok.oktato_id
    INNER JOIN ora_tipusa ON ora_adatok.ora_tipusID=ora_tipusa.oratipus_id
    WHERE ora_tipusID=2`, 
    (err, rows) => {
      if (err) {
        console.log("Hiba a vizsgák lekérdezésekor");
        res.status(500).send("Hiba");
      } else {
        res.status(200).send(rows);
      }
    }
  );
  connection.end();
});

app.post("/tanuloLe", (req, res) => {
  kapcsolat();
  connection.query(
    `
    UPDATE tanulo_adatok SET tanulo_levizsgazott = 1 WHERE tanulo_adatok.tanulo_id = ?; 
  `,
    [req.body.tanulo_id],
    (err, rows) => {
      if (err) {
        console.error("Hiba:", err);
        return res.status(500).json({ message: "Hiba történt!" });
      }
      res.json({ message: "A tanuló levizsgázott!" });
    }
  );
  connection.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});