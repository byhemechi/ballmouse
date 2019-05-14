import path from 'path';
import jsdoc2md from 'jsdoc-to-markdown';
import fs from "fs-extra";
import rimraf from "rimraf";
const args = process.argv.slice(2);

args.forEach(orig => {
    const i = orig.replace(/^src\//, "");
    rimraf("./docs/Source Docs", function(e) {
        return e;
    })
    jsdoc2md.render({ files: orig }).then(md => {
        if(md.length > 0) {
            const newdir = path.join("./docs/Source Docs/", path.dirname(i))
            if(!fs.existsSync(newdir)) fs.mkdirSync(newdir, {recursive: true});
            fs.writeFileSync(path.join(newdir, path.basename(orig)) + ".md", `# ${path.basename(orig)}\n${md}`);
        }
    })
});