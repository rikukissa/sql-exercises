import com.google.gson.Gson;
import fj.data.Either;
import fj.data.Option;
import org.sql2o.Sql2oException;
import services.ExerciseService;
import services.ExerciseService.Exercise;
import spark.ResponseTransformer;

import java.util.Date;
import java.util.List;


import static spark.Spark.*;

public class Main {
  static public class ResponseError  {
    private String message;
    private int httpStatus;

    public ResponseError(String message, int httpStatus) {
      this.message = message;
      this.httpStatus = httpStatus;
    }

    public ResponseError(Exception e, int httpStatus) {
      this.message = e.getMessage();
      this.httpStatus = httpStatus;
    }

    public String getMessage() {
      return this.message;
    }

    public int getHttpStatus() {
      return this.httpStatus;
    }
  }

  static public class Response  {
    public static <T extends Object> Object fromEither(Either<ResponseError, T> either) {
      if(either.isRight()) {
        return either.right().value();
      }

      either.left().forEach(err -> halt(err.getHttpStatus(), err.getMessage()));
      return either.left().value();
    }
  }
  public static void main(String[] args) {
    Gson gson = new Gson();

    get("/hello", (req, res) -> "Hello World");
    get("/exercises", (req, res) -> ExerciseService.getExercises(), gson::toJson);
    post("/exercises",  (req, res) -> {

      Exercise exercise = new Exercise("foo", "bar", 1, new Date());

      Either<ResponseError, Exercise> createdExercise =
        ExerciseService.createExercise(exercise)
        .left().map(err -> new ResponseError(err, 500))
        .right().bind(exerciseOpt -> exerciseOpt.toEither(new ResponseError("Not found", 404)));

      return Response.fromEither(createdExercise);

    }, gson::toJson);

    after((request, response) -> {
      response.type("application/json");
    });
  }
}
