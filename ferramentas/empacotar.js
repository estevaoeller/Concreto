// Junta jogo/index.html, o CSS e os scripts num arquivo só (fácil de enviar ou publicar).
// Uso: node ferramentas/empacotar.js [arquivo-de-saida]
var fs = require('fs'), path = require('path');
var raiz = path.join(__dirname, '..', 'jogo');
var html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
var corpo = html.split(/<body>/)[1].split(/<\/body>/)[0];
corpo = corpo.replace(/<script src="([^"]+)"><\/script>\n?/g, function (_, src) {
  return '<script>\n' + fs.readFileSync(path.join(raiz, src), 'utf8') + '</script>\n';
});
var saida = '<title>Concreto</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<style>\n' +
  fs.readFileSync(path.join(raiz, 'estilo.css'), 'utf8') + '</style>\n' + corpo;
var destino = process.argv[2] || path.join(__dirname, '..', 'concreto-arquivo-unico.html');
fs.writeFileSync(destino, saida);
console.log('Gerado: ' + destino + ' (' + saida.length + ' bytes)');
