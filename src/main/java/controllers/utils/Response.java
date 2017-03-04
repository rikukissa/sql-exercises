package controllers.utils;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import fj.data.Either;

import java.util.HashMap;
import java.util.Map;

public class Response  {

  static public String toJson(Object src) {
    Gson gson = new GsonBuilder()
      .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
      .create();

    return gson.toJson(src);
  }
  static public class Reply {
    private String message;
    private int httpStatus;

    public Reply(Object message, int httpStatus) {
      this.message = toJson(message);
      this.httpStatus = httpStatus;
    }

    public Reply(String message, int httpStatus) {
      Map<String, String> response = new HashMap<>();
      response.put("message", message);
      this.message = toJson(response);
      this.httpStatus = httpStatus;
    }

    public Reply(Exception e, int httpStatus) {
      this(e.getMessage(), httpStatus);
    }

    public String getMessage() {
      return this.message;
    }
    public int getHttpStatus() {
      return this.httpStatus;
    }
  }

  public static Reply internalServerError(Exception err) {
    return new Reply(err, 500);
  }
  public static Reply internalServerError() {
    return new Reply("Internal server error", 500);
  }
  public static Reply invalidRequest() {
    return new Reply("Invalid request", 400);
  }
  public static Reply notFound() {
    return new Reply("Not found", 404);
  }

  public static Reply ok(Object result) {
    return new Reply(result, 200);
  }
  public static Reply created(Object result) {
    return new Reply(result, 201);
  }

  public static <E extends Exception, T extends Object> Object fromEither(spark.Response response, Either<E, T> either) {
    return fromHandledEither(
      response,
      either
        .left().map(Response::internalServerError)
        .right().map(Response::ok)
    );
  }

  public static Object fromHandledEither(spark.Response response, Either<Reply, Reply> either) {
    either.left().forEach(reply -> response.status(reply.getHttpStatus()));
    either.right().forEach(reply -> response.status(reply.getHttpStatus()));

    if(either.isLeft()) {
      return either.left().value().getMessage();
    } else {
      return either.right().value().getMessage();
    }
  }
}