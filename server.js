// QuickClip API starter — Node.js + Express
// Install: npm install express cors
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
app.use(cors());
app.use(express.json({limit:"20kb"}));

const clips = new Map();

function code(){
  return crypto.randomBytes(4).toString("base64url").slice(0,6).toUpperCase();
}

app.post("/api/clips",(req,res)=>{
  const text = String(req.body?.text || "").trim();
  if(!text || text.length>10000) return res.status(400).json({error:"Text must be 1–10,000 characters."});
  let id; do{id=code()}while(clips.has(id));
  clips.set(id,{text,createdAt:Date.now()});
  res.json({code:id});
});

app.get("/api/clips/:code",(req,res)=>{
  const item=clips.get(req.params.code.toUpperCase());
  if(!item) return res.status(404).json({error:"Clip not found."});
  res.json(item);
});

app.delete("/api/clips/:code",(req,res)=>{
  clips.delete(req.params.code.toUpperCase());
  res.status(204).end();
});

app.listen(3000,()=>console.log("QuickClip API running on http://localhost:3000"));
