# Guia técnico: grades horárias

[<- Voltar ao índice](../index.md)

Este guia explica, em linguagem simples, como funciona o cadastro e a consulta de
grades horárias no frontend. A ideia é ajudar quem vai revisar o código ou
estudá-lo: primeiro mostramos o caminho percorrido pelos dados e depois
explicamos as responsabilidades dos arquivos, componentes e funções.

> Este documento descreve o comportamento implementado no frontend. As regras
> finais de validação e persistência também dependem da API e do banco de dados.

## 1. O que a funcionalidade permite fazer

Uma grade pertence a um professor e a um período letivo. Dentro dela são
adicionadas disciplinas; cada disciplina fica vinculada a um curso e tem uma
carga semanal e uma lista de aulas com dia, início e fim.

O fluxo de cadastro está dividido em três etapas:

1. **Minhas disciplinas**: selecionar o período e incluir as disciplinas que
   fazem parte da grade.
2. **Grade horária**: definir dias e horários das aulas, manualmente ou usando
   os blocos apresentados na tabela semanal.
3. **Resumo de horas**: conferir os totais calculados e salvar.

Também existe uma tela de consulta. Nela, uma pessoa pode pesquisar um
professor, escolher um período e visualizar as disciplinas e aulas da grade.

## 2. Mapa dos arquivos

```text
app/
├── modules/grade/
│   ├── grade.class.ts          # Modelo de uma disciplina dentro do cadastro
│   ├── grade.service.ts        # Chamadas e tipos usados na API de grades
│   └── api/grade.routes.ts     # Métodos e caminhos dos endpoints
├── pages/grade/
│   ├── index.tsx               # Composição da consulta de grades existentes
│   ├── grade-page.types.ts     # Tipos compartilhados pela consulta
│   ├── grade-page.utils.ts     # Formatação de período, turno e dias
│   ├── @hooks/
│   │   └── useGradePage.ts     # Estado, carregamento e ações da consulta
│   ├── GradeWizard.tsx         # Estado e coordenação do cadastro
│   └── @layouts/
│       ├── GradeSelectionPanel.tsx
│       ├── GradeFocusPanel.tsx
│       ├── GradeWeeklySchedule.tsx
│       ├── GradeDisciplineCard.tsx
│       ├── GradePageDialogs.tsx
│       ├── GradeWizardDisciplineStep.tsx
│       ├── GradeWizardNavigation.tsx
│       ├── GradeWizardScheduleStep.tsx
│       ├── GradeWizardScheduleGrid.tsx
│       ├── GradeWizardSummary.tsx
│       └── grade-wizard.utils.ts
└── routes/
    ├── grade/index.tsx         # Loader da tela de consulta
    └── professor/[id]/grades/new.tsx
                                # Loader do cadastro para um professor
```

As rotas são registradas em [`app/routes.ts`](../../app/routes.ts). A tela de
consulta fica em `/grade`; o cadastro de outra grade para um professor fica em
`/professor/:id/grades/new`.

## 3. Caminho dos dados

### 3.1 Ao abrir a consulta

1. A rota `app/routes/grade/index.tsx` confere se existe token de autenticação.
2. O `clientLoader` carrega professores, períodos letivos, cursos e disciplinas
   em paralelo.
3. A página `app/pages/grade/index.tsx` permite selecionar o professor, período
   e grade.
4. Quando uma grade é selecionada, a página busca as disciplinas da grade e,
   para cada disciplina, suas aulas.

### 3.2 Ao iniciar um cadastro

1. A rota `app/routes/professor/[id]/grades/new.tsx` verifica o token e se o
   identificador do professor é válido.
2. Ela carrega o professor, cursos, disciplinas, períodos e sugestões de OP.
3. `GradeWizard.tsx` mantém os dados temporários e mostra uma etapa de cada vez.
4. A etapa de disciplinas cria objetos `Grade`.
5. A etapa de horários acrescenta aulas a esses objetos, após validar turno,
   intervalos, conflitos e quantidade semanal.
6. O resumo calcula as horas e `saveGrade` grava a grade, suas disciplinas e
   suas aulas pela API.

## 4. Modelo dos dados no cadastro

O arquivo [`grade.class.ts`](../../app/modules/grade/grade.class.ts) define
`GradeInterface` e a classe `Grade`. Neste cadastro, uma instância representa
**uma disciplina adicionada à grade**, e não a grade completa do professor.
Ela contém dados de identificação, curso, turno e aulas.

