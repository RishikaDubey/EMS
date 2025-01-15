const webfont = require("webfont").default;
const path = require("path");
const fs = require("fs");
const fontName = "ems-icons";
const dest = path.resolve(__dirname, "../../assets/fonts/font-formats/");
const destTemaplate = path.resolve(
    __dirname,
    `./../typography/_font-icons.scss`,
);
const varibaleDest = path.resolve(
    __dirname,
    `./../typography/_icons-variables.scss`,
);
const buildVersionStamp = new Date().getTime();

/**
 * Method to delete all files in a directory | its a sync operation
 */
const emptyFontFilesDirectory = (function (directoryPath) {
    try {
        fs.readdir(directoryPath, (err, files)=> {
            if(err) throw err;

            for (const file of files) {
                fs.unlinkSync(path.join(directoryPath, file), (error) => {
                    error ?
                    console.log(`ERROR DELETING FILE ${file} :: ${error}.`):
                    console.log(`file ${file} was deleted successfully`)
                })
            }
        });
    }
    catch(err) {
        console.log("error in the deleted operation");
    }
})(path.resolve(dest));

webfont({
    fontName: fontName,
    template: "scss",
    templateClassName: "cp-icons",
    templateFontPath: "/assets/fonts/font-formats/",
    normalize: true,
    startUnicode: 0xe300,
    files: "src/assests/icon-fonts/icon-images/*.svg",
    dest: dest,
    destTemplate: destTemaplate,
})
.then((result)=> {
    return Promise.all(
        Object.keys(result).map((type)=> {
            if(type === "config" || type === "usedBuildInTemplate" || type === "glyphsData") {
                return null;
            }
            let content = result[type];
            let file = null;
            if(type !== "template") {
                file = path.resolve(
                    path.join(dest, `${fontName}.${buildVersionStamp}.${type}`)
                );
            } else {
                const variables = content.substring(0, content.indexOf("@font-face"));
                const variablesFile = path.resolve(varibaleDest);
                fs.writeFile(variablesFile, variables, (error)=>
                    error ?
                    console.log(`Error writing in file ${variablesFile} :: ${error}`):
                    console.log(`file${variablesFile} written successfully`)
                );
                const replacePattern = `/${fontName}`;
                const replaceRegEx = new RegExp(replacePattern, "g");
                content = content.replace(
                    eplaceRegEx,
                    `/${fontName}.${buildVersionStamp}`
                );
                content = content.replace("font-display: auto", "font-display: swap");
                file = path.resolve(destTemaplate);
            }

            return fs.writeFile(file, content, (error) =>
                error ?
                console.log(`ERROR writing in File ${file} :: ${error}.`):
                console.log(`file ${file} written successfully`)
            )
        }),
    );
})
.catch((error) => {
    console.log(error);
    throw error;
})
