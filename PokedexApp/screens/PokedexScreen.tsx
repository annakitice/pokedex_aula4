import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

const LIMIT = 30;

export const PokedexScreen = () => {
    const insets = useSafeAreaInsets(); // Obtendo os valores dinâmicos
    
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    useEffect(() => {
        const fetchInitialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const list = await getPokemons(LIMIT, 0);
            const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
            setPokemons(details);
        } catch (err) {
            setError('Falha ao carregar Pokémons. Verifique sua conexão.');
        } finally {
            setIsLoading(false);
        }
        };
        fetchInitialData();
    }, []);

    const loadMorePokemons = async () => {
        if (isLoadingMore || isLoading || error || search.trim() !== '') return;
        setIsLoadingMore(true);
        try {
            const nextOffset = offset + LIMIT;
            const list = await getPokemons(LIMIT, nextOffset);
            const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
            setPokemons(prev => [...prev, ...details]);
            setOffset(nextOffset);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

    return (
        // paddingTop dinâmico vindo do hook aqui
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
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
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    {search.trim() !== '' 
                    ? `Nenhum Pokémon encontrado para '${search}'`
                    : 'Nenhum Pokémon para exibir no momento.'}
                </Text>
                </View>
            )}
            contentContainerStyle={filtered.length === 0 ? styles.emptyListContent : { paddingBottom: insets.bottom + 20 }}
            onEndReached={loadMorePokemons}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => isLoadingMore ? (
                <View style={styles.footerContainer}>
                <ActivityIndicator size="large" color="#e3350d" />
                </View>
            ) : null}
            />
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingHorizontal: 16 
        // paddingTop removido daqui para ser dinâmico lá em cima
    },
    title: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 12 
    },
    input: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    centerBox: { 
        flex: 1, 
        justifyContent: 
        'center', 
        alignItems: 'center' 
    },
    loadingText: { 
        marginTop: 10,
        fontSize: 16, 
        color: '#666' 
    },
    errorText: { 
        color: '#d9534f', 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
    emptyContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 40 
    },
    emptyText: { 
        fontSize: 16, 
        color: '#666', 
        textAlign: 'center', 
        fontStyle: 'italic' 
    },
    emptyListContent: { 
        flexGrow: 1, 
        justifyContent: 'center' 
    },
    footerContainer: { 
        paddingVertical: 20, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
});