-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 12. 11:39
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `szakdoga_gyakorlas`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `autosiskola_adatok`
--

CREATE TABLE `autosiskola_adatok` (
  `autosiskola_id` int(11) NOT NULL,
  `autosiskola_neve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `autosiskola_adatok`
--

INSERT INTO `autosiskola_adatok` (`autosiskola_id`, `autosiskola_neve`) VALUES
(1, 'Civis Autósiskola'),
(2, 'Vida Autósiskola');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `befizetesek`
--

CREATE TABLE `befizetesek` (
  `tanulo_id` int(11) NOT NULL,
  `befizetes_tipusa` int(11) NOT NULL,
  `oktato_id` int(11) NOT NULL,
  `befizetett_osszeg` int(11) NOT NULL,
  `befizetes_ideje` date NOT NULL,
  `jovahagyva` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `befizetesek`
--

INSERT INTO `befizetesek` (`tanulo_id`, `befizetes_tipusa`, `oktato_id`, `befizetett_osszeg`, `befizetes_ideje`, `jovahagyva`) VALUES
(1, 1, 1, 10000, '2024-12-10', 1),
(1, 1, 1, 2000, '2024-12-08', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznaloi_adatok`
--

CREATE TABLE `felhasznaloi_adatok` (
  `felhasznalo_id` int(11) NOT NULL,
  `felhasznalo_autosiskola` int(11) NOT NULL,
  `felhasznalo_email` varchar(255) NOT NULL,
  `felhasznalo_jelszo` varchar(20) NOT NULL,
  `felhasznalo_telefonszam` varchar(11) NOT NULL,
  `felhasznalo_tipus` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznaloi_adatok`
--

INSERT INTO `felhasznaloi_adatok` (`felhasznalo_id`, `felhasznalo_autosiskola`, `felhasznalo_email`, `felhasznalo_jelszo`, `felhasznalo_telefonszam`, `felhasznalo_tipus`) VALUES
(1, 1, 'raidonss@gmail.com', 'qwertzui123', '56556656', 2),
(2, 1, 'illjanos@gmail.com', 'illjanos123', '5645465', 1),
(5, 1, 'elsodiak@gmail.com', '$2a$10$xCaITh72z7LSb', '06209998877', 2),
(6, 1, 'tesztoktato@gmail.com', '$2a$10$Qc4jxCGe.1xgZ', '06101112233', 1),
(7, 1, 'illesjanosoktato@gmail.com', '$2a$10$O05ZvJIioQbf3', '06306667788', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `oktato_adatok`
--

CREATE TABLE `oktato_adatok` (
  `oktato_id` int(11) NOT NULL,
  `oktato_felhasznaloID` int(11) NOT NULL,
  `oktato_nev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `oktato_adatok`
--

INSERT INTO `oktato_adatok` (`oktato_id`, `oktato_felhasznaloID`, `oktato_nev`) VALUES
(1, 2, 'Illés János'),
(4, 6, 'Teszt Oktató'),
(5, 7, 'Illés János ');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ora_adatok`
--

CREATE TABLE `ora_adatok` (
  `ora_id` int(11) NOT NULL,
  `tanulo_id` int(11) NOT NULL,
  `ora_tipus` int(11) NOT NULL,
  `ora_datuma` datetime NOT NULL,
  `ora_teljesitve` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ora_adatok`
--

INSERT INTO `ora_adatok` (`ora_id`, `tanulo_id`, `ora_tipus`, `ora_datuma`, `ora_teljesitve`) VALUES
(1, 1, 1, '2024-12-10 13:23:51', 1),
(2, 1, 1, '2024-12-09 13:55:09', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tanulo_adatok`
--

CREATE TABLE `tanulo_adatok` (
  `tanulo_id` int(11) NOT NULL,
  `tanulo_felhasznaloID` int(11) NOT NULL,
  `tanulo_oktatoja` int(11) NOT NULL,
  `tanulo_nev` varchar(255) NOT NULL,
  `tanulo_levizsgazott` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `tanulo_adatok`
--

INSERT INTO `tanulo_adatok` (`tanulo_id`, `tanulo_felhasznaloID`, `tanulo_oktatoja`, `tanulo_nev`, `tanulo_levizsgazott`) VALUES
(1, 1, 1, 'Ecsedi Hanna', 0),
(2, 5, 1, 'Első Diak', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tipus_adatok`
--

CREATE TABLE `tipus_adatok` (
  `tipus_id` int(11) NOT NULL,
  `tipus_nev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `tipus_adatok`
--

INSERT INTO `tipus_adatok` (`tipus_id`, `tipus_nev`) VALUES
(1, 'ora'),
(2, 'vizsga');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `autosiskola_adatok`
--
ALTER TABLE `autosiskola_adatok`
  ADD PRIMARY KEY (`autosiskola_id`);

--
-- A tábla indexei `befizetesek`
--
ALTER TABLE `befizetesek`
  ADD KEY `tanulo_id` (`tanulo_id`),
  ADD KEY `befizetes_tipusa` (`befizetes_tipusa`),
  ADD KEY `oktato_id` (`oktato_id`);

--
-- A tábla indexei `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  ADD PRIMARY KEY (`felhasznalo_id`),
  ADD KEY `felhasznalo_autosiskola` (`felhasznalo_autosiskola`);

--
-- A tábla indexei `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  ADD PRIMARY KEY (`oktato_id`),
  ADD KEY `oktato_felhasznaloID` (`oktato_felhasznaloID`);

--
-- A tábla indexei `ora_adatok`
--
ALTER TABLE `ora_adatok`
  ADD PRIMARY KEY (`ora_id`),
  ADD KEY `tanulo_id` (`tanulo_id`),
  ADD KEY `ora_tipus` (`ora_tipus`);

--
-- A tábla indexei `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  ADD PRIMARY KEY (`tanulo_id`),
  ADD KEY `tanulo_felhasznaloID` (`tanulo_felhasznaloID`),
  ADD KEY `tanulo_oktatoja` (`tanulo_oktatoja`);

--
-- A tábla indexei `tipus_adatok`
--
ALTER TABLE `tipus_adatok`
  ADD PRIMARY KEY (`tipus_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `autosiskola_adatok`
--
ALTER TABLE `autosiskola_adatok`
  MODIFY `autosiskola_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  MODIFY `oktato_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `ora_adatok`
--
ALTER TABLE `ora_adatok`
  MODIFY `ora_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  MODIFY `tanulo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `tipus_adatok`
--
ALTER TABLE `tipus_adatok`
  MODIFY `tipus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `befizetesek`
--
ALTER TABLE `befizetesek`
  ADD CONSTRAINT `befizetesek_ibfk_1` FOREIGN KEY (`tanulo_id`) REFERENCES `tanulo_adatok` (`tanulo_id`),
  ADD CONSTRAINT `befizetesek_ibfk_2` FOREIGN KEY (`befizetes_tipusa`) REFERENCES `tipus_adatok` (`tipus_id`),
  ADD CONSTRAINT `befizetesek_ibfk_3` FOREIGN KEY (`oktato_id`) REFERENCES `oktato_adatok` (`oktato_id`);

--
-- Megkötések a táblához `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  ADD CONSTRAINT `felhasznaloi_adatok_ibfk_1` FOREIGN KEY (`felhasznalo_autosiskola`) REFERENCES `autosiskola_adatok` (`autosiskola_id`);

--
-- Megkötések a táblához `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  ADD CONSTRAINT `oktato_adatok_ibfk_1` FOREIGN KEY (`oktato_felhasznaloID`) REFERENCES `felhasznaloi_adatok` (`felhasznalo_id`);

--
-- Megkötések a táblához `ora_adatok`
--
ALTER TABLE `ora_adatok`
  ADD CONSTRAINT `ora_adatok_ibfk_1` FOREIGN KEY (`ora_tipus`) REFERENCES `tipus_adatok` (`tipus_id`),
  ADD CONSTRAINT `ora_adatok_ibfk_2` FOREIGN KEY (`tanulo_id`) REFERENCES `tanulo_adatok` (`tanulo_id`);

--
-- Megkötések a táblához `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  ADD CONSTRAINT `tanulo_adatok_ibfk_1` FOREIGN KEY (`tanulo_felhasznaloID`) REFERENCES `felhasznaloi_adatok` (`felhasznalo_id`),
  ADD CONSTRAINT `tanulo_adatok_ibfk_2` FOREIGN KEY (`tanulo_oktatoja`) REFERENCES `oktato_adatok` (`oktato_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
