# Proposta de Refatoração da Pokédex

## 1. Padrão Escolhido: MVVM (Model-View-ViewModel)

Eu escolhi o **MVVM**, porque no mundo do React e React Native, o MVVM casa perfeitamente com o conceito de **Custom Hooks**. Dá para transformar um Custom Hook no nosso "ViewModel". Isso deixa a View focada só no que importa pra ela: montar a interface. Toda a lógica pesada, os estados e as chamadas de API ficam isoladas no ViewModel, deixando o código limpo, fácil de ler e muito mais fácil de testar.

---

## 2. Nova Estrutura de Arquivos

Para organizar, eu criaria uma pasta específica para a tela da Pokédex. Ao invés de deixar tudo solto na pasta `screens`, ficaria assim:

```text
PokedexApp/
├─ src/
│  ├─ screens/
│  │  └─ Pokedex/
│  │     ├─ PokedexScreen.tsx        (View - Apenas a interface visual)
│  │     └─ usePokedexViewModel.ts   (ViewModel - O Custom Hook com a lógica)
```

---

## 3. Divisão de Responsabilidades

**O que ficaria na View (`PokedexScreen.tsx`)?**
- O trabalho da View é só desenhar os componentes do React Native na tela: o `TextInput` de busca, a `FlatList` e o ícone de carregamento (`ActivityIndicator`).
- Ela não vai ter `useState` para guardar a lista de pokémons, nem `useEffect` fazendo requisição com `axios`.
- Ela vai apenas importar o hook e "consumir" o ViewModel logo no começo do componente, tipo assim: 
  `const { filteredPokemons, isLoading, search, setSearchQuery, loadMore } = usePokedexViewModel();`

**O que ficaria no ViewModel (`usePokedexViewModel.ts`)?**
- O ViewModel vai guardar os estados (usando `useState` internamente): a lista de pokémons (`list`), se está carregando algo (`isLoading`), o texto da busca (`search`), etc.
- Ele vai ter a lógica do `useEffect` para chamar o arquivo `services/api.ts` (nosso Model) quando a tela abrir.
- Ele vai retornar apenas as variáveis prontas e as funções que a View precisa para funcionar, como a função `setSearchQuery` (para atualizar o que o usuário digitou) e `loadMore` (para buscar a próxima página da lista).

---

## 4. Fluxo de Dados (Exemplo de Busca)

Imagina que o usuário quer achar o "Charmander". O fluxo passo a passo nessa nova arquitetura seria assim:

1. O usuário digita "Char" no `TextInput` que tá lá na View (`PokedexScreen`).
2. O evento `onChangeText` do `TextInput` chama a função `setSearchQuery('Char')`, que foi fornecida pelo ViewModel.
3. Dentro do ViewModel (`usePokedexViewModel`), essa função atualiza o estado interno da busca.
4. Ao atualizar esse estado, o ViewModel recalcula a variável `filteredPokemons` (filtrando a lista original para deixar só os que tem "char" no nome).
5. O React Native percebe que os dados do ViewModel mudaram e avisa a View.
6. A View se redesenha automaticamente, e a `FlatList` agora exibe apenas o card do Charmander!
