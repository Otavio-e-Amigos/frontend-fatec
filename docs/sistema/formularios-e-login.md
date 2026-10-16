# Formulários, recarga e edição

[<- Voltar ao índice](../index.md)

Este guia registra a causa e a solução de três problemas observados nos
formulários do sistema. As alterações de aparência descritas no final se aplicam
somente à tela de login.

## 1. Erro ao recarregar formulários de cadastro

### Sintoma

Ao abrir diretamente ou atualizar com F5 uma página de cadastro de professor,
disciplina, curso ou período letivo, a renderização podia falhar com uma
referência a `localStorage` indisponível.

### Causa

As rotas do React Router Framework também podem ser renderizadas no servidor.
As páginas de cadastro incluem o componente compartilhado `Header`; antes da
correção, ele chamava `AuthService.hasUserToken()` durante a renderização. Esse
método acessava `localStorage`, uma API disponível no navegador, mas inexistente
no servidor.

Por isso, o formulário não era a origem do erro: a falha ocorria antes de a
página terminar de renderizar. O mesmo cabeçalho é usado pelas telas de
professor, disciplina, curso e período letivo.

### Solução

- `Header` começa com o estado de usuário não autenticado, renderizável tanto no
  servidor quanto no navegador.
- A leitura da sessão passou para um `useEffect`, executado depois que a tela
  está no navegador. Assim, o HTML inicial do servidor e a primeira renderização
  do cliente permanecem iguais.
- `AuthService.hasUserToken()` retorna `false` quando executado fora do
  navegador.
- `AuthService.getUserToken()` verifica o ambiente e a existência da sessão e
  lança uma mensagem explícita se uma chamada tentar ler a sessão fora do
  navegador ou sem autenticação.
- A tela `/system/user/add` também deixou de buscar o token durante a
  renderização; a consulta acontece somente ao enviar o formulário.

Após a correção, atualizar a página deve exibir um formulário novo e vazio,
pronto para preenchimento. O token de autenticação permanece no armazenamento
local do navegador como antes.

## 2. Cadastro de usuário do sistema e `useForm()`

### Sintoma

`/system/user/add` usava `FormContainer` e `FormController` diretamente,
mantinha a submissão manual no componente e obtinha a sessão durante a
renderização. Erros eram capturados por um `catch` vazio, sem indicação para a
pessoa usando o sistema.

### Causa

Esse fluxo não seguia o ciclo comum de formulário já usado nas outras páginas:
submissão, estado de carregamento, tratamento de erros de campo e navegação em
caso de sucesso. A captura vazia também transformava uma falha de API em uma
ausência de resposta visível.

### Solução

- A página agora usa `useForm()` com o componente compartilhado `FormInput` e
  `FormSection`.
- A validação, a chamada a `UserService` e os callbacks de sucesso e falha estão
  em `app/modules/user/@actions/save.action.ts`.
- Campos inválidos recebem mensagens junto ao próprio campo; erros de API são
  exibidos na página.
- O botão informa quando o envio está em andamento e impede submissões
  repetidas.
- A senha usa o campo de senha compartilhado, em vez de aparecer como texto
  aberto.
- `UserService.save()` e `UserService.edit()` agora propagam falhas e não
  retornam o próprio objeto de entrada como se a operação tivesse sido
  concluída. Isso permite que `useForm()` mantenha o formulário aberto e mostre
  o erro.

## 3. Dados que desapareciam ao voltar à edição de professor

### Sintoma

Ao sair da edição de um professor e retornar usando voltar/avançar do navegador,
os campos que deveriam começar preenchidos com os dados recebidos da API podiam
aparecer vazios.

### Causa

`SaveProfessorForm` usava a variável global de módulo `added` para decidir se
devia copiar os dados do professor para o `FormController`. O primeiro
componente alterava essa variável para `true`; ela continuava verdadeira mesmo
depois que o componente saía da tela. Quando a rota era montada novamente, era
criado um controlador novo, mas a variável global impedia que ele recebesse os
valores do professor.

Variáveis de módulo representam o processo JavaScript inteiro, não uma instância
do formulário ou uma visita à rota. Por isso, não são apropriadas para controlar
a inicialização de campos.

### Solução

- O controlador inicial é criado por instância do formulário, com os campos
  preenchidos a partir do professor recebido.
- O controlador é mantido em estado React, sem a variável global `added`.
- A tela de edição usa a chave do professor como `key` do formulário. Se a rota
  reutilizar a tela para outro professor, os campos são montados de novo com os
  dados correspondentes.

Com isso, cada montagem começa com os valores da resposta atual da API; os
valores digitados depois continuam pertencendo somente àquela instância do
formulário.

## 4. Escopo visual da tela de login

O novo layout da tela de login está isolado em `app/styles/login.css`, carregado
pela rota `/login`. As cores, tipografia mono e regras visuais foram definidas
com seletores e variáveis locais a `.login-page`; não alteram os tokens nem o
estilo das páginas de cadastro ou edição. A estrutura mantém a ação de login
existente e usa a paleta vermelha e neutra da identidade do sistema.

## 5. Como validar manualmente

Com a aplicação e a API disponíveis e uma sessão autenticada:

1. Abra cada rota de cadastro diretamente: `/professor/add`,
   `/disciplina/add`, `/curso/add` e `/periodo-letivo/add`.
2. Atualize cada uma com F5. A página deve voltar a exibir o formulário sem
   erro de `localStorage`.
3. Abra `/system/user/add`, preencha os campos e envie. Confira o estado de
   carregamento, o retorno à listagem em caso de sucesso e a mensagem se a API
   recusar o envio.
4. Abra a edição de um professor a partir da listagem, navegue para outra página
   e retorne com voltar/avançar. Os campos devem continuar inicializados com os
   dados atuais do professor.
5. Abra `/login` em tela larga e estreita. O layout deve se ajustar sem alterar
   as demais páginas; o envio continua validando as mesmas credenciais.

Os passos que enviam dados precisam da API real disponível. Uma compilação do
frontend verifica tipos, imports e a geração dos estilos, mas não substitui essa
validação de integração.
