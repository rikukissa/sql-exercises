WITH
  correctness_per_session AS
    (SELECT session, exercise, bool_or(correct) AS correct, count(*) AS tries, max(finished_at) - min(started_at) AS duration FROM session_try group by session, exercise order by session),
  avg_tries AS
    (SELECT exercise, avg(tries) as average_tries from correctness_per_session WHERE correct = true GROUP BY exercise),
  avg_durations AS
    (SELECT exercise, avg(duration) as average_duration from correctness_per_session GROUP BY exercise),
  successes AS
    (SELECT exercise, count(*) as success from correctness_per_session WHERE correct = true GROUP BY exercise),
  fails AS
    (SELECT exercise, count(*) as fail from correctness_per_session WHERE correct = false GROUP BY exercise),
  data as
    (SELECT
      successes.exercise,
      average_duration,
      average_tries,
      cast(case when success is null then 0 else success end AS float) AS success,
      cast(case when fail is null then 0 else fail end AS float) AS fail
    FROM
      successes
    LEFT JOIN
      fails ON successes.exercise = fails.exercise
    LEFT JOIN
      avg_tries ON successes.exercise = avg_tries.exercise
    LEFT JOIN
      avg_durations ON successes.exercise = avg_durations.exercise)

  SELECT
    exercise,
    EXTRACT(epoch FROM average_duration) as average_duration_seconds,
    average_tries,
    CASE (success + fail) WHEN 0 THEN 0 ELSE (success / (success + fail)) END AS success_rate
  FROM data ORDER BY average_duration DESC;

