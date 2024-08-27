import requests
from bs4 import BeautifulSoup
import os
from crawler import get_internal_links

def scrape_website(url, output_dir):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
            filename = os.path.join(output_dir, url.replace('http://', '').replace('https://', '').replace('/', '_') + '.html')
            with open(filename, 'w', encoding='utf-8') as file:
                file.write(soup.prettify())
            print(f"Contenu HTML de {url} enregistré dans {filename}.")
        else:
            print(f"Erreur {response.status_code} en accédant à {url}.")
    except Exception as e:
        print(f"Erreur lors du scraping de {url} : {e}")

