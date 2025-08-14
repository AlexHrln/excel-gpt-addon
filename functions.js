/* global CustomFunctions */

const API_URL = "https://gpt-proxy.aherlin.workers.dev/gpt-light";

/**
 * @customfunction GPT_LIGHT
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function gptLight(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return "Veuillez fournir un prompt valide.";
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(API_URL, {
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

CustomFunctions.associate("GPT_LIGHT", gptLight);
