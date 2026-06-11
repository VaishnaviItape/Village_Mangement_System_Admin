const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Replace imports
    if (content.includes('react-hot-toast')) {
        content = content.replace(/import\s+toast\s*,\s*\{\s*Toaster\s*\}\s*from\s+['"]react-hot-toast['"];?/g, 'import { toast } from "react-toastify";');
        content = content.replace(/import\s+\{\s*Toaster\s*\}\s*from\s+['"]react-hot-toast['"];?/g, '');
        content = content.replace(/import\s+toast\s*from\s+['"]react-hot-toast['"];?/g, 'import { toast } from "react-toastify";');
    }

    // 2. Remove <Toaster /> tags (various formats)
    content = content.replace(/<Toaster\s*[^>]*\/>/g, '');
    content = content.replace(/<Toaster><\/Toaster>/g, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

// Ensure App.jsx has ToastContainer
function updateApp() {
    const appPath = path.join(__dirname, 'src', 'App.jsx');
    let content = fs.readFileSync(appPath, 'utf8');
    if (!content.includes('ToastContainer')) {
        content = `import { ToastContainer } from 'react-toastify';\nimport 'react-toastify/dist/ReactToastify.css';\n` + content;
        // Inject right after <Router>
        content = content.replace('<Router>', '<Router>\n      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />');
        fs.writeFileSync(appPath, content, 'utf8');
        console.log("Updated App.jsx with ToastContainer");
    }
}

processDir(path.join(__dirname, 'src'));
updateApp();
