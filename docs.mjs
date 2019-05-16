import path from 'path';
import jsdoc2md from 'jsdoc-to-markdown';
import fs from "fs-extra";
import util from "util";
import rimraf from "rimraf";
import glob from "glob";
import { spawnSync } from 'child_process';
const args = process.argv.slice(2);

glob("src/**/*.js", function(err, files) {
    files.forEach((orig, n) => {
        const i = orig.replace(/^src\//, "");
        console.log("  " + orig + "\r");
        
        rimraf("./docs/srouce", function(e) {
            return e;
        })
        jsdoc2md.render({ files: orig }).then(md => {
            process.stdout.write(`\r\x1b[${files.length - n}A`);
            process.stdout.write("✓ ");
            process.stdout.write(`\x1b[${files.length - n}B`)
            if(md.length > 0) {
                const newdir = path.join("./docs/source/", path.dirname(i))
                if(!fs.existsSync(newdir)) fs.mkdirSync(newdir, {recursive: true});
                fs.writeFileSync(path.join(newdir, path.basename(orig)) + ".md", `# ${path.basename(orig)}\n${md}`);
            }
        })
    });
})