import { Component } from "../../utils";
import fragShaderSource from "./shader.frag";
import vertShaderSource from "./shader.vert";

export const DynamicPoint = Component(
  ({ gl, clear, render, canvas }) => {
    const handler = (event: Event) => {
      if (!(event instanceof MouseEvent)) {
        console.warn("Неожиданный тип события", event.type);
        return;
      }

      const { clientX, clientY } = event;

      console.log("Клик по канвасу в координатах:", clientX, clientY);
    };

    canvas.addEventListener("click", handler);

    render(() => {
      // Очистка экрана
      clear([0.0, 0.0, 0.0, 1.0]);
      // Рисуем точку в центре экрана
      gl.drawArrays(gl.POINTS, 0, 1);
    });

    return () => {
      canvas.removeEventListener("click", handler);
    };
  },
  {
    fragShaderSource,
    vertShaderSource,
  }
);
