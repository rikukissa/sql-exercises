package controllers.utils;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.HashMap;

public class Response  {

  static public String toJson(Object src) {
    Gson gson = new GsonBuilder()
      .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
      .create();

    return gson.toJson(src);
  }
  public static HashMap error(String err) {
    HashMap error = new HashMap<String, String>();
    error.put("error", err);
    return error;
  }

  public static String internalServerError(spark.Response res, Exception err) {
    String body = toJson(error(err.getMessage()));
    res.status(500);
    res.body(body);
    return body;
  }

  public static String internalServerError(spark.Response res) {
    String body = toJson(error("Internal server error"));
    res.status(500);
    res.body(body);
    return body;
  }
  public static String badRequest(spark.Response res) {
    String body = toJson(error("Bad request"));
    res.status(400);
    res.body(body);
    return body;
  }
  public static String notFound(spark.Response res) {
    String body = toJson(error("Not found"));
    res.status(404);
    res.body(body);
    return body;
  }

  public static String unauthorized(spark.Response res) {
    String body = toJson(error("Unauthorized"));
    res.status(401);
    res.body(body);
    return body;
  }

  public static <T extends Object> String ok(spark.Response res, T result) {
    String body = toJson(result);
    res.status(200);
    res.body(body);
    return body;
  }

  public static <T extends Object> String created(spark.Response res, T result) {
    String body = toJson(result);
    res.status(201);
    res.body(body);
    return body;
  }
}