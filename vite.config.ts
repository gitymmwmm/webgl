import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // https://github.com/UstymUkhman/vite-plugin-glsl?tab=readme-ov-file#default-options
    glsl({
      include: [
        // Glob pattern, or array of glob patterns to import
        "**/*.glsl",
        "**/*.wgsl",
        "**/*.vert",
        "**/*.frag",
        "**/*.vs",
        "**/*.fs",
      ],
      exclude: undefined, // Glob pattern, or array of glob patterns to ignore
      defaultExtension: "glsl", // Shader suffix to use when no extension is specified
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      removeDuplicatedImports: false, // Automatically remove an already imported chunk
      importKeyword: "#include", // Keyword used to import shader chunks
      minify: false, // Minify/optimize output shader code
      watch: true, // Recompile shader on change
      root: "/", // Directory for root imports
    }),
  ],
});
