package controllers;

import static spark.Spark.*;

import controllers.utils.Request;
import controllers.utils.Response;
import services.UserService;

import java.util.Arrays;

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
      before("", Request::requiresAuthentication);
      post("",  (req, res) -> {
        Request.requiresRole(req, res, Arrays.asList(UserService.User.TEACHER, UserService.User.ADMIN));
        Exercise exercise = Request.getBodyAs(req.body(), Exercise.class);
        exercise.creator = Request.getUserId(req);
        Exercise createdExercise = createExercise(exercise);
        return Response.created(res, createdExercise);
      });
      post("/:id/example-answers", (req, res) -> {
        Request.requiresRole(req, res, Arrays.asList(UserService.User.TEACHER, UserService.User.ADMIN));
        ExampleAnswer exampleAnswer = Request.getBodyAs(req.body(), ExampleAnswer.class);
        int id = Integer.parseInt(req.params(":id"));
        exampleAnswer.exercise = id;
        return Response.created(res, createExampleAnswer(exampleAnswer));
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
