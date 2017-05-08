WITH
  correctness_per_session AS
    (SELECT session, exercise, bool_or(correct) AS correct, count(*) AS tries, max(finished_at) - min(started_at) AS duration FROM session_try GROUP BY session, exercise ORDER BY session),
  avg_tries AS
    (SELECT correctness_per_session.exercise, exercise.type, avg(tries) as average_tries from correctness_per_session LEFT JOIN exercise ON exercise.id = correctness_per_session.exercise GROUP BY exercise, exercise.type),
  avg_durations AS
    (SELECT exercise, avg(duration) as average_duration from correctness_per_session GROUP BY exercise),

  data as
    (SELECT
      avg_tries.exercise,
      average_duration,
      average_tries,
      type
    FROM
      avg_tries
    LEFT JOIN
      avg_durations ON avg_tries.exercise = avg_durations.exercise
    LEFT JOIN
      example_answer ON avg_tries.exercise = example_answer.exercise
    )

  SELECT EXTRACT(epoch FROM avg(average_duration)) as average_duration, avg(average_tries) as average_tries, type FROM data GROUP BY type;

