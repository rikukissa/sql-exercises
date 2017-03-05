package services;

import org.sql2o.Connection;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class ExerciseService {
  public static class ExerciseNotFound extends Exception {
    public ExerciseNotFound() {
      super("Exercise not found");
    }
  }
  public static class ExerciseNotCreated extends Exception {
    public ExerciseNotCreated() {
      super("Exercise was not created because of an internal error");
    }
  }

  private static class ExampleAnswer {
    public int exercise;
    public String answer;
  }
  public static class Exercise {
    public int id;
    public String description;
    public String type;
    public Integer creator;
    public Date createdAt;
    public List<String> exampleAnswers;

    public Exercise(String description, String type, Integer creator, Date createdAt) {
      this.description = description;
      this.type = type;
      this.creator = creator;
      this.createdAt = createdAt;
    }

    public void setExampleAnswers(List<String> answers) {
      this.exampleAnswers = answers;
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

      Exercise exercise = exercises.get(0);

      List<String> exampleAnswers = con
        .createQuery("SELECT * FROM example_answer where exercise = :exercise")
        .addParameter("exercise", exercise.id)
        .executeAndFetch(ExampleAnswer.class)
        .stream()
        .map(ea -> ea.answer)
        .collect(Collectors.toList());

      exercise.setExampleAnswers(exampleAnswers);

      return exercise;
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

