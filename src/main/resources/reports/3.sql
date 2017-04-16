WITH
  correctness_per_session AS
    (SELECT session, exercise, bool_or(correct) AS correct, count(*) AS tries, max(finished_at) - min(started_at) AS duration FROM session_try group by session, exercise order by session),
  avg_tries AS
    (SELECT exercise, avg(tries) as average_tries from correctness_per_session GROUP BY exercise),
  avg_durations AS
    (SELECT exercise, avg(duration) as average_duration from correctness_per_session GROUP BY exercise),

  data as
    (SELECT
      avg_tries.exercise,
      average_duration,
      average_tries,
      split_part(answer, ' ', 1) as type
    FROM
      avg_tries
    LEFT JOIN
      avg_durations ON avg_tries.exercise = avg_durations.exercise
    LEFT JOIN
      example_answer ON avg_tries.exercise = example_answer.exercise
    )

  SELECT avg(average_duration) as average_duration, avg(average_tries) as average_tries, type FROM data GROUP BY type;

