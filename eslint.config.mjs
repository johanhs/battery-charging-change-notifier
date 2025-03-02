import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommendedTypeChecked, {
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    plugins: {
        prettier: prettierPlugin,
    },
    rules: {
        '@typescript-eslint/ban-ts-comment': ['off'],
    },
});
