"""
import os
import scraper
import cleaner
import preprocessor
import semantic_analysis
from crawler import get_internal_links
from gsc_api import get_top_pages

# URL du site web à analyser
site_url = 'https://www.tocodepro.com'

# Obtention des pages internes du site via l'API Google Search Console
top_pages = get_top_pages(site_url)

# Obtention des pages internes du site via crawling
internal_links = get_internal_links(site_url)

# Combinaison des URLs obtenues via l'API et le crawling
all_urls = set(top_pages).union(internal_links)

# Scraping des sites web
output_dir = 'scraped_html'
os.makedirs(output_dir, exist_ok=True)
for url in all_urls:
    scraper.scrape_website(url, output_dir)

# Nettoyage des données
cleaned_dir = 'cleaned_texts'
os.makedirs(cleaned_dir, exist_ok=True)
for filename in os.listdir(output_dir):
    input_file = os.path.join(output_dir, filename)
    output_file = os.path.join(cleaned_dir, filename.replace('.html', '.txt'))
    cleaner.clean_html(input_file, output_file)

# Prétraitement des textes
preprocessed_file = 'preprocessed_texts.txt'
with open(preprocessed_file, 'w', encoding='utf-8') as out_file:
    for filename in os.listdir(cleaned_dir):
        with open(os.path.join(cleaned_dir, filename), 'r', encoding='utf-8') as file:
            raw_text = file.read()
            cleaned_text = preprocessor.preprocess_text(raw_text)
            out_file.write(cleaned_text + '\n')

# Analyse sémantique
semantic_analysis.tfidf_analysis(preprocessed_file)
semantic_analysis.lda_modeling(preprocessed_file)
"""



#code sans api
import os
import scraper
import cleaner
import preprocessor
import semantic_analysis
import seo_onpage
#import lda
from crawler import get_internal_links
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from nltk.tokenize import word_tokenize
import matplotlib.pyplot as plt

# Fonction pour obtenir le nom du site à partir de l'URL
def get_site_name(url):
    parsed_url = urlparse(url)
    
    name=parsed_url.netloc
    
    # Supprimer les préfixes www. si présents
    if name.startswith('www.'):
        name = name[4:]

    # Supprimer le suffixe .com
    if name.endswith('.com'):
        name =name[:-4]
        
    return name

# URL du site web à analyser
site_url = 'https://www.tocodepro.com'
site_name=get_site_name(site_url)
print ("le nom du site est : ", site_name)

# Obtention des pages internes du site via crawling
internal_links = get_internal_links(site_url)

# Scraping des sites web
output_dir = 'scraped_html'
os.makedirs(output_dir, exist_ok=True)
for url in internal_links:
    scraper.scrape_website(url, output_dir)


cleaned_dir = 'cleaned_texts'
titles = [site_name]
os.makedirs(cleaned_dir, exist_ok=True)
for filename in os.listdir(output_dir):
    
    # Extraire le titre du fichier HTML
    title = seo_onpage.get_title_from_html_file(filename)

    # Ajouter chaque mot à la liste `titles`
    for t in title:
       titles.append(t)
       
    #verification des elements seo on page
    
    print("verification des elements seo on page de la page :" )
    if seo_onpage.get_title_from_html_file:
        print(seo_onpage.check_seo_elements(filename))
    else:
        print("aucun probléme de seo onpage  :) .")
    
    # Nettoyage des données: suppression des balises html
    input_file = os.path.join(output_dir, filename)
    output_file = os.path.join(cleaned_dir, filename.replace('.html', '.txt'))
    cleaner.clean_html(input_file, output_file)

# Prétraitement des textes
preprocessed_file = 'preprocessed_texts.txt'
with open(preprocessed_file, 'w', encoding='utf-8') as out_file:
    for filename in os.listdir(cleaned_dir):
        with open(os.path.join(cleaned_dir, filename), 'r', encoding='utf-8') as file:
            raw_text = file.read()
            cleaned_text = preprocessor.preprocess_text(raw_text,titles)
            out_file.write(cleaned_text + '\n')

# Analyse sémantique
input_file = "preprocessed_texts.txt"
output_file = "output_file.txt"


top_words, word_freq = semantic_analysis.tfidf_analysis(input_file)

# Afficher l'histogramme
plt.figure(figsize=(10, 6))
plt.bar(top_words, [word_freq[word] for word in top_words], color='skyblue')
plt.xlabel('Mots clés')
plt.ylabel('Fréquence')
plt.title('Distribution des mots clés basée sur TF-IDF')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()

#lda.lda_model_function(input_file)
