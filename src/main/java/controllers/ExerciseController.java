package controllers;

import static spark.Spark.*;

import controllers.utils.Request;
import controllers.utils.Response;

import static services.ExerciseService.*;

public class ExerciseController {

  public static void init() {
    path("/exercises", () -> {

      /*
       * Get all exercises
       */

      get("", (req, res) -> Response.ok(res, getExercises()));

      /*
       * Create new exercise
       */

      post("",  (req, res) -> {
        Exercise exercise = Request.getBodyAs(req.body(), Exercise.class);
        Exercise createdExercise = createExercise(exercise);
        return Response.created(res, createdExercise);
      });

      exception(ExerciseNotCreated.class, (exception, request, response) ->
        Response.internalServerError(response)
      );
    });

  }
}
