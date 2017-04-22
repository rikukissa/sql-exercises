package services;

import org.sql2o.Connection;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Map;
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

  public static class ExampleAnswer {
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

  public static List<Map<String,Object>> getExerciseReport() throws IOException {
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();

    List<String> lines = Files.readAllLines(
      Paths.get(classLoader.getResource("reports/2.sql").getPath()),
      StandardCharsets.UTF_8
    );
    String sql = String.join("\n", lines);

    try(Connection con = DatabaseService.getConnection()) {
      List<Map<String,Object>> report = con
        .createQuery(sql)
        .executeAndFetchTable()
        .asList();
      return report;
    }
  }

  public static List<Map<String,Object>> getExerciseByTypeReport() throws IOException {
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();

    List<String> lines = Files.readAllLines(
      Paths.get(classLoader.getResource("reports/3.sql").getPath()),
      StandardCharsets.UTF_8
    );
    String sql = String.join("\n", lines);

    try(Connection con = DatabaseService.getConnection()) {
      List<Map<String,Object>> report = con
        .createQuery(sql)
        .executeAndFetchTable()
        .asList();
      return report;
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
    String sql = "INSERT INTO exercise (description, type, creator) " +
                 "values (:description, :type, :creator)";

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

  public static ExampleAnswer createExampleAnswer(ExampleAnswer exampleAnswer, int id) throws ExerciseNotFound {
    if(getExerciseById(id) == null) {
      throw new ExerciseNotFound();
    }
    String sql = "INSERT INTO example_answer (exercise, answer) values (:exercise, :answer)";
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .bind(exampleAnswer)
        .executeUpdate();
    }
    return exampleAnswer;
  }

  public static Exercise modifyExercise(Exercise exercise, int eId) throws ExerciseNotFound {
    String desc = exercise.description;
    String type = exercise.type;
    String sql = "UPDATE exercise SET description = :description, type = :type WHERE id = :id";
    if(getExerciseById(eId) == null) {
      throw new ExerciseNotFound();
    }
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .addParameter("id", eId)
        .addParameter("description", desc)
        .addParameter("type", type)
        .executeUpdate();
    }
    return exercise;
  }

  public static ExampleAnswer modifyExampleAnswer(ExampleAnswer exampleAnswer, int eId) throws ExerciseNotFound {
    String answer = exampleAnswer.answer;
    String sql = "UPDATE example_answer SET answer = :answer WHERE exercise = :exercise";
    if(getExerciseById(eId) == null) {
      throw new ExerciseNotFound();
    }
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .addParameter("exercise", eId)
        .addParameter("answer", answer)
        .executeUpdate();
    }
    return exampleAnswer;
  }

  public static void deleteExercise(Exercise exercise, int elId) throws ExerciseNotFound {
    String sql = "DELETE FROM exercise WHERE id = :id";
    if(getExerciseById(elId) == null) {
      throw new ExerciseNotFound();
    }
    try(Connection con = DatabaseService.getConnection()) {
      con
        .createQuery(sql)
        .addParameter("id", elId)
        .executeUpdate();
    }
  }
}

