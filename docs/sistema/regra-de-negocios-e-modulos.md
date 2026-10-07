# Regra de Negócios e Módulos

[<- Voltar](../index.md)

As Regras de Negócio do projeto, ou seja, as características que compõem o projeto Appointer como os Professores e a Folha de Ponto, são estruturadas e implementadas através de uma pasta chamada `/modules`. Esta pasta abriga todas as classes e lógica relacionadas a cada regra de negócio definidas do projeto, o que facilita na criação e manutenção de cada módulo por estarem abrigados em um único local. Não é obrigatório seguir á risca uma estrutura fixa e restrita para todos os módulos devido ao nível de complexidade, funcionalidades e a sua maneira de implementação que cada um pode possuir, entretanto é recomendado que cada módulo siga um estilo de estrutura para que sua implementação e visualização entre os desenvolvedores seja fácil:

```md
	/modules
		/xxx
			/@components¹ <				> #Pasta de componentes lógicos da biblioteca React
				ModuleComponent.tsx
			/actions² <					> #Intermediário entre os formulários web e a camada de serviço
				save.action.ts
			/api³ <						> #Pasta de recursos e lógica de um outro módulo que este usa
				xxx.routes.ts
				xxx.mapper.ts
			xxx.class.ts <				> #Classe de negócio
			xxx.service.ts <			> #Classe camada de serviço
			xxx.routes.ts <				> #Classe ou Helper de mapeamento de páginas
	
	Notas:
		¹Caso o módulo possua componentes lógicos (componentes que possuem mais lógica do que visualização web, como serviço de autenticação do usuário ou uma hook relacionada á uma das funcionalidades de algum serviço), possa ser mais interessante agrupá-las dentro do diretório do módulo.
		²
		³Quando necessário, você pode agrupar objetos relacionados á outros módulos para facilitar sua identificação de funcionalidades e arquivos que facilitam a leitura e manutenção deles.
```

|Conteúdo			|Descrição								|
|---				|---									|
|	`/@Components`	|Componentes Lógicos da Biblioteca React|


## Implementação de Módulos

Por padrão, o desenvolvimento de novos módulos segue uma estrutura que para alguns tipos de módulos já são o suficiente, enquanto outros possui uma estrutura similar, o que é interessante aplicar uma padronização similar á estrutura mencionada acima e com a convenção de nomeação e estrutura de arquivos do sistema no geral. É recomendável para cada novo módulo siga uma estrutura similar á uma existente do sistema para facilitar sua leitura e desenvolvimento entre os desenvolvedores.

### Fluxo de implementação

#### Arquivos

Por padrão, é aconselhável que cada módulo siga uma estrutura base de arquivos e funcionalidades devido á forma do sistema realizar a comunicação entre os dados e aos layouts