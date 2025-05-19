import 'elexis/core';
import { $View } from '#node/$View';
declare module 'elexis/core' {
    export namespace $ {
        export interface TagNameElementMap {
            'view': typeof $View;
        } 
    }
}
$.registerTagName('view', $View)

export * from '#node/$View';