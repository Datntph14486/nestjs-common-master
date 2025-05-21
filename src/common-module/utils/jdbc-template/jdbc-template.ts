import { DataSource, QueryRunner } from "typeorm"

export class JDBCTemplate {
    /**
     * Thực thi raw query
     * @param params 
     * @returns 
     */
    static query(params: { dataSource: DataSource, sqlCommand: string, params: any, queryRunner?: QueryRunner, useQueryRunner?: boolean }): Promise<any> {
        let __paramRegex = new RegExp(/:([\w_]+)/g)
        let __match = [...params.sqlCommand.matchAll(__paramRegex)]

        let __params = []
        __match.forEach((item, idx) => {
            __params.push(params.params[item[1]])
        })

        if (params.useQueryRunner === true) {
            let qr: QueryRunner = params.dataSource.createQueryRunner()
            return params.dataSource.query(params.sqlCommand, __params, qr)
        } else if (params.queryRunner) {
            return params.dataSource.query(params.sqlCommand, __params, params.queryRunner)
        } else {
            return params.dataSource.query(params.sqlCommand, __params)
        }
    }
}