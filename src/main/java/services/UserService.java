package services;

import org.sql2o.Connection;
import java.util.List;

public class UserService {
  public static class UserNotFound extends Exception {}
  public static class UserNotCreated extends Exception {}

  public static class User {
    public int id;
    public String name;
    public String studentNumber;
    public String field;
    public String role;

    public User(String name, String studentNumber, String field, String role) {
      this.name = name;
      this.studentNumber = studentNumber;
      this.field = field;
      this.role = role;
    }
  }

  public static User getUserByStudentNumber(String studentNumber) throws UserNotFound {
    String sql = "SELECT * FROM \"user\" where student_number = :studentNumber";

    try(Connection con = DatabaseService.getConnection()) {
      List<User> users = con
        .createQuery(sql)
        .addParameter("studentNumber", studentNumber)
        .addColumnMapping("student_number", "studentNumber")
        .executeAndFetch(User.class);

      if(users.size() == 0) {
        throw new UserNotFound();
      }

      return users.get(0);
    }
  }

  public static User getUserById(int id) throws UserNotFound {
    String sql = "SELECT * FROM \"user\" where id = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<User> users = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("student_number", "studentNumber")
        .executeAndFetch(User.class);

      if(users.size() == 0) {
        throw new UserNotFound();
      }

      return users.get(0);
    }
  }
  public static List<User> getUsers() {
    String sql = "SELECT * FROM \"user\"";

    try(Connection con = DatabaseService.getConnection()) {
      List<User> users = con
        .createQuery(sql)
        .addColumnMapping("student_number", "studentNumber")
        .executeAndFetch(User.class);

      return users;
    }
  }

  public static User createUser(User user) throws UserNotCreated {
    String sql = "INSERT INTO \"user\" (name, student_number, field, role) " +
            "values (:name, :studentNumber, :field, :role)";

    try(Connection con = DatabaseService.getConnection()) {
      int id = con
        .createQuery(sql, true)
        .bind(user)
        .executeUpdate()
        .getKey(int.class);
      return UserService.getUserById(id);
    } catch (UserNotFound err) {
      throw new UserNotCreated();
    }
  }
}

