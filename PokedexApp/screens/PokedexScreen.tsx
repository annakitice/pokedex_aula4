import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState('');
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const list = await getPokemons(30);
            const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
            setPokemons(details);
        } catch (err) {
            setError('Falha ao carregar Pokémons. Verifique sua conexão.');
        } finally {
            setIsLoading(false);
        }
        };
        
        fetchData();
    }, []);

    const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

    // Função que retorna o componente de lista vazia
    const renderEmptyList = () => {
        return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
            {search.trim() !== '' 
                ? `Nenhum Pokémon encontrado para '${search}'`
                : 'Nenhum Pokémon para exibir no momento.'}
            </Text>
        </View>
        );
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Pokédex</Text>

        <TextInput
            placeholder="Buscar pokémon..."
            style={styles.input}
            onChangeText={setSearch}
        />

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
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
            // Garante que o contêiner vazio ocupe a tela toda para centralizar o texto
            contentContainerStyle={filtered.length === 0 ? styles.emptyListContent : null}
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
        color: '#d9534f',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    }
});