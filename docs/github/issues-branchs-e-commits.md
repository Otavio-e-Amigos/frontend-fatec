# Diretrizes de Issues, Branches e Commits

[<- Voltar](../index.md)

Este guia estabelece algumas diretrizes relacionadas a criação de Issues, Branches e Commits para o projeto, visando manter a clareza, rastreabilidade e qualidade do código e do processo de desenvolvimento. É necessário que todas as contribuições devem seguir este padrão de criação em função de manter um bom relacionamento de colaboração para o projeto.

## Criação de Issues

Cada Issue aberta neste repositório deve estar ligada a uma **História de Usuário (HU)** definida no Product Backlog. O objetivo é garantir que cada tarefa de desenvolvimento contribua diretamente para a entrega de valor ao usuário final.

### Estrutura da Issue

Uma Issue deve conter os seguintes padrões de criação:

1.  **Título:** Título deve coincidir com o título da HU, além de possuir sua menção correspondente no Product Backlog.
2.  **Descrição da Funcionalidade:** Além de citar sobre a história de usuário definida no documento, deve ser fornecida ao desenvolvedor um entendimento claro do que precisa ser implementado. Inclua, se aplicável, exemplos de comportamentos esperado, *mockups* ou conteúdo que possa facilitar ao desenvolvedor responsável no desenvolvimento da Issue.
3.  **Lista de Tarefas:** Deve detalhar os passos técnicos necessários para a conclusão da história. Esta lista de tarefas além de servir como um guia de implementação, ela também pode sinalizar aos outros desenvolvedores sobre a conclusão delas associadas à Issue e a sua HU relacionada.
4.  **Issues relacionadas fora do sistema**: É necessário substituir o campo da HU pelo prefixo (SISTEMA), para identificar que a Issue é relacionada á melhorias do próprio sistema que engloba o Appointer.

#### Modelo Base de Issue
```
Título: [HU-XXX] Manter dragões
Descrição: [Descrição do Documento inserida no início do corpo. Próximos parágrafos são relacionados em como pode ser implementado e o que deve ou pode seguir].
Checklist:
- [] [Tarefas relacionadas á HU]
- [] Criar pasta módulo `/dragons` e estrutura base de arquivos
- [] (`dragon.service.ts`) mapear rotas da api
- [] criar páginas e rotas navegáveis para o usuário
```

## Criação de Branches

Para cada funcionalidade ou modificação planejada, deve-se criar uma branch isolada do fluxo principal `main`. O uso de convenções de nomeação de branches é obrigatório.

### Convenção de Nomenclatura

Utilize os seguintes prefixos, seguidos por uma descrição coesa do propósito de sua  alteração:

> Dica: A descrição após o prefixo deve ser breve, descrevendo *o quê* será alterado, não *como* será feito.

| Prefixo | Uso | Exemplo |
| :--- | :--- | :--- |
| **`feature/`** | Para novas funcionalidades ou grandes implementações. | `feature/cadastro-dragoes` |
| **`fix/`** | Para correções de bugs ou defeitos. | `fix/erro-kobolds-tristes` |
| **`refactor/`** | Para alterações de código que não modificam a funcionalidade externa (melhoria interna, refatoração). | `refactor/otimizacao-dragon-service` |

## Criação de Commits

Cada Commit deve representar uma alteração lógica e atômica no código. Evite commitar múltiplos recursos ou correções em um único commit.

### Convenção de Nomenclatura

Adote um padrão na nomeação de suas commits, utilizando prefixos fáceis de identificar em exemplos como:

| Prefixo | Significado |
| :--- | :--- |
| **`feat:`** | Indica uma nova funcionalidade implementada. |
| **`fix:`** | Indica a correção de um bug específico. |
| **`docs:`** | Alterações apenas na documentação. |
| **`refactor:`** | Reestruturação de código sem alterar comportamento. |
| **`test:`** | Adição ou modificação para testes. |

### Estrutura da Commit

A commit deve possuir um resumo breve (linha de assunto) seguido de um corpo mais detalhado se necessário.

**Estrutura simples:**
`feat: adicionar mapeamento CRUD de dragões`

**Estrutura completa:**
```
feat: adicionar mapeamento CRUD de dragões

Implementa as rotas de CRUD da endpoint /api/dragons
```
