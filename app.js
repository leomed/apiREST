const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const ejs = require("ejs")
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))
app.set("view engine" , 'ejs');

mongoose.set('strictQuery' , false);

mongoose.connect("mongodb://127.0.0.1/wikiDB" , {useNewUrlParser: true});



const wikiSchema = new mongoose.Schema({
	title: String,
	content: String
})

const Article = mongoose.model("Article", wikiSchema);

const Wiki = mongoose.model("Wiki", wikiSchema);

// app route allow us not to write the /article route many times//
app.route("/articles")


.get(
	 async(req,res) => {
	 try {
	const articles = await Article.find({});

	res.render("articles" , {
		articlesInHtml: articles
	});

}catch(err){
	if (err) {
		console.log(err)
	}

	
}


})

//////////////////////////////////////////////////


.post(async(req,res) =>{ try {

const titleName = req.body.title
const contentName = req.body.content

const newArticle = new Article({
	title: titleName,
	content: contentName
});


newArticle.save()


}catch (err){
	if (err) {
	console.log(err);
	}else {
		res.send("nice")
	}
}

res.redirect("/articles")
})

////////////////////////////////////////////////////////




.delete(async(req,res) => { try {

const deleteArticle = await Article.deleteMany({})


}catch(err) {
	if (err) {
		console.log("err")
	}
}
res.redirect("/articles")
});


///////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(async(req,res) => {try{

const articleTitle = req.params.articleTitle

async function getUser() {
  const foundUser = await Article.findOne({title: articleTitle});
    return foundUser;

};

const articleFound = res.send(await getUser());





}catch (err) {

}


})
/////////////////////////////////////////////
// with puth we overwrite the entire objet , so if we forget to specificate the title for example, the value then will be null
// and that is dangerous if you do not want to erase it totally
.put(async(req,res) => {try{


// depending on the title post , it will updated the title and content of that specific post//
const articleUpdated = await Article.findOneAndUpdate({ title : req.params.articleTitle} , 
	{title: req.body.title , content: req.body.content},
	{overwrite: true}
	);

articleUpdated.save();

 



}catch(err) {
 console.log(err);
}
{
}
})
////////////////////////////////////////////

/// patch does not overwrite everything like put, with this function we know that we want to change just one part of the objet
.patch(async(req,res) => {try{

 const articlePatchUpdate = await Article.findOneAndUpdate({title:  req.params.articleTitle},
 	// with req.body we know what specific part the user wants to change, if only title it will change only that,
 	// but the other part of content will stay the same as before
 {$set: req.body})

articlePatchUpdate.save();



}catch(err) {
	if (err) {
		console.log(err);
	}
}




})

.delete(async(req,res) => {try{

const deleteOneArticle = await Article.deleteOne({title: req.params.articleTitle});




}catch(err) {
	if (err) {
		console.log(err)
	}
}


});


























/////////////////////////////////////////////////////
app.listen("3000" , function(req,res){
	console.log("Server running");
});