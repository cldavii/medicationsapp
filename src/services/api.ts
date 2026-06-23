// IP da tua máquina local
export const BACKEND_URL = "http://10.123.4.225:3000";

// Intarface para formatar os dados retornados da API dados recife
export interface MedicationResponseFormat {
  _id: number;
  unidade: string;
  produto: string;
  distrito: number;
  quantidade: number;
}

// Interface para a API MedicationsAPI
export interface FavoriteItem {
  id?: string;
  api_id: number;
  produto: string;
  unidade: string;
  distrito: number;
}

interface QueryParams {
  search: string;
  districtId: string;
}

// Array com os IDs reais do Portal Dados Recife
export const districtsArray = [
  { name: "Distrito 1", id: "537f0b95-4eb7-4912-9d7c-32caf9fd68ac" },
  { name: "Distrito 2", id: "30e87813-b5a3-4cbd-b35e-b09156f52698" },
  { name: "Distrito 3", id: "832ae42d-0163-45e8-82c1-a4e00a5ec1b6" },
  { name: "Distrito 4", id: "a4d419a8-4355-4ae9-b116-9cc35b914f50" },
  { name: "Distrito 5", id: "77040c32-2a39-4416-ba93-5c7386b46dcb" },
  { name: "Distrito 6", id: "ac869f94-a655-4388-871b-9957b0a642a4" },
  { name: "Distrito 7", id: "97109f18-a189-4084-acaf-b3aff6e65d51" },
  { name: "Distrito 8", id: "2e411ebc-0bef-4e03-ae34-2b792b5468c2" },
];

export async function fetchFromRecifeApi(
  query: QueryParams,
): Promise<MedicationResponseFormat[]> {
  const base_url = "https://dados.recife.pe.gov.br/api/action/datastore_search";
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        // Força a entrada de texto ao padrão maiúsculo devido o padrão de retorno da API dados Recife
        q: query.search.toUpperCase(),
        resource_id: query.districtId,
        limit: 15,
      }),
    });
    const data = await response.json();
    return data.success ? data.result.records : [];
  } catch (error) {
    console.error("Erro na API do Recife:", error);
    return [];
  }
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/favorites`);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Erro ao procurar favoritos:", error);
    return [];
  }
}

export async function addFavorite(item: FavoriteItem): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function removeFavorite(apiId: number): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/favorites/${apiId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
