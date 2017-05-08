package services.utils;

import java.io.IOException;
import java.util.Scanner;

public class FileReader {
  public static String getContent(String path) throws IOException {
    return new Scanner(Thread.currentThread().getContextClassLoader().getResource(path).openStream()).useDelimiter("\\Z").next();
  }
}

