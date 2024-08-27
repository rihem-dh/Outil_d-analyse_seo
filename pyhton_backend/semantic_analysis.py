# semantic_analysis.py
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
import pandas as pd
from sklearn.decomposition import LatentDirichletAllocation
import matplotlib.pyplot as plt


nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens if token.isalpha()]
    tokens = [token for token in tokens if token not in stop_words]
    return ' '.join(tokens)

def tfidf_analysis(input_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as file:
            texts = file.readlines()
            preprocessed_texts = [text.strip() for text in texts]  # Supprimer les espaces et sauts de ligne

            # Calculer TF-IDF
            tfidf_vectorizer = TfidfVectorizer(max_features=1000)
            tfidf_matrix = tfidf_vectorizer.fit_transform(preprocessed_texts)

            feature_names = tfidf_vectorizer.get_feature_names_out()

            # Extraire les mots clés principaux par document
            top_keywords = []
            for doc_idx in range(tfidf_matrix.shape[0]):
                doc = tfidf_matrix.getrow(doc_idx)
                top_indices = doc.toarray().argsort()[0][::-1][:5]  # Top 5 indices
                keywords = [feature_names[idx] for idx in top_indices]
                top_keywords.extend(keywords)

            # Calculer la fréquence des mots clés
            word_freq = {}
            for word in top_keywords:
                if word in word_freq:
                    word_freq[word] += 1
                else:
                    word_freq[word] = 1

            # Trier les mots par fréquence
            sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
            top_words = [word[0] for word in sorted_words[:20]]  # Top 20 mots clés par fréquence

            
            return top_words, word_freq
        
        
        
            

    except Exception as e:
        print(f"Erreur lors de l'analyse TF-IDF : {str(e)}")
    
        
        
