package controllers;

import controllers.utils.Request;
import controllers.utils.Response;

import static services.SessionTryService.*;
import static services.SessionService.*;
import static services.UserService.*;
import static services.UserService.getUserByStudentNumber;

import static spark.Spark.*;

public class  SessionTryController {

  public static void init() {
    path("/session-tries", () -> {

      before("", Request::requiresAuthentication);
      before("/*", Request::requiresAuthentication);


      /*
      * Create new session try
      */

      post("",  (req, res) -> {
        SessionTry sessionTry = Request.getBodyAs(req.body(), SessionTry.class);

        String studentNumber = Request.getStudentNumber(req);
        User user = getUserByStudentNumber(studentNumber);

        SessionTry createdSessionTry = answerExercise(sessionTry, user);
        return Response.created(res, createdSessionTry);
      });

      exception(SessionNotFound.class, (exception, request, response) ->
        Response.notFound(exception, response)
      );

      exception(SessionNotCreated.class, (exception, request, response) ->
        Response.internalServerError(exception, response)
      );

      exception(SQLError.class, (exception, request, response) ->
        Response.badRequestWithType(exception.getMessage(), response, "sql")
      );

      exception(SessionTriesExceeded.class, (exception, request, response) ->
        Response.badRequestWithType(exception, response, "tries exceeded")
      );

      exception(SessionTrySyntaxError.class, (exception, request, response) ->
        Response.badRequestWithType(exception, response, "syntax")
      );

    });
  }
}
