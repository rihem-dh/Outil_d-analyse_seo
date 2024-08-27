from collections import Counter
from flask import Flask, request, jsonify
from crawler import get_internal_links
from scraper import scrape_website
from cleaner import clean_html
from preprocessor import preprocess_text
from seo_onpage import get_title_from_html_file, check_seo_elements
from resume import keywords as extract_keywords, compare_keywords, generate_tfidf_graph_base64
from clastring import cluster_keywords
from images import analyze_image_extensions, find_large_images
from n_grams import get_ngrams, read_file

import os
from flask_cors import CORS
import shutil

app = Flask(__name__)
CORS(app)





@app.route('/analyze', methods=['POST'])
def analyse_url(): 
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        web_url = data.get('url')
        output_dir_scrape = '/scraped_html/'
        output_dir_clean = '/cleaned_texts/'
        titles = []
        seo_analysis = {}
        image_extensions=[]
        images_large=[]

        # Assurez-vous que les dossiers de sortie existent
        os.makedirs(output_dir_scrape, exist_ok=True)
        os.makedirs(output_dir_clean, exist_ok=True)
        
        # récuperer les liens internes
        urls=get_internal_links(web_url)

        
        for url in urls:
            # scraper les liens internes
            scrape_website(url, output_dir_scrape)
            #obtenir les images qui n'avait pas une bonne extension
            image_extensions.extend(analyze_image_extensions(url))
            #rechercher les images qui ont un taille > à 100 kb 
            images_large.extend(find_large_images(url))
        
          
        # Nettoyer les fichiers HTML et analyser les éléments SEO
        for filename in os.listdir(output_dir_scrape):
            if filename.endswith('.html'):
                input_file = os.path.join(output_dir_scrape, filename)
                output_file = os.path.join(output_dir_clean, filename.replace('.html', '.txt'))
                clean_html(input_file, output_file)
                titre = get_title_from_html_file(input_file)
                titles.append(titre)
                titles.append(titre.replace(" ", ""))
                seo_analysis[filename.replace('.html', '').replace('_', '/')] = check_seo_elements(input_file)
                
        # Prétraitement des textes
        preprocessed_file = 'preprocessed_texts.txt'
        with open(preprocessed_file, 'w', encoding='utf-8') as out_file:
            for filename in os.listdir(output_dir_clean):
                with open(os.path.join(output_dir_clean, filename), 'r', encoding='utf-8') as file:
                    raw_text = file.read()
                    cleaned_text = preprocess_text(raw_text, titles)
                    out_file.write(cleaned_text + '\n')  
        
        # Extraction des mots-clés et calcul des scores TF-IDF
        extracted_keywords = extract_keywords(preprocessed_file)
        tfidf_scores = {word: score for word, score in extracted_keywords[:30]}

        # Comparaison des mots-clés avec le contenu scrappé
        words_tfidf = [word for word, score in extracted_keywords[:10]]
        compared_keywords = compare_keywords(words_tfidf, output_dir_scrape)
        
        # Clustering des mots-clés et génération des graphiques en base64
        clustered_words, _ = cluster_keywords(words_tfidf)
        
        processed_corpus = read_file(preprocessed_file)

        # Extraire les bigrams et trigrams
        bigrams = get_ngrams(processed_corpus, 2)
        
        # Compter les occurrences des n-grams
        bigram_counts = Counter(bigrams)
        
        bi_grams=bigram_counts.most_common(10)
            
        
        # Préparer les résultats à renvoyer
        resultats = {
            "url": web_url,
            "seo_analysis": seo_analysis,
            "tfidf_scores": tfidf_scores,
            "clusters": clustered_words,
            "bigrams": bi_grams,
            "compared_keywords": compared_keywords,
            "image_extensions": image_extensions,
            "images_sizes": images_large,
            "message": "Analyse terminée"
        }
        
        print(resultats)

        # Supprimer les dossiers et fichiers temporaires
        shutil.rmtree(output_dir_scrape)
        shutil.rmtree(output_dir_clean)
        os.remove(preprocessed_file)
        
        return jsonify(resultats)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    
    

if __name__ == '__main__':
    app.run(debug=True)
