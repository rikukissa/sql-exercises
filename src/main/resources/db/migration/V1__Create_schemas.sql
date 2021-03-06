CREATE TABLE "user" (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  student_number TEXT NOT NULL,
  field TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE exercise_list (
  id SERIAL PRIMARY KEY NOT NULL,
  description TEXT NOT NULL,
  exercise_amount int NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL default now(),
  creator int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE exercise (
  id SERIAL PRIMARY KEY NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  "table" TEXT NOT NULL,
  creator int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamp default now()
);

CREATE TABLE example_answer (
  exercise int REFERENCES exercise(id) ON DELETE CASCADE,
  answer TEXT NOT NULL
);

CREATE TABLE exercise_list_exercise (
  exercise int REFERENCES exercise(id) ON DELETE CASCADE,
  exercise_list int REFERENCES exercise_list(id) ON DELETE CASCADE
);

CREATE TABLE session (
  id SERIAL PRIMARY KEY NOT NULL,
  "user" int REFERENCES "user"(id) ON DELETE CASCADE,
  exercise_list int REFERENCES exercise_list(id) ON DELETE CASCADE,
  started_at timestamp NOT NULL default now(),
  max_tries int NOT NULL default 3,
  finished_at timestamp
);

CREATE TABLE session_try (
  id SERIAL PRIMARY KEY NOT NULL,
  exercise int REFERENCES exercise(id) ON DELETE CASCADE,
  session int REFERENCES session(id) ON DELETE CASCADE,
  started_at timestamp NOT NULL default now(),
  finished_at timestamp,
  answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL
);

CREATE FUNCTION increase_exercise_amount() RETURNS TRIGGER
AS $$
   BEGIN
    UPDATE exercise_list SET exercise_amount = exercise_amount + 1 WHERE id = NEW.exercise_list;
    RETURN NEW;
   END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION decrease_exercise_amount() RETURNS TRIGGER
AS $$
    BEGIN
     UPDATE exercise_list SET exercise_amount = exercise_amount - 1 WHERE id = OLD.exercise_list;
     RETURN NEW;
   END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increase_exercise_amount_trigger
  AFTER INSERT
  ON exercise_list_exercise
  FOR EACH ROW
  EXECUTE PROCEDURE increase_exercise_amount();

CREATE TRIGGER decrease_exercise_amount_trigger
  AFTER DELETE
  ON exercise_list_exercise
  FOR EACH ROW
  EXECUTE PROCEDURE decrease_exercise_amount();
