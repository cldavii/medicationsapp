// app/favorites.tsx
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, removeFavorite, FavoriteItem } from "../services/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data);
    setLoading(false);
  };

  const handleUnfavorite = async (apiId: number) => {
    const success = await removeFavorite(apiId);
    if (success) {
      // Remove do array de estados local de forma reativa
      setFavorites((prev) => prev.filter((item) => item.api_id !== apiId));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Meus Favoritos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF3B30" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.api_id.toString()}
          style={styles.list}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              Ainda não tens nenhum medicamento nos favoritos.
            </Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>{item.produto}</Text>
                <TouchableOpacity onPress={() => handleUnfavorite(item.api_id)}>
                  <Ionicons name="heart" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardSubtitle}>{item.unidade}</Text>
              <View style={styles.districtBadge}>
                <Text style={styles.districtBadgeText}>
                  Distrito Sanitário {item.distrito}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", paddingTop: 20 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginLeft: "5%",
    marginBottom: 15,
  },
  list: { width: "90%", alignSelf: "center" },
  emptyText: {
    textAlign: "center",
    color: "#718096",
    marginTop: 40,
    fontSize: 16,
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
  districtBadge: {
    backgroundColor: "#EBF5FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  districtBadgeText: { fontSize: 12, color: "#007BFF", fontWeight: "600" },
});
