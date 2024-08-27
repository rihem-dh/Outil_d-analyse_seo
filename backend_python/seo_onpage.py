import requests
from bs4 import BeautifulSoup
from nltk.tokenize import word_tokenize
import nltk
import string


def check_seo_elements(html_file):
    try:
        
        with open(html_file, 'r', encoding='utf-8') as file:
            html_content = file.read()
        soup = BeautifulSoup(html_content, "html.parser")

        results = []

        # Vérification de la balise <title>
        title_tag = soup.find('title')
        if not title_tag:
            results.append("Balise <title> non trouvée. ")

        # Vérification des balises de titre <h1>, <h2>, <h3>
        
        for level in range(1, 4):
            headers = soup.find_all(f'h{level}')
            if not headers:
                results.append(f"Titre h{level} n'existe pas. ")

        # Vérification de la balise <meta name="description">
        meta_description = soup.find('meta', attrs={'name': 'description'})
        if not (meta_description and 'content' in meta_description.attrs):
            results.append("Balise <meta name='description'> non trouvée ou manquante d'attribut 'content'.")

        # Vérification des URLs des images avec attribut alt
        img_tags = soup.find_all('img')
        for img in img_tags:
            alt_text = img.get('alt', '').strip()
            if not alt_text:
                results.append(f"Image sans attribut alt : {img['src']}")

        # Vérification de la balise <meta charset="UTF-8">
        charset_meta = soup.find('meta', charset='UTF-8')
        if not charset_meta:
            results.append("Balise <meta charset='UTF-8'> non trouvée.")

        # Vérification de la balise <meta name="viewport">
        viewport_meta = soup.find('meta', attrs={'name': 'viewport'})
        if not (viewport_meta and 'content' in viewport_meta.attrs):
            results.append("Balise <meta name='viewport'> non trouvée ou manquante d'attribut 'content'.")

        return results
    except Exception as e:
        print(f"Erreur lors de l'analyse HTML : {str(e)}")
        return ["Erreur lors de l'analyse HTML."]
    
    
    
def get_title_from_html_file(html_file):
    title=''
    try:
        
        with open(html_file, 'r', encoding='utf-8') as file:
            html_content = file.read()

        soup = BeautifulSoup(html_content, 'html.parser')

        # Vérification de la balise <title>
        title_tag = soup.find('title')
        if title_tag:
                title=title_tag.split()

                return title
        else:
                print(f"Balise <title> non trouvée dans le fichier {html_file}.")
                return title
        

    except Exception as e:
        print(f"Erreur lors de l'analyse HTML : {str(e)}")
        return title
    
    
    
    
def get_keywords(html_file):
    try:
        with open(html_file, 'r', encoding='utf-8') as file:
            html_content = file.read()

        soup = BeautifulSoup(html_content, 'html.parser')
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        
        if not meta_keywords or 'content' not in meta_keywords.attrs:
            print(f"Balise <meta name='keywords'> non trouvée ou manquante d'attribut 'content' dans le fichier {html_file}.")
            return []
        else:
            # Extraire les mots-clés du contenu de la balise
            keywords_content = meta_keywords['content']
            # Séparer les mots-clés par des virgules et enlever les espaces
            keywords_list = [keyword.strip() for keyword in keywords_content.split(',')]
            return keywords_list
            
    except Exception as e:
        print(f"Erreur lors de l'analyse HTML du fichier {html_file} : {str(e)}")
        return []
    
    

#obtenir la description declarer dans la page html
def get_description(html_file):
    try:
        with open(html_file, 'r', encoding='utf-8') as file:
            html_content = file.read()

        soup = BeautifulSoup(html_content, 'html.parser')
        meta_description = soup.find('meta', attrs={'name': 'description'})
        
        if not (meta_description and 'content' in meta_description.attrs):
            print("Balise <meta name='description'> non trouvée ou manquante d'attribut 'content'.")
            return []
        else:
            # Extraire les mots-clés du contenu de la balise
            description_content = meta_description['content']
            description_list = [description.strip().lower() for description in description_content.split(',')]
            return description_list
            
    except Exception as e:
        print(f"Erreur lors de l'analyse HTML du fichier {html_file} : {str(e)}")
        return []