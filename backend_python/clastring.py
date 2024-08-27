from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score
import seaborn as sns
from mpl_toolkits.mplot3d import Axes3D
import pandas as pd
from resume import keywords





def find_optimal_clusters(data, max_k):
    """
    Utilise la méthode du coude pour trouver le nombre optimal de clusters.
    
    Parameters:
    data (array-like): Les données à analyser.
    max_k (int): Nombre maximum de clusters à essayer.
    
    Returns:
    int: Nombre optimal de clusters.
    """
    iters = range(2, max_k + 1)
    sse = []
    silhouettes = []

    for k in iters:
        kmeans = KMeans(n_clusters=k, random_state=0)
        kmeans.fit(data)
        sse.append(kmeans.inertia_)
        silhouettes.append(silhouette_score(data, kmeans.labels_))
        
        
        """
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    ax1.plot(iters, sse, marker='o')
    ax1.set_xlabel('Nombre de clusters')
    ax1.set_ylabel('Inertie')
    ax1.set_title('Méthode du coude')
    
    ax2.plot(iters, silhouettes, marker='o')
    ax2.set_xlabel('Nombre de clusters')
    ax2.set_ylabel('Score de silhouette')
    ax2.set_title('Score de silhouette')

    plt.show()
    """

    # Choisir le nombre de clusters avec le score de silhouette maximum
    optimal_k = iters[silhouettes.index(max(silhouettes))]
    print(f'Nombre optimal de clusters basé sur le score de silhouette: {optimal_k}')
    return optimal_k




import os
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import base64
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
from mpl_toolkits.mplot3d import Axes3D

def cluster_keywords(keywords, output_dir='graphs', max_clusters=10, perplexity=5):
    """
    Effectue le clustering des mots-clés, génère des graphiques et les stocke en format image
    tout en les encodant en base64 pour un éventuel envoi via une API.
    
    Parameters:
    keywords (list of str): Liste des mots-clés à analyser.
    output_dir (str): Dossier où stocker les graphiques générés.
    max_clusters (int): Nombre maximum de clusters à essayer.
    perplexity (int): Paramètre de perplexité pour t-SNE.
    
    Returns:
    clustered_words (dict): Dictionnaire des clusters et des mots-clés associés.
    base64_images (dict): Dictionnaire contenant les images encodées en base64.
    """
    # Filtrer les mots-clés pour s'assurer qu'ils sont tous des chaînes de caractères
    keywords = [str(keyword) for keyword in keywords if isinstance(keyword, str) or not isinstance(keyword, (list, dict, set, tuple))]

    if not keywords:
        raise ValueError("La liste des mots-clés est vide après filtrage des éléments non valides.")

    # Limiter le nombre maximum de clusters au nombre de mots-clés disponibles moins 1
    max_clusters = min(max_clusters, len(keywords) - 1)

    # Vectorisation TF-IDF
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(keywords)

    # Trouver le nombre optimal de clusters (cette fonction doit être implémentée)
    optimal_k = find_optimal_clusters(X, max_clusters)

    # Clustering K-means avec le nombre optimal de clusters
    kmeans = KMeans(n_clusters=optimal_k, random_state=0)
    kmeans.fit(X)
    labels = kmeans.labels_

    # Afficher les mots-clés par cluster
    clusters = {i: [] for i in range(optimal_k)}
    for keyword, label in zip(keywords, labels):
        clusters[label].append(keyword)

    clustered_words = {cluster: words for cluster, words in clusters.items()}

    # Créer le dossier si nécessaire
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    base64_images = {}

    # Visualisation et stockage en 2D
    tsne_2d = TSNE(n_components=2, perplexity=perplexity, random_state=0)
    X_tsne_2d = tsne_2d.fit_transform(X.toarray())

    df_2d = pd.DataFrame({'x': X_tsne_2d[:, 0], 'y': X_tsne_2d[:, 1], 'label': labels, 'keyword': keywords})

    plt.figure(figsize=(10, 8))
    sns.scatterplot(x='x', y='y', hue='label', data=df_2d, palette=sns.color_palette('hsv', optimal_k))
    for i in range(df_2d.shape[0]):
        plt.text(df_2d['x'][i], df_2d['y'][i], df_2d['keyword'][i], fontsize=9)
    plt.title('Clustering des mots-clés avec K-means et t-SNE (2D)')
    graph_path_2d = os.path.join(output_dir, 'tsne_2d.png')
    plt.savefig(graph_path_2d)
    plt.close()

    with open(graph_path_2d, "rb") as img_file:
        base64_images['tsne_2d'] = base64.b64encode(img_file.read()).decode('utf-8')

    # Visualisation et stockage en 3D
    tsne_3d = TSNE(n_components=3, perplexity=perplexity, random_state=0)
    X_tsne_3d = tsne_3d.fit_transform(X.toarray())

    df_3d = pd.DataFrame({'x': X_tsne_3d[:, 0], 'y': X_tsne_3d[:, 1], 'z': X_tsne_3d[:, 2], 'label': labels, 'keyword': keywords})

    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')
    scatter = ax.scatter(df_3d['x'], df_3d['y'], df_3d['z'], c=df_3d['label'], cmap='hsv')

    for i in range(df_3d.shape[0]):
        ax.text(df_3d['x'][i], df_3d['y'][i], df_3d['z'][i], df_3d['keyword'][i], fontsize=9)

    legend1 = ax.legend(*scatter.legend_elements(), title="Clusters")
    ax.add_artist(legend1)
    ax.set_title('Clustering des mots-clés avec K-means et t-SNE (3D)')
    graph_path_3d = os.path.join(output_dir, 'tsne_3d.png')
    plt.savefig(graph_path_3d)
    plt.close()

    with open(graph_path_3d, "rb") as img_file:
        base64_images['tsne_3d'] = base64.b64encode(img_file.read()).decode('utf-8')

    return clustered_words, base64_images

    
#test
if __name__ == "__main__": 

    file_path = "preprocessed_texts.txt"
    keywords = keywords(file_path)
    words_tfidf = [word for word, score in keywords[:10]]
    clustered_words,_ =cluster_keywords(words_tfidf)
    print (clustered_words)
