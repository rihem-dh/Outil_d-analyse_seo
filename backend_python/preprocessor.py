import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import os
from nltk import pos_tag
import spacy
from bs4 import BeautifulSoup

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')


generic_words_to_filter = set([
    "comment", "acheter", "meilleur", "gratuit", "télécharger", "trouver", "obtenir", 
    "comparer", "prix", "top", "guide", "avis", "promotion", "réduction", "bon", "plan", 
    "économiser", "solde", "soldes", "promo", "contact", "accueil", "à propos", "services", 
    "actualités", "entreprise", "propos", "nos", "produits", 'january', 'february', 'march', 
    'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'today', 
    'tomorrow', 'yesterday', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 
    'nine', 'ten', 'am', 'pm', 'morning', 'afternoon', 'evening', 'night', 'janvier', 
    'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 
    'novembre', 'décembre', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 
    'dimanche', 'aujourd\'hui', 'demain', 'hier', 'un', 'deux', 'trois', 'quatre', 'cinq', 
    'six', 'sept', 'huit', 'neuf', 'dix', 'matin', 'après-midi', 'soir', 'nuit','else','input','acceuil','function','fonction','width','height','button','none',
    'chacun','chacune','moins','arabe','français','anglais','english','img','radio','question'
    "facebook",
    "twitter",
    "instagram",
    "linkedIn",
    "tiktok",
    "snapchat",
    "pinterest",
    "reddit",
    "youTube",
    "whatsApp",
    "tumblr",
    "flickr",
    "quora",
    "vimeo",
    "discord",
    "telegram",
    "weChat",
    "mix",
    "goodreads",
    "baidu tieba"
])



# Load the French language model
nlp = spacy.load("fr_core_news_sm")


# Charger les stopwords pour l'anglais
stop_words_english = set(stopwords.words('english'))

# Charger les stopwords pour le français
stop_words_french = set(stopwords.words('french'))

# Combiner les deux ensembles de stopwords
stop_words = stop_words_english.union(stop_words_french)
filtred_words = stop_words.union(generic_words_to_filter)
lemmatizer = WordNetLemmatizer()




def preprocess_text(text ,titles ):
    
    
    # Tokenisation et lemmatisation (obtenir les mots dans son nature d'origine) avec la longueur minimale du mot qui est 3
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens if token.isalpha() and len(token) > 2]
    #titre1= titre.replace(" ", "")
    # Filtrage des stopwords et autres mot non significatif
    tokens = [token for token in tokens if (token not in filtred_words and token not in titles)]
    
    # Filtrage basé sur la partie du discours (noms et adjectifs)   ==> laisser que les noms et les adjectifs
    tokens_pos = pos_tag(tokens)
    tokens = [token for token, pos in tokens_pos if pos.startswith('NN') or pos.startswith('JJ')]
    tokens = [token for token in tokens if nlp(token)[0].pos_ in {'NOUN', 'ADJ'}]
    
    return ' '.join(tokens)


#lire un fichier en donnant une liste des listes contenat les mots de chaque
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




if __name__ == "__main__":
    input_dir = 'cleaned_texts'
    output_file = 'preprocessed_texts.txt'
    titre = "to code pro"
    with open(output_file, 'w', encoding='utf-8') as out_file:
        for filename in os.listdir(input_dir):
            with open(os.path.join(input_dir, filename), 'r', encoding='utf-8') as file:
                raw_text = file.read()
                cleaned_text = preprocess_text(raw_text,titre)
                out_file.write(cleaned_text + '\n')

    print(f"Textes prétraités enregistrés dans {output_file}.")
    
    
    
