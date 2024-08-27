from collections import Counter
from nltk.util import ngrams
import matplotlib.pyplot as plt
import networkx as nx
from matplotlib.colors import to_hex

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # Prétraitement et tokenisation des lignes
    processed_lines = []
    for line in lines:
        # Enlever les espaces en début et fin de ligne
        line = line.strip()
        # Tokeniser la ligne en mots
        words = line.split()  # Vous pouvez utiliser word_tokenize si vous avez besoin de plus de complexité
        processed_lines.append(words)
    
    return processed_lines

def plot_ngrams(ngrams_counts, title="N-grams", n=10):
    """Visualiser les n-grams les plus fréquents."""
    top_ngrams = ngrams_counts.most_common(n)
    ngrams, counts = zip(*top_ngrams)
    ngrams = [' '.join(ngram) for ngram in ngrams]
    

    plt.figure(figsize=(12, 8))
    plt.barh(ngrams, counts, color='skyblue')
    plt.xlabel('Fréquence')
    plt.title(title)
    plt.gca().invert_yaxis()
    plt.show()


# Fonction pour extraire les n-grams
def get_ngrams(corpus, n):
    ngrams_list = []
    for doc in corpus:
        ngrams_list.extend(list(ngrams(doc, n)))
    return ngrams_list

folder_path= 'cleaned_texts/'



if __name__ == "__main__":
    filename = "preprocessed_texts.txt"
    processed_corpus = read_file(filename)

    # Extraire les bigrams et trigrams
    bigrams = get_ngrams(processed_corpus, 2)
    trigrams = get_ngrams(processed_corpus, 3)

    # Compter les occurrences des n-grams
    bigram_counts = Counter(bigrams)
    trigram_counts = Counter(trigrams)

    # Afficher les bigrams les plus fréquents
    print("Bigrams les plus fréquents :")
    for bigram, count in bigram_counts.most_common(10):
        print(f"{' '.join(bigram)}: {count}")


    plot_ngrams(bigram_counts, title="Top Bigrams", n=10)


    """
    # Créer le graphe
    G = nx.Graph()

    # Ajouter les bigrams au graphe
    for (word1, word2), count in bigram_counts.most_common(10):
        G.add_edge(word1, word2, weight=count)

    # Définir la disposition des nœuds
    pos = nx.spring_layout(G, k=0.5, iterations=50)

    # Configurer la taille de la figure
    plt.figure(figsize=(14, 10))

    # Dessiner les nœuds avec une couleur dégradée
    node_color = [G.degree(node) for node in G.nodes()]
    nx.draw_networkx_nodes(G, pos, node_size=700, node_color=node_color, cmap='coolwarm', node_shape='o', alpha=0.9)

    # Dessiner les arêtes avec une couleur dégradée en fonction du poids
    edges = G.edges(data=True)
    edge_weights = [e[2]['weight'] for e in edges]
    nx.draw_networkx_edges(G, pos, edgelist=edges, width=[w * 0.2 for w in edge_weights], alpha=0.7, edge_color=edge_weights, edge_cmap=plt.cm.Blues)

    # Ajouter les labels
    nx.draw_networkx_labels(G, pos, font_size=12, font_family='sans-serif')

    # Ajouter une légende pour les arêtes
    sm = plt.cm.ScalarMappable(cmap='Blues', norm=plt.Normalize(vmin=min(edge_weights), vmax=max(edge_weights)))
    sm.set_array([])
    plt.colorbar(sm, label='Poids des arêtes')

    # Configurer le titre et les axes
    plt.title("Graphe des Bigrams avec Poids des Arêtes", fontsize=16)
    plt.axis('off')

    # Afficher le graphe
    plt.show()
    """