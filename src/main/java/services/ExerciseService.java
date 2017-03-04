package services;

import org.sql2o.Connection;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class ExerciseService {
  public static class ExerciseNotFound extends Exception {}
  public static class ExerciseNotCreated extends Exception {}
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

  public static List<Exercise> getExercises(List<Integer> ids) {
    String sql = "SELECT * FROM exercise WHERE id IN (:ids)";

    try(Connection con = DatabaseService.getConnection()) {

      List<Exercise> exercises = con
        .createQuery(sql)
        .addParameter("ids", ids)
        .addColumnMapping("created_at", "createdAt")
        .executeAndFetch(Exercise.class);

      return exercises;
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

  public static Exercise getExerciseById(int id) throws ExerciseNotFound {
    String sql = "SELECT * FROM exercise where id = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<Exercise> exercises = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("created_at", "createdAt")
        .executeAndFetch(Exercise.class);

      if(exercises.size() == 0) {
        throw new ExerciseNotFound();
      }

      return exercises.get(0);
    }
  }

  public static Exercise createExercise(Exercise exercise) throws ExerciseNotCreated {
    String sql = "INSERT INTO exercise (description, type, creator, created_at) " +
                 "values (:description, :type, :creator, :createdAt)";

    try(Connection con = DatabaseService.getConnection()) {
      int id = con
        .createQuery(sql, true)
        .bind(exercise)
        .executeUpdate()
        .getKey(int.class);
      try {
        return ExerciseService.getExerciseById(id);
      } catch (ExerciseNotFound err) {
        throw new ExerciseNotCreated();
      }
    }
  }
}

