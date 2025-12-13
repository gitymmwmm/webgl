export function normalizeCanvas(gl: WebGLRenderingContext) {
  resize(gl);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function resize(gl: WebGLRenderingContext) {
  const realToCSSPixels = window.devicePixelRatio;

  if (!(gl.canvas instanceof HTMLCanvasElement)) {
    throw new Error("gl.canvas is not HTMLCanvasElement");
  }

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

export function makeGLProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
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

export function makeShader(
  gl: WebGLRenderingContext,
  type: GLenum,
  source: string
) {
  const shader = gl.createShader(type); // создание шейдера

  if (!shader) {
    throw new Error("Не удалось создать шейдер");
  }

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

export function checkAttrsAvailable(...attrs: any[]) {
  for (const attr of attrs) {
    if (attr === null || attr < 0) {
      throw new Error("Не удалось получить доступ к атрибутам");
    }
  }
}
