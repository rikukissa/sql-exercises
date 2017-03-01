import services.ExerciseService;

public class Main {
  public static void main(String[] args) {
    ExerciseService.getExercises()
      .stream()
      .forEach(exercise -> System.out.println(exercise.description));
  }
}
