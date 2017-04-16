package controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import controllers.utils.Request;
import controllers.utils.Response;

import java.util.*;

import static services.UserService.*;
import static spark.Spark.*;
import static spark.Spark.exception;
import static spark.Spark.post;

public class UserController {

  private static class LoginCredentials {
    public String studentNumber;
  }
  private static class Token {
    public String token;
    public Token(String token) {
      this.token = token;
    }
  }

  public static void init() {

    post("/login", (req, res) -> {
      LoginCredentials credentials = Request.getBodyAs(req.body(), LoginCredentials.class);

      User user;
      try {
        user = getUserByStudentNumber(credentials.studentNumber);
      } catch (UserNotFound err) {
        return Response.unauthorized(res);
      }

      Map<String, Object> headerClaims = new HashMap<>();
      headerClaims.put("id", user.id);
      headerClaims.put("role", user.role);
      headerClaims.put("studentNumber", user.studentNumber);

      String token = JWT.create()
        .withHeader(headerClaims)
        .sign(Algorithm.HMAC256("SUPER_SECRET"));

      return Response.ok(res, new Token(token));
    });

    path("/users", () -> {

      /*
       * User report
       */

      get("/report", (req, res) -> Response.csvOk(res, getUserReport()));

      before("", Request::requiresAuthentication);

      /*
      * Get all users
      */

      get("", (req, res) -> {
        Request.requiresRole(req, res, Arrays.asList(User.TEACHER, User.ADMIN));
        if(Request.getRole(req).equals(User.TEACHER)) {
          return Response.ok(res, getUsersWithSessionsForCreator(Request.getUserId(req)));
        }

        return Response.ok(res, getUsers());
      });

      /*
       * Create new user
       */

      post("",  (req, res) -> {
        User session = Request.getBodyAs(req.body(), User.class);
        User createdUser = createUser(session);
        return Response.created(res, createdUser);
      });

      exception(UserNotCreated.class, (exception, request, response) ->
              Response.internalServerError(response)
      );

      /*
      * Get currently logged in user
      */

      before("/me", Request::requiresAuthentication);
      get("/me", (req, res) -> {
        String studentNumber = Request.getStudentNumber(req);
        return Response.ok(res, getUserByStudentNumber(studentNumber));
      });

      /*
      * Get specific user
      */


      get("/:id", (req, res) -> {
        Request.requiresAuthentication(req, res);
        int id = Integer.parseInt(req.params(":id"));
        return Response.ok(res, getUserById(id));
      });

      exception(NumberFormatException.class, (exception, request, response) ->
        Response.badRequest(response)
      );

      exception(UserNotFound.class, (exception, request, response) ->
        Response.notFound(response)
      );

    });
  }
}
