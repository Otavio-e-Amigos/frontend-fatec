# Regra de Negócios e Módulos

[<- Voltar](../index.md)

As Regras de Negócio do projeto, ou seja, as características que compõem o projeto Appointer como os Professores e a Folha de Ponto, são estruturadas e implementadas através de uma pasta chamada `/modules`. Esta pasta abriga todas as classes e lógica relacionadas a cada regra de negócio definidas do projeto, o que facilita na criação e manutenção de cada módulo por estarem abrigados em um único local. Não é obrigatório seguir á risca uma estrutura fixa e restrita para todos os módulos devido ao nível de complexidade, funcionalidades e a sua maneira de implementação que cada um pode possuir, entretanto é recomendado que cada módulo siga um estilo de estrutura para que sua implementação e visualização entre os desenvolvedores seja fácil:

```
	/modules
		/xxx
			/@components¹ #Pasta de componentes lógicos do React
				ModuleComponent.tsx
			/actions #
				save.action.ts
			/api³ #
				xxx.routes.ts
				xxx.mapper.ts
			xxx.class.ts
			xxx.service.ts
			xxx.routes.ts
			
	
	Notas:
		¹Caso o módulo possua componentes lógicos (componentes que possuem mais lógica do que visualização web, como serviço de autenticação do usuário ou uma hook relacionada á uma das funcionalidades de algum serviço), possa ser mais interessante agrupá-las dentro do diretório do módulo.
		²
		³Quando necessário, você pode agrupar objetos relacionados á outros módulos para facilitar sua identificação de funcionalidades
```