import { makeGLProgram, makeShader, normalizeCanvas } from "../utils";

type LessonOptions = {
  title: string;
  fragShaderSource: string;
  vertShaderSource: string;
  runner: LessonRunner;
};

export type LessonRunner = (ctx: LessonContext) => void;

type LessonContext = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
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

  opts.runner({ gl, program });

  return () => {
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  };
};
