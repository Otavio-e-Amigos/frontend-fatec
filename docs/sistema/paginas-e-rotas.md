# Organização de Páginas e Rotas do Sistema

[<- Voltar](../index.md)

A estrutura de arquivos de páginas e rotas do projeto (referente aos diretórios `/pages` e `/routes`), seguem um padrão de estrutura onde as rotas de navegação definidas em `/routes.ts` refletem as definições de rotas e páginas correspondentes dentro de seus diretórios.

### Diretório `/pages`

As páginas visualizáveis pelo usuários estão localizadas no diretório `/pages`. Cada diretório corresponde a uma tela ou funcionalidade específica do sistema, onde sua nomeação deve refletir a funcionalidade que a mesma oferecerá ao usuário final (como uma página chamada `edit.tsx` dentro do diretório `/dragon/[id]` que auto-explica pelo nome do arquivo por se tratar de uma página relacionada á edição de um dragão já existente dentro do sistema).

**Demonstração**
```
/pages
	/dragon
		/[id] #Quando tratamos de caminhos com valores dinâmicos, sempre crie uma pasta com este tipo de convenção.
			/index.tsx #Páginas dedicatórias á um determinado caminho, como ver um dragão em específico, devem ser declaradas com nomes que indicam que o caminho específico possui uma página relacionada.
			/edit.tsx
		/router.outlet.tsx #arquivo que define um layout inicial para o caminho correspondente.
	/kobold
		/index.tsx
		/pet-area.tsx #Além disso, é interessante que nomes longos utilizem o tipo-de-nomeação-traçada. (esqueci o nome disso)
		/router.outlet.tsx
```

### Diretório `routes`

Todas as rotas navegáveis são inseridas em `app/routes/`. A separação do layout e da rota se devem ao fato de cada uma delas possuírem lados diferentes em sua lógica, onde a ideia é que a página seja mais focado na lógica de visualização enquanto o arquivo de rota lida com as requisições de negócios e regras necessárias de uma determinada funcionalidade. O nome de cada arquivo de rota deve ser *exatamente* o mesmo encontrado em `/pages` para previnir problemas durante implementação.

> < **Observação** > Algumas rotas podem conter arquivos *placebos* (como `router.outlet.ts`) que são utilizados para definir um layout vazio, seguindo as diretrizes da biblioteca `react-router` que é necessário a inserção de um arquivo de layout base para as suas sub-rotas, mesmo não precisando uma.

**Demonstração**
```
/pages
	/dragon
		/[id]
			/index.tsx
			/edit.tsx
		/router.outlet.tsx
	/kobold
		/index.tsx
		/pet-area.tsx
		/router.outlet.tsx
```

## Mapeamento das rotas (`routes.ts`)

A configuração central das rotas, que define como os caminhos do sistema se conectam às páginas, reside em `app/routes.ts`.

Para garantir a rastreabilidade, o desenvolvedor deve:

1.  Criar o diretório correspondente em `app/pages/`.
2.  Criar o arquivo de rota correspondente em `app/routes/`.
3.  Registrar o mapeamento correto em `app/routes.ts`, referenciando o componente/página implementado.

## Padrões de Implementação

*   **Coerência:** Busque manter a nomenclatura entre os diretórios de rotas e os diretórios de páginas para facilitar a navegação mental entre a definição do caminho e a implementação da tela.
*   **Componentes:** A organização deve respeitar a separação de responsabilidades entre a definição da *rota* (o caminho) e a *página* (a interface).
