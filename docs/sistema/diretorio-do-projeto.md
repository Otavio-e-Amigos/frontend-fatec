# Estrutura de Diretórios do Projeto Appointer

A arquitetura do sistema foi planejada para manter uma clara separação entre suas partes importantes, isolando a lógica de interface, das regras de negócio, além de suas páginas e rotas. Cada pasta possui um propósito único que permite a fácil visualização e identificação das partes do sistema:

```
/app
	/classes
	/components
	/layouts
	/mock
	/modules
	/pages
	/routes
```

| Pasta | Propósito |
| :--- | :--- |
| `/classes` | Pasta dedicada para classes base do sistema web em si. Estes arquivos contêm código de infraestrutura e interfaces que não lidam com regras de negócio, mas sim com os aspectos técnicos do sistema. |
| `/components` | Armazena componentes lógicos e visuais reutilizáveis. São as unidades de interface que encapsulam funcionalidades específicas de UI. |
| `/layouts` | Dedicado a layouts pré-prontos. Contém componentes visuais que definem a estrutura de interface geral do site (ex: cabeçalhos, rodapés, barras laterais) e podem ser reutilizados em diversas páginas. |
| `/mock` | Diretório para simulação de dados. É utilizado para testes e desenvolvimento, permitindo simular dados do sistema em cenários onde o acesso ao backend não está disponível. |
| `/modules` | Pasta centralizada para todas as regras de negócio. É aqui que reside a lógica principal do Appointer, incluindo os processos de gerenciamento e automação de folhas de ponto e a geração de documentos a partir dos dados cadastrados. |
| `/pages` | Contém as páginas visualizáveis pelo usuário. O padrão de pastas neste diretório deve refletir o fluxo ou a funcionalidade específica que a página representa. |
| `/routes` | Dedicada aos arquivos de rotas. Gerencia como os diferentes caminhos (URLs) do projeto mapeiam para os componentes e páginas correspondentes no sistema. |
