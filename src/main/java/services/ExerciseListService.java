package services;

import org.sql2o.Connection;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.sql2o.Sql2oException;
import services.utils.FileReader;

import static services.ExerciseService.*;

public class ExerciseListService {
  public static class ExerciseListNotFound extends Exception {}
  public static class ExerciseListNotCreated extends Exception {}

  private static class ExerciseListExercise {
    public int exercise;
    public int exerciseList;
  }

  public static class ExerciseList {
    public int id;
    public String description;
    public int exerciseAmount;
    public Date createdAt;
    public List<Exercise> exercises;
    public int creator;

    public ExerciseList(String description) {
      this.description = description;
    }

    public void setExercises(List<Exercise> exercises) {
      this.exercises = exercises;
    }
  }

  public static List<ExerciseList> getExerciseLists() {
    String sql = "SELECT * FROM exercise_list";

    try(Connection con = DatabaseService.getConnection()) {
      List<ExerciseList> exercises = con
        .createQuery(sql)
        .addColumnMapping("created_at", "createdAt")
        .addColumnMapping("exercise_amount", "exerciseAmount")
        .executeAndFetch(ExerciseList.class);
      return exercises;
    }
  }

  public static List<Exercise> getExerciseListExercisesById(int id) {
    String sql = "SELECT * FROM exercise_list_exercise where exercise_list = :id";

    try(Connection con = DatabaseService.getConnection()) {
      // Fetch exercises for the exercise list
      List<Integer> exerciseIds = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("exercise_list", "exerciseList")
        .executeAndFetch(ExerciseListExercise.class)
        .stream()
        .map(e -> e.exercise)
        .collect(Collectors.toList());

      List<Exercise> exercises = ExerciseService.getExercises(exerciseIds);
      return exercises;
    }
  }

  public static ExerciseList getExerciseListById(int id) throws ExerciseListNotFound {
    String sql = "SELECT * FROM exercise_list where id = :id";

    try(Connection con = DatabaseService.getConnection()) {
      List<ExerciseList> exercisesLists = con
        .createQuery(sql)
        .addParameter("id", id)
        .addColumnMapping("created_at", "createdAt")
        .addColumnMapping("exercise_amount", "exerciseAmount")
        .executeAndFetch(ExerciseList.class);

      if(exercisesLists.size() == 0) {
        throw new ExerciseListNotFound();
      }

      ExerciseList exerciseList = exercisesLists.get(0);

      List<Exercise> exercises = getExerciseListExercisesById(id);
      exerciseList.setExercises(exercises);

      return exerciseList;
    }
  }

  public static List<Map<String,Object>> getExerciseReport(int id) throws IOException {
    String sql = FileReader.getContent("reports/1.sql");

    try(Connection con = DatabaseService.getConnection()) {
      List<Map<String,Object>> report = con
        .createQuery(sql)
        .addParameter("exercise_list", id)
        .executeAndFetchTable()
        .asList();
      return report;
    }
  }

  public static ExerciseList createExerciseList(ExerciseList exercise) throws ExerciseListNotCreated {
    String sql = "INSERT INTO exercise_list (description, creator) values (:description, :creator)";

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

  public static ExerciseList addExerciseToExerciseList(Exercise exercise, ExerciseList exerciseList) throws Sql2oException {
    String sql = "INSERT INTO exercise_list_exercise (exercise, exercise_list) values (:exercise, :exercise_list)";
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .addParameter("exercise", exercise.id)
        .addParameter("exercise_list", exerciseList.id)
        .executeUpdate();
    }
    List<Exercise> exercises = getExerciseListExercisesById(exerciseList.id);
    exerciseList.setExercises(exercises);
    return exerciseList;
  }

  public static ExerciseList deleteExerciseFromExerciseList(Exercise exercise, ExerciseList exerciseList)
                throws ExerciseListNotFound, ExerciseNotFound {
    String sql = "DELETE FROM exercise_list_exercise WHERE exercise_list = :exercise_list AND exercise = :exercise";
    if(getExerciseListById(exerciseList.id) == null) {
      throw new ExerciseListNotFound();
    }
    if(getExerciseById(exercise.id) == null) {
      throw new ExerciseService.ExerciseNotFound();
    }
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .addParameter("exercise_list", exerciseList.id)
        .addParameter("exercise", exercise.id)
        .executeUpdate();
    }
    return exerciseList;
  }

  public static ExerciseList modifyExerciseList(ExerciseList exerciseList, int elId) {
    String sql = "UPDATE exercise_list SET description = :description WHERE id = :id";
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .addParameter("id", elId)
        .addParameter("description", exerciseList.description)
        .executeUpdate();
    }
    return exerciseList;
  }

  public static void deleteExerciseList(ExerciseList exerciseList, int elId) throws ExerciseListNotFound {
    String sql = "DELETE FROM exercise_list WHERE id = :id";
    if(getExerciseListById(elId) == null) {
      throw new ExerciseListNotFound();
    }
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .addParameter("id", elId)
        .executeUpdate();
    }
  }
}