```ts
export interface GradeInterface {
  key: string;
  disciplinaId: number;
  cursoId: number;
  quantidadeAulas: number;
  status: "MINISTRANDO";
  aulas: GradeLessonPayload[];
}

export default class Grade implements GradeInterface {
  // As propriedades restantes seguem o mesmo contrato da interface.

  constructor(data: GradeInterface) {
    Object.assign(this, data);
  }
}
```

`GradeInterface` descreve quais propriedades devem estar presentes. A classe
usa o construtor para copiar os dados recebidos para a instância. Isso permite
que o formulário e as funções usem o nome `Grade` em vez de manter um tipo
local diferente para o mesmo objeto.

`key` é uma chave temporária usada pela interface para identificar a disciplina
antes e durante o salvamento. O identificador real é fornecido pela API. As
propriedades `disciplinaId` e `cursoId` são os vínculos com registros já
cadastrados; `disciplina` e `curso` guardam nomes para exibição; `aulas` contém
os horários associados.

## 5. Cadastro: coordenação do assistente

O arquivo [`GradeWizard.tsx`](../../app/pages/grade/GradeWizard.tsx) é o
componente que coordena o fluxo. Ele não desenha todos os detalhes da tela:
mantém o estado, aplica regras de negócio e entrega dados e funções aos
componentes de cada etapa.

### Estado guardado

- `step`: etapa aberta (1, 2 ou 3).
- `periodoId`: período letivo escolhido.
- `items`: disciplinas adicionadas, representadas como `Grade[]`.
- `selectedItemKey`: disciplina ativa para colocar aulas.
- `day`, `manualStart` e `manualEnd`: valores do formulário de horário manual.
- `itemError`, `scheduleError` e `saveError`: mensagens de validação ou erro.
- `isSaving`: impede iniciar salvamentos concorrentes e atualiza o botão.
- `hasPersistedData`: indica que parte da grade já foi enviada à API; a interface
  bloqueia alterações para evitar divergência com o que já foi gravado.
- `progress`: guarda identificadores criados e aulas já enviadas durante a
  sessão atual da tela.

### Funções principais

#### `handleItemAdded(newItem)`

Adiciona a disciplina à lista, seleciona-a para edição de horários e prepara o
formulário manual para o primeiro bloco do turno dela.

#### `removeItem(key)`

Remove uma disciplina pelo identificador temporário. Se a disciplina removida
era a selecionada, seleciona a primeira restante. A função não altera dados
depois que o salvamento já começou.

#### `removeLesson(itemKey, lesson)`

Remove um horário da disciplina indicada. A comparação usa dia, início e fim
para encontrar a aula correspondente. Também limpa a mensagem de erro de
horário.

#### `selectScheduleItem(key)`

Escolhe qual disciplina receberá os próximos horários e reinicia os campos de
início e fim para o primeiro bloco oficial de seu turno.

#### `addLesson(itemKey, lesson)`

É a principal validação de horários. Antes de adicionar uma aula, verifica:

1. se a aula tem início e fim válidos e o fim é posterior ao início;
2. se o horário está dentro do turno da disciplina;
3. se o horário pode ser representado nos blocos disponíveis;
4. se não se sobrepõe a outra aula no mesmo dia;
5. se não ocupa os mesmos blocos visuais de outra aula;
6. se a carga semanal da disciplina ainda permite adicionar os blocos.

Se todas as verificações passam, a aula é adicionada e ordenada por dia e hora.
Caso contrário, a função mostra uma mensagem explicando o problema.

#### `addManualLesson()`

Lê a disciplina, o dia e os horários escolhidos no formulário manual e chama
`addLesson`. Dessa forma, os horários digitados passam pelas mesmas regras dos
horários escolhidos na grade.

#### `proceedToSchedule()`

Valida a primeira etapa. É necessário escolher um período letivo e adicionar ao
menos uma disciplina antes de abrir a etapa de horários.

#### `proceedToSummary()`

Compara, para cada disciplina, os blocos que foram alocados com a quantidade
semanal solicitada. Se houver diferença, mantém o usuário na etapa de horários
e informa quantos blocos faltam ou excedem. Só permite avançar quando a carga
está completa.

#### `saveGrade()`

Salva os dados em sequência:

