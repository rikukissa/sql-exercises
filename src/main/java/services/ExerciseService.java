package services;

import org.postgresql.util.PSQLException;
import org.sql2o.Connection;
import org.sql2o.Sql2oException;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public class ExerciseService {
  public static class Exercise {
    public int id;
    public String description;
    public String type;
    public Integer creator;
    public Date createdAt;

    public Exercise(String description, String type, Integer creator, Date createdAt) {
      this.description = description;
      this.type = type;
      this.creator = creator;
      this.createdAt = createdAt;
    }
  }

  public static List<Exercise> getExercises() {
    String sql = "SELECT * FROM exercise";

    try(Connection con = DatabaseService.getConnection()) {
      List<Exercise> exercises = con
        .createQuery(sql)
        .addColumnMapping("created_at", "createdAt")
        .executeAndFetch(Exercise.class);
      return exercises;
    }
  }

  public static Optional<Exercise> getExerciseById(int id) {
    String sql = "SELECT * FROM exercise where id = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<Exercise> exercises = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("created_at", "createdAt")
        .executeAndFetch(Exercise.class);

      if(exercises.size() == 0) {
        return Optional.empty();
      }

      return Optional.of(exercises.get(0));
    }
  }

  public static Optional<Exercise> createExercise(Exercise exercise) {
    String sql = "INSERT INTO exercise (description, type, creator, created_at) " +
                 "values (:description, :type, :creator, :createdAt)";

    int insertedId;

    try(Connection con = DatabaseService.getConnection()) {
        insertedId = con
          .createQuery(sql, true)
          .bind(exercise)
          .executeUpdate()
          .getKey(int.class);

    } catch (Sql2oException err) {
      return Optional.empty();
    }
    
    return getExerciseById(insertedId);
  }
}

