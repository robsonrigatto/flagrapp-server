var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Twitter = require('twitter');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
//Vamos criar um twitter senão cada postagem vai no meu nome
var client = new Twitter({
    "consumer_key": "olqq23s4wCDJB4gqQzBrIP9We",
    "consumer_secret": "P4lipmSK1JuvZqo43RzMnjVH0KcrjL57ZfrTgm7H2VNqC0pdyP",
    "access_token_key": "3430114486-WjMHKawuKgSzh12EtR7VXUVJ1x91AnbEVagCkdG",
    "access_token_secret": "3Xv8WZ5UUo04zcC6HUvBdtKMiliLWtBHDvnurgJFsaQm0"
});

var router = express.Router();

router.get('/timeline', function(req, res) {
	//screen_name=foraPT
	var params = req.query
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (error) {
		res.json({type:'error', message:error});
	  } else {
		res.json({type:'success', message:tweets}); 
	  }	  
	});
});

function base64_encode(file) {
	var fs = require('fs');
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

router.post('/publish', function(req, res) {
	var base64Image = base64_encode(req.query.file);
	var params = {status:req.query.status, media:[new Buffer(base64Image, 'base64')]}

	client.post('statuses/update_with_media', params, function(error, tweet, response){
	  if (error) {
  		console.log('erro ao fazer upload do texto com foto');
		res.json({type:'error', message:error});

	  } else {
		console.log('upload do texto com foto realizado com sucesso');
		res.json({type:'success', message:tweet}); 
	  }	  
	});
});

app.use('/twitter', router);
app.listen(process.env.PORT || 5000);
console.log("Servidor rodando!");