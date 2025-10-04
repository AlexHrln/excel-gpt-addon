/**
 * Appelle l'API GPT via le proxy Cloudflare
 * @customfunction
 * @param {string} prompt Le texte à envoyer à GPT
 * @returns {string} La réponse de l'IA
 */
async function askGPT(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return "⚠️ Veuillez fournir un prompt valide.";
  }
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    
    const response = await fetch("https://gpt-proxy.aherlin.workers.dev/gpt-light", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      const txt = await response.text();
      return `❌ Erreur HTTP ${response.status}: ${txt}`;
    }
    
    const data = await response.json();
    return data.text || "";
    
  } catch (e) {
    if (e.name === 'AbortError') {
      return "⏱️ Timeout (>20s)";
    }
    return `❌ Erreur: ${e?.message || String(e)}`;
  }
}

// Enregistrement de la fonction personnalisée
CustomFunctions.associate("ASK_GPT", askGPT);
