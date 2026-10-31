import 'server-only';
import { prisma } from '@yooniqpark/clinic-core/lib/prisma';
import { auth } from '@yooniqpark/clinic-core/auth';
import sanitizeHtml from 'sanitize-html';
import mammothBase from 'mammoth';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import { randomUUID } from 'node:crypto';
import { mkdir,writeFile,readFile } from 'node:fs/promises';
import path from 'node:path';

export type BlogPost={id:string;title:string;category:string;excerpt:string;html:string;coverUrl:string;sourceName:string;published:boolean;createdAt:string;updatedAt:string};
const group='clinic-blog';
type WordNode={type?:string;value?:string;children?:WordNode[];styleName?:string;styleId?:string};
const mammoth=mammothBase as typeof mammothBase & {transforms:{paragraph:(fn:(node:WordNode)=>WordNode)=>(node:WordNode)=>WordNode;run:(fn:(node:WordNode)=>WordNode)=>(node:WordNode)=>WordNode}};
export async function blogAdmin(){const s=await auth();return s?.user && (s.user as {role?:string}).role==='ADMIN'?s.user:null;}
function parse(value:string):BlogPost|null{try{const post=JSON.parse(value) as BlogPost;return {...post,category:post.category==='닥터스 노트'?'닥터스 블로그':post.category};}catch{return null;}}
export async function listBlogPosts(includeDrafts=false){const rows=await prisma.siteContent.findMany({where:{group,locale:'ko',field:'post'},orderBy:{updatedAt:'desc'}});return rows.map(r=>parse(r.value)).filter((p):p is BlogPost=>!!p&&(includeDrafts||p.published)).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt));}
export async function getBlogPost(id:string){if(!/^[a-zA-Z0-9-]{1,80}$/.test(id))return null;const row=await prisma.siteContent.findUnique({where:{group_slug_locale_field:{group,slug:id,locale:'ko',field:'post'}}});return row?parse(row.value):null;}
export async function saveBlogPost(post:BlogPost,userId?:string){await prisma.siteContent.upsert({where:{group_slug_locale_field:{group,slug:post.id,locale:'ko',field:'post'}},create:{group,slug:post.id,locale:'ko',field:'post',value:JSON.stringify(post),updatedBy:userId},update:{value:JSON.stringify(post),updatedBy:userId}});return post;}
function sourceRoot(){return process.env.CLINIC_UPLOAD_DIR?path.join(path.dirname(path.resolve(process.env.CLINIC_UPLOAD_DIR)),'blog-source'):path.join(process.cwd(),'.blog-source');}
export async function blogSource(id:string){if(!/^[a-zA-Z0-9-]{1,80}$/.test(id))throw new Error('Invalid id');return readFile(path.join(sourceRoot(),id+'.docx'));}
export function cleanBlogHtml(html:string){return sanitizeHtml(html,{allowedTags:[...sanitizeHtml.defaults.allowedTags,'img','h1','h2','h3','span','sup','sub','u','s'],allowedAttributes:{a:['href','name','target','rel'],img:['src','alt'],span:['class'],p:['class'],td:['colspan','rowspan'],th:['colspan','rowspan']},allowedClasses:{span:[/^docx-color-[a-f0-9]{6}$/],p:['docx-center']},allowedSchemes:['http','https','mailto','tel'],allowedSchemesByTag:{img:['data']},allowProtocolRelative:false,transformTags:{a:sanitizeHtml.simpleTransform('a',{target:'_blank',rel:'noopener noreferrer'})}});}
function modelText(node:unknown):string{if(!node||typeof node!=='object')return '';const n=node as {type?:string;value?:string;children?:unknown[]};return n.type==='text'?n.value||'':(n.children||[]).map(modelText).join('');}
function text(node:unknown):string{if(node==null)return '';if(typeof node==='string'||typeof node==='number')return String(node);if(Array.isArray(node))return node.map(text).join('');if(typeof node==='object')return Object.entries(node).filter(([k])=>k==='w:t'||k==='#text'||k.startsWith('w:')).map(([,v])=>text(v)).join('');return '';}
export async function importBlogDocx(buffer:Buffer,name:string,userId?:string){
 if(!name.toLowerCase().endsWith('.docx')||buffer.length>12*1024*1024||buffer.length===0)throw new Error('12MB 이하 DOCX 파일을 선택하세요.');
 const zip=await JSZip.loadAsync(buffer);let total=0;for(const entry of Object.values(zip.files)){total+=(entry as unknown as {_data?:{uncompressedSize:number}})._data?.uncompressedSize||0;}if(total>64*1024*1024)throw new Error('문서 압축 해제 크기가 너무 큽니다.');
 const doc=zip.file('word/document.xml');if(!doc)throw new Error('유효한 DOCX 문서가 아닙니다.');
 const xml=await doc.async('string');if(xml.length>8*1024*1024)throw new Error('문서가 너무 복잡합니다.');
 const root=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',processEntities:false,transformAttributeName:(name:string)=>name.replace(/^w:/,'')}).parse(xml);
 const styles=new Map<string,string>();const colors=new Map<string,string>();const colorValues=new Set<string>();
 function visit(v:unknown){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(visit);return;}for(const [k,value] of Object.entries(v)){if(k==='w:p'){for(const p of (Array.isArray(value)?value:[value])){const runs:Record<string,unknown>[]=[];function collect(x:unknown){if(!x||typeof x!=='object')return;if(Array.isArray(x)){x.forEach(collect);return;}for(const [rk,rv]of Object.entries(x)){if(rk==='w:r')runs.push(...(Array.isArray(rv)?rv:[rv]) as Record<string,unknown>[]);else collect(rv);}}collect(p);let size=0;for(const r of runs){const props=r['w:rPr'] as Record<string,{val?:string}>|undefined;size=Math.max(size,Number(props?.['w:sz']?.val)||0);const c=props?.['w:color']?.val;if(c&&/^[a-f0-9]{6}$/i.test(c)){colors.set(text(r),c.toLowerCase());colorValues.add(c.toLowerCase());}}const label=text(p).replace(/\s/g,'');if(size>=40)styles.set(label,'Blog Title');else if(size>=34)styles.set(label,'Blog H2');else if(size>=28)styles.set(label,'Blog H3');}}visit(value);}}
 visit(root);
 const result=await mammoth.convertToHtml({buffer},{externalFileAccess:false,includeEmbeddedStyleMap:false,styleMap:["p[style-name='Blog Title'] => h1:fresh","p[style-name='Blog H2'] => h2:fresh","p[style-name='Blog H3'] => h3:fresh",'u => u',...Array.from(colorValues,c=>`r[style-name='Blog Color ${c}'] => span.docx-color-${c}`)],transformDocument:element=>mammoth.transforms.paragraph(p=>{const s=styles.get(modelText(p).replace(/\s/g,''));return s?{...p,styleName:s,styleId:s}:p;})(mammoth.transforms.run(r=>{const c=colors.get(modelText(r));return c?{...r,styleName:'Blog Color '+c,styleId:'BlogColor'+c}:r;})(element))});
 const html=cleanBlogHtml(result.value);const plain=sanitizeHtml(html,{allowedTags:[],allowedAttributes:{}});const raw=await mammoth.extractRawText({buffer});const title=raw.value.split('\n').find(s=>s.trim())?.trim().slice(0,200)||name.replace(/\.docx$/i,'');
 const id=randomUUID(),now=new Date().toISOString();await mkdir(sourceRoot(),{recursive:true,mode:0o700});await writeFile(path.join(sourceRoot(),id+'.docx'),buffer,{flag:'wx',mode:0o600});
 return saveBlogPost({id,title,category:'닥터스 블로그',excerpt:plain.replace(/\s+/g,' ').slice(0,160),html,coverUrl:html.match(/<img[^>]*src="([^"]+)"/)?.[1]||'',sourceName:path.basename(name).slice(0,200),published:false,createdAt:now,updatedAt:now},userId);
}