1. cria o registro principal da grade;
2. cria cada disciplina vinculada à grade;
3. cria as aulas vinculadas a cada disciplina.

Antes de criar a grade, soma as cargas e arredonda os valores monetários/de
horas para duas casas decimais. Se houver uma falha depois de uma parte já ter
sido enviada, `progress` retém os identificadores e as aulas concluídas para
que o botão **Continuar salvamento** tente prosseguir sem recriar os registros
conhecidos.

Esse controle existe somente enquanto a tela permanece aberta: `progress` usa
`useRef`, não armazenamento persistente do navegador. Se a tela for recarregada,
o estado local de progresso é perdido. Depois do sucesso, o usuário volta à
página do professor.

### Cálculo dos totais exibidos

O assistente soma os totais das disciplinas e os envia ao componente de resumo.
O resumo chama `getItemsTotals` para os valores por disciplina e usa a mesma
regra para o total geral.

## 6. Etapa 1: disciplinas

O arquivo
[`GradeWizardDisciplineStep.tsx`](../../app/pages/grade/@layouts/GradeWizardDisciplineStep.tsx)
desenha o formulário e a lista de disciplinas selecionadas.

### `addItem()`

Esta função transforma o que foi preenchido em uma instância de `Grade`. Antes
disso, verifica o período letivo, a disciplina cadastrada, o curso, a
quantidade de aulas, o semestre (de 1 a 12), o valor opcional de OP (inteiro
entre 0 e 999) e o turno do curso.

O status é definido como `MINISTRANDO`, sem pedir ao usuário uma quantidade
relacionada ao status. O turno vem do curso selecionado. Ao concluir, o
formulário limpa a pesquisa da disciplina e o campo OP.

```ts
const newItem = new Grade({
  key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  disciplinaId: selectedDiscipline.id,
  cursoId: course.id,
  quantidadeAulas: lessonsPerWeek,
  status: "MINISTRANDO",
  aulas: [],
  // Os outros campos de exibição e contexto também são preenchidos aqui.
});
```

A chave gerada identifica temporariamente o item na lista, nos eventos de
remoção e no progresso do salvamento. Ela não substitui os IDs do banco.

O restante do componente:

- mostra campos para período, disciplina, curso, semestre, carga semanal e OP;
- pesquisa disciplinas e limita a lista de sugestões exibidas a cinco;
- mostra o turno obtido do curso e o status fixo `MINISTRANDO`;
- permite filtrar as disciplinas já adicionadas por curso e turno;
- mostra mensagens quando faltam cursos, disciplinas ou período letivo;
- impede editar/remover os itens após começar a persistência.

## 7. Etapa 2: horários e regras de tempo

### Horários oficiais e dias da semana

[`grade-wizard.utils.ts`](../../app/pages/grade/@layouts/grade-wizard.utils.ts)
define os turnos e os blocos visuais. Cada bloco oficial representa 50 minutos.
Também define os dias da semana de segunda a domingo; a tabela visual do
assistente usa os seis primeiros dias, de segunda a sábado.

| Turno | Blocos exibidos |
|---|---|
| Manhã | 07:30–08:20, 08:20–09:10, 09:20–10:10, 10:10–11:00, 11:10–12:00, 12:00–12:50 |
| Tarde | 13:00–13:50, 13:50–14:40, 14:50–15:40, 15:40–16:30, 16:40–17:30, 17:30–18:20 |
| Noite | 19:20–20:10, 20:10–21:00, 21:10–22:00, 22:00–22:50 |

Os intervalos entre os blocos não são aulas nem precisam ser cadastrados.

### Funções utilitárias de tempo e cálculo

#### `timeInMinutes(time)`

Converte uma string `HH:mm` em minutos desde 00:00. Por exemplo, `08:30`
resulta em `510`. Trabalhar com números facilita comparar horários e detectar
sobreposições.

#### `getLessonBlocks(shift, lesson)`

Traduz um horário real em índices dos blocos oficiais mais próximos. A duração
é dividida em blocos de 50 minutos e arredondada para cima. Retorna uma lista
vazia quando o horário é inválido ou ultrapassa os blocos disponíveis do turno.

Esta função é usada para contar a carga alocada e para desenhar aulas na grade.
Por isso, horários manuais flexíveis podem ser representados visualmente pelo
bloco oficial mais próximo; a lista de aulas, por outro lado, mantém o início e
fim digitados.

