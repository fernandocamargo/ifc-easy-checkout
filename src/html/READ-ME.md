![Infracommerce Easy Checkout](/ifc-easy-checkout-logo.png)
# Infracommerce Easy Checkout
***

## Estrutura de componentes (widgets)

O desenvolvimento do HTML, foi criado de forma a termos um modelo padronizado na montagem dos elementos utilizado no Web App.
Desta forma, podemos ter uma melhor prototipação e padronização de estrutura dos web components do React e também uma estrutura mais limpa tanto de HTML e CSS.

Para efeito didático, segue abaixo um padrão de estrutura para alguns elementos.

### Elemento estrutural de container, ou macro componente

Um web componente React, neste projeto, deve ser definido como:

```html
<wrap>
	<title /> <!-- ou <header /> -->
	<content />
	<annotation /> <!-- ou <footer /> -->
<wrap>
```

Pensando desta maneira, teremos um modelo estrutural de um componente bem definido. 
Adicionando classes, de forma genérica e também para efeito didático, temos algo como:

```html
<wrap class="container">
	<header class="header" /> <!-- ou class="title" -->
	<content class="content" /> <!-- ou class="item, ou collection" -->
	<footer class="footer" /> <!-- pode não existir, pois não é obrigatório -->
<wrap>
```

No item class="container" é onde fica definido a regra (classe ou ID) especifico do elemento. É por ele que é estilizado os elementos filhos.

### Exemplos de conteúdos

Utilizando o modelo de estrutura citada acima, podemos ter os modelos de HTMLs para alguns elementos para exemplificar no mundo real o que tentamos descrever:

#### Uma lista

```

```