precision mediump float;
// Переменные типа атрибут - только для вершинного шейдера
// Во время компиляции шейдера будет выделена память для хранения атрибута a_Position
// Спецификатор тип имя переменной
attribute vec4 a_Position;

void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
}