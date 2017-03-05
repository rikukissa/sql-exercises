import controllers.*;
import controllers.utils.Response;

import static spark.Spark.*;

public class Main {

  public static void main(String[] args) {
    get("/hello", (req, res) -> "Hello World");

    options("/*", (request, response) -> {
      return "OK";
    });
    before((request, response) -> {
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      response.type("application/json");
    });

    ExerciseController.init();
    ExerciseListController.init();
    SessionController.init();
    UserController.init();


    notFound((req, res) -> Response.notFound(res));
  }
}
