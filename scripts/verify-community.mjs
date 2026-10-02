import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';
const auth={Cookie:'__sites_local_auth=1',Origin:base,'Content-Type':'application/json'};
async function post(payload,headers=auth){const response=await fetch(base+'/api/community',{method:'POST',headers,body:JSON.stringify(payload)});const text=await response.text();let data;try{data=JSON.parse(text)}catch{data={error:text}}return {status:response.status,data};}
assert.equal((await post({action:'topic'},{Origin:base,'Content-Type':'application/json','oai-authenticated-user-id':'forged','oai-authenticated-user-email':'forged@example.test'})).status,401);
assert.equal((await post({action:'profile',name:'Wrong origin'},{...auth,Origin:'https://invalid.example'})).status,403);
assert.equal((await post({action:'profile',name:'x'})).status,400);
assert.equal((await post({action:'profile',name:'Local test researcher'})).status,200);
assert.equal((await post({action:'topic',title:'Invalid category',body:'Testing validation',category:'Invalid'})).status,400);
const topic=await post({action:'topic',title:'Automated local verification',body:'A temporary development-only discussion.',category:'Getting started'});
assert.equal(topic.status,201);
assert.equal((await post({action:'reply',topicId:topic.data.id,body:'Immediate reply should be limited.'})).status,429);
await new Promise(resolve=>setTimeout(resolve,10100));
const reply=await post({action:'reply',topicId:topic.data.id,body:'Verified reply persists in the database.'});assert.equal(reply.status,201);
const read=await (await fetch(base+'/api/community?topic='+topic.data.id)).json();assert.equal(read.topic.title,'Automated local verification');assert.equal(read.replies.length,1);assert.equal(read.replies[0].body,'Verified reply persists in the database.');assert.equal(read.topic.owned,0);assert.equal('user_id' in read.topic,false);
assert.equal((await post({action:'deleteReply',id:'not-owned'})).status,403);
assert.equal((await post({action:'deleteTopic',id:topic.data.id})).status,200);
assert.equal((await fetch(base+'/api/community?topic='+topic.data.id)).status,404);
console.log('PASS: authentication, forged-header rejection, origin validation, profile validation, category validation, posting, rate limit, persisted replies, public privacy, ownership checks, deletion.');


