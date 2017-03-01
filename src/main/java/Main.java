import services.ExerciseService;
import services.ExerciseService.Exercise;

import java.util.Date;
import java.util.Optional;

public class Main {
  public static void main(String[] args) {
    Optional<Exercise> createdExercise = ExerciseService
      .createExercise(new Exercise("foo", "bar", 1, new Date()));


    ExerciseService.getExercises()
      .stream()
      .forEach(exercise -> System.out.println(exercise.description));
  }
}
