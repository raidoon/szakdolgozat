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
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "szakdolgozat_vol2",
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
          "INSERT INTO felhasznaloi_adatok VALUES (null, ?, ?, ?, ?, ?)",
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
        bcrypt.compare(
          felhasznalo_jelszo,
          hashedPassword,
          (compareErr, isMatch) => {
            if (compareErr) {
              console.error(compareErr);
              res.status(500).send("Hiba a jelszó ellenőrzése során!");
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
//---------------------------Oktató adatai
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
//------------------------adott oktatóhoz tartozó tanulók neveinek megjelenítése post bevitel1
app.post("/egyOktatoDiakjai", (req, res) => {
  console.log("hello");
  kapcsolat();
  connection.query(
    `SELECT *
    FROM tanulo_adatok AS tanulo
    INNER JOIN oktato_adatok AS oktato
    ON tanulo.tanulo_oktatoja = oktato.oktato_id
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
//----------------------
app.post("/egyTanuloOrai", (req, res) => {
  console.log("egy tanulo orai");
  kapcsolat();
  connection.query(
    `SELECT * 
    FROM tanulo_adatok 
    AS tanulo 
    INNER JOIN ora_adatok 
    AS ora ON tanulo.tanulo_id = ora.ora_diakja 
    WHERE tanulo.tanulo_id=?`,
    [req.body.tanulo_id],
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
//--------------------------OraFelvitel
app.post("/oraFelvitel", (req, res) => {
  kapcsolat();
  connection.query(
    `INSERT INTO ora_adatok VALUES (NULL, ?, ?, ?, ?, ?, 0 )`,
    [
      req.body.bevitel1,
      req.body.bevitel2,
      req.body.bevitel3,
      req.body.bevitel4,
      req.body.bevitel5
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
//--------------------------TanuloReszletei.js
app.post("/tanuloReszletei", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT *
FROM felhasznaloi_adatok 
INNER JOIN tanulo_adatok AS tanulo ON felhasznaloi_adatok.felhasznalo_id = tanulo.tanulo_felhasznaloID  
LEFT JOIN oktato_adatok AS oktato ON tanulo.tanulo_oktatoja = oktato.oktato_id
LEFT JOIN ora_adatok AS ora ON tanulo.tanulo_id = ora.ora_diakja
LEFT JOIN befizetesek ON tanulo.tanulo_id = befizetesek.befizetesek_tanuloID
WHERE tanulo.tanulo_levizsgazott = 0 AND tanulo_felhasznaloID = ?`,
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
app.post("/levizsgazottTanuloReszletei", (req, res) => {
  kapcsolat();
  connection.query(
    `SELECT *
FROM felhasznaloi_adatok 
INNER JOIN tanulo_adatok AS tanulo ON felhasznaloi_adatok.felhasznalo_id = tanulo.tanulo_felhasznaloID  
LEFT JOIN oktato_adatok AS oktato ON tanulo.tanulo_oktatoja = oktato.oktato_id
LEFT JOIN ora_adatok AS ora ON tanulo.tanulo_id = ora.ora_diakja
LEFT JOIN befizetesek ON tanulo.tanulo_id = befizetesek.befizetesek_tanuloID
WHERE tanulo.tanulo_levizsgazott = 1 AND tanulo_felhasznaloID = ?

`,
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
//---------------------------
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
     WHERE tanulo_felhasznaloID = ? AND ora_adatok.ora_allapot = 1;`,
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
  kapcsolat()
  connection.query(`
    DELETE FROM ora_adatok WHERE ora_adatok.ora_id = ?
    `,[req.body.ora_id], (err, rows, fields) => {
    if (err) {
      console.log("Hiba")
      console.log(err)
      res.status(500).json({ message: "Hiba történt az óra törlése során" });
    }
    else {
      console.log("Sikeres törlés!")
      res.status(200).json({ message: "Sikeres törlés!" });
    }
  })
  connection.end()
})

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
    WHERE befizetesek.befizetesek_jovahagyva=0 AND oktato.oktato_id=?
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
    WHERE befizetesek.befizetesek_jovahagyva=0 AND tanulo_felhasznaloID = ?`,
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

//--------------------------BefizetesFelvitel
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
      res.json({ message: "Óra megerősítve!" });
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
      res.json({ message: "Óra elutasítva!" });
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

app.put('/oraModosithato', (req, res) => {
  kapcsolat();
  connection.query(`
    UPDATE ora_adatok SET ora_allapot = 2 WHERE ora_adatok.ora_id = ?  
    `,[req.body.ora_id], (err, rows, fields) => {
    if (err) {
      console.log("Hiba");
      console.log(err);
      res.status(500).json({ message: "Hiba történt!" }); // JSON válasz
    } else {
      console.log("Sikeres módosítás!");
      res.status(200).json({ message: "Sikeres módosítás!" }); // JSON válasz
    }
  });
  connection.end();
});

app.put('/oraTeljesitett', (req, res) => {
  kapcsolat();
  connection.query(`
    UPDATE ora_adatok SET ora_allapot = 1 WHERE ora_adatok.ora_id = ?  
    `,[req.body.ora_id], (err, rows, fields) => {
    if (err) {
      console.log("Hiba");
      console.log(err);
      res.status(500).json({ message: "Hiba történt!" }); // JSON válasz
    } else {
      console.log("Sikeres módosítás!");
      res.status(200).json({ message: "Sikeres módosítás!" }); // JSON válasz
    }
  });
  connection.end();
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