#### `getAllocatedBlocks(item)`

Encontra o turno da disciplina e soma os blocos ocupados por todas as aulas
dela. Se não encontrar o turno, retorna zero.

#### `periodoDataValida(periodo)`

Verifica se o período letivo possui data de início e fim que podem ser
interpretadas como datas.

#### `academicMonths(period)`

Calcula quantos meses de calendário o período letivo cobre, incluindo o mês
inicial e final. Se as datas não forem válidas, usa seis meses como valor
alternativo.

#### `roundHours(value)`

Arredonda um valor numérico para duas casas decimais. É usado nos totais
enviados à API.

#### `formatHours(value)`

Formata o valor como horas com uma casa decimal e convenção brasileira, por
exemplo `12,5h`.

#### `getItemsTotals(item, months)`

Calcula os valores para uma disciplina:

```text
horas semanais = quantidade de aulas × 50 ÷ 60
horas mensais = horas semanais × 4
hora-atividade = horas mensais × 50%
total mensal = horas mensais + hora-atividade
total do período = total mensal × número de meses
```

`GradeWizardScheduleStep.tsx` apresenta o formulário manual, o seletor da
disciplina ativa, a tabela e a lista detalhada de aulas.

- `ActiveDisciplineSelector` deixa escolher a disciplina a preencher e mostra
  blocos usados versus permitidos.
- `ManualLessonForm` coleta disciplina, dia, início e fim sem obrigar o uso de
  uma célula visual.
- `ScheduledLessons` lista os horários exatos e permite removê-los enquanto os
  dados ainda não foram enviados à API.
- `GradeWizardScheduleGrid` recebe os horários e os eventos de adicionar/remover
  do componente coordenador.

### Interação na grade

[`GradeWizardScheduleGrid.tsx`](../../app/pages/grade/@layouts/GradeWizardScheduleGrid.tsx)
divide a tabela em componentes menores:

- `GradeWizardScheduleGrid` percorre os turnos e instala o controle do gesto de
  arraste.
- `stopDragging()` limpa a indicação de arraste quando o ponteiro é solto,
  inclusive se for solto fora da célula.
- `ShiftScheduleTable` desenha uma tabela para um turno, com dias nas colunas e
  blocos de horário nas linhas.
- `ScheduleCell` identifica se a célula está ocupada, se a disciplina ativa
  pertence ao turno e se ainda tem carga semanal disponível. Um clique em uma
  célula livre adiciona aula; clicar em uma célula ocupada remove a aula. O
  arraste permite preencher células seguidas.

As referências `isDragging` e `ignoreNextClick` evitam que o clique emitido ao
terminar um arraste seja interpretado como uma segunda ação. Células de outros
turnos ou sem carga disponível ficam desabilitadas e apresentam uma explicação
acessível por rótulo ou dica.

## 8. Etapa 3: resumo

[`GradeWizardSummary.tsx`](../../app/pages/grade/@layouts/GradeWizardSummary.tsx)
mostra professor, período, totais gerais e detalhamento por disciplina. O texto
explica a regra usada para as horas semanais, mensais, atividade e total do
período.

### `SummaryCard`

Componente interno que desenha um indicador individual, com título, valor,
detalhe e uma das cores visuais disponíveis. É usado para manter a aparência
dos cartões consistente.

Se o salvamento falhar, a tela mostra `saveError`. Quando parte dos dados já
foi persistida, também informa que o salvamento pode ser retomado pelo botão de
continuação.

## 9. Navegação entre etapas

[`GradeWizardNavigation.tsx`](../../app/pages/grade/@layouts/GradeWizardNavigation.tsx)
desenha o progresso e os botões:

- mostra as três etapas e marca a etapa atual;
- mostra um visto nas etapas anteriores;
- na primeira etapa, oferece **Cancelar** e retorna ao perfil do professor;
- nas etapas seguintes, chama `onBack`;
- antes do resumo, chama `onNext`;
- no resumo, chama `onSave` e desabilita o botão enquanto salva.

O componente não valida o conteúdo por conta própria: recebe `onNext` e `onSave`
do `GradeWizard`, que concentra as regras.

## 10. Acesso à API

### Rotas da API

[`grade.routes.ts`](../../app/modules/grade/api/grade.routes.ts) declara o
método HTTP e o caminho relativo das operações:

