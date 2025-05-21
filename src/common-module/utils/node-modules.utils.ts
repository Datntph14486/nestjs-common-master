import { readFileSync, readdirSync } from "fs";

export class NodeModulesUtils {
    static versions: any = {}

    /**
     * Load thông tin version của các thư viện node đang dùng
     */
    static loadVersions() {
        var dirs = readdirSync('node_modules')

        dirs.forEach((dir: string) => {
            try {
                var file = 'node_modules/' + dir + '/package.json';
                var json = JSON.parse(readFileSync(file).toString());
                var name = json.name;
                var version = json.version;
                NodeModulesUtils.versions[name] = version;
            } catch (err) { 
            }
        });
    }
}