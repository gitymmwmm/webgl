import {
  checkAttrsAvailable,
  WebglProgram,
  getRelativeMousePosition,
} from "../../utils";
import fragShaderSource from "./shader.frag";
import vertShaderSource from "./shader.vert";

export const DynamicPoint = WebglProgram(
  ({ gl, clear, render, canvas, program }) => {
    const pos: [number, number][] = [];
    // Хранит последнюю позицию текущего штриха. Сбрасывается при mouseup,
    // чтобы следующий mousedown не соединялся с предыдущим штрихом.
    let lastPos: [number, number] | null = null;
    let colorIndex = 0;
    const colors = [
      [0.87, 0.0, 0.0],
      [0.0, 0.87, 0.0],
      [0.0, 0.0, 0.87],
      [0.87, 0.87, 0.0],
      [0.87, 0.0, 0.87],
    ];

    const aPos = gl.getAttribLocation(program, "a_Position");
    const uColor = gl.getUniformLocation(program, "uColor");

    checkAttrsAvailable(aPos, uColor);

    const handler = (event: Event) => {
      if (!(event instanceof MouseEvent)) {
        throw new Error(`Неожиданный тип события: ${event.type}`);
      }

      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Ожидался HTMLCanvasElement");
      }

      const { x, y } = getRelativeMousePosition(event, canvas);
      // Интерполируем только внутри одного штриха (между mousedown и mouseup).
      if (lastPos) {
        const dx = x - lastPos[0];
        const dy = y - lastPos[1];
        const dist = Math.hypot(dx, dy);
        const step = 0.005; // Чем меньше - тем плотнее точки
        const maxSteps = 500;
        const steps = Math.min(Math.ceil(dist / step), maxSteps);

        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          pos.push([lastPos[0] + dx * t, lastPos[1] + dy * t]);
        }
        // Обновляем последнюю позицию текущего штриха
        lastPos = [x, y];
      } else {
        // Начало нового штриха — добавляем только начальную точку и
        // запоминаем её как последнюю для дальнейшей интерполяции.
        pos.push([x, y]);
        lastPos = [x, y];
      }
    };

    const handleMouseDown = (event: Event) => {
      event.preventDefault();
      if (!(event instanceof MouseEvent)) {
        throw new Error(`Неожиданный тип события: ${event.type}`);
      }

      const key = event.button;

      if (key !== 0) {
        // Если нажата не левая кнопка мыши - игнорируем событие
        return;
      }

      handler(event);
      canvas.addEventListener("mousemove", handler);
    };

    const handleMouseUp = (event: Event) => {
      event.preventDefault();
      canvas.removeEventListener("mousemove", handler);
      // Завершаем текущий штрих — сбрасываем последнюю позицию, чтобы
      // следующий mousedown не соединил точки.
      lastPos = null;
    };

    const handleChangeColor = (event: Event) => {
      event.preventDefault();
      const color = colors[colorIndex % colors.length];
      gl.uniform4f(uColor, color[0], color[1], color[2], 1.0);
      colorIndex++;
    };

    const handleMakeScreenshot = (event: Event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }

      if (event.code !== "Space") {
        return;
      }

      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Ожидался HTMLCanvasElement");
      }

      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "screenshot.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    window.addEventListener("keydown", handleMakeScreenshot);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("contextmenu", handleChangeColor);

    render(() => {
      // Очистка экрана
      clear([0.0, 0.0, 0.0, 1.0]);
      pos.forEach((current) => {
        // Устанавливаем позицию точки в центр экрана (записываем информацию в атрибут)
        // gl.vertexAttrib3f(aPos, x, y, 0.0);
        // Векторная версия - использует DataView ("типизированные массивы от ArrayBuffer")
        gl.vertexAttrib2fv(aPos, new Float32Array(current));
        // Рисуем точку в центре экрана
        gl.drawArrays(gl.POINTS, 0, 1);
      });
    });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handler);
      canvas.removeEventListener("contextmenu", handleChangeColor);
      window.removeEventListener("keydown", handleMakeScreenshot);
    };
  },
  {
    fragShaderSource,
    vertShaderSource,
  }
);