| Recurso | Operações disponíveis |
|---|---|
| Grades | listar (`GET /grades`), criar (`POST /grades`), consultar por ID (`GET /grades/{id}`), atualizar (`PUT /grades/{id}`), listar por professor e listar disciplinas da grade |
| Disciplinas da grade | criar (`POST /disciplinas-grade`), consultar por ID, atualizar (`PUT /disciplinas-grade/{id}`), excluir (`DELETE /disciplinas-grade/{id}`) e listar aulas associadas |
| Aulas | criar (`POST /aulas-grade/disciplinas-grade/{id}/aulas`), listar por disciplina da grade (`GET /disciplinas-grade/{id}/aulas`) e excluir (`DELETE /aulas-grade/{id}`) |

O contrato OpenAPI consultado não declara `DELETE /grades/{id}`; por isso essa
operação não foi adicionada ao frontend.

### Tipos de dados enviados e recebidos

[`grade.service.ts`](../../app/modules/grade/grade.service.ts) contém os
contratos usados pelo frontend:

- `GradeCreatePayload`: dados gerais, como professor, período e totais;
- `GradeDisciplinePayload`: vínculo da disciplina com a grade e o curso;
- `GradeLessonPayload`: dia da semana e intervalo da aula;
- `SavedGrade`, `SavedGradeDiscipline` e `SavedGradeLesson`: formatos
  normalizados dos dados retornados pela API.

### Métodos do `GradeService`

#### `request(request, auth)`

Envia uma solicitação usando o módulo de API padrão e as credenciais do usuário.
Se a API devolver uma mensagem de erro conhecida, transforma essa mensagem em
um `Error` comum para que a interface possa exibi-la. Outros erros são
propagados, não escondidos.

#### `responseData(response)`

Lê o conteúdo útil da resposta. Algumas respostas vêm dentro da propriedade
`dados`; quando ela não existe, usa o conteúdo bruto.

#### `responseList(response)`

Normaliza listas que a API pode devolver diretamente ou dentro de `content`.
Se a resposta não contiver uma dessas formas de lista, lança um erro para não
tratar um formato inesperado como uma lista vazia válida.

#### `responseId(response, label)`

Extrai e valida o ID de um registro criado. Se a API não retornar um inteiro
positivo seguro, lança um erro com o nome do registro esperado.

#### `createGrade(payload, auth)`

Cria o registro principal da grade e retorna o ID gerado.

#### `getGrades(auth, options)`

Lista grades com paginação. `options` aceita número da página, tamanho e
critérios de ordenação, enviados na query string.

#### `getGrade(id, auth)`, `updateGrade(id, payload, auth)` e `deleteGrade(id, auth)`

Consultam, atualizam ou excluem uma grade pelo ID. A exclusão depende da
integridade referencial: a API responde com conflito (`409`) se ainda houver
disciplinas vinculadas. O serviço converte esse caso em uma mensagem que
orienta a desvincular as disciplinas antes de tentar novamente.

#### `createDiscipline(payload, auth)`

Cria uma disciplina vinculada à grade e retorna o ID dessa associação.

#### `getDisciplineGrade(id, auth)`, `updateDisciplineGrade(id, payload, auth)` e `deleteDisciplineGrade(id, auth)`

Consultam e atualizam uma associação de disciplina com uma grade, ou removem
somente essa associação. A exclusão não altera os status documentados
(`MINISTRANDO` e `CANCELADA`) nem apaga o cadastro global da disciplina.

#### `createLesson(disciplineGradeId, payload, auth)`

Cria uma aula para uma associação de disciplina já criada. Não retorna um ID
porque o fluxo do assistente não precisa dele para continuar.

#### `getLesson(id, auth)`, `updateLesson(id, payload, auth)` e `deleteLesson(id, auth)`

Consultam, atualizam ou excluem uma aula pelo identificador da própria aula.
Antes de abrir a edição, a tela consulta novamente a aula por ID. A edição
altera dia e intervalo; conflitos de horário retornados pela API são mostrados
no formulário.

#### `getOpOptions(professorId, auth)`

Consulta grades e disciplinas anteriores do professor, reúne valores OP válidos,
remove duplicados e os ordena. A lista aparece como sugestão no formulário, mas
o usuário ainda pode informar um valor manualmente.

#### `getProfessorGrades(professorId, auth)`

Busca as grades do professor e valida/converte os campos numéricos retornados.

