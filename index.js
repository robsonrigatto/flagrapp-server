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

router.get('/recents', function(req, res) {
	var params = req.query;
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (error) {
		res.json({type:'error', message:error});
	  } else {
		var recents = new Array();
		if (req.query.only_with_media == 'true') {
			for (var i = 0; (i <= 10 && i <= tweets.length) && tweets[i].entities.media; i++) {
				var url = tweets[i].entities.media[0].url;
				var text = (tweets[i].text).substring(0,(tweets[i].text).indexOf(url)-1);				
				var single = {text: text, media: tweets[i].entities.media[0].media_url};
				recents.push(single);
			}
		} else {
			for (var i = 0; i <= 10 && i <= tweets.length; i++) {
				if (tweets[i].entities.media) {
					var url = tweets[i].entities.media[0].url;
					var text = (tweets[i].text).substring(0,(tweets[i].text).indexOf(url)-1);				
					var single = {text: text, media: tweets[i].entities.media[0].media_url};
				} else {
					var single = {text: tweets[i].text, media: ''};
				}
				recents.push(single);
			}
		}
		if (recents.length <= 0) {
			var declaredError = {code:204, message:'Nenhuma publicação encontrada.'};
			res.json({type:'error', message: declaredError});
		} else {
			res.json({type:'success', message:recents});
		}
	  }	  
	});
});

router.get('/tweets', function(req, res) {
	req.query.q = '#flagrapp';
	var params = req.query;
	client.get('search/tweets', params, function(error, tweets, response){
	  if (error) {
		res.json({type:'error', message:error});
	  } else {
		if (tweets == null || tweets.statuses.length <= 0) {
			var declaredError = {code:204, message:'Nenhuma publicação encontrada.'};
			res.json({type:'error', message: declaredError});
		} else {
			res.json({type:'success', message:tweets}); 
		}
	  }	  
	});
});

router.post('/publish', function(req, res) {
	var params = {status: req.query.status};
	var operation = "update";
	if(!params.status) {
		console.log('Parâmetro status faltando');
		res.status(400).send("Obrigatório parâmetro status");
		return;
	}
	
	if(req.body.media) {
		operation = "update_with_media";
		params.media = [new Buffer(req.body.media, 'base64')];
	}
	
	console.log("Parâmetros:");
	console.log(params);
	
	client.post('statuses/' + operation, params, function(error, tweet, response){
	  if (error) {
  		console.log('erro ao fazer upload do texto com foto');
		res.status(500).json(error);

	  } else {
		console.log('upload do texto com foto realizado com sucesso');
		res.json(tweet); 
	  }	  
	});
});

app.use(express.static(__dirname + '/views'));
app.get('/', function (req, res) {
	res.sendFile('index.html');
});
app.use('/api', router);
app.listen(process.env.PORT || 5000);
console.log("Servidor rodando!");