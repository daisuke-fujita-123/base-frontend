// String型Utilityクラス
export class StringUtil {
    /**
     * 文字列が空文字(null/undefined含む)以外か判定
     * @param str 文字列
     * @returns true: not empty, false: empty
     */
    static isNotEmpty(str: string | null | undefined) : boolean {
      return (str == null || str.length == 0) ? false : true;
    }

    /**
     * 文字列が空文字(null/undefined含む)か判定
     * @param str 文字列 
     * @returns true: empty, false: not empty
     */
    static isEmpty(str: string | null | undefined) : boolean {
      return !(this.isNotEmpty(str));
    }

    /**
     * 空文字の場合、デフォルト値を返します。
     * @param str 文字列
     * @param def デフォルト値（null/undefined時）
     * @returns 文字列
     */
    static defaultIfEmpty(str: string | null | undefined, def = '') : string {
      return (str != null) ? str : def;
    }
}