#### `getGradeDisciplines(gradeId, auth)`

Busca as disciplinas associadas à grade e normaliza seus campos, incluindo
curso, semestre, turno, quantidade de aulas e OP.

#### `getDisciplineLessons(disciplineGradeId, auth)`

Busca as aulas associadas à disciplina da grade e normaliza dia e horários.

## 11. Rotas e carregamento de dados

### `/grade`

Em [`app/routes/grade/index.tsx`](../../app/routes/grade/index.tsx):

- `meta()` define o título da página;
- `clientLoader()` verifica autenticação e carrega professores, períodos,
  cursos e disciplinas em paralelo;
- `GradeIndex()` entrega os dados carregados a `GradePage`.

### `/professor/:id/grades/new`

Em
[`app/routes/professor/[id]/grades/new.tsx`](../../app/routes/professor/[id]/grades/new.tsx):

- `meta()` define o título de cadastro;
- `clientLoader()` verifica autenticação e ID, carrega os dados necessários e
  trata falhas na consulta de sugestões de OP como uma mensagem informativa;
- `NewProfessorGrade()` entrega os dados a `GradeWizard`;
- `HydrateFallback()` mostra uma mensagem enquanto os dados da tela são
  carregados.

### `/periodo-letivo/:id/edit`

A rota carrega o período letivo pelo ID e reutiliza o formulário de criação
com os dados existentes. O serviço envia `POST /periodos-letivos` no cadastro
e `PUT /periodos-letivos/{id}` na edição. A tela de detalhes oferece acesso
direto à edição.

## 12. Consulta de grades existentes

[`app/pages/grade/index.tsx`](../../app/pages/grade/index.tsx) compõe a tela
de consulta. O estado e as chamadas ficam em
[`useGradePage.ts`](../../app/pages/grade/@hooks/useGradePage.ts), enquanto os
componentes visuais estão separados em `@layouts/`.

### Tipos e funções auxiliares

- `GradePageProps` e `ScheduleDiscipline` definem os dados recebidos pela tela e
  a forma de exibir uma disciplina com seu curso, turno e horários.
- `academicKey(period)`: converte ano e semestre em uma chave numérica para
  ordenar períodos cronologicamente.
- `periodLabel(period)`: cria um rótulo legível para o período, ou uma mensagem
  quando o período não foi encontrado.
- `displayDay(day)`: transforma o número do dia em nome; para um dia sem rótulo
  conhecido, exibe `Dia N`.
- `selectProfessor(professor)`: no hook, seleciona o professor, preenche o campo
  de pesquisa e fecha as sugestões.
- `loadSchedule()`: função assíncrona interna do hook. Busca as disciplinas da
  grade selecionada e as aulas de cada disciplina; usa nomes de disciplinas e
  cursos já carregados para tornar os resultados legíveis.

### Efeitos de carregamento

Em `useGradePage.ts`, o primeiro `useEffect` busca as grades quando o professor
muda. Ordena as grades por período e ID, e seleciona a mais recente. Uma
variável `active` evita atualizar a tela com a resposta de uma consulta antiga
se o usuário mudar de professor antes da resposta chegar.

O segundo efeito garante que a grade selecionada pertença ao período que está
visível. Se não pertencer, seleciona a primeira grade desse período.

O terceiro efeito carrega disciplinas e aulas da grade selecionada. Também
usa uma variável `active` para ignorar respostas antigas e mostra erro com uma
ação para tentar carregar novamente.

### Pesquisa e grade visual

A pesquisa de professor apresenta até cinco sugestões, sem expor matrícula.
Quando a busca tem pelo menos dois caracteres e não encontra correspondência,
a tela orienta a conferência do nome e oferece o link de cadastro do professor.

As aulas consultadas são organizadas visualmente por turno, dia e horário. Uma
legenda detalhada também mostra curso, disciplina, turno e horários cadastrados.
Quando o professor não tem grade no período selecionado, a tela mostra essa
situação e oferece o cadastro de uma grade.

`GradeSelectionPanel` desenha os campos de pesquisa e seleção;
`GradeWeeklySchedule` monta a tabela semanal; `GradeDisciplineCard` mostra cada
disciplina e suas ações; e `GradePageDialogs` reúne os diálogos de edição e
confirmação. `GradeFocusPanel` combina a tabela e os cartões na seção da grade.

