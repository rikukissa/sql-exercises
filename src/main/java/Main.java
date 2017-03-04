import controllers.*;
import controllers.utils.Response;

import static spark.Spark.after;
import static spark.Spark.get;
import static spark.Spark.notFound;

public class Main {

  public static void main(String[] args) {
    get("/hello", (req, res) -> "Hello World");

    ExerciseController.init();
    SessionController.init();

    after((request, response) -> response.type("application/json"));

    notFound((req, res) -> Response.notFound(res));
  }
}
