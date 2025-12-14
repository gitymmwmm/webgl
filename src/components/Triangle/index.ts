import { Component } from "../../utils";
import fragShaderSource from "./shader.frag";
import vertShaderSource from "./shader.vert";

export const Triangle = Component(
  ({ gl, clear, render }) => {
    render(() => {
      // Очистка экрана
      clear([0.0, 0.0, 0.0, 1.0]);
      // Рисуем точку в центре экрана
      gl.drawArrays(gl.POINTS, 0, 1);
    });
  },
  {
    fragShaderSource,
    vertShaderSource,
  }
);
