import { WebglProgram } from "../../utils";
import { DynamicPointRunner } from "./runner";
import fragShaderSource from "./shader.frag";
import vertShaderSource from "./shader.vert";

export const DynamicPoint = WebglProgram(DynamicPointRunner, {
  fragShaderSource,
  vertShaderSource,
});
