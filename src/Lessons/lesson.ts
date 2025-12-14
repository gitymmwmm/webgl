import {
  makeGLProgram,
  makeLoopSet,
  makeShader,
  normalizeCanvas,
} from "../utils";

type LessonOptions = {
  title: string;
  fragShaderSource: string;
  vertShaderSource: string;
  runner: LessonRunner;
};

export type LessonRunner = (ctx: LessonContext) => void | (() => void);

type LessonContext = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  clear: (color: [number, number, number, number]) => void;
  loop: (cb: () => void) => void;
};

export const lesson = (opts: LessonOptions) => (gl: WebGLRenderingContext) => {
  console.log(`Starting lesson: ${opts.title}`);

  normalizeCanvas(gl);

  const vertexShader = makeShader(gl, gl.VERTEX_SHADER, opts.vertShaderSource);
  const fragmentShader = makeShader(
    gl,
    gl.FRAGMENT_SHADER,
    opts.fragShaderSource
  );

  const program = makeGLProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  const clear = (color: [number, number, number, number]) => {
    // Устанавливаем цвет очистки буфера цвета
    gl.clearColor(color[0], color[1], color[2], color[3]);
    // Очищаем буфер цвета
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const loopSet = makeLoopSet();

  const disposeRunner = opts.runner({ gl, program, clear, loop: loopSet.loop });

  return () => {
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    loopSet.dispose();
    disposeRunner?.();
  };
};
