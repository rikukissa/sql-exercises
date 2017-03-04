package controllers;

import fj.data.Either;
import fj.data.Option;

import static spark.Spark.*;

import services.ExerciseService;
import controllers.utils.Response;
import controllers.utils.Request;

public class ExerciseController {

  public static void init() {
    path("/exercises", () -> {

      /*
       * Get all exercises
       */

      get("", (req, res) ->
        Response.fromEither(ExerciseService.getExercises())
      , Response::toJson);

      /*
       * Create new exercise
       */

      post("",  (req, res) -> {

        // Parse Exercise model instance from request body
        Option<ExerciseService.Exercise> exerciseOpt = Request.getBodyAs(req.body(), ExerciseService.Exercise.class);

        Either<Response.ResponseError, ExerciseService.Exercise> createdExercise =
          // "Invalid request" response if received body cannot be parsed
          exerciseOpt.toEither(Response.invalidRequest())
          // Try saving exercise to database
          .right().bind(exercise -> ExerciseService.createExercise(exercise)
          // Send "Internal server error" if saving fails
          .left().map(Response::internalServerError)
          // Send "Not found" if exercise isn't found after saving
          .right().bind(exerOpt -> exerOpt.toEither(Response.internalServerError())));

        return Response.fromHandledEither(createdExercise);

      }, Response::toJson);
    });

  }
}
