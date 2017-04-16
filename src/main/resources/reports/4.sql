WITH
  correctness_per_session AS
    (SELECT 
      session, 
      exercise, 
      bool_or(correct) AS correct
    FROM session_try 
    GROUP BY session, exercise 
    ORDER BY session
    ),
  data AS 
    (SELECT "user".*, count(*) as finished_exercises FROM correctness_per_session 
      LEFT JOIN session ON session.id = correctness_per_session.session
      RIGHT JOIN "user" ON "user".id = session."user"
      WHERE correct = true
      GROUP by "user".id
    )
      
  SELECT sum(COALESCE(finished_exercises, 0)) / count(*) as success_rate, "user".field FROM data FULL OUTER JOIN "user" ON "user".id = data.id GROUP by "user".field;