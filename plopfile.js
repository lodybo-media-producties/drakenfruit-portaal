module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Create a new component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?',
      },
      {
        type: 'input',
        name: 'storybookCategory',
        message: 'In what Storybook category should this component be placed?',
        default: 'Components',
      },
      {
        type: 'input',
        name: 'storybookTitle',
        message: 'What is the title of the Storybook story?',
        default(answers) {
          return answers.name;
        },
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'app/components',
        templateFiles: 'templates/plop/component/**',
        base: 'templates/plop/component',
      },
    ],
  });
};
