import { CodegenConfig } from '@graphql-codegen/cli';

export default {
  overwrite: true,
  schema: '../api/src/schema.gql',
  documents: ['src/**/*.tsx'],
  generates: {
    'src/@generated/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
      presetConfig: {
        // the rest of this update? 🤌 nectar of the gods, thank you graphql codegen gods.
        // but this piece of shit? why. *why*.
        fragmentMasking: false,
      },
    },
    'src/@generated/introspection.json': {
      plugins: ['introspection'],
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
} satisfies CodegenConfig;
