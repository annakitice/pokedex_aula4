import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState('');
    
    // Novos estados para gerenciamento da requisição
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        // Garante que o loading está ativo e zera os erros antes de tentar buscar
        setIsLoading(true);
        setError(null);
        
        try {
            const list = await getPokemons(30);
            const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
            setPokemons(details);
        } catch (err) {
            // Se a Promise for rejeitada no arquivo api.ts, o catch captura aqui
            setError('Falha ao carregar Pokémons. Verifique sua conexão.');
        } finally {
            // O bloco finally sempre executa, independente de sucesso ou erro
            setIsLoading(false);
        }
        };
        
        fetchData();
    }, []);

    const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Pokédex</Text>

        <TextInput
            placeholder="Buscar pokémon..."
            style={styles.input}
            onChangeText={setSearch}
        />

        {/* Renderização Condicional baseada nos estados */}
        {isLoading ? (
            <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#e3350d" />
            <Text style={styles.loadingText}>Carregando Pokémons...</Text>
            </View>
        ) : error ? (
            <View style={styles.centerBox}>
            <Text style={styles.errorText}>{error}</Text>
            </View>
        ) : (
            <FlatList
            data={filtered}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => <PokemonCard pokemon={item} />}
            // Pequeno bônus: esconde a barra de rolagem lateral
            showsVerticalScrollIndicator={false} 
            />
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
    input: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    // Novos estilos para centralizar o loading e erro
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        color: '#d9534f', // Um tom de vermelho
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});