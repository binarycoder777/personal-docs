import{d as S,o as f,c as z,r as H,n as q,a as X,t as B,b as w,w as p,T as l3,e as d,_ as x,u as Xe,i as Ke,f as Qe,g as n3,h as F,j as S1,k,l as L1,m,p as t,q as K,s as Q,v as M1,x as I2,y as h1,z as m2,A as o3,B as X4,C as Je,D as cr,E as H1,F as $,G,H as K4,I as v2,J as M,K as u1,L as Q4,M as z2,N as a2,O as h2,P as ar,Q as O2,R as er,S as rr,U as J4,V as c6,W as sr,X as ir,Y as lr,Z as a6,$ as e6,a0 as nr,a1 as or,a2 as fr,a3 as tr,a4 as e2}from"./framework.DUnMl7IF.js";const mr=S({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(c){return(a,e)=>(f(),z("span",{class:q(["VPBadge",a.type])},[H(a.$slots,"default",{},()=>[X(B(a.text),1)])],2))}}),vr={key:0,class:"VPBackdrop"},zr=S({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(c){return(a,e)=>(f(),w(l3,{name:"fade"},{default:p(()=>[a.show?(f(),z("div",vr)):d("",!0)]),_:1}))}}),hr=x(zr,[["__scopeId","data-v-54a304ca"]]),P=Xe;function Hr(c,a){let e,r=!1;return()=>{e&&clearTimeout(e),r?e=setTimeout(c,a):(c(),(r=!0)&&setTimeout(()=>r=!1,a))}}function G2(c){return/^\//.test(c)?c:`/${c}`}function f3(c){const{pathname:a,search:e,hash:r,protocol:s}=new URL(c,"http://a.com");if(Ke(c)||c.startsWith("#")||!s.startsWith("http")||!Qe(a))return c;const{site:i}=P(),l=a.endsWith("/")||a.endsWith(".html")?c:c.replace(/(?:(^\.+)\/)?.*$/,`$1${a.replace(/(\.md)?$/,i.value.cleanUrls?"":".html")}${e}${r}`);return n3(l)}const t3=F(S1?location.hash:"");S1&&window.addEventListener("hashchange",()=>{t3.value=location.hash});function D1({removeCurrent:c=!0,correspondingLink:a=!1}={}){const{site:e,localeIndex:r,page:s,theme:i}=P(),l=k(()=>{var o,v;return{label:(o=e.value.locales[r.value])==null?void 0:o.label,link:((v=e.value.locales[r.value])==null?void 0:v.link)||(r.value==="root"?"/":`/${r.value}/`)}});return{localeLinks:k(()=>Object.entries(e.value.locales).flatMap(([o,v])=>c&&l.value.label===v.label?[]:{text:v.label,link:Vr(v.link||(o==="root"?"/":`/${o}/`),i.value.i18nRouting!==!1&&a,s.value.relativePath.slice(l.value.link.length-1),!e.value.cleanUrls)+t3.value})),currentLang:l}}function Vr(c,a,e,r){return a?c.replace(/\/$/,"")+G2(e.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):c}const pr=c=>(K("data-v-b9c0c15a"),c=c(),Q(),c),ur={class:"NotFound"},Mr={class:"code"},Cr={class:"title"},dr=pr(()=>m("div",{class:"divider"},null,-1)),Lr={class:"quote"},gr={class:"action"},br=["href","aria-label"],xr=S({__name:"NotFound",setup(c){const{site:a,theme:e}=P(),{localeLinks:r}=D1({removeCurrent:!1}),s=F("/");return L1(()=>{var l;const i=window.location.pathname.replace(a.value.base,"").replace(/(^.*?\/).*$/,"/$1");r.value.length&&(s.value=((l=r.value.find(({link:n})=>n.startsWith(i)))==null?void 0:l.link)||r.value[0].link)}),(i,l)=>{var n,o,v,h,V;return f(),z("div",ur,[m("p",Mr,B(((n=t(e).notFound)==null?void 0:n.code)??"404"),1),m("h1",Cr,B(((o=t(e).notFound)==null?void 0:o.title)??"PAGE NOT FOUND"),1),dr,m("blockquote",Lr,B(((v=t(e).notFound)==null?void 0:v.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),m("div",gr,[m("a",{class:"link",href:t(n3)(s.value),"aria-label":((h=t(e).notFound)==null?void 0:h.linkLabel)??"go to home"},B(((V=t(e).notFound)==null?void 0:V.linkText)??"Take me home"),9,br)])])}}}),Nr=x(xr,[["__scopeId","data-v-b9c0c15a"]]);function r6(c,a){if(Array.isArray(c))return r2(c);if(c==null)return[];a=G2(a);const e=Object.keys(c).sort((s,i)=>i.split("/").length-s.split("/").length).find(s=>a.startsWith(G2(s))),r=e?c[e]:[];return Array.isArray(r)?r2(r):r2(r.items,r.base)}function Sr(c){const a=[];let e=0;for(const r in c){const s=c[r];if(s.items){e=a.push(s);continue}a[e]||a.push({items:[]}),a[e].items.push(s)}return a}function kr(c){const a=[];function e(r){for(const s of r)s.text&&s.link&&a.push({text:s.text,link:s.link,docFooterText:s.docFooterText}),s.items&&e(s.items)}return e(c),a}function W2(c,a){return Array.isArray(a)?a.some(e=>W2(c,e)):M1(c,a.link)?!0:a.items?W2(c,a.items):!1}function r2(c,a){return[...c].map(e=>{const r={...e},s=r.base||a;return s&&r.link&&(r.link=s+r.link),r.items&&(r.items=r2(r.items,s)),r})}function n1(){const{frontmatter:c,page:a,theme:e}=P(),r=I2("(min-width: 960px)"),s=F(!1),i=k(()=>{const _=e.value.sidebar,y=a.value.relativePath;return _?r6(_,y):[]}),l=F(i.value);h1(i,(_,y)=>{JSON.stringify(_)!==JSON.stringify(y)&&(l.value=i.value)});const n=k(()=>c.value.sidebar!==!1&&l.value.length>0&&c.value.layout!=="home"),o=k(()=>v?c.value.aside==null?e.value.aside==="left":c.value.aside==="left":!1),v=k(()=>c.value.layout==="home"?!1:c.value.aside!=null?!!c.value.aside:e.value.aside!==!1),h=k(()=>n.value&&r.value),V=k(()=>n.value?Sr(l.value):[]);function u(){s.value=!0}function L(){s.value=!1}function A(){s.value?L():u()}return{isOpen:s,sidebar:l,sidebarGroups:V,hasSidebar:n,hasAside:v,leftAside:o,isSidebarEnabled:h,open:u,close:L,toggle:A}}function wr(c,a){let e;m2(()=>{e=c.value?document.activeElement:void 0}),L1(()=>{window.addEventListener("keyup",r)}),o3(()=>{window.removeEventListener("keyup",r)});function r(s){s.key==="Escape"&&c.value&&(a(),e==null||e.focus())}}function yr(c){const{page:a}=P(),e=F(!1),r=k(()=>c.value.collapsed!=null),s=k(()=>!!c.value.link),i=F(!1),l=()=>{i.value=M1(a.value.relativePath,c.value.link)};h1([a,c,t3],l),L1(l);const n=k(()=>i.value?!0:c.value.items?W2(a.value.relativePath,c.value.items):!1),o=k(()=>!!(c.value.items&&c.value.items.length));m2(()=>{e.value=!!(r.value&&c.value.collapsed)}),X4(()=>{(i.value||n.value)&&(e.value=!1)});function v(){r.value&&(e.value=!e.value)}return{collapsed:e,collapsible:r,isLink:s,isActiveLink:i,hasActiveLink:n,hasChildren:o,toggle:v}}function Ar(){const{hasSidebar:c}=n1(),a=I2("(min-width: 960px)"),e=I2("(min-width: 1280px)");return{isAsideEnabled:k(()=>!e.value&&!a.value?!1:c.value?e.value:a.value)}}const Z2=[];function s6(c){return typeof c.outline=="object"&&!Array.isArray(c.outline)&&c.outline.label||c.outlineTitle||"On this page"}function m3(c){const a=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(e=>e.id&&e.hasChildNodes()).map(e=>{const r=Number(e.tagName[1]);return{element:e,title:Pr(e),link:"#"+e.id,level:r}});return _r(a,c)}function Pr(c){let a="";for(const e of c.childNodes)if(e.nodeType===1){if(e.classList.contains("VPBadge")||e.classList.contains("header-anchor")||e.classList.contains("ignore-header"))continue;a+=e.textContent}else e.nodeType===3&&(a+=e.textContent);return a.trim()}function _r(c,a){if(a===!1)return[];const e=(typeof a=="object"&&!Array.isArray(a)?a.level:a)||2,[r,s]=typeof e=="number"?[e,e]:e==="deep"?[2,6]:e;c=c.filter(l=>l.level>=r&&l.level<=s),Z2.length=0;for(const{element:l,link:n}of c)Z2.push({element:l,link:n});const i=[];c:for(let l=0;l<c.length;l++){const n=c[l];if(l===0)i.push(n);else{for(let o=l-1;o>=0;o--){const v=c[o];if(v.level<n.level){(v.children||(v.children=[])).push(n);continue c}}i.push(n)}}return i}function Tr(c,a){const{isAsideEnabled:e}=Ar(),r=Hr(i,100);let s=null;L1(()=>{requestAnimationFrame(i),window.addEventListener("scroll",r)}),Je(()=>{l(location.hash)}),o3(()=>{window.removeEventListener("scroll",r)});function i(){if(!e.value)return;const n=window.scrollY,o=window.innerHeight,v=document.body.offsetHeight,h=Math.abs(n+o-v)<1,V=Z2.map(({element:L,link:A})=>({link:A,top:Br(L)})).filter(({top:L})=>!Number.isNaN(L)).sort((L,A)=>L.top-A.top);if(!V.length){l(null);return}if(n<1){l(null);return}if(h){l(V[V.length-1].link);return}let u=null;for(const{link:L,top:A}of V){if(A>n+cr()+4)break;u=L}l(u)}function l(n){s&&s.classList.remove("active"),n==null?s=null:s=c.value.querySelector(`a[href="${decodeURIComponent(n)}"]`);const o=s;o?(o.classList.add("active"),a.value.style.top=o.offsetTop+39+"px",a.value.style.opacity="1"):(a.value.style.top="33px",a.value.style.opacity="0")}}function Br(c){let a=0;for(;c!==document.body;){if(c===null)return NaN;a+=c.offsetTop,c=c.offsetParent}return a}const Fr=["href","title"],Dr=S({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(c){function a({target:e}){const r=e.href.split("#")[1],s=document.getElementById(decodeURIComponent(r));s==null||s.focus({preventScroll:!0})}return(e,r)=>{const s=H1("VPDocOutlineItem",!0);return f(),z("ul",{class:q(["VPDocOutlineItem",e.root?"root":"nested"])},[(f(!0),z($,null,G(e.headers,({children:i,link:l,title:n})=>(f(),z("li",null,[m("a",{class:"outline-link",href:l,onClick:a,title:n},B(n),9,Fr),i!=null&&i.length?(f(),w(s,{key:0,headers:i},null,8,["headers"])):d("",!0)]))),256))],2)}}}),i6=x(Dr,[["__scopeId","data-v-53c99d69"]]),Rr=c=>(K("data-v-6b52fe58"),c=c(),Q(),c),qr={class:"content"},$r={class:"outline-title",role:"heading","aria-level":"2"},Er={"aria-labelledby":"doc-outline-aria-label"},Ur=Rr(()=>m("span",{class:"visually-hidden",id:"doc-outline-aria-label"}," Table of Contents for current page ",-1)),Ir=S({__name:"VPDocAsideOutline",setup(c){const{frontmatter:a,theme:e}=P(),r=K4([]);v2(()=>{r.value=m3(a.value.outline??e.value.outline)});const s=F(),i=F();return Tr(s,i),(l,n)=>(f(),z("div",{class:q(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:s,role:"navigation"},[m("div",qr,[m("div",{class:"outline-marker",ref_key:"marker",ref:i},null,512),m("div",$r,B(t(s6)(t(e))),1),m("nav",Er,[Ur,M(i6,{headers:r.value,root:!0},null,8,["headers"])])])],2))}}),Or=x(Ir,[["__scopeId","data-v-6b52fe58"]]),Gr={class:"VPDocAsideCarbonAds"},Wr=S({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(c){const a=()=>null;return(e,r)=>(f(),z("div",Gr,[M(t(a),{"carbon-ads":e.carbonAds},null,8,["carbon-ads"])]))}}),Zr=c=>(K("data-v-cb998dce"),c=c(),Q(),c),jr={class:"VPDocAside"},Yr=Zr(()=>m("div",{class:"spacer"},null,-1)),Xr=S({__name:"VPDocAside",setup(c){const{theme:a}=P();return(e,r)=>(f(),z("div",jr,[H(e.$slots,"aside-top",{},void 0,!0),H(e.$slots,"aside-outline-before",{},void 0,!0),M(Or),H(e.$slots,"aside-outline-after",{},void 0,!0),Yr,H(e.$slots,"aside-ads-before",{},void 0,!0),t(a).carbonAds?(f(),w(Wr,{key:0,"carbon-ads":t(a).carbonAds},null,8,["carbon-ads"])):d("",!0),H(e.$slots,"aside-ads-after",{},void 0,!0),H(e.$slots,"aside-bottom",{},void 0,!0)]))}}),Kr=x(Xr,[["__scopeId","data-v-cb998dce"]]);function Qr(){const{theme:c,page:a}=P();return k(()=>{const{text:e="Edit this page",pattern:r=""}=c.value.editLink||{};let s;return typeof r=="function"?s=r(a.value):s=r.replace(/:path/g,a.value.filePath),{url:s,text:e}})}function Jr(){const{page:c,theme:a,frontmatter:e}=P();return k(()=>{var o,v,h,V,u,L,A,_;const r=r6(a.value.sidebar,c.value.relativePath),s=kr(r),i=s.findIndex(y=>M1(c.value.relativePath,y.link)),l=((o=a.value.docFooter)==null?void 0:o.prev)===!1&&!e.value.prev||e.value.prev===!1,n=((v=a.value.docFooter)==null?void 0:v.next)===!1&&!e.value.next||e.value.next===!1;return{prev:l?void 0:{text:(typeof e.value.prev=="string"?e.value.prev:typeof e.value.prev=="object"?e.value.prev.text:void 0)??((h=s[i-1])==null?void 0:h.docFooterText)??((V=s[i-1])==null?void 0:V.text),link:(typeof e.value.prev=="object"?e.value.prev.link:void 0)??((u=s[i-1])==null?void 0:u.link)},next:n?void 0:{text:(typeof e.value.next=="string"?e.value.next:typeof e.value.next=="object"?e.value.next.text:void 0)??((L=s[i+1])==null?void 0:L.docFooterText)??((A=s[i+1])==null?void 0:A.text),link:(typeof e.value.next=="object"?e.value.next.link:void 0)??((_=s[i+1])==null?void 0:_.link)}}})}const cs={},as={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},es=m("path",{d:"M18,23H4c-1.7,0-3-1.3-3-3V6c0-1.7,1.3-3,3-3h7c0.6,0,1,0.4,1,1s-0.4,1-1,1H4C3.4,5,3,5.4,3,6v14c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1v-7c0-0.6,0.4-1,1-1s1,0.4,1,1v7C21,21.7,19.7,23,18,23z"},null,-1),rs=m("path",{d:"M8,17c-0.3,0-0.5-0.1-0.7-0.3C7,16.5,6.9,16.1,7,15.8l1-4c0-0.2,0.1-0.3,0.3-0.5l9.5-9.5c1.2-1.2,3.2-1.2,4.4,0c1.2,1.2,1.2,3.2,0,4.4l-9.5,9.5c-0.1,0.1-0.3,0.2-0.5,0.3l-4,1C8.2,17,8.1,17,8,17zM9.9,12.5l-0.5,2.1l2.1-0.5l9.3-9.3c0.4-0.4,0.4-1.1,0-1.6c-0.4-0.4-1.2-0.4-1.6,0l0,0L9.9,12.5z M18.5,2.5L18.5,2.5L18.5,2.5z"},null,-1),ss=[es,rs];function is(c,a){return f(),z("svg",as,ss)}const ls=x(cs,[["render",is]]),e1=S({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(c){const a=c,e=k(()=>a.tag??(a.href?"a":"span")),r=k(()=>a.href&&Q4.test(a.href));return(s,i)=>(f(),w(u1(e.value),{class:q(["VPLink",{link:s.href,"vp-external-link-icon":r.value,"no-icon":s.noIcon}]),href:s.href?t(f3)(s.href):void 0,target:s.target??(r.value?"_blank":void 0),rel:s.rel??(r.value?"noreferrer":void 0)},{default:p(()=>[H(s.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),ns={class:"VPLastUpdated"},os=["datetime"],fs=S({__name:"VPDocFooterLastUpdated",setup(c){const{theme:a,page:e,frontmatter:r,lang:s}=P(),i=k(()=>new Date(r.value.lastUpdated??e.value.lastUpdated)),l=k(()=>i.value.toISOString()),n=F("");return L1(()=>{m2(()=>{var o,v,h;n.value=new Intl.DateTimeFormat((v=(o=a.value.lastUpdated)==null?void 0:o.formatOptions)!=null&&v.forceLocale?s.value:void 0,((h=a.value.lastUpdated)==null?void 0:h.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(i.value)})}),(o,v)=>{var h;return f(),z("p",ns,[X(B(((h=t(a).lastUpdated)==null?void 0:h.text)||t(a).lastUpdatedText||"Last updated")+": ",1),m("time",{datetime:l.value},B(n.value),9,os)])}}}),ts=x(fs,[["__scopeId","data-v-19a7ae4e"]]),ms={key:0,class:"VPDocFooter"},vs={key:0,class:"edit-info"},zs={key:0,class:"edit-link"},hs={key:1,class:"last-updated"},Hs={key:1,class:"prev-next"},Vs={class:"pager"},ps=["innerHTML"],us=["innerHTML"],Ms={class:"pager"},Cs=["innerHTML"],ds=["innerHTML"],Ls=S({__name:"VPDocFooter",setup(c){const{theme:a,page:e,frontmatter:r}=P(),s=Qr(),i=Jr(),l=k(()=>a.value.editLink&&r.value.editLink!==!1),n=k(()=>e.value.lastUpdated&&r.value.lastUpdated!==!1),o=k(()=>l.value||n.value||i.value.prev||i.value.next);return(v,h)=>{var V,u,L,A;return o.value?(f(),z("footer",ms,[H(v.$slots,"doc-footer-before",{},void 0,!0),l.value||n.value?(f(),z("div",vs,[l.value?(f(),z("div",zs,[M(e1,{class:"edit-link-button",href:t(s).url,"no-icon":!0},{default:p(()=>[M(ls,{class:"edit-link-icon","aria-label":"edit icon"}),X(" "+B(t(s).text),1)]),_:1},8,["href"])])):d("",!0),n.value?(f(),z("div",hs,[M(ts)])):d("",!0)])):d("",!0),(V=t(i).prev)!=null&&V.link||(u=t(i).next)!=null&&u.link?(f(),z("nav",Hs,[m("div",Vs,[(L=t(i).prev)!=null&&L.link?(f(),w(e1,{key:0,class:"pager-link prev",href:t(i).prev.link},{default:p(()=>{var _;return[m("span",{class:"desc",innerHTML:((_=t(a).docFooter)==null?void 0:_.prev)||"Previous page"},null,8,ps),m("span",{class:"title",innerHTML:t(i).prev.text},null,8,us)]}),_:1},8,["href"])):d("",!0)]),m("div",Ms,[(A=t(i).next)!=null&&A.link?(f(),w(e1,{key:0,class:"pager-link next",href:t(i).next.link},{default:p(()=>{var _;return[m("span",{class:"desc",innerHTML:((_=t(a).docFooter)==null?void 0:_.next)||"Next page"},null,8,Cs),m("span",{class:"title",innerHTML:t(i).next.text},null,8,ds)]}),_:1},8,["href"])):d("",!0)])])):d("",!0)])):d("",!0)}}}),gs=x(Ls,[["__scopeId","data-v-b4b63abf"]]),bs=c=>(K("data-v-e6f2a212"),c=c(),Q(),c),xs={class:"container"},Ns=bs(()=>m("div",{class:"aside-curtain"},null,-1)),Ss={class:"aside-container"},ks={class:"aside-content"},ws={class:"content"},ys={class:"content-container"},As={class:"main"},Ps=S({__name:"VPDoc",setup(c){const{theme:a}=P(),e=z2(),{hasSidebar:r,hasAside:s,leftAside:i}=n1(),l=k(()=>e.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(n,o)=>{const v=H1("Content");return f(),z("div",{class:q(["VPDoc",{"has-sidebar":t(r),"has-aside":t(s)}])},[H(n.$slots,"doc-top",{},void 0,!0),m("div",xs,[t(s)?(f(),z("div",{key:0,class:q(["aside",{"left-aside":t(i)}])},[Ns,m("div",Ss,[m("div",ks,[M(Kr,null,{"aside-top":p(()=>[H(n.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":p(()=>[H(n.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":p(()=>[H(n.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":p(()=>[H(n.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":p(()=>[H(n.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":p(()=>[H(n.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):d("",!0),m("div",ws,[m("div",ys,[H(n.$slots,"doc-before",{},void 0,!0),m("main",As,[M(v,{class:q(["vp-doc",[l.value,t(a).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),M(gs,null,{"doc-footer-before":p(()=>[H(n.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),H(n.$slots,"doc-after",{},void 0,!0)])])]),H(n.$slots,"doc-bottom",{},void 0,!0)],2)}}}),_s=x(Ps,[["__scopeId","data-v-e6f2a212"]]),Ts=S({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(c){const a=c,e=k(()=>a.href&&Q4.test(a.href)),r=k(()=>a.tag||a.href?"a":"button");return(s,i)=>(f(),w(u1(r.value),{class:q(["VPButton",[s.size,s.theme]]),href:s.href?t(f3)(s.href):void 0,target:a.target??(e.value?"_blank":void 0),rel:a.rel??(e.value?"noreferrer":void 0)},{default:p(()=>[X(B(s.text),1)]),_:1},8,["class","href","target","rel"]))}}),Bs=x(Ts,[["__scopeId","data-v-c9cf0e3c"]]),Fs=["src","alt"],Ds=S({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(c){return(a,e)=>{const r=H1("VPImage",!0);return a.image?(f(),z($,{key:0},[typeof a.image=="string"||"src"in a.image?(f(),z("img",a2({key:0,class:"VPImage"},typeof a.image=="string"?a.$attrs:{...a.image,...a.$attrs},{src:t(n3)(typeof a.image=="string"?a.image:a.image.src),alt:a.alt??(typeof a.image=="string"?"":a.image.alt||"")}),null,16,Fs)):(f(),z($,{key:1},[M(r,a2({class:"dark",image:a.image.dark,alt:a.image.alt},a.$attrs),null,16,["image","alt"]),M(r,a2({class:"light",image:a.image.light,alt:a.image.alt},a.$attrs),null,16,["image","alt"])],64))],64)):d("",!0)}}}),l2=x(Ds,[["__scopeId","data-v-ab19afbb"]]),Rs=c=>(K("data-v-b10c5094"),c=c(),Q(),c),qs={class:"container"},$s={class:"main"},Es={key:0,class:"name"},Us=["innerHTML"],Is=["innerHTML"],Os=["innerHTML"],Gs={key:0,class:"actions"},Ws={key:0,class:"image"},Zs={class:"image-container"},js=Rs(()=>m("div",{class:"image-bg"},null,-1)),Ys=S({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(c){const a=h2("hero-image-slot-exists");return(e,r)=>(f(),z("div",{class:q(["VPHero",{"has-image":e.image||t(a)}])},[m("div",qs,[m("div",$s,[H(e.$slots,"home-hero-info-before",{},void 0,!0),H(e.$slots,"home-hero-info",{},()=>[e.name?(f(),z("h1",Es,[m("span",{innerHTML:e.name,class:"clip"},null,8,Us)])):d("",!0),e.text?(f(),z("p",{key:1,innerHTML:e.text,class:"text"},null,8,Is)):d("",!0),e.tagline?(f(),z("p",{key:2,innerHTML:e.tagline,class:"tagline"},null,8,Os)):d("",!0)],!0),H(e.$slots,"home-hero-info-after",{},void 0,!0),e.actions?(f(),z("div",Gs,[(f(!0),z($,null,G(e.actions,s=>(f(),z("div",{key:s.link,class:"action"},[M(Bs,{tag:"a",size:"medium",theme:s.theme,text:s.text,href:s.link,target:s.target,rel:s.rel},null,8,["theme","text","href","target","rel"])]))),128))])):d("",!0),H(e.$slots,"home-hero-actions-after",{},void 0,!0)]),e.image||t(a)?(f(),z("div",Ws,[m("div",Zs,[js,H(e.$slots,"home-hero-image",{},()=>[e.image?(f(),w(l2,{key:0,class:"image-src",image:e.image},null,8,["image"])):d("",!0)],!0)])])):d("",!0)])],2))}}),Xs=x(Ys,[["__scopeId","data-v-b10c5094"]]),Ks=S({__name:"VPHomeHero",setup(c){const{frontmatter:a}=P();return(e,r)=>t(a).hero?(f(),w(Xs,{key:0,class:"VPHomeHero",name:t(a).hero.name,text:t(a).hero.text,tagline:t(a).hero.tagline,image:t(a).hero.image,actions:t(a).hero.actions},{"home-hero-info-before":p(()=>[H(e.$slots,"home-hero-info-before")]),"home-hero-info":p(()=>[H(e.$slots,"home-hero-info")]),"home-hero-info-after":p(()=>[H(e.$slots,"home-hero-info-after")]),"home-hero-actions-after":p(()=>[H(e.$slots,"home-hero-actions-after")]),"home-hero-image":p(()=>[H(e.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):d("",!0)}}),Qs={},Js={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},ci=m("path",{d:"M19.9,12.4c0.1-0.2,0.1-0.5,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.3l-7-7c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l5.3,5.3H5c-0.6,0-1,0.4-1,1s0.4,1,1,1h11.6l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l7-7C19.8,12.6,19.9,12.5,19.9,12.4z"},null,-1),ai=[ci];function ei(c,a){return f(),z("svg",Js,ai)}const ri=x(Qs,[["render",ei]]),si={class:"box"},ii={key:0,class:"icon"},li=["innerHTML"],ni=["innerHTML"],oi=["innerHTML"],fi={key:4,class:"link-text"},ti={class:"link-text-value"},mi=S({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(c){return(a,e)=>(f(),w(e1,{class:"VPFeature",href:a.link,rel:a.rel,target:a.target,"no-icon":!0,tag:a.link?"a":"div"},{default:p(()=>[m("article",si,[typeof a.icon=="object"&&a.icon.wrap?(f(),z("div",ii,[M(l2,{image:a.icon,alt:a.icon.alt,height:a.icon.height||48,width:a.icon.width||48},null,8,["image","alt","height","width"])])):typeof a.icon=="object"?(f(),w(l2,{key:1,image:a.icon,alt:a.icon.alt,height:a.icon.height||48,width:a.icon.width||48},null,8,["image","alt","height","width"])):a.icon?(f(),z("div",{key:2,class:"icon",innerHTML:a.icon},null,8,li)):d("",!0),m("h2",{class:"title",innerHTML:a.title},null,8,ni),a.details?(f(),z("p",{key:3,class:"details",innerHTML:a.details},null,8,oi)):d("",!0),a.linkText?(f(),z("div",fi,[m("p",ti,[X(B(a.linkText)+" ",1),M(ri,{class:"link-text-icon"})])])):d("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),vi=x(mi,[["__scopeId","data-v-ee984185"]]),zi={key:0,class:"VPFeatures"},hi={class:"container"},Hi={class:"items"},Vi=S({__name:"VPFeatures",props:{features:{}},setup(c){const a=c,e=k(()=>{const r=a.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,s)=>r.features?(f(),z("div",zi,[m("div",hi,[m("div",Hi,[(f(!0),z($,null,G(r.features,i=>(f(),z("div",{key:i.title,class:q(["item",[e.value]])},[M(vi,{icon:i.icon,title:i.title,details:i.details,link:i.link,"link-text":i.linkText,rel:i.rel,target:i.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):d("",!0)}}),pi=x(Vi,[["__scopeId","data-v-b1eea84a"]]),ui=S({__name:"VPHomeFeatures",setup(c){const{frontmatter:a}=P();return(e,r)=>t(a).features?(f(),w(pi,{key:0,class:"VPHomeFeatures",features:t(a).features},null,8,["features"])):d("",!0)}}),Mi={class:"VPHome"},Ci=S({__name:"VPHome",setup(c){return(a,e)=>{const r=H1("Content");return f(),z("div",Mi,[H(a.$slots,"home-hero-before",{},void 0,!0),M(Ks,null,{"home-hero-info-before":p(()=>[H(a.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":p(()=>[H(a.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":p(()=>[H(a.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":p(()=>[H(a.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":p(()=>[H(a.$slots,"home-hero-image",{},void 0,!0)]),_:3}),H(a.$slots,"home-hero-after",{},void 0,!0),H(a.$slots,"home-features-before",{},void 0,!0),M(ui),H(a.$slots,"home-features-after",{},void 0,!0),M(r)])}}}),di=x(Ci,[["__scopeId","data-v-df618fe7"]]),Li={},gi={class:"VPPage"};function bi(c,a){const e=H1("Content");return f(),z("div",gi,[H(c.$slots,"page-top"),M(e),H(c.$slots,"page-bottom")])}const xi=x(Li,[["render",bi]]),Ni=S({__name:"VPContent",setup(c){const{page:a,frontmatter:e}=P(),{hasSidebar:r}=n1();return(s,i)=>(f(),z("div",{class:q(["VPContent",{"has-sidebar":t(r),"is-home":t(e).layout==="home"}]),id:"VPContent"},[t(a).isNotFound?H(s.$slots,"not-found",{key:0},()=>[M(Nr)],!0):t(e).layout==="page"?(f(),w(xi,{key:1},{"page-top":p(()=>[H(s.$slots,"page-top",{},void 0,!0)]),"page-bottom":p(()=>[H(s.$slots,"page-bottom",{},void 0,!0)]),_:3})):t(e).layout==="home"?(f(),w(di,{key:2},{"home-hero-before":p(()=>[H(s.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":p(()=>[H(s.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":p(()=>[H(s.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":p(()=>[H(s.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":p(()=>[H(s.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":p(()=>[H(s.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":p(()=>[H(s.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":p(()=>[H(s.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":p(()=>[H(s.$slots,"home-features-after",{},void 0,!0)]),_:3})):t(e).layout&&t(e).layout!=="doc"?(f(),w(u1(t(e).layout),{key:3})):(f(),w(_s,{key:4},{"doc-top":p(()=>[H(s.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":p(()=>[H(s.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":p(()=>[H(s.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":p(()=>[H(s.$slots,"doc-before",{},void 0,!0)]),"doc-after":p(()=>[H(s.$slots,"doc-after",{},void 0,!0)]),"aside-top":p(()=>[H(s.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":p(()=>[H(s.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":p(()=>[H(s.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":p(()=>[H(s.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":p(()=>[H(s.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":p(()=>[H(s.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Si=x(Ni,[["__scopeId","data-v-9a6c75ad"]]),ki={class:"container"},wi=["innerHTML"],yi=["innerHTML"],Ai=S({__name:"VPFooter",setup(c){const{theme:a,frontmatter:e}=P(),{hasSidebar:r}=n1();return(s,i)=>t(a).footer&&t(e).footer!==!1?(f(),z("footer",{key:0,class:q(["VPFooter",{"has-sidebar":t(r)}])},[m("div",ki,[t(a).footer.message?(f(),z("p",{key:0,class:"message",innerHTML:t(a).footer.message},null,8,wi)):d("",!0),t(a).footer.copyright?(f(),z("p",{key:1,class:"copyright",innerHTML:t(a).footer.copyright},null,8,yi)):d("",!0)])],2)):d("",!0)}}),Pi=x(Ai,[["__scopeId","data-v-566314d4"]]);function l6(){const{theme:c,frontmatter:a}=P(),e=K4([]),r=k(()=>e.value.length>0);return v2(()=>{e.value=m3(a.value.outline??c.value.outline)}),{headers:e,hasLocalNav:r}}const _i={},Ti={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Bi=m("path",{d:"M9,19c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l5.3-5.3L8.3,6.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l6,6c0.4,0.4,0.4,1,0,1.4l-6,6C9.5,18.9,9.3,19,9,19z"},null,-1),Fi=[Bi];function Di(c,a){return f(),z("svg",Ti,Fi)}const n6=x(_i,[["render",Di]]),Ri={class:"header"},qi={class:"outline"},$i=S({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(c){const a=c,{theme:e}=P(),r=F(!1),s=F(0),i=F(),l=F();ar(i,()=>{r.value=!1}),O2("Escape",()=>{r.value=!1}),v2(()=>{r.value=!1});function n(){r.value=!r.value,s.value=window.innerHeight+Math.min(window.scrollY-a.navHeight,0)}function o(h){h.target.classList.contains("outline-link")&&(l.value&&(l.value.style.transition="none"),rr(()=>{r.value=!1}))}function v(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(h,V)=>(f(),z("div",{class:"VPLocalNavOutlineDropdown",style:er({"--vp-vh":s.value+"px"}),ref_key:"main",ref:i},[h.headers.length>0?(f(),z("button",{key:0,onClick:n,class:q({open:r.value})},[X(B(t(s6)(t(e)))+" ",1),M(n6,{class:"icon"})],2)):(f(),z("button",{key:1,onClick:v},B(t(e).returnToTopLabel||"Return to top"),1)),M(l3,{name:"flyout"},{default:p(()=>[r.value?(f(),z("div",{key:0,ref_key:"items",ref:l,class:"items",onClick:o},[m("div",Ri,[m("a",{class:"top-link",href:"#",onClick:v},B(t(e).returnToTopLabel||"Return to top"),1)]),m("div",qi,[M(i6,{headers:h.headers},null,8,["headers"])])],512)):d("",!0)]),_:1})],4))}}),Ei=x($i,[["__scopeId","data-v-2744f6e0"]]),Ui={},Ii={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Oi=m("path",{d:"M17,11H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S17.6,11,17,11z"},null,-1),Gi=m("path",{d:"M21,7H3C2.4,7,2,6.6,2,6s0.4-1,1-1h18c0.6,0,1,0.4,1,1S21.6,7,21,7z"},null,-1),Wi=m("path",{d:"M21,15H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h18c0.6,0,1,0.4,1,1S21.6,15,21,15z"},null,-1),Zi=m("path",{d:"M17,19H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S17.6,19,17,19z"},null,-1),ji=[Oi,Gi,Wi,Zi];function Yi(c,a){return f(),z("svg",Ii,ji)}const Xi=x(Ui,[["render",Yi]]),Ki={class:"container"},Qi=["aria-expanded"],Ji={class:"menu-text"},cl=S({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(c){const{theme:a,frontmatter:e}=P(),{hasSidebar:r}=n1(),{headers:s}=l6(),{y:i}=J4(),l=F(0);L1(()=>{l.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),v2(()=>{s.value=m3(e.value.outline??a.value.outline)});const n=k(()=>s.value.length===0),o=k(()=>n.value&&!r.value),v=k(()=>({VPLocalNav:!0,"has-sidebar":r.value,empty:n.value,fixed:o.value}));return(h,V)=>t(e).layout!=="home"&&(!o.value||t(i)>=l.value)?(f(),z("div",{key:0,class:q(v.value)},[m("div",Ki,[t(r)?(f(),z("button",{key:0,class:"menu","aria-expanded":h.open,"aria-controls":"VPSidebarNav",onClick:V[0]||(V[0]=u=>h.$emit("open-menu"))},[M(Xi,{class:"menu-icon"}),m("span",Ji,B(t(a).sidebarMenuLabel||"Menu"),1)],8,Qi)):d("",!0),M(Ei,{headers:t(s),navHeight:l.value},null,8,["headers","navHeight"])])],2)):d("",!0)}}),al=x(cl,[["__scopeId","data-v-b979e4d9"]]);function el(){const c=F(!1);function a(){c.value=!0,window.addEventListener("resize",s)}function e(){c.value=!1,window.removeEventListener("resize",s)}function r(){c.value?e():a()}function s(){window.outerWidth>=768&&e()}const i=z2();return h1(()=>i.path,e),{isScreenOpen:c,openScreen:a,closeScreen:e,toggleScreen:r}}const rl={},sl={class:"VPSwitch",type:"button",role:"switch"},il={class:"check"},ll={key:0,class:"icon"};function nl(c,a){return f(),z("button",sl,[m("span",il,[c.$slots.default?(f(),z("span",ll,[H(c.$slots,"default",{},void 0,!0)])):d("",!0)])])}const ol=x(rl,[["render",nl],["__scopeId","data-v-1c29e291"]]),fl={},tl={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},ml=m("path",{d:"M12.1,22c-0.3,0-0.6,0-0.9,0c-5.5-0.5-9.5-5.4-9-10.9c0.4-4.8,4.2-8.6,9-9c0.4,0,0.8,0.2,1,0.5c0.2,0.3,0.2,0.8-0.1,1.1c-2,2.7-1.4,6.4,1.3,8.4c2.1,1.6,5,1.6,7.1,0c0.3-0.2,0.7-0.3,1.1-0.1c0.3,0.2,0.5,0.6,0.5,1c-0.2,2.7-1.5,5.1-3.6,6.8C16.6,21.2,14.4,22,12.1,22zM9.3,4.4c-2.9,1-5,3.6-5.2,6.8c-0.4,4.4,2.8,8.3,7.2,8.7c2.1,0.2,4.2-0.4,5.8-1.8c1.1-0.9,1.9-2.1,2.4-3.4c-2.5,0.9-5.3,0.5-7.5-1.1C9.2,11.4,8.1,7.7,9.3,4.4z"},null,-1),vl=[ml];function zl(c,a){return f(),z("svg",tl,vl)}const hl=x(fl,[["render",zl]]),Hl={},Vl={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},pl=c6('<path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z"></path><path d="M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z"></path><path d="M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z"></path><path d="M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.2,6.5,5.9,6.6,5.6,6.6z"></path><path d="M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20,20.8,19.8,20.8z"></path><path d="M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z"></path><path d="M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path><path d="M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z"></path><path d="M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z"></path>',9),ul=[pl];function Ml(c,a){return f(),z("svg",Vl,ul)}const Cl=x(Hl,[["render",Ml]]),dl=S({__name:"VPSwitchAppearance",setup(c){const{isDark:a,theme:e}=P(),r=h2("toggle-appearance",()=>{a.value=!a.value}),s=k(()=>a.value?e.value.lightModeSwitchTitle||"Switch to light theme":e.value.darkModeSwitchTitle||"Switch to dark theme");return(i,l)=>(f(),w(ol,{title:s.value,class:"VPSwitchAppearance","aria-checked":t(a),onClick:t(r)},{default:p(()=>[M(Cl,{class:"sun"}),M(hl,{class:"moon"})]),_:1},8,["title","aria-checked","onClick"]))}}),v3=x(dl,[["__scopeId","data-v-d80abb8e"]]),Ll={key:0,class:"VPNavBarAppearance"},gl=S({__name:"VPNavBarAppearance",setup(c){const{site:a}=P();return(e,r)=>t(a).appearance&&t(a).appearance!=="force-dark"?(f(),z("div",Ll,[M(v3)])):d("",!0)}}),bl=x(gl,[["__scopeId","data-v-283b26e9"]]),z3=F();let o6=!1,D2=0;function xl(c){const a=F(!1);if(S1){!o6&&Nl(),D2++;const e=h1(z3,r=>{var s,i,l;r===c.el.value||(s=c.el.value)!=null&&s.contains(r)?(a.value=!0,(i=c.onFocus)==null||i.call(c)):(a.value=!1,(l=c.onBlur)==null||l.call(c))});o3(()=>{e(),D2--,D2||Sl()})}return sr(a)}function Nl(){document.addEventListener("focusin",f6),o6=!0,z3.value=document.activeElement}function Sl(){document.removeEventListener("focusin",f6)}function f6(){z3.value=document.activeElement}const kl={},wl={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},yl=m("path",{d:"M12,16c-0.3,0-0.5-0.1-0.7-0.3l-6-6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-6,6C12.5,15.9,12.3,16,12,16z"},null,-1),Al=[yl];function Pl(c,a){return f(),z("svg",wl,Al)}const t6=x(kl,[["render",Pl]]),_l={},Tl={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Bl=m("circle",{cx:"12",cy:"12",r:"2"},null,-1),Fl=m("circle",{cx:"19",cy:"12",r:"2"},null,-1),Dl=m("circle",{cx:"5",cy:"12",r:"2"},null,-1),Rl=[Bl,Fl,Dl];function ql(c,a){return f(),z("svg",Tl,Rl)}const $l=x(_l,[["render",ql]]),El={class:"VPMenuLink"},Ul=S({__name:"VPMenuLink",props:{item:{}},setup(c){const{page:a}=P();return(e,r)=>(f(),z("div",El,[M(e1,{class:q({active:t(M1)(t(a).relativePath,e.item.activeMatch||e.item.link,!!e.item.activeMatch)}),href:e.item.link,target:e.item.target,rel:e.item.rel},{default:p(()=>[X(B(e.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),H2=x(Ul,[["__scopeId","data-v-f51f088d"]]),Il={class:"VPMenuGroup"},Ol={key:0,class:"title"},Gl=S({__name:"VPMenuGroup",props:{text:{},items:{}},setup(c){return(a,e)=>(f(),z("div",Il,[a.text?(f(),z("p",Ol,B(a.text),1)):d("",!0),(f(!0),z($,null,G(a.items,r=>(f(),z($,null,["link"in r?(f(),w(H2,{key:0,item:r},null,8,["item"])):d("",!0)],64))),256))]))}}),Wl=x(Gl,[["__scopeId","data-v-a6b0397c"]]),Zl={class:"VPMenu"},jl={key:0,class:"items"},Yl=S({__name:"VPMenu",props:{items:{}},setup(c){return(a,e)=>(f(),z("div",Zl,[a.items?(f(),z("div",jl,[(f(!0),z($,null,G(a.items,r=>(f(),z($,{key:r.text},["link"in r?(f(),w(H2,{key:0,item:r},null,8,["item"])):(f(),w(Wl,{key:1,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):d("",!0),H(a.$slots,"default",{},void 0,!0)]))}}),Xl=x(Yl,[["__scopeId","data-v-e42ed9b3"]]),Kl=["aria-expanded","aria-label"],Ql={key:0,class:"text"},Jl=["innerHTML"],cn={class:"menu"},an=S({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(c){const a=F(!1),e=F();xl({el:e,onBlur:r});function r(){a.value=!1}return(s,i)=>(f(),z("div",{class:"VPFlyout",ref_key:"el",ref:e,onMouseenter:i[1]||(i[1]=l=>a.value=!0),onMouseleave:i[2]||(i[2]=l=>a.value=!1)},[m("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":a.value,"aria-label":s.label,onClick:i[0]||(i[0]=l=>a.value=!a.value)},[s.button||s.icon?(f(),z("span",Ql,[s.icon?(f(),w(u1(s.icon),{key:0,class:"option-icon"})):d("",!0),s.button?(f(),z("span",{key:1,innerHTML:s.button},null,8,Jl)):d("",!0),M(t6,{class:"text-icon"})])):(f(),w($l,{key:1,class:"icon"}))],8,Kl),m("div",cn,[M(Xl,{items:s.items},{default:p(()=>[H(s.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),h3=x(an,[["__scopeId","data-v-aa8de344"]]),en={discord:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>',facebook:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',github:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',instagram:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>',linkedin:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',mastodon:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Mastodon</title><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>',npm:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>npm</title><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>',slack:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Slack</title><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>',twitter:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"/></svg>',x:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',youtube:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'},rn=["href","aria-label","innerHTML"],sn=S({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(c){const a=c,e=k(()=>typeof a.icon=="object"?a.icon.svg:en[a.icon]);return(r,s)=>(f(),z("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:e.value},null,8,rn))}}),ln=x(sn,[["__scopeId","data-v-16cf740a"]]),nn={class:"VPSocialLinks"},on=S({__name:"VPSocialLinks",props:{links:{}},setup(c){return(a,e)=>(f(),z("div",nn,[(f(!0),z($,null,G(a.links,({link:r,icon:s,ariaLabel:i})=>(f(),w(ln,{key:r,icon:s,link:r,ariaLabel:i},null,8,["icon","link","ariaLabel"]))),128))]))}}),H3=x(on,[["__scopeId","data-v-e71e869c"]]),fn={key:0,class:"group translations"},tn={class:"trans-title"},mn={key:1,class:"group"},vn={class:"item appearance"},zn={class:"label"},hn={class:"appearance-action"},Hn={key:2,class:"group"},Vn={class:"item social-links"},pn=S({__name:"VPNavBarExtra",setup(c){const{site:a,theme:e}=P(),{localeLinks:r,currentLang:s}=D1({correspondingLink:!0}),i=k(()=>r.value.length&&s.value.label||a.value.appearance||e.value.socialLinks);return(l,n)=>i.value?(f(),w(h3,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:p(()=>[t(r).length&&t(s).label?(f(),z("div",fn,[m("p",tn,B(t(s).label),1),(f(!0),z($,null,G(t(r),o=>(f(),w(H2,{key:o.link,item:o},null,8,["item"]))),128))])):d("",!0),t(a).appearance&&t(a).appearance!=="force-dark"?(f(),z("div",mn,[m("div",vn,[m("p",zn,B(t(e).darkModeSwitchLabel||"Appearance"),1),m("div",hn,[M(v3)])])])):d("",!0),t(e).socialLinks?(f(),z("div",Hn,[m("div",Vn,[M(H3,{class:"social-links-list",links:t(e).socialLinks},null,8,["links"])])])):d("",!0)]),_:1})):d("",!0)}}),un=x(pn,[["__scopeId","data-v-8e87c032"]]),Mn=c=>(K("data-v-6bee1efd"),c=c(),Q(),c),Cn=["aria-expanded"],dn=Mn(()=>m("span",{class:"container"},[m("span",{class:"top"}),m("span",{class:"middle"}),m("span",{class:"bottom"})],-1)),Ln=[dn],gn=S({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(c){return(a,e)=>(f(),z("button",{type:"button",class:q(["VPNavBarHamburger",{active:a.active}]),"aria-label":"mobile navigation","aria-expanded":a.active,"aria-controls":"VPNavScreen",onClick:e[0]||(e[0]=r=>a.$emit("click"))},Ln,10,Cn))}}),bn=x(gn,[["__scopeId","data-v-6bee1efd"]]),xn=["innerHTML"],Nn=S({__name:"VPNavBarMenuLink",props:{item:{}},setup(c){const{page:a}=P();return(e,r)=>(f(),w(e1,{class:q({VPNavBarMenuLink:!0,active:t(M1)(t(a).relativePath,e.item.activeMatch||e.item.link,!!e.item.activeMatch)}),href:e.item.link,target:e.item.target,rel:e.item.rel,tabindex:"0"},{default:p(()=>[m("span",{innerHTML:e.item.text},null,8,xn)]),_:1},8,["class","href","target","rel"]))}}),Sn=x(Nn,[["__scopeId","data-v-cb318fec"]]),kn=S({__name:"VPNavBarMenuGroup",props:{item:{}},setup(c){const a=c,{page:e}=P(),r=i=>"link"in i?M1(e.value.relativePath,i.link,!!a.item.activeMatch):i.items.some(r),s=k(()=>r(a.item));return(i,l)=>(f(),w(h3,{class:q({VPNavBarMenuGroup:!0,active:t(M1)(t(e).relativePath,i.item.activeMatch,!!i.item.activeMatch)||s.value}),button:i.item.text,items:i.item.items},null,8,["class","button","items"]))}}),wn=c=>(K("data-v-f732b5d0"),c=c(),Q(),c),yn={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},An=wn(()=>m("span",{id:"main-nav-aria-label",class:"visually-hidden"},"Main Navigation",-1)),Pn=S({__name:"VPNavBarMenu",setup(c){const{theme:a}=P();return(e,r)=>t(a).nav?(f(),z("nav",yn,[An,(f(!0),z($,null,G(t(a).nav,s=>(f(),z($,{key:s.text},["link"in s?(f(),w(Sn,{key:0,item:s},null,8,["item"])):(f(),w(kn,{key:1,item:s},null,8,["item"]))],64))),128))])):d("",!0)}}),_n=x(Pn,[["__scopeId","data-v-f732b5d0"]]);function Tn(c){const{localeIndex:a,theme:e}=P();function r(s){var A,_,y;const i=s.split("."),l=(A=e.value.search)==null?void 0:A.options,n=l&&typeof l=="object",o=n&&((y=(_=l.locales)==null?void 0:_[a.value])==null?void 0:y.translations)||null,v=n&&l.translations||null;let h=o,V=v,u=c;const L=i.pop();for(const N of i){let g=null;const T=u==null?void 0:u[N];T&&(g=u=T);const E=V==null?void 0:V[N];E&&(g=V=E);const U=h==null?void 0:h[N];U&&(g=h=U),T||(u=g),E||(V=g),U||(h=g)}return(h==null?void 0:h[L])??(V==null?void 0:V[L])??(u==null?void 0:u[L])??""}return r}const Bn=["aria-label"],Fn={class:"DocSearch-Button-Container"},Dn=m("svg",{class:"DocSearch-Search-Icon",width:"20",height:"20",viewBox:"0 0 20 20","aria-label":"search icon"},[m("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})],-1),Rn={class:"DocSearch-Button-Placeholder"},qn=m("span",{class:"DocSearch-Button-Keys"},[m("kbd",{class:"DocSearch-Button-Key"}),m("kbd",{class:"DocSearch-Button-Key"},"K")],-1),d4=S({__name:"VPNavBarSearchButton",setup(c){const e=Tn({button:{buttonText:"Search",buttonAriaLabel:"Search"}});return(r,s)=>(f(),z("button",{type:"button",class:"DocSearch DocSearch-Button","aria-label":t(e)("button.buttonAriaLabel")},[m("span",Fn,[Dn,m("span",Rn,B(t(e)("button.buttonText")),1)]),qn],8,Bn))}}),$n={class:"VPNavBarSearch"},En={id:"local-search"},Un={key:1,id:"docsearch"},In=S({__name:"VPNavBarSearch",setup(c){const a=ir(()=>lr(()=>import("./VPLocalSearchBox.BzSRzK0s.js"),__vite__mapDeps([0,1]))),e=()=>null,{theme:r}=P(),s=F(!1),i=F(!1);L1(()=>{});function l(){s.value||(s.value=!0,setTimeout(n,16))}function n(){const V=new Event("keydown");V.key="k",V.metaKey=!0,window.dispatchEvent(V),setTimeout(()=>{document.querySelector(".DocSearch-Modal")||n()},16)}function o(V){const u=V.target,L=u.tagName;return u.isContentEditable||L==="INPUT"||L==="SELECT"||L==="TEXTAREA"}const v=F(!1);O2("k",V=>{(V.ctrlKey||V.metaKey)&&(V.preventDefault(),v.value=!0)}),O2("/",V=>{o(V)||(V.preventDefault(),v.value=!0)});const h="local";return(V,u)=>{var L;return f(),z("div",$n,[t(h)==="local"?(f(),z($,{key:0},[v.value?(f(),w(t(a),{key:0,onClose:u[0]||(u[0]=A=>v.value=!1)})):d("",!0),m("div",En,[M(d4,{onClick:u[1]||(u[1]=A=>v.value=!0)})])],64)):t(h)==="algolia"?(f(),z($,{key:1},[s.value?(f(),w(t(e),{key:0,algolia:((L=t(r).search)==null?void 0:L.options)??t(r).algolia,onVnodeBeforeMount:u[2]||(u[2]=A=>i.value=!0)},null,8,["algolia"])):d("",!0),i.value?d("",!0):(f(),z("div",Un,[M(d4,{onClick:l})]))],64)):d("",!0)])}}}),On=S({__name:"VPNavBarSocialLinks",setup(c){const{theme:a}=P();return(e,r)=>t(a).socialLinks?(f(),w(H3,{key:0,class:"VPNavBarSocialLinks",links:t(a).socialLinks},null,8,["links"])):d("",!0)}}),Gn=x(On,[["__scopeId","data-v-ef6192dc"]]),Wn=["href","rel","target"],Zn={key:1},jn={key:2},Yn=S({__name:"VPNavBarTitle",setup(c){const{site:a,theme:e}=P(),{hasSidebar:r}=n1(),{currentLang:s}=D1(),i=k(()=>{var o;return typeof e.value.logoLink=="string"?e.value.logoLink:(o=e.value.logoLink)==null?void 0:o.link}),l=k(()=>{var o;return typeof e.value.logoLink=="string"||(o=e.value.logoLink)==null?void 0:o.rel}),n=k(()=>{var o;return typeof e.value.logoLink=="string"||(o=e.value.logoLink)==null?void 0:o.target});return(o,v)=>(f(),z("div",{class:q(["VPNavBarTitle",{"has-sidebar":t(r)}])},[m("a",{class:"title",href:i.value??t(f3)(t(s).link),rel:l.value,target:n.value},[H(o.$slots,"nav-bar-title-before",{},void 0,!0),t(e).logo?(f(),w(l2,{key:0,class:"logo",image:t(e).logo},null,8,["image"])):d("",!0),t(e).siteTitle?(f(),z("span",Zn,B(t(e).siteTitle),1)):t(e).siteTitle===void 0?(f(),z("span",jn,B(t(a).title),1)):d("",!0),H(o.$slots,"nav-bar-title-after",{},void 0,!0)],8,Wn)],2))}}),Xn=x(Yn,[["__scopeId","data-v-0ad69264"]]),Kn={},Qn={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Jn=m("path",{d:"M0 0h24v24H0z",fill:"none"},null,-1),co=m("path",{d:" M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z ",class:"css-c4d79v"},null,-1),ao=[Jn,co];function eo(c,a){return f(),z("svg",Qn,ao)}const m6=x(Kn,[["render",eo]]),ro={class:"items"},so={class:"title"},io=S({__name:"VPNavBarTranslations",setup(c){const{theme:a}=P(),{localeLinks:e,currentLang:r}=D1({correspondingLink:!0});return(s,i)=>t(e).length&&t(r).label?(f(),w(h3,{key:0,class:"VPNavBarTranslations",icon:m6,label:t(a).langMenuLabel||"Change language"},{default:p(()=>[m("div",ro,[m("p",so,B(t(r).label),1),(f(!0),z($,null,G(t(e),l=>(f(),w(H2,{key:l.link,item:l},null,8,["item"]))),128))])]),_:1},8,["label"])):d("",!0)}}),lo=x(io,[["__scopeId","data-v-ff4524ae"]]),no=c=>(K("data-v-3efcd581"),c=c(),Q(),c),oo={class:"wrapper"},fo={class:"container"},to={class:"title"},mo={class:"content"},vo={class:"content-body"},zo=no(()=>m("div",{class:"divider"},[m("div",{class:"divider-line"})],-1)),ho=S({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(c){const{y:a}=J4(),{hasSidebar:e}=n1(),{hasLocalNav:r}=l6(),{frontmatter:s}=P(),i=F({});return X4(()=>{i.value={"has-sidebar":e.value,"has-local-nav":r.value,top:s.value.layout==="home"&&a.value===0}}),(l,n)=>(f(),z("div",{class:q(["VPNavBar",i.value])},[m("div",oo,[m("div",fo,[m("div",to,[M(Xn,null,{"nav-bar-title-before":p(()=>[H(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":p(()=>[H(l.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),m("div",mo,[m("div",vo,[H(l.$slots,"nav-bar-content-before",{},void 0,!0),M(In,{class:"search"}),M(_n,{class:"menu"}),M(lo,{class:"translations"}),M(bl,{class:"appearance"}),M(Gn,{class:"social-links"}),M(un,{class:"extra"}),H(l.$slots,"nav-bar-content-after",{},void 0,!0),M(bn,{class:"hamburger",active:l.isScreenOpen,onClick:n[0]||(n[0]=o=>l.$emit("toggle-screen"))},null,8,["active"])])])])]),zo],2))}}),Ho=x(ho,[["__scopeId","data-v-3efcd581"]]),Vo={key:0,class:"VPNavScreenAppearance"},po={class:"text"},uo=S({__name:"VPNavScreenAppearance",setup(c){const{site:a,theme:e}=P();return(r,s)=>t(a).appearance&&t(a).appearance!=="force-dark"?(f(),z("div",Vo,[m("p",po,B(t(e).darkModeSwitchLabel||"Appearance"),1),M(v3)])):d("",!0)}}),Mo=x(uo,[["__scopeId","data-v-338d9b48"]]),Co=S({__name:"VPNavScreenMenuLink",props:{item:{}},setup(c){const a=h2("close-screen");return(e,r)=>(f(),w(e1,{class:"VPNavScreenMenuLink",href:e.item.link,target:e.item.target,rel:e.item.rel,onClick:t(a)},{default:p(()=>[X(B(e.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),Lo=x(Co,[["__scopeId","data-v-fe523e3d"]]),go={},bo={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},xo=m("path",{d:"M18.9,10.9h-6v-6c0-0.6-0.4-1-1-1s-1,0.4-1,1v6h-6c-0.6,0-1,0.4-1,1s0.4,1,1,1h6v6c0,0.6,0.4,1,1,1s1-0.4,1-1v-6h6c0.6,0,1-0.4,1-1S19.5,10.9,18.9,10.9z"},null,-1),No=[xo];function So(c,a){return f(),z("svg",bo,No)}const ko=x(go,[["render",So]]),wo=S({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(c){const a=h2("close-screen");return(e,r)=>(f(),w(e1,{class:"VPNavScreenMenuGroupLink",href:e.item.link,target:e.item.target,rel:e.item.rel,onClick:t(a)},{default:p(()=>[X(B(e.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),v6=x(wo,[["__scopeId","data-v-aea78dd1"]]),yo={class:"VPNavScreenMenuGroupSection"},Ao={key:0,class:"title"},Po=S({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(c){return(a,e)=>(f(),z("div",yo,[a.text?(f(),z("p",Ao,B(a.text),1)):d("",!0),(f(!0),z($,null,G(a.items,r=>(f(),w(v6,{key:r.text,item:r},null,8,["item"]))),128))]))}}),_o=x(Po,[["__scopeId","data-v-f60dbfa7"]]),To=["aria-controls","aria-expanded"],Bo=["innerHTML"],Fo=["id"],Do={key:1,class:"group"},Ro=S({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(c){const a=c,e=F(!1),r=k(()=>`NavScreenGroup-${a.text.replace(" ","-").toLowerCase()}`);function s(){e.value=!e.value}return(i,l)=>(f(),z("div",{class:q(["VPNavScreenMenuGroup",{open:e.value}])},[m("button",{class:"button","aria-controls":r.value,"aria-expanded":e.value,onClick:s},[m("span",{class:"button-text",innerHTML:i.text},null,8,Bo),M(ko,{class:"button-icon"})],8,To),m("div",{id:r.value,class:"items"},[(f(!0),z($,null,G(i.items,n=>(f(),z($,{key:n.text},["link"in n?(f(),z("div",{key:n.text,class:"item"},[M(v6,{item:n},null,8,["item"])])):(f(),z("div",Do,[M(_o,{text:n.text,items:n.items},null,8,["text","items"])]))],64))),128))],8,Fo)],2))}}),qo=x(Ro,[["__scopeId","data-v-32e4a89c"]]),$o={key:0,class:"VPNavScreenMenu"},Eo=S({__name:"VPNavScreenMenu",setup(c){const{theme:a}=P();return(e,r)=>t(a).nav?(f(),z("nav",$o,[(f(!0),z($,null,G(t(a).nav,s=>(f(),z($,{key:s.text},["link"in s?(f(),w(Lo,{key:0,item:s},null,8,["item"])):(f(),w(qo,{key:1,text:s.text||"",items:s.items},null,8,["text","items"]))],64))),128))])):d("",!0)}}),Uo=S({__name:"VPNavScreenSocialLinks",setup(c){const{theme:a}=P();return(e,r)=>t(a).socialLinks?(f(),w(H3,{key:0,class:"VPNavScreenSocialLinks",links:t(a).socialLinks},null,8,["links"])):d("",!0)}}),Io={class:"list"},Oo=S({__name:"VPNavScreenTranslations",setup(c){const{localeLinks:a,currentLang:e}=D1({correspondingLink:!0}),r=F(!1);function s(){r.value=!r.value}return(i,l)=>t(a).length&&t(e).label?(f(),z("div",{key:0,class:q(["VPNavScreenTranslations",{open:r.value}])},[m("button",{class:"title",onClick:s},[M(m6,{class:"icon lang"}),X(" "+B(t(e).label)+" ",1),M(t6,{class:"icon chevron"})]),m("ul",Io,[(f(!0),z($,null,G(t(a),n=>(f(),z("li",{key:n.link,class:"item"},[M(e1,{class:"link",href:n.link},{default:p(()=>[X(B(n.text),1)]),_:2},1032,["href"])]))),128))])],2)):d("",!0)}}),Go=x(Oo,[["__scopeId","data-v-41505286"]]),Wo={class:"container"},Zo=S({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(c){const a=F(null),e=a6(S1?document.body:null);return(r,s)=>(f(),w(l3,{name:"fade",onEnter:s[0]||(s[0]=i=>e.value=!0),onAfterLeave:s[1]||(s[1]=i=>e.value=!1)},{default:p(()=>[r.open?(f(),z("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:a,id:"VPNavScreen"},[m("div",Wo,[H(r.$slots,"nav-screen-content-before",{},void 0,!0),M(Eo,{class:"menu"}),M(Go,{class:"translations"}),M(Mo,{class:"appearance"}),M(Uo,{class:"social-links"}),H(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):d("",!0)]),_:3}))}}),jo=x(Zo,[["__scopeId","data-v-57cce842"]]),Yo={key:0,class:"VPNav"},Xo=S({__name:"VPNav",setup(c){const{isScreenOpen:a,closeScreen:e,toggleScreen:r}=el(),{frontmatter:s}=P(),i=k(()=>s.value.navbar!==!1);return e6("close-screen",e),m2(()=>{S1&&document.documentElement.classList.toggle("hide-nav",!i.value)}),(l,n)=>i.value?(f(),z("header",Yo,[M(Ho,{"is-screen-open":t(a),onToggleScreen:t(r)},{"nav-bar-title-before":p(()=>[H(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":p(()=>[H(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":p(()=>[H(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":p(()=>[H(l.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),M(jo,{open:t(a)},{"nav-screen-content-before":p(()=>[H(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":p(()=>[H(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):d("",!0)}}),Ko=x(Xo,[["__scopeId","data-v-7ad780c2"]]),Qo=c=>(K("data-v-bd01e0d5"),c=c(),Q(),c),Jo=["role","tabindex"],cf=Qo(()=>m("div",{class:"indicator"},null,-1)),af={key:1,class:"items"},ef=S({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(c){const a=c,{collapsed:e,collapsible:r,isLink:s,isActiveLink:i,hasActiveLink:l,hasChildren:n,toggle:o}=yr(k(()=>a.item)),v=k(()=>n.value?"section":"div"),h=k(()=>s.value?"a":"div"),V=k(()=>n.value?a.depth+2===7?"p":`h${a.depth+2}`:"p"),u=k(()=>s.value?void 0:"button"),L=k(()=>[[`level-${a.depth}`],{collapsible:r.value},{collapsed:e.value},{"is-link":s.value},{"is-active":i.value},{"has-active":l.value}]);function A(y){"key"in y&&y.key!=="Enter"||!a.item.link&&o()}function _(){a.item.link&&o()}return(y,N)=>{const g=H1("VPSidebarItem",!0);return f(),w(u1(v.value),{class:q(["VPSidebarItem",L.value])},{default:p(()=>[y.item.text?(f(),z("div",a2({key:0,class:"item",role:u.value},or(y.item.items?{click:A,keydown:A}:{},!0),{tabindex:y.item.items&&0}),[cf,y.item.link?(f(),w(e1,{key:0,tag:h.value,class:"link",href:y.item.link,rel:y.item.rel,target:y.item.target},{default:p(()=>[(f(),w(u1(V.value),{class:"text",innerHTML:y.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(f(),w(u1(V.value),{key:1,class:"text",innerHTML:y.item.text},null,8,["innerHTML"])),y.item.collapsed!=null?(f(),z("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:_,onKeydown:nr(_,["enter"]),tabindex:"0"},[M(n6,{class:"caret-icon"})],32)):d("",!0)],16,Jo)):d("",!0),y.item.items&&y.item.items.length?(f(),z("div",af,[y.depth<5?(f(!0),z($,{key:0},G(y.item.items,T=>(f(),w(g,{key:T.text,item:T,depth:y.depth+1},null,8,["item","depth"]))),128)):d("",!0)])):d("",!0)]),_:1},8,["class"])}}}),rf=x(ef,[["__scopeId","data-v-bd01e0d5"]]),z6=c=>(K("data-v-4871f9f5"),c=c(),Q(),c),sf=z6(()=>m("div",{class:"curtain"},null,-1)),lf={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},nf=z6(()=>m("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),of=S({__name:"VPSidebar",props:{open:{type:Boolean}},setup(c){const{sidebarGroups:a,hasSidebar:e}=n1(),r=c,s=F(null),i=a6(S1?document.body:null);return h1([r,s],()=>{var l;r.open?(i.value=!0,(l=s.value)==null||l.focus()):i.value=!1},{immediate:!0,flush:"post"}),(l,n)=>t(e)?(f(),z("aside",{key:0,class:q(["VPSidebar",{open:l.open}]),ref_key:"navEl",ref:s,onClick:n[0]||(n[0]=fr(()=>{},["stop"]))},[sf,m("nav",lf,[nf,H(l.$slots,"sidebar-nav-before",{},void 0,!0),(f(!0),z($,null,G(t(a),o=>(f(),z("div",{key:o.text,class:"group"},[M(rf,{item:o,depth:0},null,8,["item"])]))),128)),H(l.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):d("",!0)}}),ff=x(of,[["__scopeId","data-v-4871f9f5"]]),tf=S({__name:"VPSkipLink",setup(c){const a=z2(),e=F();h1(()=>a.path,()=>e.value.focus());function r({target:s}){const i=document.getElementById(decodeURIComponent(s.hash).slice(1));if(i){const l=()=>{i.removeAttribute("tabindex"),i.removeEventListener("blur",l)};i.setAttribute("tabindex","-1"),i.addEventListener("blur",l),i.focus(),window.scrollTo(0,0)}}return(s,i)=>(f(),z($,null,[m("span",{ref_key:"backToTop",ref:e,tabindex:"-1"},null,512),m("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),mf=x(tf,[["__scopeId","data-v-c8291ffa"]]),vf=S({__name:"Layout",setup(c){const{isOpen:a,open:e,close:r}=n1(),s=z2();h1(()=>s.path,r),wr(a,r);const{frontmatter:i}=P(),l=tr(),n=k(()=>!!l["home-hero-image"]);return e6("hero-image-slot-exists",n),(o,v)=>{const h=H1("Content");return t(i).layout!==!1?(f(),z("div",{key:0,class:q(["Layout",t(i).pageClass])},[H(o.$slots,"layout-top",{},void 0,!0),M(mf),M(hr,{class:"backdrop",show:t(a),onClick:t(r)},null,8,["show","onClick"]),M(Ko,null,{"nav-bar-title-before":p(()=>[H(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":p(()=>[H(o.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":p(()=>[H(o.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":p(()=>[H(o.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":p(()=>[H(o.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":p(()=>[H(o.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),M(al,{open:t(a),onOpenMenu:t(e)},null,8,["open","onOpenMenu"]),M(ff,{open:t(a)},{"sidebar-nav-before":p(()=>[H(o.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":p(()=>[H(o.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),M(Si,null,{"page-top":p(()=>[H(o.$slots,"page-top",{},void 0,!0)]),"page-bottom":p(()=>[H(o.$slots,"page-bottom",{},void 0,!0)]),"not-found":p(()=>[H(o.$slots,"not-found",{},void 0,!0)]),"home-hero-before":p(()=>[H(o.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":p(()=>[H(o.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":p(()=>[H(o.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":p(()=>[H(o.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":p(()=>[H(o.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":p(()=>[H(o.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":p(()=>[H(o.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":p(()=>[H(o.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":p(()=>[H(o.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":p(()=>[H(o.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":p(()=>[H(o.$slots,"doc-before",{},void 0,!0)]),"doc-after":p(()=>[H(o.$slots,"doc-after",{},void 0,!0)]),"doc-top":p(()=>[H(o.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":p(()=>[H(o.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":p(()=>[H(o.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":p(()=>[H(o.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":p(()=>[H(o.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":p(()=>[H(o.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":p(()=>[H(o.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":p(()=>[H(o.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),M(Pi),H(o.$slots,"layout-bottom",{},void 0,!0)],2)):(f(),w(h,{key:1}))}}}),zf=x(vf,[["__scopeId","data-v-d8b57b2d"]]),L4={Layout:zf,enhanceApp:({app:c})=>{c.component("Badge",mr)}},hf={name:"PersonalInfoWithStats"},J=c=>(K("data-v-0aa1ff44"),c=c(),Q(),c),Hf={class:"container"},Vf={class:"introduction"},pf=J(()=>m("h1",null,"关于我",-1)),uf=J(()=>m("br",null,null,-1)),Mf=J(()=>m("p",null," 👋 一名软件开发工程师，专业领域涵盖了后端开发、数据库设计和系统架构，专注于将复杂的问题转化为简单而直观的设计。 ",-1)),Cf=J(()=>m("br",null,null,-1)),df=J(()=>m("p",null," 💻 坚信技术的价值在于为用户创造价值，努力构建出简洁、高效且易于维护的代码，以提供出色的用户体验。 ",-1)),Lf=J(()=>m("br",null,null,-1)),gf=J(()=>m("p",null," 🚀 注重团队协作，喜欢和团队成员分享经验、学习新技术，并持续关注行业的最新动态，以确保我的技术栈始终保持更新。 ",-1)),bf=J(()=>m("br",null,null,-1)),xf=J(()=>m("p",null," 🌐 当不在编写代码的时候，热衷于探索互联网世界。可能在学习新的编程语言，研究新的技术趋势，或者在个人项目上挥洒创意。 ",-1)),Nf=J(()=>m("br",null,null,-1)),Sf={class:"social-links"},kf={href:"https://github.com/yourusername",target:"_blank"},wf={href:"mailto:your@email.com"},yf={href:"your-wechat-url"},Af=J(()=>m("div",{class:"language-stats"},[m("h2",null,"Most Used Languages"),m("img",{src:"https://github-readme-stats.vercel.app/api/top-langs/?username=BinaryCoder777&layout=donut&langs_count=10",alt:"Most Used Languages"})],-1));function Pf(c,a,e,r,s,i){const l=H1("font-awesome-icon");return f(),z("div",Hf,[m("div",Vf,[pf,uf,Mf,Cf,df,Lf,gf,bf,xf,Nf,m("div",Sf,[m("a",kf,[M(l,{icon:["fab","github"]})]),m("a",wf,[M(l,{icon:["fas","envelope"]})]),m("a",yf,[M(l,{icon:["fab","weixin"]})])])]),Af])}const _f=x(hf,[["render",Pf],["__scopeId","data-v-0aa1ff44"]]),Tf={mounted(){console.log(111),console.log(this.latestArticles),console.log(222)},name:"FeaturesSection"},Bf=c6('<div class="features-section" data-v-90e41cc7><h2 class="features-title" data-v-90e41cc7>当前正在做的...</h2><p class="features-subtitle" data-v-90e41cc7>探索创新的技术解决方案，让编程之旅更加有趣。</p><div class="features-cards" data-v-90e41cc7><div class="feature-card" data-v-90e41cc7><div class="card-icon" data-v-90e41cc7></div><h3 class="card-title" data-v-90e41cc7>系统解析方案</h3><p class="card-detail" data-v-90e41cc7>为客户提供定制化的专业解决方案，以满足特定行业的独特需求。</p></div><div class="feature-card" data-v-90e41cc7><div class="card-icon" data-v-90e41cc7></div><h3 class="card-title" data-v-90e41cc7>软件开发</h3><p class="card-detail" data-v-90e41cc7>承诺提供卓越的软件开发服务，确保每一次交付都是高效和高质量的。</p></div><div class="feature-card" data-v-90e41cc7><div class="card-icon" data-v-90e41cc7></div><h3 class="card-title" data-v-90e41cc7>数字创新</h3><p class="card-detail" data-v-90e41cc7>挖掘生活中的创新灵感，将酷炫的想法转化为实际可行的数字产品。</p></div></div></div><div class="lastes-news" data-v-90e41cc7><h1 data-v-90e41cc7>近期动态</h1><a href="/markdown-examples" data-v-90e41cc7>阅览更多...</a><div class="features-cards" data-v-90e41cc7><div class="feature-card" data-v-90e41cc7><div class="card-icon" data-v-90e41cc7></div><h3 class="card-title" data-v-90e41cc7>系统解析方案</h3><p class="card-detail" data-v-90e41cc7>为客户提供定制化的专业解决方案，以满足特定行业的独特需求。</p></div><div class="feature-card" data-v-90e41cc7><div class="card-icon" data-v-90e41cc7></div><h3 class="card-title" data-v-90e41cc7>软件开发</h3><p class="card-detail" data-v-90e41cc7>承诺提供卓越的软件开发服务，确保每一次交付都是高效和高质量的。</p></div><div class="feature-card" data-v-90e41cc7><div class="card-icon" data-v-90e41cc7></div><h3 class="card-title" data-v-90e41cc7>数字创新</h3><p class="card-detail" data-v-90e41cc7>挖掘生活中的创新灵感，将酷炫的想法转化为实际可行的数字产品。</p></div></div></div>',2);function Ff(c,a,e,r,s,i){return Bf}const Df=x(Tf,[["render",Ff],["__scopeId","data-v-90e41cc7"]]);function g4(c,a){var e=Object.keys(c);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(c);a&&(r=r.filter(function(s){return Object.getOwnPropertyDescriptor(c,s).enumerable})),e.push.apply(e,r)}return e}function C(c){for(var a=1;a<arguments.length;a++){var e=arguments[a]!=null?arguments[a]:{};a%2?g4(Object(e),!0).forEach(function(r){O(c,r,e[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(c,Object.getOwnPropertyDescriptors(e)):g4(Object(e)).forEach(function(r){Object.defineProperty(c,r,Object.getOwnPropertyDescriptor(e,r))})}return c}function n2(c){"@babel/helpers - typeof";return n2=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(a){return typeof a}:function(a){return a&&typeof Symbol=="function"&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},n2(c)}function Rf(c,a){if(!(c instanceof a))throw new TypeError("Cannot call a class as a function")}function b4(c,a){for(var e=0;e<a.length;e++){var r=a[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(c,r.key,r)}}function qf(c,a,e){return a&&b4(c.prototype,a),e&&b4(c,e),Object.defineProperty(c,"prototype",{writable:!1}),c}function O(c,a,e){return a in c?Object.defineProperty(c,a,{value:e,enumerable:!0,configurable:!0,writable:!0}):c[a]=e,c}function V3(c,a){return Ef(c)||If(c,a)||h6(c,a)||Gf()}function R1(c){return $f(c)||Uf(c)||h6(c)||Of()}function $f(c){if(Array.isArray(c))return j2(c)}function Ef(c){if(Array.isArray(c))return c}function Uf(c){if(typeof Symbol<"u"&&c[Symbol.iterator]!=null||c["@@iterator"]!=null)return Array.from(c)}function If(c,a){var e=c==null?null:typeof Symbol<"u"&&c[Symbol.iterator]||c["@@iterator"];if(e!=null){var r=[],s=!0,i=!1,l,n;try{for(e=e.call(c);!(s=(l=e.next()).done)&&(r.push(l.value),!(a&&r.length===a));s=!0);}catch(o){i=!0,n=o}finally{try{!s&&e.return!=null&&e.return()}finally{if(i)throw n}}return r}}function h6(c,a){if(c){if(typeof c=="string")return j2(c,a);var e=Object.prototype.toString.call(c).slice(8,-1);if(e==="Object"&&c.constructor&&(e=c.constructor.name),e==="Map"||e==="Set")return Array.from(c);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return j2(c,a)}}function j2(c,a){(a==null||a>c.length)&&(a=c.length);for(var e=0,r=new Array(a);e<a;e++)r[e]=c[e];return r}function Of(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Gf(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var x4=function(){},p3={},H6={},V6=null,p6={mark:x4,measure:x4};try{typeof window<"u"&&(p3=window),typeof document<"u"&&(H6=document),typeof MutationObserver<"u"&&(V6=MutationObserver),typeof performance<"u"&&(p6=performance)}catch{}var Wf=p3.navigator||{},N4=Wf.userAgent,S4=N4===void 0?"":N4,m1=p3,R=H6,k4=V6,W1=p6;m1.document;var o1=!!R.documentElement&&!!R.head&&typeof R.addEventListener=="function"&&typeof R.createElement=="function",u6=~S4.indexOf("MSIE")||~S4.indexOf("Trident/"),Z1,j1,Y1,X1,K1,s1="___FONT_AWESOME___",Y2=16,M6="fa",C6="svg-inline--fa",C1="data-fa-i2svg",X2="data-fa-pseudo-element",Zf="data-fa-pseudo-element-pending",u3="data-prefix",M3="data-icon",w4="fontawesome-i2svg",jf="async",Yf=["HTML","HEAD","STYLE","SCRIPT"],d6=function(){try{return!0}catch{return!1}}(),D="classic",I="sharp",C3=[D,I];function q1(c){return new Proxy(c,{get:function(e,r){return r in e?e[r]:e[D]}})}var P1=q1((Z1={},O(Z1,D,{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands",fak:"kit",fakd:"kit","fa-kit":"kit","fa-kit-duotone":"kit"}),O(Z1,I,{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"}),Z1)),_1=q1((j1={},O(j1,D,{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab",kit:"fak"}),O(j1,I,{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"}),j1)),T1=q1((Y1={},O(Y1,D,{fab:"fa-brands",fad:"fa-duotone",fak:"fa-kit",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"}),O(Y1,I,{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"}),Y1)),Xf=q1((X1={},O(X1,D,{"fa-brands":"fab","fa-duotone":"fad","fa-kit":"fak","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"}),O(X1,I,{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"}),X1)),Kf=/fa(s|r|l|t|d|b|k|ss|sr|sl|st)?[\-\ ]/,L6="fa-layers-text",Qf=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp|Kit)?.*/i,Jf=q1((K1={},O(K1,D,{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"}),O(K1,I,{900:"fass",400:"fasr",300:"fasl",100:"fast"}),K1)),g6=[1,2,3,4,5,6,7,8,9,10],ct=g6.concat([11,12,13,14,15,16,17,18,19,20]),at=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],V1={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},B1=new Set;Object.keys(_1[D]).map(B1.add.bind(B1));Object.keys(_1[I]).map(B1.add.bind(B1));var et=[].concat(C3,R1(B1),["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",V1.GROUP,V1.SWAP_OPACITY,V1.PRIMARY,V1.SECONDARY]).concat(g6.map(function(c){return"".concat(c,"x")})).concat(ct.map(function(c){return"w-".concat(c)})),y1=m1.FontAwesomeConfig||{};function rt(c){var a=R.querySelector("script["+c+"]");if(a)return a.getAttribute(c)}function st(c){return c===""?!0:c==="false"?!1:c==="true"?!0:c}if(R&&typeof R.querySelector=="function"){var it=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];it.forEach(function(c){var a=V3(c,2),e=a[0],r=a[1],s=st(rt(e));s!=null&&(y1[r]=s)})}var b6={styleDefault:"solid",familyDefault:"classic",cssPrefix:M6,replacementClass:C6,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};y1.familyPrefix&&(y1.cssPrefix=y1.familyPrefix);var N1=C(C({},b6),y1);N1.autoReplaceSvg||(N1.observeMutations=!1);var b={};Object.keys(b6).forEach(function(c){Object.defineProperty(b,c,{enumerable:!0,set:function(e){N1[c]=e,A1.forEach(function(r){return r(b)})},get:function(){return N1[c]}})});Object.defineProperty(b,"familyPrefix",{enumerable:!0,set:function(a){N1.cssPrefix=a,A1.forEach(function(e){return e(b)})},get:function(){return N1.cssPrefix}});m1.FontAwesomeConfig=b;var A1=[];function lt(c){return A1.push(c),function(){A1.splice(A1.indexOf(c),1)}}var t1=Y2,a1={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function nt(c){if(!(!c||!o1)){var a=R.createElement("style");a.setAttribute("type","text/css"),a.innerHTML=c;for(var e=R.head.childNodes,r=null,s=e.length-1;s>-1;s--){var i=e[s],l=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(l)>-1&&(r=i)}return R.head.insertBefore(a,r),c}}var ot="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function F1(){for(var c=12,a="";c-- >0;)a+=ot[Math.random()*62|0];return a}function k1(c){for(var a=[],e=(c||[]).length>>>0;e--;)a[e]=c[e];return a}function d3(c){return c.classList?k1(c.classList):(c.getAttribute("class")||"").split(" ").filter(function(a){return a})}function x6(c){return"".concat(c).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ft(c){return Object.keys(c||{}).reduce(function(a,e){return a+"".concat(e,'="').concat(x6(c[e]),'" ')},"").trim()}function V2(c){return Object.keys(c||{}).reduce(function(a,e){return a+"".concat(e,": ").concat(c[e].trim(),";")},"")}function L3(c){return c.size!==a1.size||c.x!==a1.x||c.y!==a1.y||c.rotate!==a1.rotate||c.flipX||c.flipY}function tt(c){var a=c.transform,e=c.containerWidth,r=c.iconWidth,s={transform:"translate(".concat(e/2," 256)")},i="translate(".concat(a.x*32,", ").concat(a.y*32,") "),l="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),n="rotate(".concat(a.rotate," 0 0)"),o={transform:"".concat(i," ").concat(l," ").concat(n)},v={transform:"translate(".concat(r/2*-1," -256)")};return{outer:s,inner:o,path:v}}function mt(c){var a=c.transform,e=c.width,r=e===void 0?Y2:e,s=c.height,i=s===void 0?Y2:s,l=c.startCentered,n=l===void 0?!1:l,o="";return n&&u6?o+="translate(".concat(a.x/t1-r/2,"em, ").concat(a.y/t1-i/2,"em) "):n?o+="translate(calc(-50% + ".concat(a.x/t1,"em), calc(-50% + ").concat(a.y/t1,"em)) "):o+="translate(".concat(a.x/t1,"em, ").concat(a.y/t1,"em) "),o+="scale(".concat(a.size/t1*(a.flipX?-1:1),", ").concat(a.size/t1*(a.flipY?-1:1),") "),o+="rotate(".concat(a.rotate,"deg) "),o}var vt=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-counter-scale, 0.25));
          transform: scale(var(--fa-counter-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top left;
          transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(var(--fa-li-width, 2em) * -1);
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  -webkit-animation-name: fa-beat;
          animation-name: fa-beat;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  -webkit-animation-name: fa-bounce;
          animation-name: fa-bounce;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  -webkit-animation-name: fa-fade;
          animation-name: fa-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  -webkit-animation-name: fa-beat-fade;
          animation-name: fa-beat-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  -webkit-animation-name: fa-flip;
          animation-name: fa-flip;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  -webkit-animation-name: fa-shake;
          animation-name: fa-shake;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 2s);
          animation-duration: var(--fa-animation-duration, 2s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));
          animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    -webkit-animation-delay: -1ms;
            animation-delay: -1ms;
    -webkit-animation-duration: 1ms;
            animation-duration: 1ms;
    -webkit-animation-iteration-count: 1;
            animation-iteration-count: 1;
    -webkit-transition-delay: 0s;
            transition-delay: 0s;
    -webkit-transition-duration: 0s;
            transition-duration: 0s;
  }
}
@-webkit-keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@-webkit-keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@-webkit-keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@-webkit-keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@-webkit-keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@-webkit-keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@-webkit-keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
}

