import com.google.gson.*;
import fj.data.Either;
import fj.data.Option;
import services.ExerciseService;
import services.ExerciseService.Exercise;

import static spark.Spark.*;

public class Main {

  public static void main(String[] args) {
    Gson gson = new Gson();

    get("/hello", (req, res) -> "Hello World");

    get("/exercises", (req, res) -> Response.fromEither(
      ExerciseService.getExercises().left().map(err -> Response.internalServerError(err))
    ), Response::toJson);

    post("/exercises",  (req, res) -> {

      // Parse Exercise model instance from request body
      Option<Exercise> exerciseOpt = Request.getBodyAs(req.body(), Exercise.class);

      Either<Response.ResponseError, Exercise> createdExercise =
        // "Invalid request" response if received body cannot be parsed
        exerciseOpt.toEither(Response.invalidRequest())
        // Try saving exercise to database
        .right().bind(exercise -> ExerciseService.createExercise(exercise)
        // Send "Internal server error" if saving fails
        .left().map(err -> Response.internalServerError(err))
        // Send "Not found" if exercise isn't found after saving
        .right().bind(exerOpt -> exerOpt.toEither(Response.notFound())));

      return Response.fromEither(createdExercise);

    }, Response::toJson);

    after((request, response) -> {
      response.type("application/json");
    });
  }
}
