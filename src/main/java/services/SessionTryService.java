package services;

import org.sql2o.Connection;

import java.sql.SQLException;
import java.util.*;
import java.util.stream.IntStream;

import org.sql2o.Query;
import org.sql2o.Sql2oException;
import services.UserService.User;

import services.SessionService.Session;
import services.SessionService.SessionNotFound;
import services.ExerciseService.Exercise;
import services.ExerciseService.ExerciseNotFound;

import static services.ExerciseService.getExerciseById;
import static services.SessionService.getSessionById;

public class SessionTryService {
  public static class SessionTryNotFound extends Exception {
    public SessionTryNotFound() {
      super("Session try not found");
    }
  }
  public static class SessionTryNotCreated extends Exception {
    public SessionTryNotCreated() {
      super("Session try was not created because of an internal error");
    }
  }
  public static class SessionTriesExceeded extends Exception {
    public SessionTriesExceeded() {
      super("Too many exercise answer attempts");
    }
  }
  public static class SessionTrySyntaxError extends Exception {
    public SessionTrySyntaxError() { super("Syntax error"); }
  }

  public static class SQLError extends Exception {
    public SQLError(String message) {
      super(message);
    }
  }
  public static class SessionTry {
    public int id;
    public int exercise;
    public int session;
    public String answer;
    public boolean correct;
    public Date startedAt;
    public Date finishedAt;
    public List<Map<String, Object>> result;
    public SessionTry(
      int exercise,
      int session,
      String answer,
      Date startedAt
    ) {
      this.exercise = exercise;
      this.session = session;
      this.answer = answer;
      this.startedAt = startedAt;
    }
  }

  public static SessionTry getSessionTryById(int id) throws SessionTryNotFound {
    String sql = "SELECT * FROM session_try where id = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<SessionTry> sessions = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("started_at", "startedAt")
        .addColumnMapping("finished_at", "finishedAt")
        .executeAndFetch(SessionTry.class);

      if(sessions.size() == 0) {
        throw new SessionTryNotFound();
      }

      return sessions.get(0);
    }
  }

  public static List<SessionTry> getSessionTriesBySession(int id) {
    String sql = "SELECT * FROM session_try WHERE session = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<SessionTry> sessionTries = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("started_at", "startedAt")
        .addColumnMapping("finished_at", "finishedAt")
        .executeAndFetch(SessionTry.class);

      return sessionTries;
    }
  }

  public static List<SessionTry> getSessionTriesBySessionAndExercise(int id, int exercise) {
    String sql = "SELECT * FROM session_try WHERE session = :id AND exercise = :exercise";

    try(Connection con = DatabaseService.getConnection()) {
      List<SessionTry> sessionTries = con
        .createQuery(sql)
        .addParameter("id", id)
        .addParameter("exercise", exercise)
        .addColumnMapping("started_at", "startedAt")
        .addColumnMapping("finished_at", "finishedAt")
        .executeAndFetch(SessionTry.class);

      return sessionTries;
    }
  }

  public static SessionTry answerExercise(SessionTry sessionTry, User user)
          throws SessionTryNotCreated, SessionNotFound, SessionTriesExceeded, ExerciseNotFound,
                  SessionTrySyntaxError, SQLError {

    sessionTry.finishedAt = new Date();
    sessionTry.correct = false;
    Session session = getSessionById(sessionTry.session);

    List<SessionTry> previousTries =
            getSessionTriesBySessionAndExercise(sessionTry.session, sessionTry.exercise);

    // Has max amount of tries been reached?
    if(previousTries.size() == session.maxTries) {
      throw new SessionTriesExceeded();
    }

    // Is answer syntactically correct?
    if(sessionTry.answer.charAt((sessionTry.answer.length() -1)) != ';') {
      createSessionTry(sessionTry);
      throw new SessionTrySyntaxError();
    }

    if(!isValidSyntax(sessionTry.answer)) {
      createSessionTry(sessionTry);
      throw new SessionTrySyntaxError();
    }

    Exercise exercise = getExerciseById(sessionTry.exercise);


    try(Connection con = DatabaseService.getTransaction()) {
      con.getJdbcConnection().setSchema("sandbox" + session.id);

      String type = exercise.type;

      Query q = con.createQuery(exercise.exampleAnswers.get(0));

      List<Map<String,Object>> correctAnswer;
      List<Map<String,Object>> userAnswerResult;

      boolean isUpdate =
        type.equals("insert") ||
        type.equals("update") ||
        type.equals("delete");

      if(isUpdate) {
        q.executeUpdate();
        correctAnswer = con
          .createQuery(String.format("select * from %s", exercise.table))
          .executeAndFetchTable()
          .asList();
      } else {
        correctAnswer = q.executeAndFetchTable().asList();
      }

      con.rollback(false);
      con.getJdbcConnection().setSchema("sandbox" + session.id);

      q = con.createQuery(sessionTry.answer);

      if(isUpdate) {
        q.executeUpdate();
        userAnswerResult = con
          .createQuery(String.format("select * from %s", exercise.table))
          .executeAndFetchTable()
          .asList();
      } else {
        userAnswerResult = q
          .executeAndFetchTable()
          .asList();
      }

      sessionTry.result = userAnswerResult;
      boolean correct = isEqualResult(correctAnswer, userAnswerResult);
      sessionTry.correct = correct;

      if(correct) {
        con.commit();
      }

    } catch (Sql2oException err) {
      sessionTry.correct = false;
      createSessionTry(sessionTry);
      throw new SQLError(err.getMessage());
    } catch (SQLException err) {
      sessionTry.correct = false;
      createSessionTry(sessionTry);
      throw new SQLError(err.getMessage());
    }

    return createSessionTry(sessionTry);
  }

  public static SessionTry createSessionTry(SessionTry sessionTry) throws SessionTryNotCreated {
    String sql = "INSERT INTO session_try (exercise, session, answer, started_at, finished_at, correct) " +
            "values (:exercise, :session, :answer, :startedAt, :finishedAt, :correct)";

    try(Connection con = DatabaseService.getConnection()) {
      int id = con
        .createQuery(sql, true)
        .bind(sessionTry)
        .executeUpdate()
        .getKey(int.class);

      SessionTry createdSessionTry = SessionTryService.getSessionTryById(id);
      createdSessionTry.result = sessionTry.result;
      return createdSessionTry;
    } catch (SessionTryNotFound err) {
      throw new SessionTryNotCreated();
    }
  }
  private static boolean isEqualResult(List<Map<String, Object>> resultA, List<Map<String, Object>> resultB) {

    if(resultA.size() != resultB.size()) {
      return false;
    }

    return IntStream.range(0, resultA.size()).allMatch(i ->
      resultA.get(i).equals(resultB.get(i))
    );
  }
  private static boolean isValidSyntax(String answer) {
    if(answer.charAt((answer.length() -1)) != ';') {
      return false;
    } else {
      final char PAR1 = '(';
      final char PAR2 = ')';
      int parNum1 = 0;
      int parNum2 = 0;
      for (int i = 0; i < answer.length() - 1; ++i) {
        if (answer.charAt(i) == PAR1) {
          parNum1++;
        }
        if (answer.charAt(i) == PAR2) {
          parNum2++;
        }
      }
      return parNum1 == parNum2;
    }
  }
}