Na área **Grade em foco**, o botão **Editar grade** abre um formulário para
alterar o período letivo e os totais semanais, mensais e gerais registrados. O
professor aparece como somente leitura, pois a consulta e o contexto da página
estão vinculados a ele. **Excluir grade** pede confirmação e chama
`DELETE /grades/{id}`. Se ainda houver disciplinas associadas, a API retorna
`409`; o frontend mantém a confirmação e informa que os vínculos precisam ser
removidos antes.

Cada disciplina da grade tem uma ação de edição:

- **Editar** permite alterar disciplina, curso, semestre, carga semanal, OP e
  status (`MINISTRANDO` ou `CANCELADA`). O turno acompanha o curso selecionado.
  Os horários já cadastrados não são modificados por esse formulário.

Cada disciplina também mostra ações de manutenção:

- **Desvincular** remove a associação da disciplina com a grade pelo endpoint
  em duas etapas. Para disciplinas `MINISTRANDO`, a primeira confirmação salva
  o status `CANCELADA` pela rota `PUT /disciplinas-grade/{id}` e a ação passa a
  se chamar **Excluir vínculo**. Se ainda houver horários, a exclusão fica
  desabilitada e a tela orienta removê-los primeiro. Sem horários associados,
  a segunda confirmação chama `DELETE /disciplinas-grade/{id}`. A operação
  remove apenas o vínculo, não o cadastro global da disciplina.
- **Editar horário** consulta o registro atualizado com `GET /aulas-grade/{id}`
  e permite alterar dia da semana e horários de início e fim por
  `PUT /aulas-grade/{id}`. A tela verifica se o horário final é posterior ao
  inicial; a API também valida conflitos com outras aulas.
- **Excluir horário** aparece junto a cada aula e remove somente aquele horário
  pelo endpoint `DELETE /aulas-grade/{id}`. A confirmação identifica o dia e o
  intervalo. Após sucesso, a grade visual e a lista de horários são atualizadas.

Os horários são apresentados em linhas próprias, com dia e intervalo agrupados
e ações consistentes de edição e exclusão. Isso deixa o vínculo entre cada
horário e sua disciplina mais claro, inclusive em telas estreitas.

Falhas da API mantêm a confirmação ou o formulário abertos e exibem a mensagem
retornada. O `404` ao consultar ou excluir uma aula indica que aquele horário
não foi encontrado ou já foi removido.

## 13. Por que o código está separado em vários arquivos?

O cadastro envolve interface, estado, regras de horário, cálculos, acesso à API
e carregamento de rotas. Se tudo ficasse em um único componente, seria mais
difícil localizar um erro e testar mentalmente cada comportamento.

A separação adotada mantém responsabilidades mais claras:

- **`GradeWizard.tsx`** coordena o fluxo e as regras centrais;
- **componentes `GradeWizard*Step`** desenham as etapas e repassam ações;
- **`grade-wizard.utils.ts`** reúne regras reutilizáveis de tempo e cálculo;
- **`grade.class.ts`** descreve o objeto usado no cadastro;
- **`grade.service.ts`** centraliza chamadas e normalização da API;
- **`grade.routes.ts`** mantém os caminhos dos endpoints em um local;
- **arquivos de rota** validam acesso e preparam dados antes de abrir a página;
- **`pages/grade/index.tsx`** exibe grades existentes sem misturar esse fluxo
  com o cadastro.

Quando for revisar uma regra, comece pelo ponto correspondente: validação de
horários em `addLesson`, cálculo em `getItemsTotals`, desenho das células em
`ScheduleCell` ou persistência nos métodos de `GradeService`.

## 14. Observações importantes para revisão

- A interface trabalha com 50 minutos por bloco oficial.
- O formulário manual mantém horários exatos, mas o desenho da tabela converte
  aulas para blocos oficiais próximos por meio de `getLessonBlocks`.
- A validação de sobreposição considera as aulas do mesmo dia, inclusive entre
  disciplinas diferentes.
- O salvamento cria a grade antes das disciplinas e as disciplinas antes das
  aulas, porque cada etapa depende do ID retornado pela anterior.
- O acompanhamento de salvamento parcial existe apenas na memória da página
  aberta; não sobrevive a um recarregamento.
- O frontend valida os dados para orientar o usuário, mas a API ainda precisa
  validar as regras no servidor.
- A documentação explica o código atual; se uma regra mudar, atualize este guia
  junto com a implementação.
