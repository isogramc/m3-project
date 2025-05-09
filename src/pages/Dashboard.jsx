import { Sidebar } from "../components/SideBar";
import { Button, Typography } from "@material-tailwind/react";
import  BlogAdd  from "../components/BlogAdd";
import BlogEditDelete from "../components/BlogEditDelete";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";


function Dashboard() {

  const [blogPostArray, setBlogPostArray] = useState([]); 

  const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState(user.name);
    const [image, setImage] = useState("https://education-team-2020.s3.eu-west-1.amazonaws.com/web-dev/m3/tweet-user-photo.png");
    const [handle, setHandle] = useState("human");

      // this is the link to the LIVE SERVER
      const remote = `${import.meta.env.VITE_API_URL}/api/posts`;

      async function getPosts() {
        //console.log("user", user._id, JSON.stringify(user));

          try { 
            return await axios({url: remote, 
              method: 'get',
              timeout: 8000,
              headers: {
                  'Content-Type': 'application/json',
              }, 
              params: { userId: user._id },
            })
          } catch (error) {
            console.error(error);
          }
        }
   
        useEffect(() => {
            getPosts().then(function (result) {
               if(result.status === 200) {
                   //console.log(result.data.posts);
                   setBlogPostArray(result.data.posts);
               }    
            })
        }, [blogPostArray]);

  return (
    <>
      <div className="w-full flex flex-row">
        <Sidebar />
        <div className="flex flex-col px-8">

          <div className="mt-4 flex items-center justify-center gap-4 p-4">
            <Typography variant="h3" color="blue-gray">
              Dashboard
            </Typography>
          </div>

          <BlogAdd getPosts={getPosts}/>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen px-8">
          <p>
            Here you will see your own posts and you will be able to update or
            delete them.
          </p>
          <div>
            {blogPostArray &&
              blogPostArray.map((blog, index) => (
                <BlogEditDelete
                  key={index}
                  id={blog?._id}
                  name={name}
                  image={image}
                  handle={handle}
                  time={blog?.Timestamp}
                  message={blog?.message}
                  getPosts={getPosts}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;