// routes.js
const express = require('express');
const router = express.Router();
const Post=require('../models/Post');
router.get('/', async(req, res) => {

    try{
        const locals={
            title:"Nodejs blog",
            description:'Simple blog created with node,express & mongodb'
        }
    let perPage=1;
    let page=req.query.page ||1;
    const data=await Post.aggregate([{$sort:{createdAt:-1}}])
    .skip(perPage*page-perPage)
    .limit(perPage)
    .exec();
    const count=await Post.countDocuments();
    const nextPage=parseInt(page)+1;
    const hasNextPage=nextPage<=Math.ceil(count/perPage);
     
    res.render('index',{
        locals,
        data,
        current:page,
        nextPage:hasNextPage?nextPage :null,
        currentRoute:'/'
    });
    }catch(error){
console.log(error);
    }
    
});




router.get('/post/:id', async(req, res) => {
        try{
    let slug=req.params.id;

    const data=await Post.findById({_id:slug});

    const locals={
        title:data.title,
        description:'Simple blog created with node,express & mongodb',
        currentRoute:`/post/${slug}`
    }

    res.render('post',{locals,data});
        }catch(error){
    console.log(error);
        }
        
    });

router.get('/about',(req,res)=>{
    res.render('about',
    {currentRoute:'/about'});
    
});


router.post('/search', async(req, res) => {
        try{
            const locals={
                title:"Search",
                description:'Simple blog created with node,express & mongodb'
            }

            let searchTerm=req.body.searchTerm;
            const searchNoSpecialChar=searchTerm.replace(/[^A-Za-z0-9\s]/g,"")
            
    const data=await Post.find({
        for:[
        {title:{$regex:new RegExp(searchNoSpecialChar,'i')}},
        {body:{$regex:new RegExp(searchNoSpecialChar,'i')}}
        ]
    });
    res.render("search",{
        data,
        locals
    });
}catch(error){
    console.log(error);
        }
        
    });




module.exports = router;



// function insertPostData (){
//     Post.insertMany([
//         {
//             title:"Building a Blog",
//             body:"This is the body text"
//         },
// ])
// }
// insertPostData()


// router.get('/', async(req, res) => {
//     const locals={
//         title:"Nodejs blog",
//         description:'Simple blog created with node,express & mongodb'
//     }
//         try{
//     const data=await Post.find();
//     res.render('index',{locals,data});
//         }catch(error){
//     console.log(error);
//         }
        
//     });