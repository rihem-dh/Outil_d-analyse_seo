import gensim
from gensim.models import Word2Vec
import preprocessor
import numpy as np





def word2vec(processed_docs):
    # Entraîner le modèle Word2Vec
    model = Word2Vec(sentences=processed_docs, vector_size=100, window=5, min_count=1, workers=4)
    
    return model



def get_keywords_for_document(doc, model, topn=10):
    # Calculer le vecteur moyen du document
    doc_vector = np.mean([model.wv[word] for word in doc if word in model.wv], axis=0)
    word_scores = {}
    
    # Calculer les scores pour chaque mot
    for word in doc:
        if word in model.wv:
            word_vector = model.wv[word]
            score = np.dot(word_vector, doc_vector)
            word_scores[word] = score
            
    # Trier les mots par score décroissant
    sorted_words = sorted(word_scores.items(), key=lambda kv: kv[1], reverse=True)
    return [word for word, score in sorted_words[:topn]]


#exemple
if __name__ == "__main__":

    #lire le contenue de la fichier qui contient les texts extraire du site et traiter
    file_path ='preprocessed_texts.txt'
    processed_docs = preprocessor.read_file(file_path) #liste des listes chaqune contenant les mots de chaque page web
    # Obtenir les mots-clés pour chaque document
    model=word2vec(processed_docs)
    for i, doc in enumerate(processed_docs):
        keywords = get_keywords_for_document(doc, model)
        print(f"Mots-clés pour le document {i+1}: {keywords}")



