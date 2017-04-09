package services;

import org.flywaydb.core.Flyway;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

public class DatabaseService {

  // Development defaults
  private static final String DRIVER = "org.postgresql.Driver";
  private static final String PROTOCOL = "jdbc:postgresql:";
  private static final String HOST = "localhost";
  private static final int PORT = 5432;
  private static final String DATABASE = "exercises";
  private static final String USER = "exercises";
  private static final String PASSWORD = "super_secret_database_password";

  private static String getUrl() {
    if(System.getenv("JDBC_DATABASE_URL") != null) {
      return System.getenv("JDBC_DATABASE_URL");
    }
    return PROTOCOL + "//" + HOST + ":" + PORT + "/" + DATABASE;
  }

  private static String getUsername() {
    if(System.getenv("JDBC_DATABASE_USERNAME") != null) {
      return System.getenv("JDBC_DATABASE_USERNAME");
    }
    return USER;
  }
  private static String getPassword() {
    if(System.getenv("JDBC_DATABASE_PASSWORD") != null) {
      return System.getenv("JDBC_DATABASE_PASSWORD");
    }
    return PASSWORD;
  }

  public static Connection getConnection() {
    Sql2o sql2o = new Sql2o(getUrl(), getUsername(), getPassword());
    return sql2o.open();
  }
  public static void migrate() {
    Flyway flyway = new Flyway();
    flyway.setDataSource(getUrl(), getUsername(), getPassword());
    flyway.migrate();
  }

}

