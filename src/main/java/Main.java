import controllers.*;

import static spark.Spark.after;
import static spark.Spark.get;

public class Main {

  public static void main(String[] args) {
    get("/hello", (req, res) -> "Hello World");

    ExerciseController.init();

    after((request, response) -> response.type("application/json"));
  }
}
