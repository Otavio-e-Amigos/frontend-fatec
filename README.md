# Appointer: Sistema de Grades e Folhas de Ponto dos professores da FATEC

O Appointer é um sistema desenvolvido de uso interno para a secretaria que permite a geração e renovação para as grades e folhas de ponto dos professores da FATEC, providenciando maior eficiẽncia e menor taxa de erros no fluxo de criação e manutenção deste tipo de documento importante.

## Desenvolvimento

### Instalação

Antes de começar o desenvolvimento do sistema, primeiro instale as dependências do projeto:

```bash
npm install
```

### Desenvolvimento

Depois disso, inicialize o servidor local de desenvolvimento, estando disponível internamente em seu dispositivo no endereço `http://localhost:5173`:

```bash
npm run dev
```

## Produção

Compilação do projeto:

```bash
npm run build
```

## Hospedagem

### Docker

```bash
docker build -t appointer .

# Rodar o container
docker run -p 3000:3000 appointer
```

### DIY Deployment (Descrição original do React Router)

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```
