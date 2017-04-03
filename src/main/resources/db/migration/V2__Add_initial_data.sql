insert into "user" (id, name, role, student_number, field) values (0, 'Opettaja', 'admin', '12345', 'TKT');

insert into "user" (id, name, student_number, field) values (1, 'Juha Sipilä', '00001', 'TKT');
insert into "user" (id, name, student_number, field) values (2, 'Alexander Stubb', '00002', 'TKT');
insert into "user" (id, name, student_number, field) values (3, 'Timo Soini', '00003', 'TKT');

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
insert into exercise_list (id, description) values (0, 'Perusharjoitukset');

insert into exercise (id, description, type, creator) values (0, 'Valitse opettajien nimet', 'easy', 0);
insert into example_answer (exercise, answer) values (0, 'SELECT opettaja FROM kurssit;');

insert into exercise (id, description, type, creator) values (1, 'Valitse opiskelijoiden nimet, joilla
pääaineena on TKO.', 'easy', 0);
insert into example_answer (exercise, answer) values (1, 'SELECT nimi FROM opiskelija
WHERE p_aine = "TKO";');

insert into exercise (id, description, type, creator) values (2, 'Mitkä ovat Villen suorittamien
kurssien arvosanat?', 'easy', 0);
insert into example_answer (exercise, answer) values (2, 'SELECT suoritukset.arvosana
FROM opiskelijat, suoritukset
WHERE opiskelijat.nro =
suoritukset.op_nro AND
opiskelijat.nimi = "Ville";');


insert into exercise_list_exercise (exercise, exercise_list) values (0, 0);
insert into exercise_list_exercise (exercise, exercise_list) values (1, 0);
insert into exercise_list_exercise (exercise, exercise_list) values (2, 0);

-- Haastavat harjoitukset
insert into exercise_list (id, description) values (1, 'Haastavat harjoitukset');

insert into exercise (id, description, type, creator) values (3, 'Lisää opiskelija nimeltä Matti
tietokantaan. Matin opiskelijanumero on
1234 ja pääaine VT.', 'medium', 0);
insert into example_answer (exercise, answer) values (3, 'INSERT INTO opiskelijat
VALUES(1234, "Matti", "VT");');

insert into exercise (id, description, type, creator) values (4, 'Poista opiskelija, jonka numero on 1234.', 'medium', 0);
insert into example_answer (exercise, answer) values (4, 'DELETE FROM opiskelijat WHERE
nro = 1234;');

insert into exercise_list_exercise (exercise, exercise_list) values (0, 1);
insert into exercise_list_exercise (exercise, exercise_list) values (3, 1);
insert into exercise_list_exercise (exercise, exercise_list) values (4, 1);

