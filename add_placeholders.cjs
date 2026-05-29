const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for(const f of files) {
    const fullPath = path.join(dir, f);
    if(fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if(fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      content = content.replace(/<input([^>]*?)>/g, (match, attrs) => {
        if (!attrs.includes('placeholder=') && !attrs.includes('type="file"') && !attrs.includes('type="checkbox"') && !attrs.includes('type="radio"') && !attrs.includes('type="submit"')) {
          changed = true;
          return `<input placeholder="Enter value" ${attrs}>`;
        }
        return match;
      });
      if (changed) {
         fs.writeFileSync(fullPath, content);
         console.log('Updated', fullPath);
      }
    }
  }
}
processDir('d:/MCA Project/Village_Mangement_System_Admin/src/pages');
