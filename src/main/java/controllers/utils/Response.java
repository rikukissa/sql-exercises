package controllers.utils;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.opencsv.CSVWriter;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Response  {

  static public String toJson(Object src) {
    Gson gson = new GsonBuilder()
      .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
      .create();

    return gson.toJson(src);
  }

  static public String toCSV(List<Map<String,Object>> src) throws IOException {
    StringWriter s = new StringWriter();
    CSVWriter writer = new CSVWriter(s, CSVWriter.DEFAULT_SEPARATOR, CSVWriter.NO_QUOTE_CHARACTER);

    Set<String> keys = src.get(0).keySet();


    writer.writeNext(keys.toArray(new String[keys.size()]));

    src.stream().forEach(row -> {
      String[] values = row.values().stream().map(a -> a == null ? "" : a.toString()).collect(Collectors.toList()).toArray(new String[row.values().size()]);
      writer.writeNext(values);
    });

    writer.close();
    return s.toString();
  }

  public static HashMap error(String err) {
    HashMap error = new HashMap<String, String>();
    error.put("error", err);
    return error;
  }

  public static HashMap errorWithType(String err, String type) {
    HashMap error = error(err);
    error.put("type", type);
    return error;
  }

  public static String internalServerError(Exception err, spark.Response res) {
    String body = toJson(error("Internal server error: " + err.getMessage()));
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

  public static String badRequest(Exception err, spark.Response res) {
    String body = toJson(error("Bad request: " + err.getMessage()));
    res.status(400);
    res.body(body);
    return body;
  }

  public static String badRequest(String message, spark.Response res) {
    String body = toJson(error(message));
    res.status(400);
    res.body(body);
    return body;
  }

  public static String badRequestWithType(Exception err, spark.Response res, String type) {
    String body = toJson(errorWithType(err.getMessage(), type));
    res.status(400);
    res.body(body);
    return body;
  }

  public static String badRequestWithType(String message, spark.Response res, String type) {
    String body = toJson(errorWithType(message, type));
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

  public static String notFound(Exception err, spark.Response res) {
    String body = toJson(error("Not found: " + err.getMessage()));
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

  public static String csvOk(spark.Response res, List<Map<String,Object>> result) throws IOException {
    res.type("text/csv");
    String body = toCSV(result);
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