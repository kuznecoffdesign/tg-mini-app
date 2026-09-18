import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';

const output=path.resolve('dist/client');
const template=readFileSync(path.join(output,'index.html'),'utf8');
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const escape=(value)=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
try {
  const {App,meta,schemaFor}=await server.ssrLoadModule('/src/App.jsx');
  const {publicOrigin}=await server.ssrLoadModule('/src/content.js');
  if(publicOrigin && (!/^https:\/\/[^/]+$/.test(publicOrigin) || publicOrigin.includes('example.'))) throw new Error('Set a confirmed HTTPS origin without a trailing slash.');
  const routes=[...Object.keys(meta),'/404'];
  for(const route of routes){
    const [title,description]=meta[route]||['Страница не найдена','Запрошенная страница не существует.'];
    const indexable=!!publicOrigin&&route!=='/404'&&route!=='/privacy';
    // Full HTML content and real links are emitted for every route, not just an app shell.
    const markup=renderToString(createElement(App,{initialPath:route}));
    let html=template.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<meta\s[^>]*(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,'').replace(/<link\s[^>]*rel="canonical"[^>]*>/g,'');
    const head=`<title>${escape(title)}</title>\n<meta name="description" content="${escape(description)}">\n<meta name="robots" content="${indexable?'index, follow':'noindex, follow'}">\n<meta property="og:title" content="${escape(title)}">\n<meta property="og:description" content="${escape(description)}">\n<meta property="og:type" content="${route.startsWith('/journal/')?'article':'website'}">\n<meta property="og:locale" content="ru_RU">\n<meta name="twitter:card" content="summary">\n${publicOrigin&&route!=='/404'?`<link rel="canonical" href="${publicOrigin}${route}">\n<meta property="og:url" content="${publicOrigin}${route}">`:''}\n<script id="page-schema" type="application/ld+json">${JSON.stringify(schemaFor(route)).replaceAll('<','\\u003c')}</script>`;
    html=html.replace('</head>',head+'\n</head>').replace(/<div id="root">[\s\S]*?<\/div>/,()=>`<div id="root" data-prerendered="true">${markup}</div>`);
    const file=path.join(output,route==='/404'?'404.html':route==='/'?'index.html':route.slice(1)+'/index.html');
    mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,html);
  }
  writeFileSync(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\n${publicOrigin?`Sitemap: ${publicOrigin}/sitemap.xml\n`:''}`);
  const sitemap=path.join(output,'sitemap.xml');
  if(publicOrigin) writeFileSync(sitemap,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(meta).filter(p=>p!=='/privacy').map(p=>`<url><loc>${publicOrigin}${p}</loc></url>`).join('')}</urlset>`);
  else if(existsSync(sitemap)) unlinkSync(sitemap);
  console.log(`Prerendered ${routes.length} pages. ${publicOrigin?'Canonical URLs and sitemap enabled.':'Preview is noindex; confirmed domain required for canonical URLs and sitemap.'}`);
} finally {await server.close();}
