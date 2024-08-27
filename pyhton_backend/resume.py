import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import matplotlib.pyplot as plt
from collections import Counter
from lda import lda_model
from word2vec import word2vec
from preprocessor import read_file
import seo_onpage
import os
import base64
from io import BytesIO

def generate_tfidf_graph(sorted_keywords, output_dir='graphs'):
    # Extraire les mots-clés et leurs scores
    words_tfidf = [word for word, score in sorted_keywords[:10]]
    scores_tfidf = [score for word, score in sorted_keywords[:10]]
    
    # Créer le répertoire de sortie s'il n'existe pas
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Nom du fichier d'image
    graph_filename = os.path.join(output_dir, 'tfidf_graph.png')
    
    # Générer le graphique
    plt.figure(figsize=(10, 6))
    plt.bar(words_tfidf, scores_tfidf)
    plt.xlabel('Mots-Clés')
    plt.ylabel('Scores TF-IDF')
    plt.title('Scores TF-IDF des 10 Mots-Clés les Plus Fréquents')
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    # Sauvegarder le graphique sous forme d'image
    plt.savefig(graph_filename)
    plt.close()
    
    return graph_filename

def generate_tfidf_graph_base64(sorted_keywords):
    # Extraire les mots-clés et leurs scores
    words_tfidf = [word for word, score in sorted_keywords[:10]]
    scores_tfidf = [score for word, score in sorted_keywords[:10]]

    # Générer le graphique
    plt.figure(figsize=(10, 6))
    plt.bar(words_tfidf, scores_tfidf)
    plt.xlabel('Mots-Clés')
    plt.ylabel('Scores TF-IDF')
    plt.title('Scores TF-IDF des 10 Mots-Clés les Plus Fréquents')
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Sauvegarder le graphique dans un objet BytesIO
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    # Encoder l'image en base64
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

    return image_base64




# Fonction pour obtenir les mots-clés
def get_top_keywords(lda_model, vectorizer, num_keywords=5):
    terms = vectorizer.get_feature_names_out()
    topic_keywords = []
    for topic in lda_model.components_:
        top_keywords_idx = topic.argsort()[-num_keywords:][::-1]
        top_keywords = [terms[i] for i in top_keywords_idx]
        topic_keywords.append(top_keywords)
    return topic_keywords


# Utiliser Word2Vec pour obtenir des mots similaires
def get_similar_words(keywords, model, topn=3):
    similar_words = set()
    for keyword in keywords:
        if keyword in model.wv:
            similar_words.update([word for word, _ in model.wv.most_similar(keyword, topn=topn)])
    return list(similar_words)



#fonction pour recuperer les mots clees
def keywords(file_path ):
    processed_docs = read_file(file_path)
    # Reconvertir les documents en format texte
    processed_text = [" ".join(doc) for doc in processed_docs]
    lda, vectorizer = lda_model(processed_text)
    # Obtenir les mots-clés principaux
    top_keywords = get_top_keywords(lda, vectorizer)

    w2v_model = word2vec(processed_docs)
    # Aplatir la liste des mots-clés
    flat_keywords = [keyword for sublist in top_keywords for keyword in sublist]

    # Obtenir des mots similaires
    similar_words = get_similar_words(flat_keywords, w2v_model)

    # Combiner les mots-clés et les mots similaires
    all_keywords = list(set(flat_keywords + similar_words))

    # Calculer TF-IDF
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(processed_text)
    # Calculer les scores TF-IDF pour les mots-clés combinés
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = {word: 0 for word in all_keywords}
    for word in all_keywords:
        if word in feature_names:
            idx = feature_names.tolist().index(word)
            tfidf_scores[word] = np.mean(X[:, idx].toarray())

    # Trier les mots-clés par score TF-IDF
    sorted_keywords = sorted(tfidf_scores.items(), key=lambda item: item[1], reverse=True)

    # Générer une phrase cohérente
    #summary_keywords = [word for word, score in sorted_keywords[:10]]
    return sorted_keywords




#fonction qui fait la comparaison entre les mots-clés obtenues et celui declarer dans la meta keywords
def compare_keywords(words_tfidf, html_directory):
    declared_keywords = []
    
    for filename in os.listdir(html_directory):
        file_path = os.path.join(html_directory, filename)
        if os.path.isfile(file_path):
            keywords = seo_onpage.get_keywords(file_path)
            if keywords:
                declared_keywords.extend(keywords)
        
    # Supprimer les doublons dans la liste des mots-clés déclarés
    declared_keywords = list(set(declared_keywords))
    
    # Comparaison des mots-clés déclarés avec les mots-clés TF-IDF
    if declared_keywords != words_tfidf[:len(declared_keywords)]:
        compare = (f"Les mots-clés déclarés {declared_keywords} "
                   f"ne sont pas optimaux. Il est préférable de les remplacer par "
                   f"{words_tfidf[:len(declared_keywords)]}.")
    else:
        compare = "Les mots-clés déclarés sont déjà optimaux."
    
    return compare




#test
if __name__ == "__main__": 

    directory='scraped_html'
    file_path = "preprocessed_texts.txt"
    
    sorted_keywords = keywords(file_path)
    
    # Afficher les scores TF-IDF
    print("Scores TF-IDF des mots-clés :")
    for word, score in sorted_keywords[:10]:
        print(f"{word}: {score:.4f}")


    # Générer un graphique des scores TF-IDF des 10 mots-clés les plus fréquents
    words_tfidf = [word for word, score in sorted_keywords[:10]]
    scores_tfidf = [score for word, score in sorted_keywords[:10]]
    
    compare_keywords(words_tfidf,directory)

    generate_tfidf_graph(sorted_keywords)
    
   






"""
summary_sentence = " ".join(summary_keywords)

print("Phrase décrivant le contenu du site :")
print(summary_sentence)
"""







