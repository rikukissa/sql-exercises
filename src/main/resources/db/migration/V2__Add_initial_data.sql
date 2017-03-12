insert into "user" (id, name, role, student_number, field) values (0, 'Opettaja', 'admin', '12345', 'TKT');

insert into "user" (id, name, student_number, field) values (1, 'Juha Sipilä', '00001', 'TKT');
insert into "user" (id, name, student_number, field) values (2, 'Alexander Stubb', '00002', 'TKT');
insert into "user" (id, name, student_number, field) values (3, 'Timo Soini', '00003', 'TKT');

-- Perusharjoitukset
insert into exercise_list (id, description) values (0, 'Perusharjoitukset');

insert into exercise (id, description, type, creator) values (0, 'Hae kaikki "exercise" taulun rivit', 'easy', 0);
insert into example_answer (exercise, answer) values (0, 'SELECT * FROM exercise;');

insert into exercise (id, description, type, creator) values (1, 'Hae kaikki "exercise_list" taulun rivit', 'easy', 0);
insert into example_answer (exercise, answer) values (1, 'SELECT * FROM exercise_list;');

insert into exercise_list_exercise (exercise, exercise_list) values (0, 0);
insert into exercise_list_exercise (exercise, exercise_list) values (1, 0);

-- Haastavat harjoitukset
insert into exercise_list (id, description) values (1, 'Haastavat harjoitukset');

insert into exercise (id, description, type, creator) values (2, 'Hae käyttäjän nimi ja hänen suorittamiensa tehtävien määrä', 'medium', 0);
insert into example_answer (exercise, answer) values (2,
    'SELECT name FROM "user"'
    'WHERE id IN'
      '(SELECT "user" FROM session LEFT JOIN session_try ON session_try.session = session.id);'
);

insert into exercise (id, description, type, creator) values (3, 'Hae käyttäjän nimi ja hänen suorittamiensa tehtävien määrä', 'hard', 0);
insert into example_answer (exercise, answer) values (3,
    'WITH started_exercises AS ('
      'SELECT session, correct, COUNT(*) AS tries, exercise FROM session_try GROUP BY session, correct, exercise'
    '), finished_exercises AS ('
      'SELECT '
        '"user", exercise_list, session, COUNT(*) '
      'FROM session INNER JOIN started_exercises ON '
          '(started_exercises.session = session.id AND'
          '(started_exercises.tries = session.max_tries OR '
          'started_exercises.correct))'
      'GROUP BY "user", exercise_list, session'
    ') select name, SUM(finished_exercises.count) from "user" LEFT JOIN finished_exercises on finished_exercises."user" = id GROUP BY name;'
);

insert into exercise (id, description, type, creator) values (4, 'Hae käyttäjien nimet ja heidän suorittamiensa tehtävälistojen nimet', 'hard', 0);
insert into example_answer (exercise, answer) values (4,
    'WITH started_exercises AS ('
      'SELECT session, correct, COUNT(*) AS tries, exercise FROM session_try GROUP BY session, correct, exercise'
    '), finished_exercises AS ('
      'SELECT '
        '"user", exercise_list, session, COUNT(*) '
      'FROM session INNER JOIN started_exercises ON '
          '(started_exercises.session = session.id AND '
          '(started_exercises.tries = session.max_tries OR '
          'started_exercises.correct)) '
      'GROUP BY "user", exercise_list, session'
    '), users_with_finished_exercise_lists AS ('
      'SELECT '
        '"user", description '
      'FROM exercise_list '
      'INNER JOIN finished_exercises '
      'ON finished_exercises.count = exercise_list.exercise_amount'
    ') SELECT '
      'users_with_finished_exercise_lists.description, name '
    'FROM "user" INNER JOIN '
      'users_with_finished_exercise_lists '
    'ON "user".id = users_with_finished_exercise_lists."user";'
);

insert into exercise_list_exercise (exercise, exercise_list) values (2, 1);
insert into exercise_list_exercise (exercise, exercise_list) values (3, 1);
insert into exercise_list_exercise (exercise, exercise_list) values (4, 1);

