import { lesson, type LessonRunner } from "../lesson";
import fragShaderSource from "./shaders/point.frag";
import vertShaderSource from "./shaders/point.vert";

const runner: LessonRunner = ({ gl, clear, rafLoop }) => {
  rafLoop(() => {
    // Очистка экрана
    clear([0.0, 0.0, 0.0, 1.0]);
    // Рисуем точку в центре экрана
    gl.drawArrays(gl.POINTS, 0, 1);
  });
};

export const lesson1 = lesson({
  title: "Урок 1: Точки",
  fragShaderSource,
  vertShaderSource,
  runner,
});
