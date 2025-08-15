/**
 * Call OPENAI API
 * @customfunction ASK_GPT
 * @param {string} prompt Le texte à envoyer.
 * @returns {Promise<string>} La réponse de l'IA.
 */
export async function askGPT(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return "Veuillez fournir un prompt valide.";
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 secondes de timeout

    const response = await fetch("https://gpt-proxy.aherlin.workers.dev/gpt-light", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const txt = await response.text();
      return `Erreur HTTP proxy: ${response.status}. Réponse: ${txt}`;
    }
    const data = await response.json();
    return data.text || "";
  } catch (e) {
    return `Erreur de connexion (proxy) : ${e?.message || String(e)}`;
  }
}
