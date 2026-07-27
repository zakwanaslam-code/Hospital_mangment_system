import React, { useState } from "react";
import API from "../api/axios";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Login = () => {

const navigate = useNavigate();

const [role,setRole] = useState("Front Desk");

const [form,setForm] = useState({
    email:"",
    password:""
});

const [error,setError] = useState("");


const handleChange = (e)=>{
    setForm({
        ...form,
        [e.target.name]:e.target.value
    });
};



const handleLogin = async(e)=>{

e.preventDefault();

try{

const res = await API.post("/auth/login",{
    ...form,
    role
});


localStorage.setItem(
    "token",
    res.data.token
);


navigate("/dashboard");


}
catch(error){

setError(
error.response?.data?.message ||
"Login Failed"
);

}

};




return (

<div
className="
min-h-screen
flex
items-center
justify-center
bg-cover
bg-center
relative
"
style={{
backgroundImage:"url('/hospital-bg.jpg')"
}}
>


{/* Overlay */}

<div className="
absolute
inset-0
bg-blue-900/50
"></div>



{/* Login Box */}

<div
className="
relative
w-[420px]
rounded-2xl
bg-blue-600/40
backdrop-blur-md
border
border-white/40
shadow-xl
p-6
"
>


{/* Logo */}

<div className="text-center mb-4">

<img
src="/logo.png"
className="
w-20
mx-auto
"
/>

</div>




<h1
className="
text-white
text-xl
text-center
font-semibold
mb-5
"
>
USER LOGIN
</h1>





{/* Roles */}

<div
className="
flex
justify-center
gap-3
mb-5
"
>


{
["Front Desk","Doctor","Patient"]
.map(item=>(

<button
key={item}
onClick={()=>setRole(item)}

className={`
px-5
py-1.5
rounded-full
text-sm

${
role===item
?
"bg-indigo-700 text-white"
:
"bg-blue-900 text-white"
}

`}
>

{item}

</button>


))
}


</div>





<form onSubmit={handleLogin}>


{/* Email */}

<div
className="
flex
items-center
bg-white
rounded-full
px-4
py-2.5
mb-3
"
>

<FaUser className="text-blue-500 mr-3"/>


<input

type="email"

name="email"

value={form.email}

placeholder="frontdesk@hospital.org"

className="
outline-none
w-full
text-gray-700
"

onChange={handleChange}

/>


</div>





{/* Password */}


<div
className="
flex
items-center
bg-white
rounded-full
px-4
py-2.5
"
>


<FaLock className="text-blue-500 mr-3"/>


<input

type="password"

name="password"

value={form.password}

placeholder="************"

className="
outline-none
w-full
text-gray-700
"

onChange={handleChange}

/>


</div>






<div
className="
flex
justify-between
text-white
text-sm
mt-4
"
>


<label className="flex gap-2">

<input type="checkbox"/>

Remember Me

</label>



<span className="cursor-pointer">

Forget Password ?

</span>


</div>






{
error &&

<p className="
text-red-200
text-center
mt-3
text-sm
">

{error}

</p>

}





<button

className="
block
mx-auto
mt-5
bg-indigo-800
hover:bg-indigo-900
text-white
px-10
py-2
rounded-full
transition
"

>

Login

</button>



</form>


</div>


</div>


)

}


export default Login;