insert into "user" (id, name, student_number, field) values (0, 'Testaaja', '12345', 'TKT');
insert into exercise (id, description, type, creator) values (0, 'Hae kaikki "exercise" taulun rivit', 'TODO', 0);
insert into example_answer (exercise, answer) values (0, 'SELECT * FROM exercise;');
insert into exercise_list (id, description) values (0, 'Perusharjoitukset');
insert into exercise_list_exercise (exercise, exercise_list) values (0, 0);