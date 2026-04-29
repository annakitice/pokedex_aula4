import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../App';
import { capitalize } from '../utils/format';

export const PokemonDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
    const navigation = useNavigation();
    const { pokemon } = route.params;

    const [extraInfo, setExtraInfo] = useState<{height: number, weight: number, description: string} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
        try {
            // 1. Busca detalhes básicos (altura e peso)
            const detailRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
            
            // 2. Busca a espécie para pegar a descrição (flavor text)
            const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
            
            // Filtra para pegar a primeira descrição em inglês
            const description = speciesRes.data.flavor_text_entries.find(
                (entry: any) => entry.language.name === 'en'
            ).flavor_text.replace(/\n|\f/g, ' '); // Limpa caracteres especiais de quebra de linha

            setExtraInfo({
                height: detailRes.data.height,
                weight: detailRes.data.weight,
                description
            });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [pokemon.id]);

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
            <Image source={{ uri: pokemon.image }} style={styles.image} />
            <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
            <View style={styles.typeRow}>
            {pokemon.types.map(t => (
                <View key={t} style={styles.typeBadge}>
                <Text style={styles.typeText}>{capitalize(t)}</Text>
                </View>
            ))}
            </View>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#e3350d" style={{ marginTop: 20 }} />
        ) : (
            <View style={styles.infoCard}>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                <Text style={styles.statLabel}>Altura</Text>
                <Text style={styles.statValue}>{extraInfo ? extraInfo.height / 10 : '--'} m</Text>
                </View>
                <View style={styles.statItem}>
                <Text style={styles.statLabel}>Peso</Text>
                <Text style={styles.statValue}>{extraInfo ? extraInfo.weight / 10 : '--'} kg</Text>
                </View>
            </View>
            
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.description}>{extraInfo?.description}</Text>
            </View>
        )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    backButton: { 
        padding: 16 
    },
    backText: { 
        fontSize: 18, 
        color: '#e3350d', 
        fontWeight: 'bold' 
    },
    header: { 
        alignItems: 'center', 
        padding: 20 
    },
    image: { 
        width: 200, 
        height: 200 
    },
    name: { 
        fontSize: 36, 
        fontWeight: 'bold', 
        marginVertical: 10 
    },
    typeRow: { 
        flexDirection: 'row', 
        gap: 8 
    },
    typeBadge: { 
        backgroundColor: '#666', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20 
    },
    typeText: { 
        color: 'white', 
        fontWeight: 'bold' 
    },
    infoCard: { 
        backgroundColor: 'white', 
        margin: 16, 
        borderRadius: 20, 
        padding: 20, 
        elevation: 4 
    },
    statsRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: 20 
    },
    statItem: { 
        alignItems: 'center' 
    },
    statLabel: { 
        color: '#999', 
        fontSize: 14 
    },
    statValue: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10
     },
    description: { 
        fontSize: 16, 
        color: '#444', 
        lineHeight: 24, 
        textAlign: 'justify' 
    }
});