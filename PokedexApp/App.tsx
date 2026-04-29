import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PokedexScreen } from './screens/PokedexScreen';
import { PokemonDetailScreen } from './screens/PokemonDetailScreen';
import { Pokemon } from './types/Pokemon';

// Telas e parâmetros que o navegador terá
export type RootStackParamList = {
    Pokedex: undefined;
    Details: { pokemon: Pokemon };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Pokedex" component={PokedexScreen} />
            <Stack.Screen name="Details" component={PokemonDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </SafeAreaProvider>
    );
}