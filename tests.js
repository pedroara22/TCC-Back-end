const fs = require("fs")

const testFile = (storageLocation, file, textCodification) => {
  fs.readFile(storageLocation+file, textCodification, (err,data)=>{
    if(err){
      fs.writeFileSync(storageLocation+file, "[]")
    }
    global.tests=="half"?global.tests=true:global.tests="half";
  })
}

module.exports  = testFile;