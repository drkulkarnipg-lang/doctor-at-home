'use strict';
async function owner(req,env=process.env,request=(...a)=>fetch(...a)){
 const cookie=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('__Host-clinicSession='));let token;try{token=cookie?decodeURIComponent(cookie.slice('__Host-clinicSession='.length)):'';}catch{token='';}
 if(!token)return null;const r=await request(env.SUPABASE_URL+'/auth/v1/user',{headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(12000)});if(!r.ok)return null;const user=await r.json();return user.id===env.CLINIC_OWNER_USER_ID?{id:user.id,token}:null;
}
module.exports={owner};
