import {
  makeGLProgram,
  makeLoopSet,
  makeShader,
  normalizeCanvas,
} from "./common";

type ProgramOptions = {
  fragShaderSource: string;
  vertShaderSource: string;
};

export type Runner = (ctx: ProgramContext) => void | (() => void);

type ProgramContext = {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement | OffscreenCanvas;
  program: WebGLProgram;
  clear: (color: [number, number, number, number]) => void;
  render: (cb: () => void) => void;
};

export const WebglProgram =
  (runner: Runner, opts: ProgramOptions) => (gl: WebGLRenderingContext) => {
    normalizeCanvas(gl);

    const vertexShader = makeShader(
      gl,
      gl.VERTEX_SHADER,
      opts.vertShaderSource
    );
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

    const disposeRunner = runner({
      gl,
      canvas: gl.canvas,
      program,
      clear,
      render: loopSet.loop,
    });

    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      loopSet.dispose();
      disposeRunner?.();
    };
  };
