import com.google.gson.JsonSyntaxException;
import controllers.*;
import controllers.utils.Response;
import services.DatabaseService;

import static spark.Spark.*;

public class Main {

  public static void main(String[] args) {
    DatabaseService.migrate();

    port(getHerokuAssignedPort());

    staticFiles.location("/build");

    get("/hello", (req, res) -> "Hello World");

    options("/*", (request, response) -> "OK");

    before((request, response) -> {
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      response.type("application/json");
    });

    ExerciseController.init();
    ExerciseListController.init();
    SessionController.init();
    UserController.init();
    SessionTryController.init();

    exception(JsonSyntaxException.class, (exception, request, response) ->
      Response.badRequest(response)
    );

    notFound((req, res) -> Response.notFound(res));
  }
  static int getHerokuAssignedPort() {
    ProcessBuilder processBuilder = new ProcessBuilder();
    if (processBuilder.environment().get("PORT") != null) {
      return Integer.parseInt(processBuilder.environment().get("PORT"));
    }
    return 4567; //return default port if heroku-port isn't set (i.e. on localhost)
  }

}
