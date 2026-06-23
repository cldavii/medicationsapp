import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchFromRecifeApi,
  districtsArray,
  addFavorite,
  removeFavorite,
  getFavorites,
  MedicationResponseFormat,
} from "../services/api";

export default function Index() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MedicationResponseFormat[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Sincroniza os favoritos guardados no banco de dados assim que a app abre
  useEffect(() => {
    syncFavorites();
  }, []);

  const syncFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs.map((f) => f.api_id));
  };

  const handleSearch = async (districtId: string, searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    const data = await fetchFromRecifeApi({ search: searchTerm, districtId });
    setResults(data);
    setLoading(false);
  };

  const handleToggleFavorite = async (item: MedicationResponseFormat) => {
    const isFav = favoriteIds.includes(item._id);
    if (isFav) {
      const success = await removeFavorite(item._id);
      if (success)
        setFavoriteIds((prev) => prev.filter((id) => id !== item._id));
    } else {
      const success = await addFavorite({
        api_id: item._id,
        produto: item.produto,
        unidade: item.unidade,
        distrito: item.distrito,
      });
      if (success) setFavoriteIds((prev) => [...prev, item._id]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicamentos</Text>
        <TouchableOpacity
          style={styles.navFavButton}
          onPress={() => router.push("/favorites")}
        >
          <Ionicons name="heart" size={20} color="#FF3B30" />
          <Text style={styles.navFavText}>Favoritos</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Digita o nome do remédio..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={() =>
          handleSearch(selectedDistrictId || districtsArray[0].id, search)
        }
      />

      <View style={styles.districtContainer}>
        <FlatList
          data={districtsArray}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedDistrictId;
            return (
              <TouchableOpacity
                style={[
                  styles.districtButton,
                  isSelected && styles.districtButtonSelected,
                ]}
                onPress={() => {
                  setSelectedDistrictId(item.id);
                  handleSearch(item.id, search);
                }}
              >
                <Text
                  style={[
                    styles.districtButtonText,
                    isSelected && styles.districtButtonTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id.toString()}
          style={styles.resultsList}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              {search
                ? "Nenhum resultado para este distrito."
                : "Pesquisa um medicamento para começar."}
            </Text>
          )}
          renderItem={({ item }) => {
            const isFav = favoriteIds.includes(item._id);
            return (
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{item.produto}</Text>
                  <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={24}
                      color={isFav ? "#FF3B30" : "#888"}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardSubtitle}>{item.unidade}</Text>
                <Text
                  style={
                    item.quantidade > 0 ? styles.inStock : styles.outOfStock
                  }
                >
                  Estoque: {item.quantidade} unidades
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A" },
  navFavButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  navFavText: { marginLeft: 6, fontWeight: "600", color: "#4A5568" },
  input: {
    backgroundColor: "#FFF",
    width: "90%",
    alignSelf: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    marginBottom: 15,
  },
  districtContainer: { height: 50, paddingLeft: "5%" },
  districtButton: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    height: 40,
  },
  districtButtonSelected: { backgroundColor: "#007BFF" },
  districtButtonText: { color: "#4A5568", fontWeight: "600" },
  districtButtonTextSelected: { color: "#FFF" },
  resultsList: { width: "90%", alignSelf: "center" },
  emptyText: {
    textAlign: "center",
    color: "#718096",
    marginTop: 40,
    fontSize: 15,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    flex: 1,
    paddingRight: 10,
  },
  cardSubtitle: { fontSize: 14, color: "#718096", marginVertical: 6 },
  inStock: { color: "#2F855A", fontWeight: "bold", marginTop: 4 },
  outOfStock: { color: "#C53030", fontWeight: "bold", marginTop: 4 },
});
