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
       *
       */

      get("/:id/example-answers", (req, res) -> {
        int id = Integer.parseInt(req.params(":id"));
        return Response.ok(res, getExerciseById(id).exampleAnswers);
      });

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

      exception(ExerciseNotFound.class, (exception, request, response) ->
        Response.notFound(response)
      );

      exception(NumberFormatException.class, (exception, request, response) ->
        Response.badRequest(response)
      );
    });

  }
}
