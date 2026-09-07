import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...minimal2023Preset,
    // Override transparent to ensure correct sizes + favicon
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, "favicon.ico"]],
    },
    maskable: {
      sizes: [512],
      // maskable uses padding ratio 0.2 by default in generator (safe zone)
      // This creates pwa-maskable-512x512.png from the source
    },
    apple: {
      sizes: [180],
    },
    assetName: (type, size) => {
      if (type === "transparent") return `pwa-${size.width}x${size.height}.png`;
      if (type === "maskable") return `pwa-maskable-${size.width}x${size.height}.png`;
      if (type === "apple") return `apple-touch-icon.png`;
      return `${type}-${size.width}x${size.height}.png`;
    },
  },
  images: ["public/favicon.svg"],
});
