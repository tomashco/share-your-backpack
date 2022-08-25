module.exports = function plopGenerator(plop) {
  plop.setGenerator('component', {
    description: 'Atomic Design component creation logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name please',
      },
      {
        type: 'input',
        name: 'level',
        message: 'Atomic Design level of the component please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../../components/{{level}}/{{pascalCase name}}/index.tsx',
        templateFile: 'templates/index.tsx.hbs',
      },
      {
        type: 'add',
        path: '../../components/{{level}}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
        templateFile: 'templates/stories.tsx.hbs',
      },
    ],
  });
};
