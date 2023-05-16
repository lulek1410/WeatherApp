import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";
import historyApiFallback from "connect-history-api-fallback";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), reactRefresh()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		middleware: (options) => {
			return [historyApiFallback(), options.middleware];
		},
	},
	base: "https://weatherapp-bj6p.onrender.com",
});
