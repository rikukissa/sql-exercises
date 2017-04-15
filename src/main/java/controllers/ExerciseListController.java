package controllers;

import static spark.Spark.*;

import controllers.utils.Request;
import controllers.utils.Response;
import services.ExerciseListService;
import services.ExerciseService;
import services.UserService;
import static services.ExerciseService.*;

import java.util.Arrays;

import static services.ExerciseListService.*;

public class ExerciseListController {

  public static void init() {
    path("/exercise-lists", () -> {
      post("/:id/exercises", (req, res) -> {
        int id = Integer.parseInt(req.params(":id"));
        Request.requiresAuthentication(req, res);
        Request.requiresRole(req, res, Arrays.asList(UserService.User.TEACHER, UserService.User.ADMIN));
        ExerciseList exerciseList = ExerciseListService.getExerciseListById(id);
        if(exerciseList.creator != Request.getUserId(req)) {
          return Response.unauthorized(res);
        }
        Exercise exercise = Request.getBodyAs(req.body(), Exercise.class);
        ExerciseList updatedExerciseList = ExerciseListService.addExerciseToExerciseList(exercise, exerciseList);

        return Response.created(res, updatedExerciseList);
      });
      /*
       * Get all exercise lists
       */

      get("", (req, res) -> Response.ok(res, getExerciseLists()));

      /*
       * Get exercise list by id
       */

      get("/:id", (req, res) -> {
        int id = Integer.parseInt(req.params(":id"));
        return Response.ok(res, getExerciseListById(id));
      });

      get("/:id/exercises", (req, res) -> {
        int id = Integer.parseInt(req.params(":id"));
        return Response.ok(res, getExerciseListExercisesById(id));
      });

      exception(NumberFormatException.class, (exception, request, response) ->
        Response.badRequest(response)
      );

      exception(ExerciseListNotFound.class, (exception, request, response) ->
        Response.notFound(response)
      );

      /*
       * Create new exerciselist
       */
      post("",  (req, res) -> {
        Request.requiresAuthentication(req, res);
        Request.requiresRole(req, res, Arrays.asList(UserService.User.TEACHER, UserService.User.ADMIN));
        ExerciseList exerciseList = Request.getBodyAs(req.body(), ExerciseList.class);
        exerciseList.creator = Request.getUserId(req);
        ExerciseList createdExerciseList = createExerciseList(exerciseList);
        return Response.created(res, createdExerciseList);
      });

      exception(ExerciseListNotCreated.class, (exception, request, response) ->
        Response.internalServerError(response)
      );
    });
  }
}
