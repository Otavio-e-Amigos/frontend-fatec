# Pull Requests

[<- Voltar](../index.md)

Este pequeno guia detalha o processo correto de abertura e gerenciamento de _Pull Requests_ ao propor novas funcionalidades, correções de bugs ou melhorias na base de código do Appointer. A padronização no processo de criação delas é crucial para garantir a qualidade, rastreabilidade e a manutenção coesa do projeto, além de permitir a leitura e revisão fácil entre os colaboradores do projeto.

## Fluxo de Trabalho Sugerido

1. É recomendado seguir um fluxo de trabalho baseado em _feature branches_ para isolar o desenvolvimento e garantir que o código principal da branch `main` permaneça estável e coeso.

2. É sempre preferível criar uma _feature branch_ uma alteração ou adição específica do sistema, garantindo que outros desenvolvedores possam saber o que está sendo desenvolvido e evitar conflitos de implementação entre branches e códigos de outros desenvolvedores. O nome da branch deve ser descritivo, seguindo uma descrição clara sobre do que se trata aquela branch em específica, nomes como `feature/adicionar-dragões` ou `fix/corrigir-kobolds`)

3. **Desenvolvimento e Commits Atômicos:** Realize as alterações necessárias. Os _commits_ devem ser pequenos, focados em uma única mudança lógica (seguindo as diretrizes de [Issues, Branchs e Commits](github/issues-branchs-e-commits.md)).

4. **Push e Criação do PR:** Após testes locais bem-sucedidos, envie sua branch para o repositório remoto e abra um Pull Request direcionando para o branch principal de integração.

## Requisitos para um Pull Request Aceitável

Antes de enviar sua Pull Request para revisão, garanta que os seguintes pontos foram atendidos:

### 1. Descrição Clara e Completa

O título e a descrição da Pull Request devem ser claros com o que a sua branch oferece para o projeto.

- **Título:** Descreva brevemente a mudança realizada, algo como `feat: Adicionar tipos de estilo para os Dragões`, para que seja fácil identificar do que a Pull se trata.
- **Corpo:** Detalhe _o que_ foi feito e _como_ o código implementa essa solução. Não é necessário, mas é recomendável que haja uma justificativa da implementação para maiores detalhes de casos mais específicos.
  - Mencione a issue relacionada sempre que houver (ex: `Fecha com #123`).
  - Em correção de bugs, descreva o comportamento incorreto e o esperado do sistema, além da solução realizada para esta correção.
