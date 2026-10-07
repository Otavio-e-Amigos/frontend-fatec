# Regra de Negócios e Módulos

[<- Voltar](../index.md)

As Regras de Negócio do projeto, ou seja, as características que compõem o projeto Appointer como os Professores e a Folha de Ponto, são estruturadas e implementadas através de uma pasta chamada `/modules`. Esta pasta abriga todas as classes e lógica relacionadas a cada regra de negócio definidas do projeto, o que facilita na criação e manutenção de cada módulo por estarem abrigados em um único local. Não é obrigatório seguir á risca uma estrutura fixa e restrita para todos os módulos devido ao nível de complexidade, funcionalidades e a sua maneira de implementação que cada um pode possuir, entretanto é recomendado que cada módulo siga um estilo de estrutura para que sua implementação e visualização entre os desenvolvedores seja fácil:

```
/modules
	/xxx
		/@components¹
			ModuleComponent.tsx
		/actions
			save.action.ts
		/api²
			xxx.routes.ts
			xxx.mapper.ts
		xxx.class.ts
		xxx.service.ts
		xxx.routes.ts

Notas:
	¹Caso o módulo possua componentes lógicos (componentes que possuem mais lógica do que visualização web, como serviço de autenticação do usuário ou uma hook relacionada á uma das funcionalidades de algum serviço), possa ser mais interessante agrupá-las dentro do diretório do módulo ao invés do diretório de páginas, que são dedicados para arquivos de sites e visualização para o usuário.
	²Quando necessário, você pode agrupar objetos relacionados á outros módulos para facilitar sua identificação de funcionalidades e arquivos que facilitam a leitura e manutenção deles.
```

|Conteúdo						|Descrição																											|
|-------------------|---------------------------------------------------------------|
|	`/@Components`		| Componentes Lógicos da Biblioteca React 											|
|	`/actions`				| Camada itermediária entre o formulário e a camada de serviço 	|
|	`/xxx.class.ts`		| Classe da regra de negócio							 											|
|	`/xxx.service.ts`	| Camada de serviços da regra de negócio	 											|
|	`/xxx.routes.ts`	| (W.I.P) Camada de rotas de páginas														|


## Implementação de Módulos
Por padrão, o desenvolvimento de novos módulos segue uma estrutura que para alguns tipos de módulos já são o suficiente, enquanto outros possui uma estrutura similar, o que é interessante aplicar uma padronização similar á estrutura mencionada acima e com a convenção de nomeação e estrutura de arquivos do sistema no geral. É recomendável para cada novo módulo siga uma estrutura similar á uma existente do sistema para facilitar sua leitura e desenvolvimento entre os desenvolvedores.

### Fluxo de implementação

### Estrutura de arquivos
Por padrão, é aconselhável que cada módulo siga uma estrutura base de arquivos e funcionalidades em sua raiz devido á forma de como o sistema realiza a comunicação entre os dados e aos layouts, além de poder manter a padronização e fácil reconhecimento dos recursos que um módulo oferece para o sistema:

- `xxx.class.ts`: Classe da regra de negócio, é neste arquivo onde os dados de determinado módulo são inseridos e utilizados ao redor do sistema, para realizar criações com a API ou simplesmente mostrar suas informações em determinado layout, provendo integridade e manipulação de seus dados ao redor das classes e com outros aspectos do sistema.

- `xxx.service.ts`: Classe Camada de serviço do módulo. Todas as requisições e procedimentos realizados de determinadas situações com a API (ou com alguma outra coisa caso queira) são feitas aqui, como se fosse uma espécie de "Controller" em uma arquitetura MVC. É através desta camada que os formulários utilizarão essas classes para realizar suas requisições de criações ou de outras funcionalidades e irão esperar o aceite vindos dela, além de esperarem por erros caso aconteça algo do outro lado que não tenha sido realizada com sucesso, como a API ter recusado a criação de uma entidade por erros de validação ou de outra natureza.

- `xxx.routes.ts`: (W.I.P) Classe (ou função/outro método prático e conveniente) de rotas de páginas do módulo. Isto será importado pela `/routes.ts` do sistema para cadastrar rotas navegáveis de páginas para o usuário.

### Implementação de classes *(xxx.class.ts)*
O padrão de implementação de classes ocorre através de interfaces por conta do sistema de tipagens do Typescript, onde você consiga utilizá-las tanto para criação de suas representações simples e validação delas, quanto para a criação de classes e facilidade de inserção e manipulação de dados para cada uma. A inserção diversa de dados pode acabar sendo uma dor de cabeça para classes com vários atributos quando criado através de argumentos em seu construtor.

Seguindo este estilo,
