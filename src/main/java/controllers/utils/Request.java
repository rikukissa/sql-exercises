package controllers.utils;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import fj.data.Option;

import java.lang.reflect.Type;

public class Request  {

  public static <T> Option<T> getBodyAs(String body, Type targetClass) {
    Gson gson = new GsonBuilder()
      .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
      .create();

    try {
      T parsed = gson.fromJson(body, targetClass);
      return Option.fromNull(parsed);
    } catch (JsonSyntaxException err) {
      return Option.none();
    }
  }

}