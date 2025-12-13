import { checkAttrsAvailable } from "../../utils";
import { lesson, type LessonRunner } from "../Lesson";
import fragShaderSource from "./shaders/point.frag";
import vertShaderSource from "./shaders/point.vert";

const runLesson1: LessonRunner = ({ gl, program }) => {
  // Инициализируем uniform-attributes
  const uFrag = gl.getUniformLocation(program, "u_FragColor");
  const aPosition = gl.getAttribLocation(program, "a_Position");

  checkAttrsAvailable(uFrag, aPosition);

  // Создаем буфер
  const vertexBuffer = gl.createBuffer();

  // Если не получилось создать, бросаем ошибку
  if (!vertexBuffer) {
    throw new Error("Не удалось создать буфер WebGL");
  }

  const coordsPickCount = 2;

  // Создаем массив типизированных данных
  const vertices = new Float32Array([
    -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5,
  ]);
  // Типизируем буфер
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Записываем данные в буфер и говорим подсказку что данные в буфере будут записаны один раз и использованы многократно
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  // Сохраняем ссылку на буферный объект в WebGL в атрибут вершинного шейдера
  gl.vertexAttribPointer(aPosition, coordsPickCount, gl.FLOAT, false, 0, 0);
  // Разрешаем присваивание в атрибут вершинного шейдера (блокирует перезапись до вызова gl.disableVertexAttribArray(aPosition))
  gl.enableVertexAttribArray(aPosition);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / coordsPickCount);
};

export const lesson1 = lesson({
  title: "Урок 1: Точки",
  fragShaderSource,
  vertShaderSource,
  runner: runLesson1,
});
