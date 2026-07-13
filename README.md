# ☁️ Clima BR

**Clima BR** é um dashboard de monitoramento meteorológico em tempo real focado em municípios brasileiros. O projeto foi projetado com uma interface limpa, responsiva e moderna, integrando dados diretamente da API do **HG Brasil Weather** e utilizando recursos de armazenamento local para uma experiência personalizada.

Este projeto foi desenvolvido como parte de uma avaliação prática de faculdade.

---

## 🧑‍🏫 Contexto Acadêmico

Este projeto foi desenvolvido para fins acadêmicos na disciplina de **Desenvolvimento Front-End**, sob a orientação do professor **Rodrigo Cesar Nunes Maciel**. O objetivo foi aplicar na prática conceitos fundamentais do ecossistema web, tais como:
* Estruturação semântica com HTML5.
* Estilização avançada e responsiva com Vanilla CSS (CSS Grid, Flexbox e variáveis).
* Consumo de APIs RESTful usando JavaScript assíncrono (`fetch`/`Promises`).
* Persistência de dados local no navegador utilizando a API do `localStorage`.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web nativas para garantir leveza e alta performance:

* **HTML5**: Estruturação semântica e acessível das páginas de início, favoritos e histórico.
* **CSS3 (Vanilla)**: Layout responsivo adaptado para dispositivos móveis e desktops, variáveis CSS para fácil manutenção, efeitos de *glassmorphism* e transições suaves.
* **JavaScript (ES6+)**: Manipulação dinâmica do DOM, controle de rotas virtuais/estados locais, gerenciamento de requisições de rede.
* **HG Brasil Weather API**: Fonte de dados meteorológicos dinâmicos de alta precisão.
* **localStorage**: Armazenamento no navegador para guardar o histórico de buscas e as cidades favoritas do usuário.

---

## ✨ Funcionalidades Principais

* **Consulta em Tempo Real**: Digite o nome de qualquer cidade brasileira para ver instantaneamente a temperatura, descrição do clima, umidade atual, velocidade do vento e temperaturas mínima/máxima do dia.
* **Previsão para os Próximos Dias**: O dashboard exibe a tendência meteorológica para os dias seguintes com ícones representativos.
* **Gerenciador de Favoritos ⭐**: Favorite suas cidades mais acessadas clicando na estrela. Elas ficarão salvas na aba dedicada para acesso rápido sem precisar buscar novamente.
* **Histórico de Consultas Recentes ⏳**: Acompanhe o registro das suas últimas buscas com data e hora. A lista armazena as últimas 5 consultas.
* **Layout Totalmente Responsivo**: Interface adaptada para celulares, tablets e desktops.

---

## 📂 Estrutura de Arquivos

```
projeto-frontend/
├── index.html        # Página principal (Dashboard de Clima)
├── favoritos.html    # Visualização e acesso rápido de cidades favoritas
├── historico.html    # Exibição do histórico de buscas recentes
├── style.css         # Estilização completa do projeto (design system)
├── app.js            # Lógica de integração com a API, favoritos e histórico
└── README.md         # Documentação do projeto
```

---

## 🚀 Como Executar Localmente

Como o projeto é construído apenas com tecnologias nativas (*HTML, CSS, JS*), não há necessidade de instalar dependências complexas (como npm/yarn).

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/gabrieltomazi/weather-frontend.git
   ```

2. **Acessar a Pasta:**
   ```bash
   cd weather-frontend
   ```

3. **Abrir o Projeto:**
   Basta abrir o arquivo `index.html` diretamente no seu navegador de preferência ou utilizar a extensão **Live Server** no VS Code para rodar um servidor de desenvolvimento local.

---

## 🌐 Deploy no GitHub Pages

O deploy desta aplicação está configurado e disponível online via **GitHub Pages**. Você pode acessar o site publicado através do seguinte link:

👉 [Clima BR - Acessar Online](https://gabrieltomazi.github.io/weather-frontend/)
