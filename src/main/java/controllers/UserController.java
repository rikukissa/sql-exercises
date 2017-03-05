package controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import controllers.utils.Request;
import controllers.utils.Response;

import java.util.HashMap;
import java.util.Map;

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
      User user = getUserByStudentNumber(credentials.studentNumber);

      Map<String, Object> headerClaims = new HashMap<>();
      headerClaims.put("studentNumber", user.studentNumber);

      String token = JWT.create()
        .withHeader(headerClaims)
        .sign(Algorithm.HMAC256("SUPER_SECRET"));

      return Response.ok(res, new Token(token));
    });

    path("/users", () -> {

      before("/*", Request::requiresAuthentication);

      /*
      * Get currently logged in user
      */

      get("/me", (req, res) -> {
        String studentNumber = Request.getAuthIdentifier(req);
        return Response.ok(res, getUserByStudentNumber(studentNumber));
      });

      /*
      * Get specific user
      */

      get("/:id", (req, res) -> {
        int id = Integer.parseInt(req.params(":id"));
        return Response.ok(res, getUserById(id));
      });

      exception(NumberFormatException.class, (exception, request, response) ->
        Response.badRequest(response)
      );

      exception(UserNotFound.class, (exception, request, response) ->
        Response.notFound(response)
      );

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
    });
  }
}
