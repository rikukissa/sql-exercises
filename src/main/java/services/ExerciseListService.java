package services;

import org.sql2o.Connection;

import java.util.Date;
import java.util.List;

public class ExerciseListService {
  public static class ExerciseListNotFound extends Exception {}
  public static class ExerciseListNotCreated extends Exception {}
  public static class ExerciseList {
    public int id;
    public String description;
    public int exerciseAmount;
    public Date createdAt;

    public ExerciseList(String description, Date createdAt) {
      this.description = description;
      this.createdAt = createdAt;
    }
  }

  public static List<ExerciseList> getExerciseLists() {
    String sql = "SELECT * FROM exercise";

    try(Connection con = DatabaseService.getConnection()) {
      List<ExerciseList> exercises = con
        .createQuery(sql)
        .addColumnMapping("created_at", "createdAt")
        .addColumnMapping("exercise_amount", "exerciseAmount")
        .executeAndFetch(ExerciseList.class);
      return exercises;
    }
  }

  public static ExerciseList getExerciseListById(int id) throws ExerciseListNotFound {
    String sql = "SELECT * FROM exercise where id = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<ExerciseList> exercisesLists = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("exercise_amount", "exerciseAmount")
        .executeAndFetch(ExerciseList.class);

      if(exercisesLists.size() == 0) {
        throw new ExerciseListNotFound();
      }

      return exercisesLists.get(0);
    }
  }

  public static ExerciseList createExerciseList(ExerciseList exercise) throws ExerciseListNotCreated {
    String sql = "INSERT INTO exercise (description, type, creator, created_at) " +
            "values (:description, :type, :creator, :createdAt)";

    try(Connection con = DatabaseService.getConnection()) {
      int id = con
        .createQuery(sql, true)
        .bind(exercise)
        .executeUpdate()
        .getKey(int.class);

      return ExerciseListService.getExerciseListById(id);
    } catch (ExerciseListNotFound err) {
      throw new ExerciseListNotCreated();
    }
  }
}

