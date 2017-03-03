import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import fj.data.Either;

import static spark.Spark.halt;

/**
 * Created by rrou on 03/03/2017.
 */
public class Response  {

  static public String toJson(Object src) {
    Gson gson = new GsonBuilder()
      .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
      .create();

    return gson.toJson(src);
  }
  static public class ResponseError  {
    private String message;
    private int httpStatus;

    public ResponseError(String message, int httpStatus) {
      this.message = message;
      this.httpStatus = httpStatus;
    }

    public ResponseError(Exception e, int httpStatus) {
      this.message = e.getMessage();
      this.httpStatus = httpStatus;
    }

    public String getMessage() {
      return this.message;
    }

    public int getHttpStatus() {
      return this.httpStatus;
    }
  }

  public static ResponseError internalServerError(Exception err) {
    return new ResponseError(err.getMessage(), 500);
  }
  public static ResponseError invalidRequest() {
    return new ResponseError("Invalid request", 400);
  }
  public static ResponseError notFound() {
    return new ResponseError("Not found", 404);
  }
/*  public static <E extends Exception, T extends Object> Object fromEither(Either<E, T> either) {
    if(either.isRight()) {
      return either.right().value();
    }

    either.left().forEach(err -> halt(500, err.getMessage()));
    return either.left().value();
  }*/
  public static <T extends Object> Object fromEither(Either<ResponseError, T> either) {
    if(either.isRight()) {
      return either.right().value();
    }

    either.left().forEach(err -> halt(err.getHttpStatus(), err.getMessage()));
    return either.left().value();
  }
}