import { useProgram } from "./Program";

function App() {
  const glProgram = useProgram();

  return <canvas id="canvas" ref={glProgram.listen} />;
}

export default App;
