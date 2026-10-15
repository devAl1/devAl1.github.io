/* QR rendering: qrcode-generator 2.0.4, MIT, Kazuhiko Arase (vendored). */
'use strict';
const api='https://yglvndjqgrmcxpgivlot.supabase.co/functions/v1/family-hub-mcp';
const statusText=document.getElementById('status');
const parameters=new URLSearchParams(location.search);
// Drop OAuth request details from subsequent browser history/referrers.
history.replaceState(null,'',location.pathname);
let expires=0;
async function post(path,body){const response=await fetch(api+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});const result=await response.json();if(!response.ok||result.error)throw new Error('Connection request unavailable. Start again from your AI client.');return result;}
async function start(){
 if(!parameters.has('client_id')){document.getElementById('intro').hidden=false;return;}
 try{
  const data=Object.fromEntries(parameters);
  data.state??='';
  const request=await post('/start',data);
  expires=Date.parse(request.expires_at);
  document.getElementById('request').hidden=false;
  document.getElementById('open').href=request.app_url;
  document.getElementById('code').textContent=request.code.match(/.{1,4}/g).join('-');
  const qr=qrcode(0,'M');qr.addData(request.app_url);qr.make();
  // Only the locally generated QR image is inserted; client-provided text uses textContent.
  document.getElementById('qr').innerHTML=qr.createImgTag(6,4);
  await poll(request);
 }catch(error){statusText.textContent=error.message;document.getElementById('retry').hidden=false;}
}
async function poll(request){
 while(Date.now()<expires){
  await new Promise(resolve=>setTimeout(resolve,2000));
  let response;
  try{response=await post('/poll',{authorization_id:request.authorization_id,poll_secret:request.poll_secret});}
  catch{statusText.textContent='Waiting for your phone. Check your connection…';continue;}
  if(response.status==='approved'||response.status==='denied'){
   statusText.textContent=response.status==='approved'?'Approved. Returning to your AI client…':'Connection denied. Returning to your AI client…';
   // Destination is returned by the server from the registered, validated redirect.
   location.replace(response.redirect_uri);return;
  }
  if(response.status==='expired'||response.status==='used')break;
 }
 document.getElementById('request').hidden=true;
 throw new Error('This connection code expired. Start again from your AI client.');
}
document.getElementById('retry').addEventListener('click',()=>{document.getElementById('retry').hidden=true;start();});
start();
