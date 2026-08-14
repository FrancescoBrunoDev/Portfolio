import next from "eslint-config-next";

const config = [
  ...next,
  {
    rules: {
      // Legitimate SSR-safe patterns (window dimensions, per-mount randomization,
      // MDX reference registration) set state inside effects.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
