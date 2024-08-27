import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin

# Extensions d'image autorisées
ALLOWED_EXTENSIONS = {'.avif', '.webp'}

def analyze_image_extensions(url):
    try:
        # Récupérer le contenu HTML de la page
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text
        
        # Analyser le HTML avec BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Trouver toutes les balises <img> dans le document
        img_tags = soup.find_all('img')
        
        # Analyser les extensions des images
        seen_images = set()
        analysis_results = []
        for img_tag in img_tags:
            img_url = img_tag.get('src')
            if img_url :
                # Convertir en URL absolue si nécessaire
                img_url = urljoin(url, img_url)
                # Extraire l'extension du fichier
                img_extension = os.path.splitext(img_url)[1].lower()
                
                if img_url not in seen_images and img_extension in ALLOWED_EXTENSIONS:
                    seen_images.add(img_url)
                    analysis_results.append((img_url, img_extension))

        
        return analysis_results
    
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération de l'URL: {e}")
        return []
    
    
    
    
    
    
def get_image_size(url):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        size_in_kb = int(response.headers.get('Content-Length', 0)) / 1024
        return size_in_kb
    except requests.RequestException as e:
        print(f"Erreur lors de la récupération de l'image {url}: {e}")
        return None

def find_large_images(url, max_size_kb=100):
    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        images = soup.find_all('img')
        
        seen_images = set()
        large_images = []

        for img in images:
            img_url = img.get('src')
            if not img_url.startswith('http'):
                # Handling relative URLs
                img_url = os.path.join(url, img_url)
            
            size_kb = get_image_size(img_url)
            if size_kb and size_kb > max_size_kb and img_url not in seen_images:
                seen_images.add(img_url)
                large_images.append((img_url, size_kb))
        
        return large_images
    
    except requests.RequestException as e:
        print(f"Erreur lors de l'analyse du site {url}: {e}")
        return []
    
    
    

# Exemple d'utilisation
if __name__ == "__main__":
    url = "https://example.com"
    results = analyze_image_extensions(url)

    if results:
        for img_url, img_extension, is_allowed in results:
            status = "Valide" if is_allowed else "Non Valide"
            print(f"Image: {img_url} | Extension: {img_extension} | Statut: {status}")
    else:
        print("Aucune image trouvée ou erreur lors de l'analyse.")
