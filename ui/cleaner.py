import re
import os
from bs4 import BeautifulSoup

def remove_script_and_style_tags(html_content):
    # Créer une instance BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Trouver et supprimer toutes les balises <script>
    for script in soup.find_all('script'):
        script.decompose()  # supprime la balise <script> et son contenu

    # Trouver et supprimer toutes les balises <style>
    for style in soup.find_all('style'):
        style.decompose()  # supprime la balise <style> et son contenu

    # Retourner le HTML nettoyé
    return str(soup)

def clean_html(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        file_content = file.read()
        raw_html = remove_script_and_style_tags(file_content)

    text = re.sub('<.*?>', '', raw_html)  # Supprime les balises HTML
    text = re.sub(r'\s+', ' ', text)  # Supprime les espaces multiples
   # text = re.sub(r'[^a-zA-Z0-9\s.]', '', text)  # Supprime les caractères spéciaux sauf les points
    text = text.lower()  # Convertit en minuscules

    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(text)

    print(f"Texte nettoyé de {input_file} enregistré dans {output_file}.")
    
    
  
    


if __name__ == "__main__":
    input_dir = 'scraped_html'
    output_dir = 'cleaned_texts'
    os.makedirs(output_dir, exist_ok=True)

    for filename in os.listdir(input_dir):
        if filename.endswith('.html'):
            input_file = os.path.join(input_dir, filename)
            output_file = os.path.join(output_dir, filename.replace('.html', '.txt'))
            clean_html(input_file, output_file)
