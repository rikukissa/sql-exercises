
-- Administrators
INSERT INTO "user" (id, name, role, student_number, field) VALUES (0, 'Opettaja', 'teacher', '12345', 'TKT');
INSERT INTO "user" (name, student_number, field, role) VALUES ('Admin', '00000', 'TKT', 'admin');

-- Students
INSERT INTO "user" (name, student_number, field) VALUES ('Juha Sipilä', '00001', 'TKT');
INSERT INTO "user" (name, student_number, field) VALUES ('Alexander Stubb', '00002', 'TKT');
INSERT INTO "user" (name, student_number, field) VALUES ('Timo Soini', '00003', 'TKT');

-- esimerkkitaulun opiskelijat
INSERT INTO opiskelijat VALUES(1, 'Maija', 'TKO');
INSERT INTO opiskelijat VALUES(2, 'Ville', 'TKO');
INSERT INTO opiskelijat VALUES(3, 'Kalle', 'VT');
INSERT INTO opiskelijat VALUES(4, 'Liisa', 'VT');

-- esimerkkitaulun kurssit
INSERT INTO kurssit VALUES(1, 'tkp', 'KI');
INSERT INTO kurssit VALUES(2, 'oope', 'JL');
INSERT INTO kurssit VALUES(3, 'tiko', 'MJ');

-- esimerkkitaulun suoritukset
INSERT INTO suoritukset VALUES(1, 1, 5);
INSERT INTO suoritukset VALUES(1, 2, 4);
INSERT INTO suoritukset VALUES(1, 3, 2);
INSERT INTO suoritukset VALUES(2, 1, 5);
INSERT INTO suoritukset VALUES(2, 2, 3);
INSERT INTO suoritukset VALUES(2, 4, 3);
INSERT INTO suoritukset VALUES(3, 1, 5);
INSERT INTO suoritukset VALUES(3, 2, 4);

-- Perusharjoitukset
INSERT INTO exercise_list (id, description, creator) VALUES (0, 'Perusharjoitukset', 0);

-- Perusharjoitukset 1
INSERT INTO exercise (id, description, type, creator) VALUES (
  0,
  'Valitse opettajien nimet',
  'easy',
  0
);
INSERT INTO example_answer (exercise, answer) VALUES (0, 'SELECT opettaja FROM kurssit;');

-- Perusharjoitukset 2
INSERT INTO exercise (id, description, type, creator) VALUES (
  1,
  'Valitse opiskelijoiden nimet, joilla pääaineena on TKO.',
  'easy',
  0
);

INSERT INTO example_answer (exercise, answer) VALUES (
  1,
  'SELECT nimi FROM opiskelijat WHERE p_aine = ''TKO'';'
);

-- Perusharjoitukset 3
INSERT INTO exercise (id, description, type, creator) VALUES (
  2,
  'Mitkä ovat Villen suorittamien kurssien arvosanat?',
  'easy',
  0
);

INSERT INTO example_answer (exercise, answer) VALUES (
  2,
  'SELECT suoritukset.arvosana FROM opiskelijat, suoritukset WHERE opiskelijat.nro = suoritukset.op_nro AND opiskelijat.nimi = ''Ville'';'
);

INSERT INTO exercise_list_exercise (exercise, exercise_list) VALUES (0, 0);
INSERT INTO exercise_list_exercise (exercise, exercise_list) VALUES (1, 0);
INSERT INTO exercise_list_exercise (exercise, exercise_list) VALUES (2, 0);

-- Haastavat harjoitukset
INSERT INTO exercise_list (id, description, creator) VALUES (1, 'Haastavat harjoitukset', 0);

-- Haastavat harjoitukset 1
INSERT INTO exercise (id, description, type, creator) VALUES (
  3,
  'Lisää opiskelija nimeltä Matti tietokantaan. Matin opiskelijanumero on 1234 ja pääaine VT.',
  'medium',
  0
);

INSERT INTO example_answer (exercise, answer) VALUES (
  3,
  'INSERT INTO opiskelijat VALUES(1234, ''Matti'', ''VT'');'
);

-- Haastavat harjoitukset 2
INSERT INTO exercise (id, description, type, creator) VALUES (
  4,
  'Poista opiskelija, jonka numero on 1234.',
  'medium',
  0
);

INSERT INTO example_answer (exercise, answer) VALUES (
  4,
  'DELETE FROM opiskelijat WHERE nro = 1234;'
);

INSERT INTO exercise_list_exercise (exercise, exercise_list) VALUES (0, 1);
INSERT INTO exercise_list_exercise (exercise, exercise_list) VALUES (3, 1);
INSERT INTO exercise_list_exercise (exercise, exercise_list) VALUES (4, 1);

