interface QueryParams {
  search: string;
  districtId: string;
}

// Listagem dos distritos dentro de um array
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

export async function Api(query: QueryParams) {
  const base_url =
    "https://dados.recife.pe.gov.br:443/api/action/datastore_search";
  try {
    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        q: query.search.toUpperCase(),
        resource_id: query.districtId,
        limit: 10,
      }),
    });
    const data = await response.json();
    if (data.success) {
      return data.result.records;
    } else {
      console.error("Não foi possível buscar esses dados na API");
      throw new Error("Não foi possível buscar esses dados na API");
    }
  } catch (error: any) {
    console.error("Erro durante a busca de dados na API:", error);
    return [];
  }
}
