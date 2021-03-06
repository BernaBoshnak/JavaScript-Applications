function loadRepos() {
   const button = document.getElementById('load');

   button.addEventListener('click', function () {
      const url = 'https://api.github.com/users/testnakov/repos';

      const httpRequest = new XMLHttpRequest();

      httpRequest.addEventListener('readystatechange', function () {

         if (httpRequest.readyState === 4) {
            document.getElementById('res').textContent = httpRequest.responseText;
         }
      });

      httpRequest.open('GET', url);

      httpRequest.send();
   });
}

window.addEventListener('load', () => {
   loadRepos();
});
