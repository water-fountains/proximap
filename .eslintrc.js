module.exports = {
  root: true,
  ignorePatterns: ["projects/**/*"],
  plugins: ["file-progress"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: ["tsconfig.json", "e2e/tsconfig.json"],
        createDefaultProgram: true,
      },
      extends: [
        "plugin:@typescript-eslint/recommended", // typescript rules
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
      ],
      rules: {
        "file-progress/activate": 1,
        "@angular-eslint/component-selector": [
          "error",
          {
            prefix: "app",
            style: "kebab-case",
            type: "element",
          },
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            prefix: "app",
            style: "camelCase",
            type: "attribute",
          },
        ],

        // TODO these rules should be activated again and the problems fixed.
        "@typescript-eslint/ban-types": 'off',
        "@typescript-eslint/no-explicit-any": 'off',
        "@typescript-eslint/explicit-module-boundary-types": 'off'
      },
    },
    {
      files: ["*.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {},
    },
  ],
};
