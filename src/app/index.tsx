import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Api, districtsArray } from "@/services/api";
import { useState } from "react";

interface MedicationReponseFormat {
  _id: string;
  produto: string;
  unidade: string;
  quantidade: number;
}

export default function Index() {
  const [search, setSearch] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [result, setResult] = useState<MedicationReponseFormat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Pegando os dados da API
  async function getApiData(search: string, districtId: string) {
    // Verificando se o campo de pesquisa não está nulo
    if (!search.trim()) return;

    setLoading(true);

    try {
      // Buscando o medicamento no distrito selecionado
      const data = await Api({ search: search, districtId: districtId });
      setResult(data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectedDistrict(selectedDistrict: string) {
    setDistrictId(selectedDistrict);
    getApiData(search, selectedDistrict);
  }

  function defineDefaultDistrict() {
    // Se o usuário apertar "buscar" mas não escolheu um distrito, usamos o distrito 1 por padrão
    const selectedDistrict = districtId || districtsArray[0].id;
    if (!districtId) {
      setDistrictId(districtsArray[0].id);
    }
    getApiData(search, selectedDistrict);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicamentos</Text>

      <TextInput
        style={styles.input}
        placeholder="Pesquise o medicamento"
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={defineDefaultDistrict}
      />

      <View style={styles.districtContainer}>
        <FlatList
          data={districtsArray}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = item.id === districtId;
            return (
              <TouchableOpacity
                style={[
                  styles.districtButton,
                  isSelected && styles.districtButtonSelected,
                ]}
                onPress={() => handleSelectedDistrict(item.id)}
              >
                <Text
                  style={[
                    styles.districtButtonText,
                    isSelected && styles.districtButtonSelectedText,
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
          data={result}
          keyExtractor={(item) => item._id.toString()}
          style={styles.resultsList}
          contentContainerStyle={{ paddingBottom: 20 }}
          // O que aparece se a busca não retornar nada
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              {search
                ? "Nenhum medicamento encontrado para este distrito"
                : "Pesquise um medicamento"}
            </Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.produto}</Text>
              <Text style={styles.cardSubtitle}>{item.unidade}</Text>
              <View style={styles.stockBadge}>
                <Text
                  style={
                    item.quantidade > 0 ? styles.inStock : styles.outOfStock
                  }
                >
                  Estoque: {item.quantidade} unidades
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
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    width: "90%",
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  districtContainer: {
    height: 50,
    marginBottom: 15,
    paddingLeft: "5%",
  },
  districtButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    height: 40,
  },
  districtButtonSelected: {
    backgroundColor: "#007BFF",
  },
  districtButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  districtButtonSelectedText: {
    color: "#FFF",
  },
  resultsList: {
    width: "90%",
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  stockBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  inStock: {
    color: "#2E7D32",
    fontWeight: "bold",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outOfStock: {
    color: "#C62828",
    fontWeight: "bold",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
