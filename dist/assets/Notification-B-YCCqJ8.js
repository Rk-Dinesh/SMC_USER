import{r as o,T as x,j as s,l as h,b as r,A as i}from"./index-BK9-5p3Z.js";const y=()=>{const{global:l,setGlobal:p}=o.useContext(x),n=localStorage.getItem("user"),[c,m]=o.useState([]);return o.useEffect(()=>{const e=async()=>{try{const f=(await r.get(`${i}/api/getnotifybyid?user=${n}`)).data.notify.reverse();m(f)}catch(t){console.log(t)}},a=async()=>{try{const t=await r.put(`${i}/api/updatenotify?user=${n}`);p(!l)}catch(t){console.log(t)}};e(),a()},[]),s.jsxs("div",{className:"mx-5 my-6 font-poppins font-extralight",children:[s.jsx("p",{className:"text-lg",children:"Notifications"}),s.jsx("hr",{className:"my-2 "}),c&&c.map((e,a)=>s.jsxs("div",{className:"my-5",children:[s.jsxs("p",{children:[s.jsx("span",{className:"font-normal",children:"Date :"})," ",h(e.createdAt)]}),s.jsxs("p",{children:[s.jsx("span",{className:"font-normal",children:"Subject :"})," ",e.subject]}),s.jsxs("p",{className:"my-3",children:[s.jsx("span",{className:"font-normal",children:"Description :"})," ",e.description]}),s.jsx("hr",{className:"my-4 "})]},a))]})};export{y as default};
