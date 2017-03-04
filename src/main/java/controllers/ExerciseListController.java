package controllers;

import static spark.Spark.*;

import controllers.utils.Request;
import controllers.utils.Response;

import static services.ExerciseListService.*;

public class ExerciseListController {

  public static void init() {
    path("/exercise-lists", () -> {

      /*
       * Get all exercise lists
       */

      get("/", (req, res) -> Response.ok(res, getExerciseLists()));

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
      * Create new session
      */

      post("",  (req, res) -> {
        ExerciseList session = Request.getBodyAs(req.body(), ExerciseList.class);
        ExerciseList createdExerciseList = createExerciseList(session);
        return Response.created(res, createdExerciseList);
      });

      exception(ExerciseListNotCreated.class, (exception, request, response) ->
        Response.internalServerError(response)
      );
    });
  }
}
