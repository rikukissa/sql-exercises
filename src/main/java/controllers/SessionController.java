package controllers;

import static services.UserService.getUserByStudentNumber;
import static spark.Spark.*;

import controllers.utils.Request;
import controllers.utils.Response;
import services.UserService.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static services.SessionService.*;
import static services.SessionTryService.*;

public class SessionController {

  public static void init() {
    path("/sessions", () -> {

      before("", Request::requiresAuthentication);
      before("/*", Request::requiresAuthentication);

      /*
       * Get all sessions
       */

      get("", (req, res) -> {
        int id = Integer.parseInt(req.queryParams("user"));

        boolean isOwner =
          Request.getUserId(req) == id ||
          !Request.hasOneOfRoles(req, Arrays.asList(User.TEACHER, User.ADMIN));

        if(!isOwner) {
          return Response.unauthorized(res);
        }

        List<Session> sessions = getSessionsByUser(id);

        List<Session> response = sessions.stream().map(session -> {
          session.populateSessionTries(getSessionTriesBySession(session.id));
          return session;
        })
        .collect(Collectors.toList());

        return Response.ok(res, response);
      });


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

        String studentNumber = Request.getStudentNumber(req);
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
