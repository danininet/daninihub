'use strict';
// Non-destructive diagnosis for the OWNER in the EXISTING Hostinger Node release.
// Never print secret values, credentials, hostnames, email addresses or SQL rows.
// No writes, migrations, payments or remote notifications.
const path=require('node:path');
const fs=require('node:fs');
const dotenv=require('dotenv');
const ownEnv=path.join(__dirname,'..','.env');
const cwdEnv=path.join(process.cwd(),'.env');
dotenv.config({path:ownEnv,quiet:true});
if(cwdEnv!==ownEnv)dotenv.config({path:cwdEnv,quiet:true});
const {ImportOSStore}=require('../importos-store');
const result={
  operation:'read-only-owner-diagnostic',timestamp:new Date().toISOString(),
  releaseEnvFilePresent:fs.existsSync(ownEnv),
  workingDirEnvFilePresent:fs.existsSync(cwdEnv),
  existingDbVariables:{
    dbHost:!!process.env.DB_HOST,dbUser:!!process.env.DB_USER,
    dbName:!!process.env.DB_NAME,dbPassword:!!process.env.DB_PASSWORD,
    mysqlUrl:!!process.env.MYSQL_URL,databaseUrl:!!process.env.DATABASE_URL
  },
  integrations:{
    brevoKeyPresent:!!process.env.BREVO_API_KEY,
    brevoSenderPresent:!!(process.env.BREVO_SENDER_EMAIL||process.env.MAIL_FROM||process.env.DANINIHUB_SENDER_EMAIL),
    stripeKeyPresent:!!process.env.STRIPE_SECRET_KEY,
    paypalIdPresent:!!process.env.PAYPAL_CLIENT_ID,
    paypalSecretPresent:!!process.env.PAYPAL_CLIENT_SECRET,
    openAiKeyPresent:!!process.env.OPENAI_API_KEY
  }
};
async function main(){
  const store=new ImportOSStore({env:process.env});
  result.mysqlConfigured=store.databaseConfigured;
  result.mysqlConnectivity='not-checked';
  if(!store.databaseConfigured){
    result.mysqlConnectivity='config-not-visible-to-this-process';
  }else{
    const mysql=require('mysql2/promise');
    let connection;
    try{
      connection=await mysql.createConnection({...store.connectionOptions,connectTimeout:6500});
      await connection.query('SELECT 1');
      const [tables]=await connection.query("SHOW TABLES LIKE 'danini_importos_records'");
      result.mysqlConnectivity='connection-ok';
      result.importOsTableExists=tables.length>0;
    }catch(error){
      const code=String(error.code||'');
      result.mysqlConnectivity='connection-failed';
      result.mysqlErrorCode=/^[A-Z0-9_]+$/.test(code)?code:'DATABASE_CONNECTION_FAILED';
    }finally{if(connection)try{await connection.end()}catch{}}
  }
  console.log(JSON.stringify(result,null,2));
}
main().catch(()=>{console.log(JSON.stringify({operation:'read-only-owner-diagnostic',unexpectedFailure:true}));process.exitCode=1});