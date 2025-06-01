
    // Podstawowe dane repozytorium GitHub
    const owner = "Guliii1";  // np. "mojlogin"
    const repo = "zdjecia";        // np. "mojrepozytorium"
    const folderPath = "";               // ścieżka do folderu ze zdjęciami w repo, np. "images"
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

    const gallery = document.querySelector('.picture__box');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    // Funkcja filtrująca pliki - czy jest to obraz
    function isImageFile(filename) {
      return allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    // Funkcja do pobrania listy plików z GitHub API
    async function fetchImages() {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać listy plików z GitHub: ' + response.statusText);
        }
        const files = await response.json();

        // Filtrujemy tylko pliki będące obrazami
        const images = files.filter(file => file.type === 'file' && isImageFile(file.name));
        if (images.length === 0) {
          loading.textContent = "Brak zdjęć w wybranym folderze.";
          return;
        }
        loading.style.display = 'none';

        // Dodajemy zdjęcia do galerii
        images.forEach(image => {
          const img = document.createElement('img');
          img.classList.add('picture__box-img')
          // Bezpośredni link do pliku raw w GitHub
          // Format: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{folderPath}/{fileName}
          // Załóżmy główna gałąź to 'main' lub 'master' - możesz to zmienić jeśli trzeba
          const branch = "main"; // <- zmień "main" na "master" jeśli Twoja główna gałąź nazywa się master
          img.src = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${folderPath}/${image.name}`;
          img.alt = image.name;
          gallery.appendChild(img);
        });
      } catch (error) {
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = error.message;
      }
    }



    window.onload = fetchImages;
