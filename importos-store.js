'use strict';

const fs=require('fs');
const path=require('path');

const DB_FIELDS=new Set(['status','reviewedAt','reviewNote','lastError','payload']);

function databaseConfigured(env){return Boolean(env.DB_HOST&&env.DB_USER&&env.DB_NAME)}
function nowIso(){return new Date().toISOString()}
function safeJson(value){try{return typeof value==='string'?JSON.parse(value):value}catch{return {}}}

function parseRow(row){
  if(!row)return null;
  return {
    reference:row.reference,
    type:row.type,
    language:row.language,
    email:row.email,
    name:row.name,
    status:row.status,
    payload:safeJson(row.payload_json),
    reviewedAt:row.reviewed_at?new Date(row.reviewed_at).toISOString():null,
    reviewNote:row.review_note||'',
    lastError:row.last_error||'',
    createdAt:new Date(row.created_at).toISOString(),
    updatedAt:new Date(row.updated_at).toISOString()
  };
}

class ImportOSStore{
  constructor(options={}){
    this.env=options.env||process.env;
    this.storageFile=options.storageFile||path.join(__dirname,'runtime','importos-records.json');
    this.mysql=options.mysql||null;
    this.pool=null;
    this.mode=databaseConfigured(this.env)?'mysql':'file';
    this.initialized=false;
    this.fileQueue=Promise.resolve();
  }

  initializeFile(){
    fs.mkdirSync(path.dirname(this.storageFile),{recursive:true});
    if(!fs.existsSync(this.storageFile))fs.writeFileSync(this.storageFile,'{}\n',{mode:0o600});
  }

  async init(){
    if(this.initialized)return;
    if(this.mode==='mysql'){
      const mysql=this.mysql||require('mysql2/promise');
      try{
        this.pool=mysql.createPool({
          host:this.env.DB_HOST,
          port:this.env.DB_PORT?Number(this.env.DB_PORT):undefined,
          user:this.env.DB_USER,
          password:this.env.DB_PASSWORD,
          database:this.env.DB_NAME,
          waitForConnections:true,
          connectionLimit:5,
          queueLimit:0
        });
        await this.pool.execute(`
          CREATE TABLE IF NOT EXISTS danini_importos_records (
            reference VARCHAR(64) PRIMARY KEY,
            type VARCHAR(40) NOT NULL,
            language VARCHAR(5) NOT NULL,
            email VARCHAR(191) NOT NULL,
            name VARCHAR(180) NOT NULL,
            status VARCHAR(40) NOT NULL,
            payload_json LONGTEXT NOT NULL,
            reviewed_at DATETIME NULL,
            review_note TEXT NULL,
            last_error TEXT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX idx_importos_type_created (type,created_at),
            INDEX idx_importos_status_created (status,created_at)
          ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
      }catch(error){
        console.error('ImportOS database unavailable; using local fallback:',error.message);
        if(this.pool&&typeof this.pool.end==='function'){try{await this.pool.end()}catch{}}
        this.pool=null;
        this.mode='file';
        this.initializeFile();
      }
    }else this.initializeFile();
    this.initialized=true;
  }

  async create(record){
    await this.init();
    const createdAt=record.createdAt||nowIso();
    const item={
      reference:record.reference,
      type:record.type||'request',
      language:record.language||'de',
      email:record.email||'',
      name:record.name||'',
      status:record.status||'NEW',
      payload:record.payload||{},
      reviewedAt:null,
      reviewNote:'',
      lastError:'',
      createdAt,
      updatedAt:createdAt
    };
    if(this.mode==='mysql'){
      await this.pool.execute(
        `INSERT INTO danini_importos_records
          (reference,type,language,email,name,status,payload_json,created_at,updated_at)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [item.reference,item.type,item.language,item.email,item.name,item.status,JSON.stringify(item.payload),new Date(createdAt),new Date(createdAt)]
      );
      return item;
    }
    return this.withFile(records=>{
      if(records[item.reference])throw new Error('RECORD_ALREADY_EXISTS');
      records[item.reference]=item;
      return item;
    });
  }

  async get(reference){
    await this.init();
    if(this.mode==='mysql'){
      const [rows]=await this.pool.execute('SELECT * FROM danini_importos_records WHERE reference=? LIMIT 1',[reference]);
      return parseRow(rows[0]);
    }
    return JSON.parse(fs.readFileSync(this.storageFile,'utf8'))[reference]||null;
  }

  async update(reference,changes){
    await this.init();
    const allowed=Object.fromEntries(Object.entries(changes).filter(([k])=>DB_FIELDS.has(k)));
    const updatedAt=nowIso();
    if(this.mode==='mysql'){
      const map={status:'status',reviewedAt:'reviewed_at',reviewNote:'review_note',lastError:'last_error',payload:'payload_json'};
      const keys=Object.keys(allowed);
      if(!keys.length)return this.get(reference);
      const sql=keys.map(k=>map[k]+'=?').join(', ');
      const values=keys.map(k=>k==='reviewedAt'&&allowed[k]?new Date(allowed[k]):k==='payload'?JSON.stringify(allowed[k]||{}):allowed[k]??null);
      values.push(new Date(updatedAt),reference);
      const [result]=await this.pool.execute(`UPDATE danini_importos_records SET ${sql}, updated_at=? WHERE reference=?`,values);
      if(!result.affectedRows)throw new Error('RECORD_NOT_FOUND');
      return this.get(reference);
    }
    return this.withFile(records=>{
      if(!records[reference])throw new Error('RECORD_NOT_FOUND');
      records[reference]={...records[reference],...allowed,updatedAt};
      return records[reference];
    });
  }

  withFile(operation){
    const task=this.fileQueue.then(()=>{
      const records=JSON.parse(fs.readFileSync(this.storageFile,'utf8'));
      const result=operation(records);
      const tmp=this.storageFile+'.'+process.pid+'.tmp';
      fs.writeFileSync(tmp,JSON.stringify(records,null,2)+'\n',{mode:0o600});
      fs.renameSync(tmp,this.storageFile);
      return result;
    });
    this.fileQueue=task.catch(()=>{});
    return task;
  }
}

function createImportOSStore(options){return new ImportOSStore(options)}
module.exports={ImportOSStore,createImportOSStore};
