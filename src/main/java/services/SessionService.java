package services;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Date;
import org.sql2o.Connection;
import services.utils.FileReader;
import java.util.List;

import static services.SessionTryService.*;

public class SessionService {
  public static class SessionNotFound extends Exception {}
  public static class SessionNotCreated extends Exception {}

  public static class Session {
    public int id;
    public int user;
    public int exerciseList;
    public int maxTries;
    public Date startedAt;
    public Date finishedAt;
    public List<SessionTry> sessionTries;

    public Session(int user, int exerciseList, Date startedAt, Date finishedAt) {
      this.user = user;
      this.exerciseList = exerciseList;
      this.startedAt = startedAt;
      this.finishedAt = finishedAt;
    }

    public void populateSessionTries(List<SessionTry> tries) {
      this.sessionTries = tries;
    }
  }

  public static Session getSessionById(int id) throws SessionNotFound {
    String sql = "SELECT * FROM session where id = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<Session> sessions = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("started_at", "startedAt")
        .addColumnMapping("finished_at", "finishedAt")
        .addColumnMapping("exercise_list", "exerciseList")
        .addColumnMapping("max_tries", "maxTries")
        .executeAndFetch(Session.class);

      if(sessions.size() == 0) {
        throw new SessionNotFound();
      }

      return sessions.get(0);
    }
  }
  public static List<Session> getSessionsByUser(int id) throws SessionNotFound {
    String sql = "SELECT * FROM session where \"user\" = :user";

    try(Connection con = DatabaseService.getConnection()) {
      List<Session> sessions = con
        .createQuery(sql)
        .addParameter("user", id)
        .addColumnMapping("started_at", "startedAt")
        .addColumnMapping("finished_at", "finishedAt")
        .addColumnMapping("exercise_list", "exerciseList")
        .addColumnMapping("max_tries", "maxTries")
        .executeAndFetch(Session.class);

      return sessions;
    }
  }

  public static List<Session> getSessionsByUserForCreator(int id, int creatorId) throws SessionNotFound {
    String sql = "SELECT \"session\".* FROM exercise_list RIGHT JOIN session ON exercise_list.id = session.exercise_list WHERE exercise_list.creator = :creator AND session.\"user\" = :user;";

    try(Connection con = DatabaseService.getConnection()) {
      List<Session> sessions = con
        .createQuery(sql)
        .addParameter("user", id)
        .addParameter("creator", creatorId)
        .addColumnMapping("started_at", "startedAt")
        .addColumnMapping("finished_at", "finishedAt")
        .addColumnMapping("exercise_list", "exerciseList")
        .addColumnMapping("max_tries", "maxTries")
        .executeAndFetch(Session.class);

      return sessions;
    }
  }

  public static Session createSession(Session session) throws SessionNotCreated, IOException, URISyntaxException {
    String sql = "INSERT INTO session (\"user\", exercise_list, started_at) " +
            "values (:user, :exerciseList, :startedAt)";

    String sandboxInitSql = FileReader.getContent("queries/create_sandbox.sql");

    try(Connection con = DatabaseService.getConnection()) {
      int id = con
        .createQuery(sql, true)
        .bind(session)
        .executeUpdate()
        .getKey(int.class);

      String amendedSandboxInitSql = sandboxInitSql.replaceAll("SANDBOX_NAME", "sandbox" + id);

      con.createQuery(sandboxInitSql).executeUpdate();

      return SessionService.getSessionById(id);
    } catch (SessionNotFound err) {
      throw new SessionNotCreated();
    }
  }
}

