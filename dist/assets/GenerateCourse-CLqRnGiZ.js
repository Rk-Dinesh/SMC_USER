import{u as J,r,j as e,d as Y,B as n,b as d,A as u}from"./index-zwJ3F9yb.js";const K=()=>{const f=J(),N=5,[o,p]=r.useState([{sub:""}]),[l,C]=r.useState("4"),[c,T]=r.useState("Text & Image Course"),[M,v]=r.useState(!1),[S,i]=r.useState(!1),[O,U]=r.useState(""),[k,F]=r.useState([]),[D,I]=r.useState(0);let g=localStorage.getItem("type");const b=localStorage.getItem("user");r.useEffect(()=>{(async()=>{localStorage.getItem("type")!=="free"?(v(!0),await $(),await y()):await y()})()},[]);async function $(){const s=u+`/api/getcountplan?user=${b}`;try{const a=(await d.get(s)).data;I(a[0].count)}catch{}}async function y(){const s=u+`/api/courses?userId=${b}`;try{const t=await d.get(s);F(t.data)}catch(t){console.log(t)}}const A=async()=>{const s={user:localStorage.getItem("user")},t=u+"/api/updatecount";try{const a=await d.post(t,s)}catch(a){console.error(a)}},j=s=>{C(s.target.value)},w=s=>{T(s.target.value)};let L=(s,t)=>{let a=[...o];a[s][t.target.name]=t.target.value,p(a)},V=()=>{o.length<N?p([...o,{sub:""}]):n.error("You can only add 5 sub topics")},E=()=>{let s=[...o];s.pop(),p(s)};const P=s=>{s.preventDefault();const t=[];i(!0),o.forEach(h=>{t.push(h.sub)});const a=document.getElementById("topic1").value;if(!a.trim()){i(!1),n.error("Please fill in all required fields");return}if(t.length===0){i(!1),n.error("Please fill in all required fields");return}const m=`Generate a list of Strict ${l} topics and any number sub topic for each topic for main title ${a.toLowerCase()}, everything in single line. Those ${l} topics should Strictly include these topics :- ${t.join(", ").toLowerCase()}. Strictly Keep theory, youtube, image field empty. Generate in the form of JSON in this format {
        "${a.toLowerCase()}": [
   {
   "title": "Topic Title",
   "subtopics": [
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    },
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    }
   ]
   },
   {
   "title": "Topic Title",
   "subtopics": [
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    },
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    }
   ]
   }
  ]
  }`;G(m,a,c)};async function G(s,t,a){const m={prompt:s};try{const R=(await d.post(`${u}/api/prompt`,m)).data.generatedText.replace(/```json/g,"").replace(/```/g,"");try{const x=JSON.parse(R);i(!1),g==="free"&&k.length>=1?n.error("Please subscribe to access more courses."):g!=="free"?D>0?(await A(),f("/topics",{state:{jsonData:x,mainTopic:t.toLowerCase(),type:a.toLowerCase()}})):n.error("Your monthly plan has reached the limit. Please upgrade the Monthly plan for further access"):f("/topics",{state:{jsonData:x,mainTopic:t.toLowerCase(),type:a.toLowerCase()}})}catch{}}catch{}}return e.jsxs("div",{className:"my-5 text-white font-poppins ",children:[e.jsx("p",{className:"text-center font-extralight",children:"Generate Course"}),e.jsx("form",{onSubmit:P,children:e.jsxs("div",{className:" grid grid-cols-12 gap-3 mx-10 mt-6",children:[e.jsxs("div",{className:"lg:col-span-6 md:col-span-6 col-span-12",children:[e.jsx("p",{className:"text-sm font-extralight",children:"Type the topic on which you want to Generate course."}),e.jsxs("div",{className:"flex flex-col py-8 gap-1",children:[e.jsxs("label",{htmlFor:"topic1",value:"Topic",children:["Course Topic ",e.jsx("span",{className:"text-red-600",children:"*"})]}),e.jsx("input",{type:"text",placeholder:"Enter Topic",id:"topic1",className:"py-2 px-4  rounded-md  text-black shadow-md outline-none lg:w-3/4 md:w-full w-full"})]}),e.jsx("p",{className:"text-sm font-extralight",children:"Select the number of Subtopics you want this course to be spread across."}),e.jsxs("p",{className:"text-lg py-2",children:["No of Subtopic ",e.jsx("span",{className:"text-red-600",children:"*"})]}),e.jsxs("div",{className:"flex flex-col space-y-4",children:[e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value",id:"4",value:"4",onChange:j,checked:l==="4",className:"hidden peer"}),e.jsxs("label",{htmlFor:"4",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${l==="4"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"5"})]})]}),e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value",id:"7",value:"7",onChange:j,checked:l==="7",className:"hidden peer"}),e.jsxs("label",{htmlFor:"7",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${l==="7"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"10"})]})]})]}),e.jsx("p",{className:"text-sm font-extralight py-5",children:"You can enter a list of subtopics, which are the specifics you want to learn. You can leave this blank if you want our AI to generate the Sub Topics."}),e.jsxs("div",{className:"flex flex-col py-1 gap-1 ",children:[e.jsxs("label",{htmlFor:"subtopic",value:"Sub Topic",className:"text-lg",children:["Enter Subtopic",e.jsx("span",{className:"text-red-600",children:"*"})]}),o.map((s,t)=>e.jsx("div",{children:e.jsx("input",{name:"sub",value:s.sub,onChange:a=>L(t,a),className:"py-2 px-4 rounded-md text-black shadow-md outline-none lg:w-3/4 md:w-full w-full my-1",placeholder:"Enter Subtopic",type:"text"})},t)),e.jsxs("div",{className:" flex flex-wrap gap-3 ",children:[e.jsx("p",{className:` text-base text-center bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  py-2.5 ${o.length<=1,"lg:w-3/4 md:w-full w-full"}`,onClick:()=>V(),children:"Add Subtopic"}),o.length>1&&e.jsx("p",{className:" text-base text-center bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-3/4 md:w-full w-full  py-2.5 ",onClick:()=>E(),children:"Remove Subtopic"})]})]})]}),e.jsxs("div",{className:" lg:col-span-6 md:col-span-6 col-span-12 lg:mx-10 md:mx-10",children:[e.jsx("p",{className:"text-sm font-extralight",children:"Choose your course content type"}),e.jsxs("p",{className:"text-lg py-2",children:["Course Type ",e.jsx("span",{className:"text-red-600",children:"*"})]}),e.jsxs("div",{className:"flex flex-col space-y-4",children:[e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value1",id:"textcourse",value:"Text & Image Course",onChange:w,checked:c==="Text & Image Course",className:"hidden peer"}),e.jsxs("label",{htmlFor:"textcourse",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${c==="Text & Image Course"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"Theory & Image Course"})]})]}),e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value1",id:"videocourse",value:"Video & Text Course",onChange:w,checked:c==="Video & Text Course",className:"hidden peer"}),e.jsxs("label",{htmlFor:"videocourse",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${c==="Video & Text Course"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"Video & Theory Course"})]})]})]}),e.jsx("div",{className:"flex justify-center",children:e.jsx("button",{className:" text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-1/2 md:w-3/4 w-full py-2.5 my-5 ",type:"submit",children:S?e.jsxs("span",{className:"flex justify-center gap-3",children:[" ",e.jsx(Y,{className:"h-6 w-6 animate-spin"})," ",e.jsx("p",{children:"Generating ...."})]}):"Generate Course"})})]})]})})]})};export{K as default};
