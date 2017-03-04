package services;

import fj.Try;
import fj.data.Either;
import fj.data.Option;
import fj.function.Try0;
import org.sql2o.Connection;

import java.util.Date;
import java.util.List;

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

  public static Either<Exception, List<Exercise>> getExercises() {
    String sql = "SELECT * FROM exercise";

    Try0<List<Exercise>, Exception> t = () -> {
      try(Connection con = DatabaseService.getConnection()) {
        List<Exercise> exercises = con
          .createQuery(sql)
          .addColumnMapping("created_at", "createdAt")
          .executeAndFetch(Exercise.class);
        return exercises;
      }
    };

    return Try.f(t).f().toEither();
  }

  public static Either<Exception, Option<Exercise>> getExerciseById(int id) {
    String sql = "SELECT * FROM exercise where id = :id";

    Try0<Option<Exercise>, Exception> t = () -> {

      try(Connection con = DatabaseService.getConnection()) {
        List<Exercise> exercises = con
          .createQuery(sql)
          .addParameter("id", id)
          .addColumnMapping("created_at", "createdAt")
          .executeAndFetch(Exercise.class);

        if(exercises.size() == 0) {
          return Option.none();
        }

        return Option.some(exercises.get(0));
      }

    };

    return Try.f(t).f().toEither();
  }

  public static Either<Exception,  Option<Exercise>> createExercise(Exercise exercise) {
    String sql = "INSERT INTO exercise (description, type, creator, created_at) " +
                 "values (:description, :type, :creator, :createdAt)";

    Try0<Integer, Exception> t = () -> {
      try(Connection con = DatabaseService.getConnection()) {
        return con
          .createQuery(sql, true)
          .bind(exercise)
          .executeUpdate()
          .getKey(int.class);
      }
    };

    return Try.f(t).f().toEither()
      .right().bind(ExerciseService::getExerciseById);
  }
}

