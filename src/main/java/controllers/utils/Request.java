package controllers.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.lang.reflect.Type;
import java.util.List;

import static spark.Spark.*;

public class Request  {

  public static <T> T getBodyAs(String body, Type targetClass) {
    Gson gson = new GsonBuilder()
      .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
      .create();

    return gson.fromJson(body, targetClass);
  }

  public static String getStudentNumber(spark.Request request) {
    String token = request.headers("Authorization");
    return JWT.decode(token).getHeaderClaim("studentNumber").asString();
  }

  public static String getRole(spark.Request request) {
    String token = request.headers("Authorization");
    return JWT.decode(token).getHeaderClaim("role").asString();
  }

  public static Integer getUserId(spark.Request request) {
    String token = request.headers("Authorization");
    return JWT.decode(token).getHeaderClaim("id").asInt();
  }

  public static void requiresRole(spark.Request request, spark.Response response, List<String> roles) {
    if(!roles.contains(getRole(request))) {
      halt(400, Response.unauthorized(response));
    }
  }

  public static Boolean hasOneOfRoles(spark.Request request, List<String> roles) {
    return roles.contains(getRole(request));
  }

  public static void requiresAuthentication(spark.Request request, spark.Response response) {
    if(request.requestMethod() == "OPTIONS") {
      return;
    }

    try {
      String token = request.headers("Authorization");
      JWT.decode(token);
      return;
    }
    catch (NullPointerException exception) {
      System.out.println(exception.getStackTrace());
    }
    catch (JWTDecodeException exception) {
      System.out.println("jwtdec");

    }

    halt(400, Response.unauthorized(response));
  }
}