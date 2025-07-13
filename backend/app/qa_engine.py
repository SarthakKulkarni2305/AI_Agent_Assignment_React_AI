from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    Settings,
    StorageContext,
    load_index_from_storage
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama
import tempfile
import os
import hashlib

INDEX_DIR = "./persisted_index"
os.makedirs(INDEX_DIR, exist_ok=True)

Settings.llm = Ollama(model="mistral", request_timeout=60)
Settings.embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

INDEX_CACHE = {}
CURRENT_HASH = None

def hash_text(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def build_index_and_ask_question(text, question):
    global INDEX_CACHE, CURRENT_HASH

    if not text or len(text.strip()) < 50:
        print("⚠️ Text too short or empty")
        return "⚠️ PDF content is too short or could not be extracted properly."

    text_hash = hash_text(text)

    try:
        if text_hash != CURRENT_HASH:
            CURRENT_HASH = text_hash

            with tempfile.NamedTemporaryFile(delete=False, suffix=".txt", mode="w", encoding="utf-8") as f:
                f.write(text)
                temp_path = f.name

            documents = SimpleDirectoryReader(input_files=[temp_path]).load_data()

            required_files = ["docstore.json", "vector_store.json", "index_store.json"]
            index_complete = all(os.path.exists(os.path.join(INDEX_DIR, file)) for file in required_files)

            if index_complete:
                storage_context = StorageContext.from_defaults(persist_dir=INDEX_DIR)
                index = load_index_from_storage(storage_context)
            else:
                storage_context = StorageContext.from_defaults()
                index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
                index.storage_context.persist(persist_dir=INDEX_DIR)

            INDEX_CACHE[text_hash] = index
            os.remove(temp_path)
        else:
            index = INDEX_CACHE[text_hash]

        query_engine = index.as_query_engine(response_mode="compact")
        response = query_engine.query(question)

        print("🧠 Answer:", response.response)

        if not response or not response.response.strip():
            return "⚠️ No answer found. Please try rephrasing the question or check the document."

        return response.response

    except Exception as e:
        print("❌ LLM query failed:", str(e))
        return "⛔ LLM is taking too long or encountered an error. Please try again or refresh."
