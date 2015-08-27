![Infracommerce Easy Checkout](/ifc-easy-checkout-logo.png)
# Infracommerce Easy Checkout
***

Este repositório contém os arquivos necessários para criação do web app Easy Checkout da empresa Infracommerce.


***

## Tecnologias utilizadas

Javascript
* [React.js](facebook.github.io/react/)
* [Gulp.js](http://gulpjs.com/)
* [qtip2](http://qtip2.com/)

CSS / Estilização / Tipografia
* [SASS](http://sass-lang.com/)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/)




***

## Estrutura de pastas do projeto

```
/                       --> Raiz do projeto
|- /gulp    			--> Arquivos utilizados para o processamento das tasks do Gulp
|- /build				--> Arquivos finais gerados pelo projeto
|- /node_modules		--> Dependências utilizadas pelos pacotes node do projeto (esta pasta não deve ser armazenada no repositório)
|- /src				    --> Arquivos source utilizados no projeto, como SASS, Fonts, Images, Javascripts, etc.
   |- /font             --> Arquivos de fontes (tipologia) utilizados na aplicação
   |- /html             --> Arquivos de HTML estáticos utilizados no desenvolvimento do projeto.
   |- /image            --> Armazenamento das imagens utilizadas no projeto
   |- /js               --> O coração da aplicação. Aqui estão os arquivos utilizados para o funcionamento da aplicação. Arquivos de React.js e outro estão aqui.
   |- /sass             --> Arquivos de estilização, utilizando framework SASS, com formato de escrita SCSS
   |- /json             --> Arquivos modelos de Json`s utilizados no desenvolvimento doprojeto
```

***

## Getting Started

Para carregar a aplicação e trabalhar no desenvolvimento, primeiramente é necessário que esteja instalado em seu sistema operacional: Ruby e Node.js [...]

Primeiramente, após ter os aplicativos instalados, acessar a pasta do projeto por meio do seu console de comando do SO e executar:
```sh
$ npm install
```
Aguarde, pode demorar um pouco até o node baixar e instalar todas as dependências.
Após a conclusão pasta executar o comando:
```sh
$ gulp
```
Com isso será iniciado o processo de compilação e "escuta" de edições nos arquivos do projeto.
Ao concluir a inicialização, o Gulp exibirá no console a URL que você pode acessar para ver o projeto no browser. Por exemplo:
```
Access URLs:
 -------------------------------------
       Local: http://localhost:3000
```
O processo Gulp ficará rodando até você encerá-lo com a tecla de atalho de parar processo. No windows, por exemplo **CTRL + C** ou em MacOS **Cmd + C**

Para gerar um pacote de distribuição do projeto, pode ser realizado o comando:

```sh
$ gulp --deploy
```

***

## Documentações

[Estrutura de componentes HTML (widgets)](/src/html)

## Colaboradores:

[Fernando Camargo Del Buono](https://plus.google.com/105030355101850320529/posts) - <fernando.camargo@infracommerce.com.br>
[Jefferson Rafael Kozerski](https://twitter.com/jeff_drumgod)  - <jefferson.rafael@infracommerce.com.br>


***