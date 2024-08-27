import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

def lda_model(processed_text):
    count_vectorizer = CountVectorizer()
    X = count_vectorizer.fit_transform(processed_text)

    # Initialiser LDA
    lda = LatentDirichletAllocation(n_components=5, random_state=0)  # Ajustez n_components selon vos besoins
    lda.fit(X)
    return lda, count_vectorizer

def print_topic_summaries(lda, count_vectorizer, num_top_words=10):
    terms = count_vectorizer.get_feature_names_out()
    topic_summaries = []
    
    for idx, topic in enumerate(lda.components_):
        top_terms_idx = topic.argsort()[:-num_top_words - 1:-1]
        top_terms = [terms[i] for i in top_terms_idx]
        topic_summaries.append(" , ".join(top_terms))
        print(f"Thème {idx}:")
        print(top_terms)
    
    return topic_summaries

def main_theme_summary(doc_topics, topic_summaries):
    # Calculer la somme des distributions de thèmes pour tous les documents
    total_topic_distribution = doc_topics.sum(axis=0)
    # Identifier le thème principal à travers tous les documents
    main_topic = total_topic_distribution.argmax()
    return main_topic, topic_summaries[main_topic]

if __name__ == "__main__":
    # Initialiser le vecteur de compte
    file_path = "preprocessed_texts.txt"
    processed_text = []
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    for line in lines:
        processed_text.append(line)
        
    lda, count_vectorizer = lda_model(processed_text)
    topic_summaries = print_topic_summaries(lda, count_vectorizer)

    # Affichage du résumé du thème principal pour l'ensemble des documents
    doc_topics = lda.transform(count_vectorizer.transform(processed_text))
    main_topic, main_topic_summary = main_theme_summary(doc_topics, topic_summaries)
    print(f"Thème principal global: {main_topic}")
    print(f"Résumé global: {main_topic_summary}")

    # Visualisation des thèmes avec matplotlib (barres des termes les plus importants pour chaque thème)
    fig, axes = plt.subplots(nrows=1, ncols=lda.n_components, figsize=(20, 10), sharex=True, sharey=True)
    terms = count_vectorizer.get_feature_names_out()
    for idx, topic in enumerate(lda.components_):
        ax = axes[idx]
        top_terms_idx = topic.argsort()[:-11:-1]
        top_terms = [terms[i] for i in top_terms_idx]
        top_terms_scores = topic[top_terms_idx]
        ax.barh(top_terms, top_terms_scores)
        ax.set_title(f"Thème {idx}")
        ax.invert_yaxis()

    plt.tight_layout()
    plt.show()
