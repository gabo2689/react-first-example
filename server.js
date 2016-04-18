import fs from 'fs';
import express from 'express';
import Schema from './data/Schema';
import GraphQLHTTP from 'express-graphql';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {MongoClient} from 'mongodb';


let app = express();
console.log("1");
app.use(express.static('public'));
(async () => {

	try {

		console.log("2");
		let db = await MongoClient.connect(process.env.MONGO_URL);
		console.log("3")
		let schema = Schema(db);
		console.log("4");
		app.use('/graphql', GraphQLHTTP({
			schema,
			graphiql:true
		}));

		app.listen(3000, ()=> console.log('listening on port 3000'));

		let json = await graphql(schema,introspectionQuery);
		fs.writeFile('./data/schema.json', JSON.stringify(json, null,2),err =>{
			if(err) throw err;

				console.log("JSON schema created");

		});
	}catch(e)
	{
		console.log(e)
	}



})();
