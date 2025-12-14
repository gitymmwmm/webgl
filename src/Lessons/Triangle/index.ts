import { lesson, type LessonRunner } from "../../utils";
import fragShaderSource from "./shader.frag";
import vertShaderSource from "./shader.vert";

const runner: LessonRunner = ({ gl, clear, rafLoop }) => {
  rafLoop(() => {
    // Очистка экрана
    clear([0.0, 0.0, 0.0, 1.0]);
    // Рисуем точку в центре экрана
    gl.drawArrays(gl.POINTS, 0, 1);
  });
};

export const lesson2 = lesson({
  title: "Урок 2: Треугольники",
  fragShaderSource,
  vertShaderSource,
  runner,
});
