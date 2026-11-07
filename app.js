const products=[
{id:"1",name:"ওয়্যারলেস হেডফোন",category:"ইলেকট্রনিক্স",price:1250,mark:"♫"},
{id:"2",name:"স্মার্ট ওয়াচ",category:"ইলেকট্রনিক্স",price:1890,mark:"⌚"},
{id:"3",name:"ক্যাজুয়াল টি-শার্ট",category:"ফ্যাশন",price:550,mark:"T"},
{id:"4",name:"ব্যাকপ্যাক",category:"ফ্যাশন",price:990,mark:"▱"},
{id:"5",name:"ডেস্ক ল্যাম্প",category:"হোম ও লাইফস্টাইল",price:780,mark:"☼"},
{id:"6",name:"পানির বোতল",category:"হোম ও লাইফস্টাইল",price:320,mark:"◒"},
{id:"7",name:"দৈনন্দিন ব্যবহার্য পণ্য",category:"অন্যান্য",price:250,mark:"✦"},
{id:"8",name:"মোবাইল স্ট্যান্ড",category:"ইলেকট্রনিক্স",price:180,mark:"▤"}];
let cart=[];const $=s=>document.querySelector(s);const money=n=>"৳"+Number(n).toLocaleString("bn-BD");
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function notify(s){const n=$("#notice");n.textContent=s;n.classList.add("show");setTimeout(()=>n.classList.remove("show"),2200);}
function renderProducts(){const q=$("#search").value.trim().toLowerCase(),cat=$("#category").value;const list=products.filter(p=>(cat==="সব"||p.category===cat)&&p.name.toLowerCase().includes(q));$("#product-grid").innerHTML=list.length?list.map(p=>'<article class="product-card"><div class="product-image">'+p.mark+'</div><div class="product-info"><span class="product-category">'+safe(p.category)+'</span><h3>'+safe(p.name)+'</h3><div class="product-row"><b class="price">'+money(p.price)+'</b><button class="add-button" data-add="'+p.id+'">কার্টে যোগ +</button></div></div></article>').join(""):'<div class="empty">এই নামে কোনো পণ্য পাওয়া যায়নি।</div>';}
function renderCart(){const count=cart.reduce((n,x)=>n+x.qty,0);$("#cart-count").textContent=count.toLocaleString("bn-BD");$("#cart-total").textContent=money(cart.reduce((n,x)=>n+x.price*x.qty,0));$("#cart-items").innerHTML=cart.length?cart.map(x=>'<div class="cart-item"><div><b>'+safe(x.name)+'</b><small>'+money(x.price)+' × '+x.qty+'</small></div><div class="qty"><button data-dec="'+x.id+'">−</button><span>'+x.qty+'</span><button data-inc="'+x.id+'">+</button></div></div>').join(""):'<div class="empty">আপনার কার্ট এখন খালি।</div>';}
function openCart(v){$("#cart-drawer").classList.toggle("open",v);$("#drawer-backdrop").classList.toggle("open",v);$("#cart-drawer").setAttribute("aria-hidden",String(!v));}
$("#product-grid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const p=products.find(x=>x.id===b.dataset.add);const f=cart.find(x=>x.id===p.id);if(f)f.qty++;else cart.push({...p,qty:1});renderCart();notify("কার্টে যোগ হয়েছে");});
$("#cart-items").addEventListener("click",e=>{const b=e.target.closest("[data-inc],[data-dec]");if(!b)return;const id=b.dataset.inc||b.dataset.dec;const x=cart.find(i=>i.id===id);if(b.dataset.inc)x.qty++;else if(--x.qty<1)cart=cart.filter(i=>i.id!==id);renderCart();});
$("#cart-open").onclick=()=>openCart(true);$("#cart-close").onclick=()=>openCart(false);$("#drawer-backdrop").onclick=()=>openCart(false);$("#search").addEventListener("input",renderProducts);$("#category").addEventListener("change",renderProducts);$("#checkout").onclick=()=>notify("অনলাইন অর্ডার এখনো চালু হয়নি।");$("#year").textContent=new Date().getFullYear();renderProducts();renderCart();