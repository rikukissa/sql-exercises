with
  session_tries AS
    (SELECT * FROM session_try WHERE session in (SELECT id FROM session WHERE exercise_list = :exercise_list)),
  correctness_per_session AS
    (SELECT session, exercise, bool_or(correct) AS correct FROM session_tries group by session, exercise order by session),
  successes AS
    (SELECT count(*) AS success, exercise FROM correctness_per_session WHERE correct = true group by exercise),
  fails AS
    (SELECT count(*) AS fail, exercise FROM correctness_per_session WHERE correct = false group by exercise),
  data AS
    (SELECT
      id,
      description,
      cast(case when success is null then 0 else success end AS float) AS success,
      cast(case when fail is null then 0 else fail end AS float) AS fail,
      -- Average time per exercise
      (SELECT
        avg(deltas.delta)
      FROM
        (SELECT
          (max(finished_at) - min(started_at)) AS delta
        FROM session_tries
        WHERE exercise = exercise.id
        GROUP BY session, exercise) deltas) AS average_time
    FROM exercise
    LEFT JOIN
      successes ON exercise.id = successes.exercise
    LEFT JOIN
      fails ON exercise.id = fails.exercise)

  SELECT
    id as exercise,
    CASE (success + fail) WHEN 0 THEN 0 ELSE (success / (success + fail)) END AS success_rate,
    EXTRACT(epoch FROM average_time) as average_seconds
  FROM data;
