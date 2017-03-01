package services;

import org.sql2o.Connection;
import org.sql2o.Sql2o;

public class DatabaseService {
  private static final String DRIVER = "org.postgresql.Driver";
  private static final String PROTOCOL = "jdbc:postgresql:";
  private static final String HOST = "localhost";
  private static final int PORT = 5432;
  private static final String DATABASE = "exercises";
  private static final String USER = "exercises";
  private static final String PASSWORD = "super_secret_database_password";


  public static Connection getConnection() {
    try {
      Class.forName(DRIVER);
    } catch (ClassNotFoundException e) {
      System.out.println("Database driver not found");
      return null;
    }

    Sql2o sql2o = new Sql2o(PROTOCOL + "//" + HOST + ":" + PORT + "/" + DATABASE, USER, PASSWORD);
    return sql2o.open();
  }
}
