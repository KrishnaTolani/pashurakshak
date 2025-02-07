import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F8F9FC",
          dark: "#1A1F2E",
        },
        foreground: {
          DEFAULT: "#1F2937",
          dark: "#EDF2F7",
        },
        primary: {
          DEFAULT: "#FF9843",
          50: "#FFF5EB",
          100: "#FFE8D3",
          200: "#FFD4A8",
          300: "#FFC17D",
          400: "#FFAD52",
          500: "#FF9843",
          600: "#FF7B14",
          700: "#E66400",
          800: "#B84F00",
          900: "#8A3B00",
          dark: "#FFB067"
        },
        secondary: {
          DEFAULT: "#A8E6CF",
          50: "#F0FBF7",
          100: "#E1F7EE",
          200: "#C3F0E0",
          300: "#A8E6CF",
          400: "#8AD5B9",
          500: "#6CC4A3",
          600: "#4EA98A",
          700: "#3D856B",
          800: "#2C614E",
          900: "#1B3D31",
          dark: "#7EEDC5"
        },
        accent: {
          DEFAULT: "#FFB5B5",
          50: "#FFF0F0",
          100: "#FFE1E1",
          200: "#FFC3C3",
          300: "#FFB5B5",
          400: "#FF8787",
          500: "#FF5959",
          600: "#FF2B2B",
          700: "#FC0000",
          800: "#C40000",
          900: "#920000",
          dark: "#FF9898"
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#242B3D"
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
          dark: "#2D364A"
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#303B55"
        },
        theme: {
          "paw": "#FFD700",
          "heart": "#FF6B6B",
          "nature": "#66BB6A",
          "sky": "#4FC3F7"
        }
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
