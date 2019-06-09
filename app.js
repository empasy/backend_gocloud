var express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const path = require('path');

AWS.config.update({
	accessKeyId: "AKIAIYJ266LBLOOPBBSA", 
	secretAccessKey: "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",
	region: 'us-east-2'
});

var app = express();
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/landing/subscriptions', function (req, res) {
  	var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    var params = {
        TableName: 'inscripciones',
        Item: {
			'id': {S: uuidv1()},
            'nombre' : {S: req.body.nombre},
            'telefono' : {S: req.body.telefono},
            'correo' : {S: req.body.correo},
            'rut' : {S: req.body.rut}
        }  
	};  
	
    ddb.putItem(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            res.json({
				err: true,
				msj: 'Problemas al insertar el documento.',
				variant: 'danger'
            });
        } else {
            console.log("Success", data);
            res.json({
				err: false,
				msj: 'Se registró correctamente.',
				variant: 'success'
            });
        }
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

