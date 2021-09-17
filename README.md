<p align="center">
    <img width="800" src=".github/logo.png" title="Processamento de imagens"><br />
    <img src="https://img.shields.io/maintenance/yes/2021?style=for-the-badge" title="Status do projeto">
</p>

# Intro

Esse repositório contem exemplos e implementações de filtros para processamento de imagens. O objetivo é entender como esses funcionam e como eles podem ser utilizados no contexto de aprendizado de máquina (machine learning). Os filtros apresentados são lineares e convolucionais.

> **Responsável pelo curso:** Fernando Bevilacqua  ([dovyski@gmail.com](mailto:dovyski@gmail.com))

## 1. Começando

Todo material deve funcionar em qualquer navegador moderno. Você pode simplesmente baixar esse repositório e abrir os arquivos. Para uma maior comodidade na utilização do material, siga os passos abaixo.

### 1.1 Pré-requisitos

Certifique-se de que sua máquina tenha um ambiente de desenvolvimento instalado, por exemplo, [Visual Studio Code](https://code.visualstudio.com). Você também precisa do [git](https://gitforwindows.org/) instalado.

#### 1.2 Clone o projeto

Clone o projeto em alguma pasta do seu computador, e.g. `c:\`:

```
git clone https://github.com/Dovyski/image-filters.git && cd image-filters
```

### 1.3 Acessar conteúdo usando "hot reload"

Para facilitar o teste e manipulação dos códigos, é muito recomendável que você tenha uma extensão que sirva as páginas html e atualize elas se houver mudança.

Para isso, instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) do VSCode:

```
code --install-extension ritwickdey.liveserver
```
> *Dica:* você também pode clicar no painel de extensões e buscar por "Live Server".

Por fim, abra a pasta onde estão os arquivos no Visual Studio Code e clique no botão `Go Live` na barra de tarefas (base da tela)

![Gif showing how the Go Live button in the taskbar](.github/vscode-live-server-animated-demo.gif)

## Licença

Os arquivos de código neste repositório têm licenças mistas. Consulte cada arquivo / projeto para verificar sua licença.

## Changelog

Veja todas as alterações desse repositório estão no arquivo [CHANGELOG](CHANGELOG.md).

## Links úteis

* [Image Kernels](https://setosa.io/ev/image-kernels/)
* [Image filtering](https://ai.stanford.edu/~syyeung/cvweb/tutorial1.html)
* [Redes Neurais Convolucionais](https://www.analyticsvidhya.com/blog/2018/12/guide-convolutional-neural-network-cnn/)