.fa-rotate-180 {
  -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
}

.fa-rotate-270 {
  -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
}

.fa-flip-horizontal {
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}

.fa-flip-vertical {
  -webkit-transform: scale(1, -1);
          transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  -webkit-transform: scale(-1, -1);
          transform: scale(-1, -1);
}

.fa-rotate-by {
  -webkit-transform: rotate(var(--fa-rotate-angle, none));
          transform: rotate(var(--fa-rotate-angle, none));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse,
.fa-duotone.fa-inverse {
  color: var(--fa-inverse, #fff);
}`;function N6(){var c=M6,a=C6,e=b.cssPrefix,r=b.replacementClass,s=vt;if(e!==c||r!==a){var i=new RegExp("\\.".concat(c,"\\-"),"g"),l=new RegExp("\\--".concat(c,"\\-"),"g"),n=new RegExp("\\.".concat(a),"g");s=s.replace(i,".".concat(e,"-")).replace(l,"--".concat(e,"-")).replace(n,".".concat(r))}return s}var y4=!1;function R2(){b.autoAddCss&&!y4&&(nt(N6()),y4=!0)}var zt={mixout:function(){return{dom:{css:N6,insertCss:R2}}},hooks:function(){return{beforeDOMElementCreation:function(){R2()},beforeI2svg:function(){R2()}}}},i1=m1||{};i1[s1]||(i1[s1]={});i1[s1].styles||(i1[s1].styles={});i1[s1].hooks||(i1[s1].hooks={});i1[s1].shims||(i1[s1].shims=[]);var Y=i1[s1],S6=[],ht=function c(){R.removeEventListener("DOMContentLoaded",c),o2=1,S6.map(function(a){return a()})},o2=!1;o1&&(o2=(R.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(R.readyState),o2||R.addEventListener("DOMContentLoaded",ht));function Ht(c){o1&&(o2?setTimeout(c,0):S6.push(c))}function $1(c){var a=c.tag,e=c.attributes,r=e===void 0?{}:e,s=c.children,i=s===void 0?[]:s;return typeof c=="string"?x6(c):"<".concat(a," ").concat(ft(r),">").concat(i.map($1).join(""),"</").concat(a,">")}function A4(c,a,e){if(c&&c[a]&&c[a][e])return{prefix:a,iconName:e,icon:c[a][e]}}var Vt=function(a,e){return function(r,s,i,l){return a.call(e,r,s,i,l)}},q2=function(a,e,r,s){var i=Object.keys(a),l=i.length,n=s!==void 0?Vt(e,s):e,o,v,h;for(r===void 0?(o=1,h=a[i[0]]):(o=0,h=r);o<l;o++)v=i[o],h=n(h,a[v],v,a);return h};function pt(c){for(var a=[],e=0,r=c.length;e<r;){var s=c.charCodeAt(e++);if(s>=55296&&s<=56319&&e<r){var i=c.charCodeAt(e++);(i&64512)==56320?a.push(((s&1023)<<10)+(i&1023)+65536):(a.push(s),e--)}else a.push(s)}return a}function K2(c){var a=pt(c);return a.length===1?a[0].toString(16):null}function ut(c,a){var e=c.length,r=c.charCodeAt(a),s;return r>=55296&&r<=56319&&e>a+1&&(s=c.charCodeAt(a+1),s>=56320&&s<=57343)?(r-55296)*1024+s-56320+65536:r}function P4(c){return Object.keys(c).reduce(function(a,e){var r=c[e],s=!!r.icon;return s?a[r.iconName]=r.icon:a[e]=r,a},{})}function Q2(c,a){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},r=e.skipHooks,s=r===void 0?!1:r,i=P4(a);typeof Y.hooks.addPack=="function"&&!s?Y.hooks.addPack(c,P4(a)):Y.styles[c]=C(C({},Y.styles[c]||{}),i),c==="fas"&&Q2("fa",a)}var Q1,J1,c2,g1=Y.styles,Mt=Y.shims,Ct=(Q1={},O(Q1,D,Object.values(T1[D])),O(Q1,I,Object.values(T1[I])),Q1),g3=null,k6={},w6={},y6={},A6={},P6={},dt=(J1={},O(J1,D,Object.keys(P1[D])),O(J1,I,Object.keys(P1[I])),J1);function Lt(c){return~et.indexOf(c)}function gt(c,a){var e=a.split("-"),r=e[0],s=e.slice(1).join("-");return r===c&&s!==""&&!Lt(s)?s:null}var _6=function(){var a=function(i){return q2(g1,function(l,n,o){return l[o]=q2(n,i,{}),l},{})};k6=a(function(s,i,l){if(i[3]&&(s[i[3]]=l),i[2]){var n=i[2].filter(function(o){return typeof o=="number"});n.forEach(function(o){s[o.toString(16)]=l})}return s}),w6=a(function(s,i,l){if(s[l]=l,i[2]){var n=i[2].filter(function(o){return typeof o=="string"});n.forEach(function(o){s[o]=l})}return s}),P6=a(function(s,i,l){var n=i[2];return s[l]=l,n.forEach(function(o){s[o]=l}),s});var e="far"in g1||b.autoFetchSvg,r=q2(Mt,function(s,i){var l=i[0],n=i[1],o=i[2];return n==="far"&&!e&&(n="fas"),typeof l=="string"&&(s.names[l]={prefix:n,iconName:o}),typeof l=="number"&&(s.unicodes[l.toString(16)]={prefix:n,iconName:o}),s},{names:{},unicodes:{}});y6=r.names,A6=r.unicodes,g3=p2(b.styleDefault,{family:b.familyDefault})};lt(function(c){g3=p2(c.styleDefault,{family:b.familyDefault})});_6();function b3(c,a){return(k6[c]||{})[a]}function bt(c,a){return(w6[c]||{})[a]}function p1(c,a){return(P6[c]||{})[a]}function T6(c){return y6[c]||{prefix:null,iconName:null}}function xt(c){var a=A6[c],e=b3("fas",c);return a||(e?{prefix:"fas",iconName:e}:null)||{prefix:null,iconName:null}}function v1(){return g3}var x3=function(){return{prefix:null,iconName:null,rest:[]}};function p2(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=a.family,r=e===void 0?D:e,s=P1[r][c],i=_1[r][c]||_1[r][s],l=c in Y.styles?c:null;return i||l||null}var _4=(c2={},O(c2,D,Object.keys(T1[D])),O(c2,I,Object.keys(T1[I])),c2);function u2(c){var a,e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.skipLookups,s=r===void 0?!1:r,i=(a={},O(a,D,"".concat(b.cssPrefix,"-").concat(D)),O(a,I,"".concat(b.cssPrefix,"-").concat(I)),a),l=null,n=D;(c.includes(i[D])||c.some(function(v){return _4[D].includes(v)}))&&(n=D),(c.includes(i[I])||c.some(function(v){return _4[I].includes(v)}))&&(n=I);var o=c.reduce(function(v,h){var V=gt(b.cssPrefix,h);if(g1[h]?(h=Ct[n].includes(h)?Xf[n][h]:h,l=h,v.prefix=h):dt[n].indexOf(h)>-1?(l=h,v.prefix=p2(h,{family:n})):V?v.iconName=V:h!==b.replacementClass&&h!==i[D]&&h!==i[I]&&v.rest.push(h),!s&&v.prefix&&v.iconName){var u=l==="fa"?T6(v.iconName):{},L=p1(v.prefix,v.iconName);u.prefix&&(l=null),v.iconName=u.iconName||L||v.iconName,v.prefix=u.prefix||v.prefix,v.prefix==="far"&&!g1.far&&g1.fas&&!b.autoFetchSvg&&(v.prefix="fas")}return v},x3());return(c.includes("fa-brands")||c.includes("fab"))&&(o.prefix="fab"),(c.includes("fa-duotone")||c.includes("fad"))&&(o.prefix="fad"),!o.prefix&&n===I&&(g1.fass||b.autoFetchSvg)&&(o.prefix="fass",o.iconName=p1(o.prefix,o.iconName)||o.iconName),(o.prefix==="fa"||l==="fa")&&(o.prefix=v1()||"fas"),o}var Nt=function(){function c(){Rf(this,c),this.definitions={}}return qf(c,[{key:"add",value:function(){for(var e=this,r=arguments.length,s=new Array(r),i=0;i<r;i++)s[i]=arguments[i];var l=s.reduce(this._pullDefinitions,{});Object.keys(l).forEach(function(n){e.definitions[n]=C(C({},e.definitions[n]||{}),l[n]),Q2(n,l[n]);var o=T1[D][n];o&&Q2(o,l[n]),_6()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(e,r){var s=r.prefix&&r.iconName&&r.icon?{0:r}:r;return Object.keys(s).map(function(i){var l=s[i],n=l.prefix,o=l.iconName,v=l.icon,h=v[2];e[n]||(e[n]={}),h.length>0&&h.forEach(function(V){typeof V=="string"&&(e[n][V]=v)}),e[n][o]=v}),e}}]),c}(),T4=[],b1={},x1={},St=Object.keys(x1);function kt(c,a){var e=a.mixoutsTo;return T4=c,b1={},Object.keys(x1).forEach(function(r){St.indexOf(r)===-1&&delete x1[r]}),T4.forEach(function(r){var s=r.mixout?r.mixout():{};if(Object.keys(s).forEach(function(l){typeof s[l]=="function"&&(e[l]=s[l]),n2(s[l])==="object"&&Object.keys(s[l]).forEach(function(n){e[l]||(e[l]={}),e[l][n]=s[l][n]})}),r.hooks){var i=r.hooks();Object.keys(i).forEach(function(l){b1[l]||(b1[l]=[]),b1[l].push(i[l])})}r.provides&&r.provides(x1)}),e}function J2(c,a){for(var e=arguments.length,r=new Array(e>2?e-2:0),s=2;s<e;s++)r[s-2]=arguments[s];var i=b1[c]||[];return i.forEach(function(l){a=l.apply(null,[a].concat(r))}),a}function d1(c){for(var a=arguments.length,e=new Array(a>1?a-1:0),r=1;r<a;r++)e[r-1]=arguments[r];var s=b1[c]||[];s.forEach(function(i){i.apply(null,e)})}function l1(){var c=arguments[0],a=Array.prototype.slice.call(arguments,1);return x1[c]?x1[c].apply(null,a):void 0}function c3(c){c.prefix==="fa"&&(c.prefix="fas");var a=c.iconName,e=c.prefix||v1();if(a)return a=p1(e,a)||a,A4(B6.definitions,e,a)||A4(Y.styles,e,a)}var B6=new Nt,wt=function(){b.autoReplaceSvg=!1,b.observeMutations=!1,d1("noAuto")},yt={i2svg:function(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return o1?(d1("beforeI2svg",a),l1("pseudoElements2svg",a),l1("i2svg",a)):Promise.reject("Operation requires a DOM of some kind.")},watch:function(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=a.autoReplaceSvgRoot;b.autoReplaceSvg===!1&&(b.autoReplaceSvg=!0),b.observeMutations=!0,Ht(function(){Pt({autoReplaceSvgRoot:e}),d1("watch",a)})}},At={icon:function(a){if(a===null)return null;if(n2(a)==="object"&&a.prefix&&a.iconName)return{prefix:a.prefix,iconName:p1(a.prefix,a.iconName)||a.iconName};if(Array.isArray(a)&&a.length===2){var e=a[1].indexOf("fa-")===0?a[1].slice(3):a[1],r=p2(a[0]);return{prefix:r,iconName:p1(r,e)||e}}if(typeof a=="string"&&(a.indexOf("".concat(b.cssPrefix,"-"))>-1||a.match(Kf))){var s=u2(a.split(" "),{skipLookups:!0});return{prefix:s.prefix||v1(),iconName:p1(s.prefix,s.iconName)||s.iconName}}if(typeof a=="string"){var i=v1();return{prefix:i,iconName:p1(i,a)||a}}}},Z={noAuto:wt,config:b,dom:yt,parse:At,library:B6,findIconDefinition:c3,toHtml:$1},Pt=function(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=a.autoReplaceSvgRoot,r=e===void 0?R:e;(Object.keys(Y.styles).length>0||b.autoFetchSvg)&&o1&&b.autoReplaceSvg&&Z.dom.i2svg({node:r})};function M2(c,a){return Object.defineProperty(c,"abstract",{get:a}),Object.defineProperty(c,"html",{get:function(){return c.abstract.map(function(r){return $1(r)})}}),Object.defineProperty(c,"node",{get:function(){if(o1){var r=R.createElement("div");return r.innerHTML=c.html,r.children}}}),c}function _t(c){var a=c.children,e=c.main,r=c.mask,s=c.attributes,i=c.styles,l=c.transform;if(L3(l)&&e.found&&!r.found){var n=e.width,o=e.height,v={x:n/o/2,y:.5};s.style=V2(C(C({},i),{},{"transform-origin":"".concat(v.x+l.x/16,"em ").concat(v.y+l.y/16,"em")}))}return[{tag:"svg",attributes:s,children:a}]}function Tt(c){var a=c.prefix,e=c.iconName,r=c.children,s=c.attributes,i=c.symbol,l=i===!0?"".concat(a,"-").concat(b.cssPrefix,"-").concat(e):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:C(C({},s),{},{id:l}),children:r}]}]}function N3(c){var a=c.icons,e=a.main,r=a.mask,s=c.prefix,i=c.iconName,l=c.transform,n=c.symbol,o=c.title,v=c.maskId,h=c.titleId,V=c.extra,u=c.watchable,L=u===void 0?!1:u,A=r.found?r:e,_=A.width,y=A.height,N=s==="fak",g=[b.replacementClass,i?"".concat(b.cssPrefix,"-").concat(i):""].filter(function(f1){return V.classes.indexOf(f1)===-1}).filter(function(f1){return f1!==""||!!f1}).concat(V.classes).join(" "),T={children:[],attributes:C(C({},V.attributes),{},{"data-prefix":s,"data-icon":i,class:g,role:V.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(_," ").concat(y)})},E=N&&!~V.classes.indexOf("fa-fw")?{width:"".concat(_/y*16*.0625,"em")}:{};L&&(T.attributes[C1]=""),o&&(T.children.push({tag:"title",attributes:{id:T.attributes["aria-labelledby"]||"title-".concat(h||F1())},children:[o]}),delete T.attributes.title);var U=C(C({},T),{},{prefix:s,iconName:i,main:e,mask:r,maskId:v,transform:l,symbol:n,styles:C(C({},E),V.styles)}),c1=r.found&&e.found?l1("generateAbstractMask",U)||{children:[],attributes:{}}:l1("generateAbstractIcon",U)||{children:[],attributes:{}},j=c1.children,F2=c1.attributes;return U.children=j,U.attributes=F2,n?Tt(U):_t(U)}function B4(c){var a=c.content,e=c.width,r=c.height,s=c.transform,i=c.title,l=c.extra,n=c.watchable,o=n===void 0?!1:n,v=C(C(C({},l.attributes),i?{title:i}:{}),{},{class:l.classes.join(" ")});o&&(v[C1]="");var h=C({},l.styles);L3(s)&&(h.transform=mt({transform:s,startCentered:!0,width:e,height:r}),h["-webkit-transform"]=h.transform);var V=V2(h);V.length>0&&(v.style=V);var u=[];return u.push({tag:"span",attributes:v,children:[a]}),i&&u.push({tag:"span",attributes:{class:"sr-only"},children:[i]}),u}function Bt(c){var a=c.content,e=c.title,r=c.extra,s=C(C(C({},r.attributes),e?{title:e}:{}),{},{class:r.classes.join(" ")}),i=V2(r.styles);i.length>0&&(s.style=i);var l=[];return l.push({tag:"span",attributes:s,children:[a]}),e&&l.push({tag:"span",attributes:{class:"sr-only"},children:[e]}),l}var $2=Y.styles;function a3(c){var a=c[0],e=c[1],r=c.slice(4),s=V3(r,1),i=s[0],l=null;return Array.isArray(i)?l={tag:"g",attributes:{class:"".concat(b.cssPrefix,"-").concat(V1.GROUP)},children:[{tag:"path",attributes:{class:"".concat(b.cssPrefix,"-").concat(V1.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(b.cssPrefix,"-").concat(V1.PRIMARY),fill:"currentColor",d:i[1]}}]}:l={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:a,height:e,icon:l}}var Ft={found:!1,width:512,height:512};function Dt(c,a){!d6&&!b.showMissingIcons&&c&&console.error('Icon with name "'.concat(c,'" and prefix "').concat(a,'" is missing.'))}function e3(c,a){var e=a;return a==="fa"&&b.styleDefault!==null&&(a=v1()),new Promise(function(r,s){if(l1("missingIconAbstract"),e==="fa"){var i=T6(c)||{};c=i.iconName||c,a=i.prefix||a}if(c&&a&&$2[a]&&$2[a][c]){var l=$2[a][c];return r(a3(l))}Dt(c,a),r(C(C({},Ft),{},{icon:b.showMissingIcons&&c?l1("missingIconAbstract")||{}:{}}))})}var F4=function(){},r3=b.measurePerformance&&W1&&W1.mark&&W1.measure?W1:{mark:F4,measure:F4},w1='FA "6.5.1"',Rt=function(a){return r3.mark("".concat(w1," ").concat(a," begins")),function(){return F6(a)}},F6=function(a){r3.mark("".concat(w1," ").concat(a," ends")),r3.measure("".concat(w1," ").concat(a),"".concat(w1," ").concat(a," begins"),"".concat(w1," ").concat(a," ends"))},S3={begin:Rt,end:F6},s2=function(){};function D4(c){var a=c.getAttribute?c.getAttribute(C1):null;return typeof a=="string"}function qt(c){var a=c.getAttribute?c.getAttribute(u3):null,e=c.getAttribute?c.getAttribute(M3):null;return a&&e}function $t(c){return c&&c.classList&&c.classList.contains&&c.classList.contains(b.replacementClass)}function Et(){if(b.autoReplaceSvg===!0)return i2.replace;var c=i2[b.autoReplaceSvg];return c||i2.replace}function Ut(c){return R.createElementNS("http://www.w3.org/2000/svg",c)}function It(c){return R.createElement(c)}function D6(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=a.ceFn,r=e===void 0?c.tag==="svg"?Ut:It:e;if(typeof c=="string")return R.createTextNode(c);var s=r(c.tag);Object.keys(c.attributes||[]).forEach(function(l){s.setAttribute(l,c.attributes[l])});var i=c.children||[];return i.forEach(function(l){s.appendChild(D6(l,{ceFn:r}))}),s}function Ot(c){var a=" ".concat(c.outerHTML," ");return a="".concat(a,"Font Awesome fontawesome.com "),a}var i2={replace:function(a){var e=a[0];if(e.parentNode)if(a[1].forEach(function(s){e.parentNode.insertBefore(D6(s),e)}),e.getAttribute(C1)===null&&b.keepOriginalSource){var r=R.createComment(Ot(e));e.parentNode.replaceChild(r,e)}else e.remove()},nest:function(a){var e=a[0],r=a[1];if(~d3(e).indexOf(b.replacementClass))return i2.replace(a);var s=new RegExp("".concat(b.cssPrefix,"-.*"));if(delete r[0].attributes.id,r[0].attributes.class){var i=r[0].attributes.class.split(" ").reduce(function(n,o){return o===b.replacementClass||o.match(s)?n.toSvg.push(o):n.toNode.push(o),n},{toNode:[],toSvg:[]});r[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",i.toNode.join(" "))}var l=r.map(function(n){return $1(n)}).join(`
`);e.setAttribute(C1,""),e.innerHTML=l}};function R4(c){c()}function R6(c,a){var e=typeof a=="function"?a:s2;if(c.length===0)e();else{var r=R4;b.mutateApproach===jf&&(r=m1.requestAnimationFrame||R4),r(function(){var s=Et(),i=S3.begin("mutate");c.map(s),i(),e()})}}var k3=!1;function q6(){k3=!0}function s3(){k3=!1}var f2=null;function q4(c){if(k4&&b.observeMutations){var a=c.treeCallback,e=a===void 0?s2:a,r=c.nodeCallback,s=r===void 0?s2:r,i=c.pseudoElementsCallback,l=i===void 0?s2:i,n=c.observeMutationsRoot,o=n===void 0?R:n;f2=new k4(function(v){if(!k3){var h=v1();k1(v).forEach(function(V){if(V.type==="childList"&&V.addedNodes.length>0&&!D4(V.addedNodes[0])&&(b.searchPseudoElements&&l(V.target),e(V.target)),V.type==="attributes"&&V.target.parentNode&&b.searchPseudoElements&&l(V.target.parentNode),V.type==="attributes"&&D4(V.target)&&~at.indexOf(V.attributeName))if(V.attributeName==="class"&&qt(V.target)){var u=u2(d3(V.target)),L=u.prefix,A=u.iconName;V.target.setAttribute(u3,L||h),A&&V.target.setAttribute(M3,A)}else $t(V.target)&&s(V.target)})}}),o1&&f2.observe(o,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Gt(){f2&&f2.disconnect()}function Wt(c){var a=c.getAttribute("style"),e=[];return a&&(e=a.split(";").reduce(function(r,s){var i=s.split(":"),l=i[0],n=i.slice(1);return l&&n.length>0&&(r[l]=n.join(":").trim()),r},{})),e}function Zt(c){var a=c.getAttribute("data-prefix"),e=c.getAttribute("data-icon"),r=c.innerText!==void 0?c.innerText.trim():"",s=u2(d3(c));return s.prefix||(s.prefix=v1()),a&&e&&(s.prefix=a,s.iconName=e),s.iconName&&s.prefix||(s.prefix&&r.length>0&&(s.iconName=bt(s.prefix,c.innerText)||b3(s.prefix,K2(c.innerText))),!s.iconName&&b.autoFetchSvg&&c.firstChild&&c.firstChild.nodeType===Node.TEXT_NODE&&(s.iconName=c.firstChild.data)),s}function jt(c){var a=k1(c.attributes).reduce(function(s,i){return s.name!=="class"&&s.name!=="style"&&(s[i.name]=i.value),s},{}),e=c.getAttribute("title"),r=c.getAttribute("data-fa-title-id");return b.autoA11y&&(e?a["aria-labelledby"]="".concat(b.replacementClass,"-title-").concat(r||F1()):(a["aria-hidden"]="true",a.focusable="false")),a}function Yt(){return{iconName:null,title:null,titleId:null,prefix:null,transform:a1,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function $4(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},e=Zt(c),r=e.iconName,s=e.prefix,i=e.rest,l=jt(c),n=J2("parseNodeAttributes",{},c),o=a.styleParser?Wt(c):[];return C({iconName:r,title:c.getAttribute("title"),titleId:c.getAttribute("data-fa-title-id"),prefix:s,transform:a1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:o,attributes:l}},n)}var Xt=Y.styles;function $6(c){var a=b.autoReplaceSvg==="nest"?$4(c,{styleParser:!1}):$4(c);return~a.extra.classes.indexOf(L6)?l1("generateLayersText",c,a):l1("generateSvgReplacementMutation",c,a)}var z1=new Set;C3.map(function(c){z1.add("fa-".concat(c))});Object.keys(P1[D]).map(z1.add.bind(z1));Object.keys(P1[I]).map(z1.add.bind(z1));z1=R1(z1);function E4(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!o1)return Promise.resolve();var e=R.documentElement.classList,r=function(V){return e.add("".concat(w4,"-").concat(V))},s=function(V){return e.remove("".concat(w4,"-").concat(V))},i=b.autoFetchSvg?z1:C3.map(function(h){return"fa-".concat(h)}).concat(Object.keys(Xt));i.includes("fa")||i.push("fa");var l=[".".concat(L6,":not([").concat(C1,"])")].concat(i.map(function(h){return".".concat(h,":not([").concat(C1,"])")})).join(", ");if(l.length===0)return Promise.resolve();var n=[];try{n=k1(c.querySelectorAll(l))}catch{}if(n.length>0)r("pending"),s("complete");else return Promise.resolve();var o=S3.begin("onTree"),v=n.reduce(function(h,V){try{var u=$6(V);u&&h.push(u)}catch(L){d6||L.name==="MissingIcon"&&console.error(L)}return h},[]);return new Promise(function(h,V){Promise.all(v).then(function(u){R6(u,function(){r("active"),r("complete"),s("pending"),typeof a=="function"&&a(),o(),h()})}).catch(function(u){o(),V(u)})})}function Kt(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;$6(c).then(function(e){e&&R6([e],a)})}function Qt(c){return function(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(a||{}).icon?a:c3(a||{}),s=e.mask;return s&&(s=(s||{}).icon?s:c3(s||{})),c(r,C(C({},e),{},{mask:s}))}}var Jt=function(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.transform,s=r===void 0?a1:r,i=e.symbol,l=i===void 0?!1:i,n=e.mask,o=n===void 0?null:n,v=e.maskId,h=v===void 0?null:v,V=e.title,u=V===void 0?null:V,L=e.titleId,A=L===void 0?null:L,_=e.classes,y=_===void 0?[]:_,N=e.attributes,g=N===void 0?{}:N,T=e.styles,E=T===void 0?{}:T;if(a){var U=a.prefix,c1=a.iconName,j=a.icon;return M2(C({type:"icon"},a),function(){return d1("beforeDOMElementCreation",{iconDefinition:a,params:e}),b.autoA11y&&(u?g["aria-labelledby"]="".concat(b.replacementClass,"-title-").concat(A||F1()):(g["aria-hidden"]="true",g.focusable="false")),N3({icons:{main:a3(j),mask:o?a3(o.icon):{found:!1,width:null,height:null,icon:{}}},prefix:U,iconName:c1,transform:C(C({},a1),s),symbol:l,title:u,maskId:h,titleId:A,extra:{attributes:g,styles:E,classes:y}})})}},cm={mixout:function(){return{icon:Qt(Jt)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=E4,e.nodeCallback=Kt,e}}},provides:function(a){a.i2svg=function(e){var r=e.node,s=r===void 0?R:r,i=e.callback,l=i===void 0?function(){}:i;return E4(s,l)},a.generateSvgReplacementMutation=function(e,r){var s=r.iconName,i=r.title,l=r.titleId,n=r.prefix,o=r.transform,v=r.symbol,h=r.mask,V=r.maskId,u=r.extra;return new Promise(function(L,A){Promise.all([e3(s,n),h.iconName?e3(h.iconName,h.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(_){var y=V3(_,2),N=y[0],g=y[1];L([e,N3({icons:{main:N,mask:g},prefix:n,iconName:s,transform:o,symbol:v,maskId:V,title:i,titleId:l,extra:u,watchable:!0})])}).catch(A)})},a.generateAbstractIcon=function(e){var r=e.children,s=e.attributes,i=e.main,l=e.transform,n=e.styles,o=V2(n);o.length>0&&(s.style=o);var v;return L3(l)&&(v=l1("generateAbstractTransformGrouping",{main:i,transform:l,containerWidth:i.width,iconWidth:i.width})),r.push(v||i.icon),{children:r,attributes:s}}}},am={mixout:function(){return{layer:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=r.classes,i=s===void 0?[]:s;return M2({type:"layer"},function(){d1("beforeDOMElementCreation",{assembler:e,params:r});var l=[];return e(function(n){Array.isArray(n)?n.map(function(o){l=l.concat(o.abstract)}):l=l.concat(n.abstract)}),[{tag:"span",attributes:{class:["".concat(b.cssPrefix,"-layers")].concat(R1(i)).join(" ")},children:l}]})}}}},em={mixout:function(){return{counter:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=r.title,i=s===void 0?null:s,l=r.classes,n=l===void 0?[]:l,o=r.attributes,v=o===void 0?{}:o,h=r.styles,V=h===void 0?{}:h;return M2({type:"counter",content:e},function(){return d1("beforeDOMElementCreation",{content:e,params:r}),Bt({content:e.toString(),title:i,extra:{attributes:v,styles:V,classes:["".concat(b.cssPrefix,"-layers-counter")].concat(R1(n))}})})}}}},rm={mixout:function(){return{text:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=r.transform,i=s===void 0?a1:s,l=r.title,n=l===void 0?null:l,o=r.classes,v=o===void 0?[]:o,h=r.attributes,V=h===void 0?{}:h,u=r.styles,L=u===void 0?{}:u;return M2({type:"text",content:e},function(){return d1("beforeDOMElementCreation",{content:e,params:r}),B4({content:e,transform:C(C({},a1),i),title:n,extra:{attributes:V,styles:L,classes:["".concat(b.cssPrefix,"-layers-text")].concat(R1(v))}})})}}},provides:function(a){a.generateLayersText=function(e,r){var s=r.title,i=r.transform,l=r.extra,n=null,o=null;if(u6){var v=parseInt(getComputedStyle(e).fontSize,10),h=e.getBoundingClientRect();n=h.width/v,o=h.height/v}return b.autoA11y&&!s&&(l.attributes["aria-hidden"]="true"),Promise.resolve([e,B4({content:e.innerHTML,width:n,height:o,transform:i,title:s,extra:l,watchable:!0})])}}},sm=new RegExp('"',"ug"),U4=[1105920,1112319];function im(c){var a=c.replace(sm,""),e=ut(a,0),r=e>=U4[0]&&e<=U4[1],s=a.length===2?a[0]===a[1]:!1;return{value:K2(s?a[0]:a),isSecondary:r||s}}function I4(c,a){var e="".concat(Zf).concat(a.replace(":","-"));return new Promise(function(r,s){if(c.getAttribute(e)!==null)return r();var i=k1(c.children),l=i.filter(function(j){return j.getAttribute(X2)===a})[0],n=m1.getComputedStyle(c,a),o=n.getPropertyValue("font-family").match(Qf),v=n.getPropertyValue("font-weight"),h=n.getPropertyValue("content");if(l&&!o)return c.removeChild(l),r();if(o&&h!=="none"&&h!==""){var V=n.getPropertyValue("content"),u=~["Sharp"].indexOf(o[2])?I:D,L=~["Solid","Regular","Light","Thin","Duotone","Brands","Kit"].indexOf(o[2])?_1[u][o[2].toLowerCase()]:Jf[u][v],A=im(V),_=A.value,y=A.isSecondary,N=o[0].startsWith("FontAwesome"),g=b3(L,_),T=g;if(N){var E=xt(_);E.iconName&&E.prefix&&(g=E.iconName,L=E.prefix)}if(g&&!y&&(!l||l.getAttribute(u3)!==L||l.getAttribute(M3)!==T)){c.setAttribute(e,T),l&&c.removeChild(l);var U=Yt(),c1=U.extra;c1.attributes[X2]=a,e3(g,L).then(function(j){var F2=N3(C(C({},U),{},{icons:{main:j,mask:x3()},prefix:L,iconName:T,extra:c1,watchable:!0})),f1=R.createElementNS("http://www.w3.org/2000/svg","svg");a==="::before"?c.insertBefore(f1,c.firstChild):c.appendChild(f1),f1.outerHTML=F2.map(function(Ye){return $1(Ye)}).join(`
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/chunks/VPLocalSearchBox.BzSRzK0s.js","assets/chunks/framework.DUnMl7IF.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}