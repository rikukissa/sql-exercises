package services;

import org.sql2o.Connection;
import java.util.Date;
import java.util.List;

public class ExerciseService {
  public class Exercise {
    public int id;
    public String description;
    public String type;
    public Integer creator;
    public Date createdAt;
  }

  public static List<Exercise> getExercises() {
    String sql = "SELECT * from exercise";

    try(Connection con = DatabaseService.getConnection()) {
      List<Exercise> exercises = con
        .createQuery(sql)
        .addColumnMapping("created_at", "createdAt")
        .executeAndFetch(Exercise.class);
      return exercises;
    }
  }
}