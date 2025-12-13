import { useState } from "react";
import { runLesson1 } from "./Lessons";

class WebglProgram {
  private canvas: HTMLCanvasElement | null = null;

  public listen = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      console.info("Detach canvas");
      this.stop();
      return;
    }

    if (this.canvas === canvas) {
      console.info("Canvas is already attached.");
      return;
    }

    if (this.canvas) {
      console.info("Switching canvas.");
      this.stop();
    }

    this.canvas = canvas;
    this.run();
  };

  private run = () => {
    if (!this.canvas) {
      throw new Error("Canvas is not attached.");
    }

    const canvas = this.canvas;

    const gl = canvas.getContext("webgl");

    if (!gl) {
      throw new Error("Ваш браузер не поддерживает WebGL");
    }

    runLesson1(gl);
  };

  private stop = () => {
    this.canvas = null;
  };
}

export const useProgram = () => {
  return useState(() => new WebglProgram())[0];
};
