document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.createElement("canvas");
  // canvas.style.transform = "translateY(50px)";
  document.body.appendChild(canvas);

  /**
   * @type {[WebGLRenderingContext, WebGLProgram]}
   */
  const [gl, program] = await initWebGLApp(canvas);

  normalizeCanvas(gl);

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
});

function normalizeCanvas(gl) {
  resize(gl);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 *
 * @param {HTMLCanvasElement} canvas Полотно для отрисовки
 */
async function initWebGLApp(canvas) {
  const gl = canvas.getContext("webgl");

  if (!gl) {
    throw new Error("Ваш браузер не поддерживает WebGL");
  }

  const VShaderSource = await loadShaderFromLink("vertex-shader");
  const FShaderSource = await loadShaderFromLink("fragment-shader");

  const VShader = createShader(gl, gl.VERTEX_SHADER, VShaderSource);
  const FShader = createShader(gl, gl.FRAGMENT_SHADER, FShaderSource);

  const program = createProgram(gl, VShader, FShader);

  gl.useProgram(program);

  return [gl, program];
}

function resize(gl) {
  const realToCSSPixels = window.devicePixelRatio;

  // Берём заданный браузером размер canvas в CSS-пикселях и вычисляем нужный
  // нам размер, чтобы буфер отрисовки совпадал с ним в действительных пикселях
  const displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  const displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

  //  проверяем, отличается ли размер canvas
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // подгоняем размер буфера отрисовки под размер HTML-элемента
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
  }
}

function makeDrawMorePoint({ gl: _gl, canvas: _canvas, aPos, uFragColor }) {
  /** @type {WebGLRenderingContext} */
  const gl = _gl;
  /** @type {HTMLCanvasElement} */
  const canvas = _canvas;

  /** @type {[number, number][]} */
  const points = [];
  /** @type {[number, number, number, number][]} */
  const pointColors = [];

  return function handleClickCanvas(event) {
    const { clientX: x, clientY: y } = event;

    const { width: cWidth, height: cHeight } = canvas;
    const rect = event.target.getBoundingClientRect();

    const newX = (x - rect.left - cWidth / 2) / (canvas.width / 2);
    const newY = -((y - rect.top - cHeight / 2) / (canvas.height / 2));

    const point = [newX, newY];
    const pointColor = getPointColor(point);
    pointColors.push(new Float32Array(pointColor));
    points.push(new Float32Array(point));

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < points.length; i++) {
      gl.vertexAttrib2fv(aPos, points[i]);
      gl.uniform4fv(uFragColor, pointColors[i]);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  };
}

function getPointColor([x, y]) {
  if (x >= 0 && y >= 0) {
    return [0, 1, 0, 1];
  } else if (x < 0 && y < 0) {
    return [1, 0, 0, 1];
  } else if (x > 0 && y < 0) {
    return [0, 0, 1, 1];
  } else {
    return [1, 1, 0, 1];
  }
}

async function loadShaderFromLink(id) {
  try {
    const res = await fetch(document.getElementById(id).getAttribute("href"));

    if (!res.ok) {
      throw new Error("Не удалось загрузить шейдер ", id, " ", err);
    }

    return res.text();
  } catch (err) {
    throw new Error("Не удалось загрузить шейдер ", id, " ", err);
  }
}

function createProgram(gl, vertexShader, fragmentShader) {
  // Создаем программу
  const program = gl.createProgram();
  // Присоединяем шейдеры
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // Связываем программу
  gl.linkProgram(program);

  // Если связка прошла успешно - возвращаем программу
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // После успешной линковки — шейдеры можно удалить
    // TODO спросить у GPT
    // gl.deleteShader(vs);
    // gl.deleteShader(fs);
    return program;
  }

  // Если не удалось связать программу - выводим сообщение об ошибке и очищаем ее
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);

  throw new Error("Не удалось создать программу");
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type); // создание шейдера
  gl.shaderSource(shader, source); // устанавливаем шейдеру его программный код
  gl.compileShader(shader); // компилируем шейдер

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }

  // если не удалось скомпилировать шейдер - выводим сообщение об ошибке и очищаем его
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);

  throw new Error("Не удалось скомпилировать шейдер");
}

function checkAttrsAvailable(...attrs) {
  for (const attr of attrs) {
    if (attr < 0 || attr === null) {
      throw new Error("Не удалось получить доступ к атрибутам");
    }
  }
}

// 112 page