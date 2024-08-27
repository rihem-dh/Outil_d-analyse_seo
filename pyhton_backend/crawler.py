import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os

def get_internal_links(base_url):
    internal_links = set()
    to_crawl = set([base_url])
    crawled = set()

    while to_crawl:
        url = to_crawl.pop()
        crawled.add(url)

        try:
            response = requests.get(url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                for link in soup.find_all('a', href=True):
                    href = link.get('href')
                    if not href.startswith(('http://', 'https://')):
                        href = urljoin(base_url, href)
                    if urlparse(href).netloc == urlparse(base_url).netloc:
                        if href not in crawled:
                            to_crawl.add(href)
                            internal_links.add(href)
        except Exception as e:
            print(f"Erreur lors de l'accès à {url} : {e}")

    return internal_links
