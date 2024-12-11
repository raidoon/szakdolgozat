-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 11. 10:11
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
-- Adatbázis: `szakdolgozat_vol2`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznaloi_adatok`
--

CREATE TABLE `felhasznaloi_adatok` (
  `felhasznalo_id` int(11) NOT NULL,
  `felhasznalo_nev` varchar(255) NOT NULL,
  `felhasznalo_email` varchar(255) NOT NULL,
  `felhasznalo_jelszo` varchar(500) NOT NULL,
  `felhasznalo_telefonszam` varchar(11) NOT NULL,
  `felhasznalo_tipus` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznaloi_adatok`
--

INSERT INTO `felhasznaloi_adatok` (`felhasznalo_id`, `felhasznalo_nev`, `felhasznalo_email`, `felhasznalo_jelszo`, `felhasznalo_telefonszam`, `felhasznalo_tipus`) VALUES
(8, 'elsooktato', 'kisjanosoktato@gmail.com', '$2a$10$n8UPuWEiewapcvHsNyXjs./hSYRSvAPFRWMTCmernNSX9ilNP/Jna', '06301122345', 1),
(10, 'teszt', 'tesztoktato@gmail.com', '$2a$10$L3Hvt1NgtAiKhLRy9TACheG3TNkqHnDkbB5H/empxXO0WkadZxdxS', '06309998765', 1),
(11, 'A', 'A@gmail.com', '$2a$10$FFGdZRrop2fTDwrGhDj3L.fkpk0kOi0Apx4FXRlC4XBIFiFJ0KmHS', '0', 2),
(12, 'B', 'B@gmail.com', '$2a$10$fdi/L0fkwNAYQ01qHIb88ebnATNDTu0v4KiewPTYp9fPFi71y.aoy', '0', 1),
(13, 'C', 'c@gmail.com', '$2a$10$cGQt81OyL7HpTYxjBriAMe.cAmWgkTsVBLAYIuzgVNUTDB4CW2S4W', '0', 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `oktato_adatok`
--

CREATE TABLE `oktato_adatok` (
  `oktato_id` int(11) NOT NULL,
  `oktato_felhasznaloID` int(11) NOT NULL,
  `oktato_autosiskolaID` int(11) NOT NULL,
  `oktato_neve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `oktato_adatok`
--

INSERT INTO `oktato_adatok` (`oktato_id`, `oktato_felhasznaloID`, `oktato_autosiskolaID`, `oktato_neve`) VALUES
(6, 8, 1, 'Kiss János'),
(7, 10, 1, 'Teszt Oktató '),
(8, 12, 1, 'B');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tanulo_adatok`
--

CREATE TABLE `tanulo_adatok` (
  `tanulo_id` int(11) NOT NULL,
  `tanulo_felhasznaloID` int(11) NOT NULL,
  `tanulo_oktatoja` int(11) NOT NULL,
  `tanulo_neve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `tanulo_adatok`
--

INSERT INTO `tanulo_adatok` (`tanulo_id`, `tanulo_felhasznaloID`, `tanulo_oktatoja`, `tanulo_neve`) VALUES
(4, 13, 7, 'C');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  ADD PRIMARY KEY (`felhasznalo_id`);

--
-- A tábla indexei `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  ADD PRIMARY KEY (`oktato_id`),
  ADD KEY `oktato_felhasznaloID` (`oktato_felhasznaloID`,`oktato_autosiskolaID`);

--
-- A tábla indexei `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  ADD PRIMARY KEY (`tanulo_id`),
  ADD KEY `tanulo_felhasznaloID` (`tanulo_felhasznaloID`,`tanulo_oktatoja`),
  ADD KEY `tanulo_oktatoja` (`tanulo_oktatoja`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  MODIFY `oktato_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  MODIFY `tanulo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  ADD CONSTRAINT `oktato_adatok_ibfk_1` FOREIGN KEY (`oktato_felhasznaloID`) REFERENCES `felhasznaloi_adatok` (`felhasznalo_id`);

--
-- Megkötések a táblához `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  ADD CONSTRAINT `tanulo_adatok_ibfk_1` FOREIGN KEY (`tanulo_oktatoja`) REFERENCES `oktato_adatok` (`oktato_id`),
  ADD CONSTRAINT `tanulo_adatok_ibfk_2` FOREIGN KEY (`tanulo_felhasznaloID`) REFERENCES `felhasznaloi_adatok` (`felhasznalo_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
