package controllers;

import static spark.Spark.*;

import services.ExerciseService;
import services.ExerciseService.Exercise;
import controllers.utils.Response;
import controllers.utils.Request;

public class ExerciseController {

  public static void init() {
    path("/exercises", () -> {

      /*
       * Get all exercises
       */

      get("", (req, res) -> Response.ok(res, ExerciseService.getExercises()));

      /*
       * Create new exercise
       */

      post("",  (req, res) -> {
        Exercise exercise = Request.getBodyAs(req.body(), ExerciseService.Exercise.class);
        Exercise createdExercise = ExerciseService.createExercise(exercise);
        return Response.created(res, createdExercise);
      });
    });

  }
}
