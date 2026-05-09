# Análise da Arquitetura do App Pokédex

## 1. Estrutura de Diretórios
A organização atual dos arquivos nas pastas `screens`, `components`, `services`, etc., faz bastante sentido. Dá pra entender fácil onde cada coisa deveria estar e ajuda na hora de procurar um arquivo.

**Eu mudaria alguma coisa?**
Eu colocaria todas as pastas do código (`screens`, `components`, `types`, etc.) junto com o `App.tsx` dentro de uma pasta `src` (source), porque a raiz do projeto está um pouco misturada. Tem arquivos de configuração do Expo e do Node (`package.json`, `app.json`) junto com o código do app. Colocar o código dentro de um `src/` deixaria a pasta principal bem mais limpa.

## 2. Componentização
O `PokemonCard` é um ótimo exemplo de componente reutilizável. Ele só recebe os dados do Pokémon via *props* e monta o visual do card na lista. Bem isolado e simples.

**Análise da tela `PokemonDetailScreen`:**
Essa tela tá fazendo muita coisa na parte visual e o arquivo ficou grande. Pra deixar ela mais limpa, eu criaria componentes separados para algumas partes:
- **`PokemonHeader`**: Um componente só pra parte de cima da tela, que receberia a imagem, o nome e renderizaria aquelas etiquetas com os tipos do Pokémon.
- **`PokemonStatsCard`**: Extrairia todo aquele card branco de baixo que mostra o peso, altura e a descrição da seção "Sobre".

Assim, a `PokemonDetailScreen` ficaria super enxuta, servindo só pra buscar os dados e encaixar esses componentes na tela.

## 3. Gerenciamento de Estado e Lógica

- Na **PokedexScreen**, a lógica de buscar os Pokémons e filtrar a lista tá toda dentro do próprio arquivo da tela, usando os hooks `useState` e `useEffect`.
- Na **PokemonDetailsScreen**, o `useEffect` tá fazendo a chamada direta com o `axios` pra pegar os detalhes extras.

**Isso é sustentável a longo prazo?**
Não. Se o aplicativo continuar crescendo, essa abordagem vai dar dor de cabeça.

**Prós e Contras de fazer assim:**
- **Prós:** É mais rápido de programar no começo. Pra um projeto pequeno, resolve o problema sem precisar criar uma arquitetura complexa.
- **Contras:** Os arquivos das telas ficam gigantes e difíceis de ler. Além disso, a tela fica "acoplada" à API, ou seja, se quisermos usar a lógica de buscar um Pokémon em outra tela, não tem como reaproveitar, teria que copiar e colar o código.

## 4. Pontos Fortes e Fracos

**O que ficou legal (Pontos Fortes):**
1. **Uso de TypeScript:** Ter os tipos definidos na pasta `types` ajuda muito a evitar erros bobos (tipo errar o nome de uma propriedade da API) e ajuda o VS Code a dar o autocompletar.
2. **Organização básica de pastas:** A separação que já existe (components, screens, services) dá uma boa base pra quem entra no projeto entender como as coisas funcionam.

**O que dá pra melhorar (Pontos Fracos):**
1. **Chamadas de API direto nas telas:** Aquele `axios.get` jogado no meio da `PokemonDetailScreen` não é o ideal. Isso deveria estar no arquivo `services/api.ts` junto com as outras funções de rede, centralizando tudo num lugar só.
2. **Estado local pra tudo:** Gerenciar *loading*, erros e paginação manualmente nos componentes é chato e repetitivo. No futuro, usar uma biblioteca para lidar com o estado dessas requisições (como o React Query ou Context API) deixaria o código bem mais profissional e o app mais rápido (com cache).
