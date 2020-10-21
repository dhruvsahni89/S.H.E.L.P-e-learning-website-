exports.getPosts = (req, res, next) => {

   return res.status(200).json({
      posts:[
      
        {
          courseid: '1',
          title: 'Web Development',
          image:'',
          name: 'Angela',
          description:'full stack development course',
          rating:'',

        },
        {
            courseid: '2',
            title: 'python Development',
            image:'',
            name: 'Heisenberg',
            description:'beginner to advance python course',
            rating:'',
  
            
          },
          {
            courseid: '3',
            title: 'web designing',
            image:'',
            name: 'Kritanya',
            description:'beginner to advance web designing course',
            rating:'',
  
            
          },
         
          {
            courseid: '4',
            title: 'java',
            image:'',
            name: 'Ayush',
            description:'Complete Java Course',
            rating:'',
  
            
          }
        ]
      
      
      
    })
    
  };

  // const feed=new courses({
  //   posts: [
  //     {
  //       _id: '1',
  //       title: 'Web Development',
  //       image:'',
  //       name: 'complete web development by angela',
  //       description:'full stack development course',
  //       rating:'',
        
  //     },
  //     {
  //         _id: '1',
  //         title: 'python ',
  //         image:'',
  //         name: 'complete python course',
  //         description:'become a python developer',
  //         rating:'',

          
  //       },
  //       {
  //         _id: '1',
  //         title: 'Web Development',
  //         name: 'complete web development by angela',
  //         description:'full stack development course',
  //         rating:'',      
  //       }
  //   ]

  // })