DROP SCHEMA IF EXISTS SANDBOX_NAME CASCADE;
CREATE SCHEMA SANDBOX_NAME;

CREATE TABLE SANDBOX_NAME.opiskelijat (
  nro int PRIMARY KEY NOT NULL,
  nimi TEXT NOT NULL,
  p_aine TEXT NOT NULL
);

CREATE TABLE SANDBOX_NAME.kurssit (
  id int PRIMARY KEY NOT NULL,
  nimi TEXT NOT NULL,
  opettaja TEXT NOT NULL
);

CREATE TABLE SANDBOX_NAME.suoritukset (
  k_id int REFERENCES SANDBOX_NAME.kurssit(id),
  op_nro int REFERENCES SANDBOX_NAME.opiskelijat(nro),
  arvosana int NOT NULL
);

-- esimerkkitaulun opiskelijat
INSERT INTO SANDBOX_NAME.opiskelijat VALUES(1, 'Maija', 'TKO');
INSERT INTO SANDBOX_NAME.opiskelijat VALUES(2, 'Ville', 'TKO');
INSERT INTO SANDBOX_NAME.opiskelijat VALUES(3, 'Kalle', 'VT');
INSERT INTO SANDBOX_NAME.opiskelijat VALUES(4, 'Liisa', 'VT');

-- esimerkkitaulun kurssit
INSERT INTO SANDBOX_NAME.kurssit VALUES(1, 'tkp', 'KI');
INSERT INTO SANDBOX_NAME.kurssit VALUES(2, 'oope', 'JL');
INSERT INTO SANDBOX_NAME.kurssit VALUES(3, 'tiko', 'MJ');

-- esimerkkitaulun suoritukset
INSERT INTO SANDBOX_NAME.suoritukset VALUES(1, 1, 5);
INSERT INTO SANDBOX_NAME.suoritukset VALUES(1, 2, 4);
INSERT INTO SANDBOX_NAME.suoritukset VALUES(1, 3, 2);
INSERT INTO SANDBOX_NAME.suoritukset VALUES(2, 1, 5);
INSERT INTO SANDBOX_NAME.suoritukset VALUES(2, 2, 3);
INSERT INTO SANDBOX_NAME.suoritukset VALUES(2, 4, 3);
INSERT INTO SANDBOX_NAME.suoritukset VALUES(3, 1, 5);
INSERT INTO SANDBOX_NAME.suoritukset VALUES(3, 2, 4);