import {
  checkAttrsAvailable,
  Component,
  getRelativeMousePosition,
} from "../../utils";
import fragShaderSource from "./shader.frag";
import vertShaderSource from "./shader.vert";

export const DynamicPoint = Component(
  ({ gl, clear, render, canvas, program }) => {
    const pos: { x: number; y: number }[] = [];
    const aPos = gl.getAttribLocation(program, "a_Position");

    checkAttrsAvailable(aPos);

    const handler = (event: Event) => {
      if (!(event instanceof MouseEvent)) {
        throw new Error(`Неожиданный тип события: ${event.type}`);
      }

      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Ожидался HTMLCanvasElement");
      }

      const { x, y } = getRelativeMousePosition(event, canvas);
      pos.push({ x, y });
    };

    canvas.addEventListener("click", handler);

    render(() => {
      // Очистка экрана
      clear([0.0, 0.0, 0.0, 1.0]);
      pos.forEach(({ x, y }) => {
        // Устанавливаем позицию точки в центр экрана
        gl.vertexAttrib3f(aPos, x, y, 0.0);
        // Рисуем точку в центре экрана
        gl.drawArrays(gl.POINTS, 0, 1);
      });
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
