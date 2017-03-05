package controllers;

import static services.UserService.getUserByStudentNumber;
import static spark.Spark.*;

import controllers.utils.Request;
import controllers.utils.Response;
import services.UserService.*;

import static services.SessionService.*;

public class SessionController {

  public static void init() {
    path("/sessions", () -> {

      before("/*", Request::requiresAuthentication);


      /*
      * Get session by id
      */

      get("/:id", (req, res) -> {
        int id = Integer.parseInt(req.params(":id"));
        return Response.ok(res, getSessionById(id));
      });

      exception(NumberFormatException.class, (exception, request, response) ->
        Response.badRequest(response)
      );

      exception(SessionNotFound.class, (exception, request, response) ->
        Response.notFound(response)
      );

      /*
      * Create new session
      */

      post("",  (req, res) -> {
        Session session = Request.getBodyAs(req.body(), Session.class);

        String studentNumber = Request.getAuthIdentifier(req);
        User user = getUserByStudentNumber(studentNumber);

        session.user = user.id;

        Session createdSession = createSession(session);
        return Response.created(res, createdSession);
      });

      exception(SessionNotCreated.class, (exception, request, response) ->
        Response.internalServerError(response)
      );
    });
  }
}
