function getSession(){try{return JSON.parse(localStorage.getItem('jobPortalSession')||'null');}catch{return null;}}
function saveSession(data){localStorage.setItem('jobPortalSession',JSON.stringify(data));}
function clearSession(){localStorage.removeItem('jobPortalSession');}
function logout(){clearSession();location.href='index.html';}
function requireRole(role){const user=getSession()?.user;if(!user||user.role!==role){location.href='login.html';return false;}return true;}
function authNav(){const nav=document.querySelector('#nav');if(!nav)return;const user=getSession()?.user;nav.innerHTML=user?`<a href="${user.role}-dashboard.html">Dashboard</a><a href="jobs.html">Jobs</a><a href="#" onclick="logout()">Logout</a>`:`<a href="jobs.html">Jobs</a><a href="login.html">Login</a><a href="register.html">Register</a>`;}
function bindLogin(form){form.addEventListener('submit',async event=>{event.preventDefault();try{const data=await authApi.login(Object.fromEntries(new FormData(form)));saveSession(data);location.href=`${data.user.role}-dashboard.html`;}catch(error){notify(error.message);}});}
function bindRegister(form){form.addEventListener('submit',async event=>{event.preventDefault();try{const data=await authApi.register(Object.fromEntries(new FormData(form)));saveSession(data);location.href=`${data.user.role}-dashboard.html`;}catch(error){notify(error.message);}});}
document.addEventListener('DOMContentLoaded',authNav);
