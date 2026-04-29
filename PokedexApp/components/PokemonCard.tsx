import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon } from '../types/Pokemon';
import { capitalize } from '../utils/format'; 
import { RootStackParamList } from '../App';

interface Props {
    pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('Details', { pokemon })}
        >
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        margin: 8,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    image: { width: 80, height: 80 },
    name: { marginTop: 8, fontWeight: 'bold' },
});